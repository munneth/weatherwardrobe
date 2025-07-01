"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { WardrobeService } from '@/lib/wardrobe-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


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
  selectedOutfitIndex: number;
  setSelectedOutfitIndex: (index: number) => void;
  generatedOutfits: OutfitSuggestion[];
}

export default function OutfitSuggestion({ weatherData, onOutfitsGenerated, selectedOutfitIndex, setSelectedOutfitIndex, generatedOutfits }: OutfitSuggestionProps) {
  const { user } = useAuth()
  const [suggestion, setSuggestion] = useState<OutfitSuggestion | null>(null)
  const [allSuggestions, setAllSuggestions] = useState<OutfitSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getOutfitSuggestion = async () => {
    if (!user) {
      setError('Please log in to get outfit suggestions')
      return
    }

    console.log('Starting outfit suggestion generation...');
    setLoading(true)
    setError(null)
    setSuggestion(null)

    try {
      // Get user's wardrobe items
      const wardrobeItems = await WardrobeService.getItems(user.uid)
      
      console.log('Raw wardrobe items from database:', wardrobeItems);
      console.log('User ID:', user.uid);
      
      if (!wardrobeItems || wardrobeItems.length === 0) {
        setSuggestion({
          suggestion: "You don't have any items in your wardrobe yet. Add some clothes to get outfit suggestions!"
        })
        setLoading(false);
        return
      }

      // Group items by category
      const itemsByCategory = wardrobeItems.reduce((acc, item) => {
        console.log('Processing item:', item.name, 'with category:', item.category);
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {} as Record<string, typeof wardrobeItems>);

      console.log('Items by category:', itemsByCategory);

      // Generate 3 full outfit suggestions (top, bottom, shoes required)
      const outfitSuggestions: OutfitSuggestion[] = [];
      const tops = itemsByCategory['top'] || [];
      const bottoms = itemsByCategory['bottom'] || [];
      const shoes = itemsByCategory['shoes'] || [];
      const outerwear = itemsByCategory['outerwear'] || [];
      const accessories = itemsByCategory['accessories'] || [];

      console.log('Category counts - tops:', tops.length, 'bottoms:', bottoms.length, 'shoes:', shoes.length);

      if (tops.length === 0 || bottoms.length === 0 || shoes.length === 0) {
        // Not enough for a full outfit
        const missing = [];
        if (tops.length === 0) missing.push('tops');
        if (bottoms.length === 0) missing.push('bottoms');
        if (shoes.length === 0) missing.push('shoes');
        console.log('Missing categories:', missing);
        setSuggestion({
          suggestion: `You need at least one top, one bottom, and one pair of shoes to generate a full outfit. Please add more: ${missing.join(', ')}.`
        });
        setAllSuggestions([]);
        setSuggestion(null);
        setLoading(false);
        return;
      }

      console.log('Starting outfit generation loop...');
      for (let i = 0; i < 3; i++) {
        console.log(`Generating outfit ${i + 1}...`);
        // Cycle through available items for variety
        const top = tops[i % tops.length];
        const bottom = bottoms[i % bottoms.length];
        const shoe = shoes[i % shoes.length];
        const outer = outerwear.length > 0 ? outerwear[i % outerwear.length] : null;
        const accessory = accessories.length > 0 ? accessories[i % accessories.length] : null;

        console.log(`Selected items - top: ${top.name}, bottom: ${bottom.name}, shoe: ${shoe.name}`);

        const outfitItems = [
          { id: top.id, name: top.name, category: top.category, reason: 'Top for the outfit' },
          { id: bottom.id, name: bottom.name, category: bottom.category, reason: 'Bottom for the outfit' },
          { id: shoe.id, name: shoe.name, category: shoe.category, reason: 'Shoes for the outfit' },
        ];
        if (outer) outfitItems.push({ id: outer.id, name: outer.name, category: outer.category, reason: 'Outerwear for the weather' });
        if (accessory) outfitItems.push({ id: accessory.id, name: accessory.name, category: accessory.category, reason: 'Accessory to complete the look' });

        // Build a detailed, itemized description for the image prompt
        const weatherContext = `${weatherData.current.temp_f}°F, ${weatherData.current.condition.text.toLowerCase()}`;
        let desc = `A complete outfit for ${weatherContext}: `;
        desc += `Top: ${top.name}`;
        if (top.color) desc += ` (${top.color})`;
        desc += ", ";
        desc += `Bottom: ${bottom.name}`;
        if (bottom.color) desc += ` (${bottom.color})`;
        desc += ", ";
        desc += `Shoes: ${shoe.name}`;
        if (shoe.color) desc += ` (${shoe.color})`;
        if (outer) {
          desc += ", Outerwear: " + outer.name;
          if (outer.color) desc += ` (${outer.color})`;
        }
        if (accessory) {
          desc += ", Accessory: " + accessory.name;
          if (accessory.color) desc += ` (${accessory.color})`;
        }
        desc += ". Style: Professional fashion photography, clean studio lighting, white background. High resolution, photorealistic, magazine-quality, no text overlays, no watermarks. Full outfit display, well-lit, showcasing all clothing items clearly. Mood: Stylish, modern, fashion-forward.";

        // Weather-appropriate name and reasoning
        let outfitName = 'Complete Outfit';
        let reasoning = `Perfect for ${weatherContext}`;
        let stylingTips = 'Layer appropriately and consider the weather conditions.';
        if (weatherData.current.temp_f < 60) {
          outfitName = 'Cozy Layers';
          reasoning = 'Warm and layered for cold weather.';
          stylingTips = 'Add thermal layers and a scarf.';
        } else if (weatherData.current.temp_f > 80) {
          outfitName = 'Cool Comfort';
          reasoning = 'Light and breathable for hot weather.';
          stylingTips = 'Choose light fabrics and stay hydrated.';
        } else if (weatherData.current.condition.text.toLowerCase().includes('rain')) {
          outfitName = 'Rain Ready';
          reasoning = 'Weather-resistant for rainy conditions.';
          stylingTips = 'Consider waterproof shoes and a rain jacket.';
        }

        outfitSuggestions.push({
          outfit_name: outfitName,
          reasoning,
          items: outfitItems,
          weather_notes: `Temperature: ${weatherData.current.temp_f}°F, Conditions: ${weatherData.current.condition.text}, Humidity: ${weatherData.current.humidity}%, Wind: ${weatherData.current.wind_kph} km/h`,
          styling_tips: stylingTips,
          description: desc
        });
        
        console.log(`Completed outfit ${i + 1}: ${outfitName}`);
      }

      console.log('Generated outfit suggestions:', outfitSuggestions);
      setSuggestion(outfitSuggestions[0]);
      setAllSuggestions(outfitSuggestions);
      if (onOutfitsGenerated) {
        console.log('Calling onOutfitsGenerated callback...');
        onOutfitsGenerated(outfitSuggestions);
      }
      console.log('Setting loading to false...');
      setLoading(false);

    } catch (err) {
      console.error('Error getting outfit suggestion:', err)
      setError('Failed to generate outfit suggestion')
      setLoading(false);
    }
  }

  // When generatedOutfits changes, update local state
  useEffect(() => {
    if (generatedOutfits && generatedOutfits.length > 0) {
      setAllSuggestions(generatedOutfits);
      setSuggestion(generatedOutfits[selectedOutfitIndex] || null);
    }
  }, [generatedOutfits, selectedOutfitIndex]);

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
        <CardTitle>Today&apos;s Outfit Ideas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={() => {
            getOutfitSuggestion();
          }} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Creating Weather-Appropriate Outfits...' : 'Get Weather-Appropriate Outfits'}
        </Button>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Outfit selection buttons */}
        {allSuggestions.length > 0 && (
          <div className="flex gap-2 mb-4">
            {allSuggestions.map((outfit, index) => (
              <Button
                key={index}
                onClick={() => setSelectedOutfitIndex(index)}
                variant={selectedOutfitIndex === index ? "default" : "outline"}
                size="sm"
              >
                {outfit.outfit_name || `Outfit ${index + 1}`}
              </Button>
            ))}
          </div>
        )}

        {/* Show only the selected outfit's details */}
        {suggestion && (
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">{suggestion.outfit_name}</h3>
            {suggestion.items && suggestion.items.length > 0 && (
              <div className="mt-2">
                <h4 className="font-medium">Items:</h4>
                <ul className="list-disc list-inside text-sm">
                  {suggestion.items.map((item, idx) => (
                    <li key={idx}>{item.name} <span className="text-gray-500">({item.category})</span></li>
                  ))}
                </ul>
              </div>
            )}
            {suggestion.styling_tips && (
              <div className="mt-2">
                <h4 className="font-medium">Styling Tips:</h4>
                <p className="text-sm text-gray-700">{suggestion.styling_tips}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 