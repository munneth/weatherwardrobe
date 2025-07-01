"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
}

interface OutfitCarouselProps {
  suggestions: OutfitSuggestion[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export default function OutfitCarousel({ suggestions, currentIndex, onIndexChange }: OutfitCarouselProps) {

  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % suggestions.length;
    onIndexChange(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = currentIndex === 0 ? suggestions.length - 1 : currentIndex - 1;
    onIndexChange(prevIndex);
  };

  const currentSuggestion = suggestions[currentIndex];

  if (!currentSuggestion) return null;

  return (
    <div className="relative">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-center">{currentSuggestion.outfit_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Outfit Details Only - No Image */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 text-center">
              Outfit images are displayed in the carousel above
            </p>
          </div>

          {/* Outfit Details */}
          <div className="space-y-3">
            {currentSuggestion.reasoning && (
              <div>
                <h4 className="font-medium">Why this works:</h4>
                <p className="text-sm text-gray-600">{currentSuggestion.reasoning}</p>
              </div>
            )}

            {currentSuggestion.items && currentSuggestion.items.length > 0 && (
              <div>
                <h4 className="font-medium">Items:</h4>
                <div className="space-y-1">
                  {currentSuggestion.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-500">{item.category}</p>
                      </div>
                      <p className="text-xs text-gray-600">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentSuggestion.weather_notes && (
              <div>
                <h4 className="font-medium">Weather Notes:</h4>
                <p className="text-sm text-gray-600">{currentSuggestion.weather_notes}</p>
              </div>
            )}

            {currentSuggestion.styling_tips && (
              <div>
                <h4 className="font-medium">Styling Tips:</h4>
                <p className="text-sm text-gray-600">{currentSuggestion.styling_tips}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-4">
        <Button 
          onClick={prevSlide} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <div className="flex gap-1">
          {suggestions.map((_, index) => (
            <button
              key={index}
              onClick={() => onIndexChange(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Button 
          onClick={nextSlide} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
} 