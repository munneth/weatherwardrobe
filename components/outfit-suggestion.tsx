"use client"
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { WardrobeService } from '@/lib/wardrobe-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import OutfitCarousel from '@/components/outfit-carousel'

interface WeatherData {
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
    };
    humidity: number;
    wind_kph: number;
  };
}

interface OutfitSuggestion {
  outfit_name?: string;
  reasoning?: string;
  items?: Array<{
    id: string;
    name: string;
    category: string;
    reason: string;
  }>;
  weather_notes?: string;
  styling_tips?: string;
  suggestion?: string;
  error?: string;
  description?: string;
}

interface OutfitSuggestionProps {
  weatherData: WeatherData;
  onOutfitsGenerated?: (outfits: OutfitSuggestion[]) => void;
}

export default function OutfitSuggestion({ weatherData, onOutfitsGenerated }: OutfitSuggestionProps) {
  const { user } = useAuth()
  const [suggestion, setSuggestion] = useState<OutfitSuggestion | null>(null)
  const [allSuggestions, setAllSuggestions] = useState<OutfitSuggestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getOutfitSuggestion = async () => {
    if (!user) {
      setError('Please log in to get outfit suggestions')
      return
    }

    setLoading(true)
    setError(null)
    setSuggestion(null)

    try {
      // Get user's wardrobe items
      const wardrobeItems = await WardrobeService.getItems(user.uid)
      
      if (!wardrobeItems || wardrobeItems.length === 0) {
        setSuggestion({
          suggestion: "You don't have any items in your wardrobe yet. Add some clothes to get outfit suggestions!"
        })
        return
      }

      // Group items by category
      const itemsByCategory = wardrobeItems.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {} as Record<string, typeof wardrobeItems>);

      console.log('Items by category:', itemsByCategory);

      // Define required categories for a complete outfit
      const requiredCategories = ['tops', 'bottoms', 'shoes'];
      const optionalCategories = ['outerwear', 'accessories'];

      // Generate 3 different balanced outfit suggestions
      const outfitSuggestions: OutfitSuggestion[] = [];

      for (let i = 0; i < 3; i++) {
        const outfitItems: any[] = [];
        let outfitDescription = '';

        // Add required items (1 from each category)
        for (const category of requiredCategories) {
          const categoryItems = itemsByCategory[category] || [];
          if (categoryItems.length > 0) {
            // Use different items for each outfit by cycling through available items
            const itemIndex = (i + Math.floor(i / categoryItems.length)) % categoryItems.length;
            const item = categoryItems[itemIndex];
            outfitItems.push({
              id: item.id,
              name: item.name,
              category: item.category,
              reason: `Essential ${item.category} for complete outfit`
            });
            outfitDescription += `${item.name} `;
          }
        }

        // Add optional items if available
        for (const category of optionalCategories) {
          const categoryItems = itemsByCategory[category] || [];
          if (categoryItems.length > 0) {
            const itemIndex = i % categoryItems.length;
            const item = categoryItems[itemIndex];
            outfitItems.push({
              id: item.id,
              name: item.name,
              category: item.category,
              reason: `Stylish ${item.category} to complete the look`
            });
            outfitDescription += `with ${item.name} `;
          }
        }

        // Create outfit names based on the combination
        const outfitNames = ["Casual Comfort", "Smart Casual", "Weekend Vibes"];
        
        const outfit = {
          outfit_name: outfitNames[i],
          reasoning: `Perfect for ${weatherData.current.temp_f}°F weather with ${weatherData.current.condition.text}`,
          items: outfitItems,
          weather_notes: `Temperature: ${weatherData.current.temp_f}°F, Conditions: ${weatherData.current.condition.text}`,
          styling_tips: "Layer appropriately and consider the weather conditions",
          description: outfitDescription.trim() || "Complete outfit combination"
        };
        
        console.log(`Outfit ${i + 1}:`, outfit);
        outfitSuggestions.push(outfit);
      }

      // Set the first suggestion as the current one
      setSuggestion(outfitSuggestions[0]);
      setAllSuggestions(outfitSuggestions);
      setCurrentIndex(0);
      
      // Notify parent component about the generated outfits
      if (onOutfitsGenerated) {
        onOutfitsGenerated(outfitSuggestions);
      }

    } catch (err) {
      console.error('Error getting outfit suggestion:', err)
      setError('Failed to generate outfit suggestion')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Outfit Suggestion</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to get personalized outfit suggestions.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Outfit Ideas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={getOutfitSuggestion} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Generating...' : 'Get 3 Outfit Ideas'}
        </Button>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

                {allSuggestions.length > 0 && (
          <OutfitCarousel 
            suggestions={allSuggestions}
            currentIndex={currentIndex}
            onIndexChange={(index) => {
              setCurrentIndex(index);
              setSuggestion(allSuggestions[index]);
            }}
          />
        )}
      </CardContent>
    </Card>
  )
} 