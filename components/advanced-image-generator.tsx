"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
interface AdvancedImageGeneratorProps {
  defaultPrompt?: string;
}

export default function AdvancedImageGenerator({ defaultPrompt = "A stylish fashion outfit" }: AdvancedImageGeneratorProps) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'imagen'>('imagen');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<"1:1" | "3:4" | "4:3" | "9:16" | "16:9">("1:1");

  const models = [
    { id: 'gemini', name: 'Gemini 2.0 Flash', description: 'Good for contextual images with reasoning' },
    { id: 'imagen', name: 'Imagen 4.0', description: 'Best for high-quality, photorealistic images' }
  ];

  const aspectRatios = [
    { value: "1:1" as const, label: "Square (1:1)", description: "Perfect for social media" },
    { value: "3:4" as const, label: "Portrait (3:4)", description: "Great for mobile displays" },
    { value: "4:3" as const, label: "Landscape (4:3)", description: "Traditional photo format" },
    { value: "9:16" as const, label: "Mobile (9:16)", description: "Perfect for stories and reels" },
    { value: "16:9" as const, label: "Widescreen (16:9)", description: "Ideal for desktop displays" }
  ];

  const generateImage = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const outfitData = {
        description: prompt,
        weatherNotes: 'General weather conditions',
        outfit_name: 'Custom Outfit'
      };

      // Call the API route for image generation
      const response = await fetch('/api/generate-single-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          outfit: outfitData, 
          model: selectedModel, 
          aspectRatio: selectedAspectRatio 
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const imageUrl = data.imageUrl;

      setGeneratedImages(prev => [...prev, imageUrl]);
      
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearImages = () => {
    setGeneratedImages([]);
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-outfit-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Advanced AI Image Generator</CardTitle>
        <p className="text-sm text-gray-600">
          Generate high-quality fashion images using Google&apos;s latest AI models
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Model Selection */}
        <div className="space-y-3">
          <Label>Choose Model</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {models.map((model) => (
              <Button
                key={model.id}
                onClick={() => setSelectedModel(model.id as 'gemini' | 'imagen')}
                variant={selectedModel === model.id ? "default" : "outline"}
                className="justify-start h-auto p-4"
              >
                <div className="text-left">
                  <div className="font-medium">{model.name}</div>
                  <div className="text-sm text-gray-600">{model.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio Selection */}
        {selectedModel === 'imagen' && (
          <div className="space-y-3">
            <Label>Aspect Ratio</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {aspectRatios.map((ratio) => (
                <Button
                  key={ratio.value}
                  onClick={() => setSelectedAspectRatio(ratio.value)}
                  variant={selectedAspectRatio === ratio.value ? "default" : "outline"}
                  size="sm"
                  className="h-auto p-3"
                >
                  <div className="text-center">
                    <div className="font-medium text-xs">{ratio.label}</div>
                    <div className="text-xs text-gray-600">{ratio.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Prompt Input */}
        <div className="space-y-3">
          <Label htmlFor="prompt">Image Prompt</Label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
            placeholder="Describe the outfit you want to generate..."
            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p className="text-sm text-gray-600">
            Be specific about style, colors, weather conditions, and mood for better results.
          </p>
        </div>

        {/* Generation Controls */}
        <div className="flex gap-3">
          <Button
            onClick={generateImage}
            disabled={loading || !prompt.trim()}
            className="flex-1"
          >
            {loading ? 'Generating...' : `Generate with ${selectedModel === 'imagen' ? 'Imagen' : 'Gemini'}`}
          </Button>
          <Button
            onClick={clearImages}
            variant="outline"
            disabled={generatedImages.length === 0}
          >
            Clear All
          </Button>
        </div>

        {/* Generated Images */}
        {generatedImages.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Generated Images ({generatedImages.length})</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Generated outfit ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      console.log('Image failed to load:', imageUrl);
                      e.currentTarget.src = `https://picsum.photos/400/400?random=${index}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        onClick={() => downloadImage(imageUrl, index)}
                        size="sm"
                        variant="secondary"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Tips for Better Results:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use descriptive language: &ldquo;A cozy winter outfit with a chunky knit sweater&rdquo;</li>
            <li>• Include weather context: &ldquo;Perfect for 65°F partly cloudy weather&rdquo;</li>
            <li>• Specify style: &ldquo;Professional office wear&rdquo; or &ldquo;Casual weekend style&rdquo;</li>
            <li>• Mention colors and materials: &ldquo;Navy blue cotton shirt with khaki pants&rdquo;</li>
            <li>• Add mood: &ldquo;Elegant and sophisticated&rdquo; or &ldquo;Relaxed and comfortable&rdquo;</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 