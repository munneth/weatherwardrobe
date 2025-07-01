"use client"
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface OutfitItem {
  id: string;
  name: string;
  category: string;
  reason: string;
}

interface OutfitSuggestion {
  outfit_name?: string;
  reasoning?: string;
  items?: OutfitItem[];
  weather_notes?: string;
  styling_tips?: string;
  suggestion?: string;
  error?: string;
  generatedImage?: string;
  description?: string;
}

interface OutfitCarouselProps {
  outfit: OutfitSuggestion;
  onImageGenerated?: (imageUrl: string) => void;
}

export default function OutfitCarousel({ outfit, onImageGenerated }: OutfitCarouselProps) {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<"1:1" | "3:4" | "4:3" | "9:16" | "16:9">("1:1");

  // Automatically generate the image when the outfit changes
  useEffect(() => {
    setGeneratedImages([]); // Reset images when outfit changes
    if (outfit && outfit.description) {
      generateImage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outfit]);

  console.log('OutfitCarousel received outfit:', outfit);

  const generateImage = async (useImagen: boolean = true, aspectRatio?: "1:1" | "3:4" | "4:3" | "9:16" | "16:9") => {
    if (!outfit.description) {
      console.error('No outfit description available');
      return;
    }

    setLoading(true);
    try {
      const outfitData = {
        description: outfit.description,
        weatherNotes: outfit.weather_notes,
        outfit_name: outfit.outfit_name,
        items: outfit.items
      };

      let imageUrl: string;
      
      if (useImagen && aspectRatio) {
        // Use the API route for single image generation with aspect ratio
        const response = await fetch('/api/generate-single-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: outfitData.description,
            model: 'imagen',
            aspectRatio: aspectRatio
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        imageUrl = result.imageUrl;
      } else if (useImagen) {
        // Use the API route for single image generation with Imagen
        const response = await fetch('/api/generate-single-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: outfitData.description,
            model: 'imagen'
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        imageUrl = result.imageUrl;
      } else {
        // Use the API route for single image generation with Gemini
        const response = await fetch('/api/generate-single-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: outfitData.description,
            model: 'gemini'
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        imageUrl = result.imageUrl;
      }

      setGeneratedImages(prev => [...prev, imageUrl]);
      onImageGenerated?.(imageUrl);
      
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  const aspectRatios = [
    { value: "1:1" as const, label: "Square" },
    { value: "3:4" as const, label: "Portrait" },
    { value: "4:3" as const, label: "Landscape" },
    { value: "9:16" as const, label: "Mobile" },
    { value: "16:9" as const, label: "Widescreen" }
  ];

  return (
    <div className="space-y-4">
      {loading && (
        <div className="text-sm text-gray-500">Generating image...</div>
      )}
      {generatedImages.length > 0 && (
        <div className="space-y-2">
          <img
            src={generatedImages[0]}
            alt={outfit.outfit_name || 'Generated outfit'}
            className="w-full h-auto rounded-lg shadow-md"
            onError={(e) => {
              e.currentTarget.src = `https://picsum.photos/400/400?random=1`;
            }}
          />
        </div>
      )}

      {outfit.items && outfit.items.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Outfit Items</h3>
          <div className="grid grid-cols-2 gap-2">
            {outfit.items.map((item, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                <div className="font-medium">{item.name}</div>
                <div className="text-gray-600">{item.category}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {outfit.styling_tips && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Styling Tips</h3>
          <p className="text-sm text-gray-700">{outfit.styling_tips}</p>
        </div>
      )}
    </div>
  )
} 