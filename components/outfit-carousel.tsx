"use client"
import React, { useState } from 'react'
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
import { generateOutfitImageWithAspectRatio, generateOutfitImageWithImagen } from "@/lib/gemini-image-service";

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
        imageUrl = await generateOutfitImageWithAspectRatio(outfitData, aspectRatio);
      } else if (useImagen) {
        imageUrl = await generateOutfitImageWithImagen(outfitData);
      } else {
        // Fallback to regular Gemini generation
        const { generateOutfitImage } = await import("@/lib/gemini-image-service");
        imageUrl = await generateOutfitImage(outfitData);
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
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => generateImage(true)}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          {loading ? 'Generating...' : 'Generate High Quality'}
        </Button>
        
        <Button
          onClick={() => generateImage(false)}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          {loading ? 'Generating...' : 'Generate Standard'}
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Aspect Ratio:</label>
        <div className="flex flex-wrap gap-2">
          {aspectRatios.map((ratio) => (
            <Button
              key={ratio.value}
              onClick={() => {
                setSelectedAspectRatio(ratio.value);
                generateImage(true, ratio.value);
              }}
              disabled={loading}
              variant={selectedAspectRatio === ratio.value ? "default" : "outline"}
              size="sm"
            >
              {ratio.label}
            </Button>
          ))}
        </div>
      </div>

      {generatedImages.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Generated Images</h3>
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {generatedImages.map((imageUrl, index) => (
                <CarouselItem key={index}>
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt={`Generated outfit ${index + 1}`}
                      className="w-full h-auto rounded-lg shadow-md"
                      onError={(e) => {
                        console.log('Image failed to load:', imageUrl);
                        e.currentTarget.src = `https://picsum.photos/400/400?random=${index}`;
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
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