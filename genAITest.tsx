import { GoogleGenAI } from "@google/genai";
import { WardrobeService } from "@/lib/wardrobe-service";

// Access the API key from the environment variable
const apiKey = process.env.gemini_api_key;
if (!apiKey) {
  throw new Error('Missing gemini_api_key environment variable');
}

const ai = new GoogleGenAI({
  apiKey: apiKey as string
});

interface WeatherData {
  current: {
    temp_c: number;
    condition: {
      text: string;
    };
    humidity: number;
    wind_kph: number;
  };
  forecast: {
    forecastday: Array<{
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        condition: {
          text: string;
        };
      };
    }>;
  };
}

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  color: string;
  material: string;
  season?: string;
  weather_condition?: string;
  min_temp?: number;
  max_temp?: number;
  image_url?: string;
}

export async function getOutfitSuggestion(userId: string, weatherData: WeatherData) {
  try {
    // Get user's wardrobe items
    const wardrobeItems = await WardrobeService.getItems(userId);
    
    if (!wardrobeItems || wardrobeItems.length === 0) {
      return {
        suggestion: "You don't have any items in your wardrobe yet. Add some clothes to get outfit suggestions!",
        items: []
      };
    }

    // Prepare weather context
    const currentTemp = weatherData.current.temp_c;
    const weatherCondition = weatherData.current.condition.text.toLowerCase();
    const humidity = weatherData.current.humidity;
    const windSpeed = weatherData.current.wind_kph;

    // Create a detailed prompt for the AI
    const prompt = `
You are a fashion expert and personal stylist. Based on the current weather and the user's wardrobe, suggest the best outfit for today.

WEATHER CONDITIONS:
- Temperature: ${currentTemp}°C
- Weather: ${weatherCondition}
- Humidity: ${humidity}%
- Wind Speed: ${windSpeed} km/h

USER'S WARDROBE ITEMS:
${wardrobeItems.map(item => `
- ${item.name} (${item.category})
  Color: ${item.color}
  Material: ${item.material}
  ${item.season ? `Season: ${item.season}` : ''}
  ${item.weather_condition ? `Weather: ${item.weather_condition}` : ''}
  ${item.min_temp && item.max_temp ? `Temperature range: ${item.min_temp}°C - ${item.max_temp}°C` : ''}
`).join('')}

TASK:
1. Analyze the weather conditions and determine what type of clothing would be most appropriate
2. From the user's wardrobe, select items that would work well together for today's weather
3. Consider factors like:
   - Temperature appropriateness (layering for cold, light fabrics for heat)
   - Weather protection (waterproof for rain, wind-resistant for windy days)
   - Comfort and practicality
   - Style coordination and color matching

OUTPUT FORMAT:
Provide your response in this exact JSON format:
{
  "outfit_name": "A creative name for this outfit",
  "reasoning": "Brief explanation of why this outfit works for today's weather",
  "items": [
    {
      "id": "item_id",
      "name": "item_name",
      "category": "item_category",
      "reason": "Why this item is perfect for today"
    }
  ],
  "weather_notes": "Additional weather-specific advice",
  "styling_tips": "How to wear or accessorize this outfit"
}

Be practical, stylish, and weather-appropriate. Focus on comfort and functionality while maintaining good style.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const responseText = response.text || '';
    
    // Try to parse the JSON response
    try {
      const outfitSuggestion = JSON.parse(responseText);
      return outfitSuggestion;
    } catch (parseError) {
      // If JSON parsing fails, return the raw response
      return {
        suggestion: responseText,
        items: [],
        error: "Could not parse AI response as JSON"
      };
    }

  } catch (error) {
    console.error("Error getting outfit suggestion:", error);
    return {
      suggestion: "Sorry, I couldn't generate an outfit suggestion right now.",
      items: [],
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Example usage function (for testing)
export async function testOutfitSuggestion() {
  const mockWeatherData: WeatherData = {
    current: {
      temp_c: 22,
      condition: { text: "Partly cloudy" },
      humidity: 65,
      wind_kph: 15
    },
    forecast: {
      forecastday: [{
        day: {
          maxtemp_c: 25,
          mintemp_c: 18,
          avgtemp_c: 22,
          condition: { text: "Partly cloudy" }
        }
      }]
    }
  };

  // You would replace 'test-user-id' with the actual user ID
  const suggestion = await getOutfitSuggestion('test-user-id', mockWeatherData);
  console.log("Outfit Suggestion:", JSON.stringify(suggestion, null, 2));
}

// Keep the original main function for backward compatibility
export default async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}