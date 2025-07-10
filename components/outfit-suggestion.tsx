"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { WardrobeService } from "@/lib/wardrobe-service";
import { Button } from "@/components/ui/button";

interface WeatherData {
  current: {
    temp_c: number;
    temp_f: number;
    condition: { text: string };
    humidity: number;
    wind_kph: number;
  };
}

export type OutfitSuggestion = {
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
};

interface OutfitSuggestionProps {
  weatherData: WeatherData;
  onOutfitsGenerated?: (outfits: OutfitSuggestion[]) => void;
  selectedOutfitIndex: number;
  setSelectedOutfitIndex: (index: number) => void;
  generatedOutfits: OutfitSuggestion[];
}

export default function OutfitSuggestion({
  weatherData,
  onOutfitsGenerated,
  selectedOutfitIndex,
  setSelectedOutfitIndex,
  generatedOutfits,
}: OutfitSuggestionProps) {
  const { user } = useAuth();
  const [suggestion, setSuggestion] = useState<OutfitSuggestion | null>(null);
  const [allSuggestions, setAllSuggestions] = useState<OutfitSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOutfitSuggestion = async () => {
    if (!user) {
      setError("Please log in to get outfit suggestions");
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const wardrobeItems = await WardrobeService.getItems(user.uid);

      const itemsByCategory = wardrobeItems.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {} as Record<string, typeof wardrobeItems>);

      const tops = itemsByCategory["top"] || [];
      const bottoms = itemsByCategory["bottom"] || [];
      const shoes = itemsByCategory["shoes"] || [];
      const outerwear = itemsByCategory["outerwear"] || [];
      const accessories = itemsByCategory["accessories"] || [];

      if (tops.length === 0 || bottoms.length === 0 || shoes.length === 0) {
        const missing = [];
        if (tops.length === 0) missing.push("tops");
        if (bottoms.length === 0) missing.push("bottoms");
        if (shoes.length === 0) missing.push("shoes");
        setError(
          `Add at least one top, bottom, and shoes: ${missing.join(", ")}`
        );
        setAllSuggestions([]);
        setSuggestion(null);
        setLoading(false);
        return;
      }

      const outfitSuggestions: OutfitSuggestion[] = [];

      for (let i = 0; i < 3; i++) {
        const top = tops[i % tops.length];
        const bottom = bottoms[i % bottoms.length];
        const shoe = shoes[i % shoes.length];
        const outer =
          outerwear.length > 0 ? outerwear[i % outerwear.length] : null;
        const accessory =
          accessories.length > 0 ? accessories[i % accessories.length] : null;

        const outfitItems = [
          { id: top.id, name: top.name, category: top.category, reason: "Top" },
          {
            id: bottom.id,
            name: bottom.name,
            category: bottom.category,
            reason: "Bottom",
          },
          {
            id: shoe.id,
            name: shoe.name,
            category: shoe.category,
            reason: "Shoes",
          },
        ];
        if (outer)
          outfitItems.push({
            id: outer.id,
            name: outer.name,
            category: outer.category,
            reason: "Outerwear",
          });
        if (accessory)
          outfitItems.push({
            id: accessory.id,
            name: accessory.name,
            category: accessory.category,
            reason: "Accessory",
          });

        const weatherContext = `${
          weatherData.current.temp_f
        }°F, ${weatherData.current.condition.text.toLowerCase()}`;
        let outfitName = "Complete Outfit";
        let reasoning = `Perfect for ${weatherContext}`;
        let stylingTips = "Dress appropriately for the weather.";

        if (weatherData.current.temp_f < 60) {
          outfitName = "Cozy Layers";
          reasoning = "Warm and layered for cold weather.";
          stylingTips = "Add a scarf and thermal layers.";
        } else if (weatherData.current.temp_f > 80) {
          outfitName = "Cool Comfort";
          reasoning = "Light and breathable for hot weather.";
          stylingTips = "Stick to breathable fabrics and lighter colors.";
        } else if (
          weatherData.current.condition.text.toLowerCase().includes("rain")
        ) {
          outfitName = "Rain Ready";
          reasoning = "Rain-appropriate outfit.";
          stylingTips = "Bring a waterproof jacket or umbrella.";
        }

        // Create a detailed description for image generation
        const itemDescriptions = outfitItems
          .map((item) => {
            // Try to include color and material if available
            let desc = item.name + " (" + item.category + ")";
            const wardrobeItem = wardrobeItems.find((w) => w.id === item.id);
            if (wardrobeItem?.color) desc += `, color: ${wardrobeItem.color}`;
            if (wardrobeItem?.material)
              desc += `, material: ${wardrobeItem.material}`;
            return desc;
          })
          .join(", ");
        const description = `A stylish outfit featuring: ${itemDescriptions}. ${reasoning} ${stylingTips}`;

        outfitSuggestions.push({
          outfit_name: outfitName,
          reasoning,
          items: outfitItems,
          styling_tips: stylingTips,
          description: description,
          weather_notes: weatherContext,
        });
      }

      setAllSuggestions(outfitSuggestions);
      setSuggestion(outfitSuggestions[0]);
      if (onOutfitsGenerated) onOutfitsGenerated(outfitSuggestions);
    } catch (err) {
      console.error(err);
      setError("Failed to generate outfit suggestions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (generatedOutfits.length > 0) {
      setAllSuggestions(generatedOutfits);
      setSuggestion(generatedOutfits[selectedOutfitIndex] || null);
    }
  }, [generatedOutfits, selectedOutfitIndex]);

  if (!user) {
    return (
      <p className="text-center">
        Please log in to get personalized outfit suggestions.
      </p>
    );
  }

  return (
    <div className="w-full max-w-sm flex flex-col items-start font-serif gap-4 text-left">
      <Button
        onClick={getOutfitSuggestion}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Creating Outfits..." : "Generate Outfits"}
      </Button>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {allSuggestions.length > 0 && (
        <div className="flex gap-2 flex-wrap">
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

      {suggestion && (
        <div className="text-left bg-gray-50 border rounded-lg p-4 mt-2 w-full">
          <h3 className="text-lg font-semibold mb-2">
            {suggestion.outfit_name}
          </h3>

          {(suggestion.items ?? []).length > 0 && (
            <div className="mt-2">
              <h4 className="font-medium">Items:</h4>
              <ul className="list-disc list-inside text-sm">
                {suggestion.items?.map((item, idx) => (
                  <li key={idx}>
                    {item.name}{" "}
                    <span className="text-gray-500">({item.category})</span>
                  </li>
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
    </div>
  );
}
