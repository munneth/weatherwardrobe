import { GoogleGenAI, Modality, PersonGeneration } from "@google/genai";

// Access the API key from the environment variable
const apiKey = process.env.gemini_api_key;
if (!apiKey) {
  console.warn('Missing gemini_api_key environment variable. Using placeholder images.');
}

const ai = apiKey ? new GoogleGenAI({
  apiKey: apiKey as string
}) : null;

interface OutfitData {
  description: string;
  weatherNotes?: string;
  outfit_name?: string;
  items?: Array<{
    name: string;
    category: string;
  }>;
}

export async function generateOutfitImage(outfit: OutfitData): Promise<string> {
  try {
    // Create a detailed prompt for image generation
    const prompt = `Generate a high-quality fashion photography image of this outfit: ${outfit.description}. 
    Style: Professional fashion photography, clean studio lighting, white background.
    Quality: High resolution, photorealistic, magazine-quality, no text overlays, no watermarks.
    Composition: Full outfit display, well-lit, showcasing all clothing items clearly.
    Weather context: ${outfit.weatherNotes || 'General weather'}.
    Mood: Stylish, modern, fashion-forward.
    The image should look like professional fashion photography that could be used in a high-end clothing catalog or fashion magazine.`;

    console.log('Generating image with prompt:', prompt);

    // Try to use Gemini for image generation if available
    if (ai) {
      try {
        // Use the new Gemini 2.0 Flash Preview Image Generation model
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash-preview-image-generation",
          contents: prompt,
          config: {
            responseModalities: [Modality.TEXT, Modality.IMAGE],
          },
        });

        // Process the response parts
        if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
          for (const part of response.candidates[0].content.parts) {
            // Based on the part type, either show the text or save the image
            if (part.text) {
              console.log('Generated text:', part.text);
            } else if (part.inlineData) {
              const imageData = part.inlineData.data;
              const mimeType = part.inlineData.mimeType;
              const dataUrl = `data:${mimeType};base64,${imageData}`;
              console.log(`Generated fashion image for outfit: ${outfit.outfit_name || 'Unknown'}`);
              return dataUrl;
            }
          }
        }
        
        console.warn("Gemini did not return an image, falling back to placeholder.");
      } catch (geminiError) {
        console.log('Gemini image generation failed, falling back to placeholder', geminiError);
      }
    }

    // Fallback: Unsplash placeholder
    const fashionKeywords = outfit.description?.toLowerCase().includes('casual') ? 'casual fashion' :
                           outfit.description?.toLowerCase().includes('formal') ? 'formal fashion' :
                           outfit.description?.toLowerCase().includes('sport') ? 'sportswear' : 'fashion outfit';
    const placeholderImage = `https://source.unsplash.com/400x300/?${fashionKeywords},clothing,fashion`;

    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`Generated fashion-focused image for outfit: ${outfit.outfit_name || 'Unknown'}`);
    return placeholderImage;

  } catch (error) {
    console.error('Error generating outfit image:', error);

    // Fallback to a fashion-focused placeholder image
    const fashionKeywords = outfit.description?.toLowerCase().includes('casual') ? 'casual fashion' :
                           outfit.description?.toLowerCase().includes('formal') ? 'formal fashion' :
                           outfit.description?.toLowerCase().includes('sport') ? 'sportswear' : 'fashion outfit';
    return `https://source.unsplash.com/400x300/?${fashionKeywords},clothing,fashion`;
  }
}

// New function to generate images using Imagen models for higher quality
export async function generateOutfitImageWithImagen(outfit: OutfitData): Promise<string> {
  try {
    if (!ai) {
      console.warn('AI service not available - missing API key. Using fallback image generation.');
      // Fallback to regular Gemini generation which has better error handling
      return generateOutfitImage(outfit);
    }

    const prompt = `High-quality fashion photography of a stylish outfit: ${outfit.description}. 
    Professional studio lighting, clean white background, magazine-quality fashion photography.
    Weather context: ${outfit.weatherNotes || 'General weather'}.
    Photorealistic, no watermarks, no text overlays.`;

    console.log('Generating Imagen image with prompt:', prompt);

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-preview-06-06',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: "1:1",
        personGeneration: PersonGeneration.ALLOW_ADULT,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const generatedImage = response.generatedImages[0];
      if (generatedImage.image && generatedImage.image.imageBytes) {
        const imgBytes = generatedImage.image.imageBytes;
        const dataUrl = `data:image/png;base64,${imgBytes}`;
        console.log(`Generated Imagen fashion image for outfit: ${outfit.outfit_name || 'Unknown'}`);
        return dataUrl;
      }
    }

    throw new Error('No images generated by Imagen');

  } catch (error) {
    console.error('Error generating Imagen outfit image:', error);
    // Fallback to regular Gemini generation
    return generateOutfitImage(outfit);
  }
}

export async function generateMultipleOutfitImages(outfits: OutfitData[]): Promise<string[]> {
  const generatedImages: string[] = [];
  
  for (const outfit of outfits) {
    try {
      // Try Imagen first for higher quality, fallback to Gemini
      const imageUrl = await generateOutfitImageWithImagen(outfit);
      generatedImages.push(imageUrl);
      
      // Add a small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error generating image for outfit: ${outfit.outfit_name}`, error);
      // Add a fallback fashion image
      const fashionKeywords = outfit.description?.toLowerCase().includes('casual') ? 'casual fashion' :
                             outfit.description?.toLowerCase().includes('formal') ? 'formal fashion' :
                             outfit.description?.toLowerCase().includes('sport') ? 'sportswear' : 'fashion outfit';
      generatedImages.push(`https://source.unsplash.com/400x300/?${fashionKeywords},clothing,fashion`);
    }
  }
  
  return generatedImages;
}

// Function to generate outfit images with specific aspect ratios
export async function generateOutfitImageWithAspectRatio(
  outfit: OutfitData, 
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "1:1"
): Promise<string> {
  try {
    if (!ai) {
      console.warn('AI service not available - missing API key. Using fallback image generation.');
      // Fallback to regular Gemini generation which has better error handling
      return generateOutfitImage(outfit);
    }

    const prompt = `High-quality fashion photography of a stylish outfit: ${outfit.description}. 
    Professional studio lighting, clean white background, magazine-quality fashion photography.
    Weather context: ${outfit.weatherNotes || 'General weather'}.
    Photorealistic, no watermarks, no text overlays.`;

    console.log(`Generating Imagen image with aspect ratio ${aspectRatio}:`, prompt);

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-preview-06-06',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: aspectRatio,
        personGeneration: PersonGeneration.ALLOW_ADULT,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const generatedImage = response.generatedImages[0];
      if (generatedImage.image && generatedImage.image.imageBytes) {
        const imgBytes = generatedImage.image.imageBytes;
        const dataUrl = `data:image/png;base64,${imgBytes}`;
        console.log(`Generated Imagen fashion image with ${aspectRatio} aspect ratio for outfit: ${outfit.outfit_name || 'Unknown'}`);
        return dataUrl;
      }
    }

    throw new Error('No images generated by Imagen');

  } catch (error) {
    console.error('Error generating Imagen outfit image with aspect ratio:', error);
    // Fallback to regular Gemini generation
    return generateOutfitImage(outfit);
  }
}