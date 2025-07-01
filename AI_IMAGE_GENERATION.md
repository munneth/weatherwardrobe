# AI Image Generation Features

This document describes the AI image generation capabilities implemented in the WeatherWardrobe project using Google's latest Gemini and Imagen models.

## Overview

The project now includes advanced AI image generation features that allow users to create high-quality fashion outfit images based on weather conditions, wardrobe items, and custom prompts.

## Models Available

### 1. Gemini 2.0 Flash Preview Image Generation
- **Use Case**: Contextual reasoning and understanding
- **Strengths**: 
  - Good for complex prompts with multiple elements
  - Can handle text and image inputs together
  - Conversational image editing capabilities
  - Contextual understanding of weather and fashion
- **Best For**: Outfit suggestions that require reasoning about weather conditions and style coordination

### 2. Imagen 4.0 Generate Preview
- **Use Case**: High-quality photorealistic images
- **Strengths**:
  - Highest quality photorealistic images
  - Multiple aspect ratio options (1:1, 3:4, 4:3, 9:16, 16:9)
  - Specialized for artistic and detailed work
  - Best for professional fashion photography
- **Best For**: Creating magazine-quality outfit images with specific styling requirements

## Features Implemented

### Core Image Generation Functions

1. **`generateOutfitImage(outfit: OutfitData)`**
   - Uses Gemini 2.0 Flash for contextual image generation
   - Includes response modalities for both text and image
   - Fallback to placeholder images if API fails

2. **`generateOutfitImageWithImagen(outfit: OutfitData)`**
   - Uses Imagen 4.0 for high-quality generation
   - Default 1:1 aspect ratio
   - Adult person generation allowed

3. **`generateOutfitImageWithAspectRatio(outfit: OutfitData, aspectRatio)`**
   - Customizable aspect ratios
   - Supports all Imagen aspect ratio options
   - Perfect for different display contexts

4. **`generateMultipleOutfitImages(outfits: OutfitData[])`**
   - Batch generation for multiple outfits
   - Rate limiting protection
   - Fallback handling for failed generations

### Components

1. **`AdvancedImageGenerator`**
   - Model selection (Gemini vs Imagen)
   - Aspect ratio customization
   - Custom prompt input
   - Image download functionality
   - Tips and best practices

2. **`OutfitCarousel`** (Updated)
   - Integration with new image generation
   - Aspect ratio selection
   - Multiple generation options
   - Image display and navigation

3. **`OutfitSuggestion`** (Updated)
   - Enhanced outfit descriptions
   - Integration with image generation
   - Better weather context integration

## Usage Examples

### Basic Outfit Image Generation
```typescript
import { generateOutfitImage } from '@/lib/gemini-image-service';

const outfitData = {
  description: "A stylish casual outfit perfect for 70°F sunny weather",
  weatherNotes: "Temperature: 70°F, Conditions: Sunny",
  outfit_name: "Summer Casual"
};

const imageUrl = await generateOutfitImage(outfitData);
```

### High-Quality Image with Custom Aspect Ratio
```typescript
import { generateOutfitImageWithAspectRatio } from '@/lib/gemini-image-service';

const imageUrl = await generateOutfitImageWithAspectRatio(outfitData, "16:9");
```

### Batch Generation
```typescript
import { generateMultipleOutfitImages } from '@/lib/gemini-image-service';

const outfits = [outfit1, outfit2, outfit3];
const imageUrls = await generateMultipleOutfitImages(outfits);
```

## Configuration

### Environment Variables
```env
gemini_api_key=your_gemini_api_key_here
```

### Model Configuration
- **Gemini**: Uses `gemini-2.0-flash-preview-image-generation`
- **Imagen**: Uses `imagen-4.0-generate-preview-06-06`

### Aspect Ratios Available
- `1:1` - Square (default, perfect for social media)
- `3:4` - Portrait (great for mobile displays)
- `4:3` - Landscape (traditional photo format)
- `9:16` - Mobile (perfect for stories and reels)
- `16:9` - Widescreen (ideal for desktop displays)

## Prompt Engineering Tips

### For Better Results:
1. **Be Specific**: "A cozy winter outfit with a chunky knit sweater"
2. **Include Weather Context**: "Perfect for 65°F partly cloudy weather"
3. **Specify Style**: "Professional office wear" or "Casual weekend style"
4. **Mention Colors and Materials**: "Navy blue cotton shirt with khaki pants"
5. **Add Mood**: "Elegant and sophisticated" or "Relaxed and comfortable"

### Example Prompts:
```
"A stylish casual outfit perfect for 70°F sunny weather, featuring a light cotton t-shirt, comfortable jeans, and sneakers. Professional fashion photography with clean studio lighting."

"An elegant winter ensemble for 35°F snowy conditions, including a warm wool coat, thermal layers, and waterproof boots. High-quality fashion photography with natural lighting."
```

## Error Handling

The system includes comprehensive error handling:
- API key validation
- Network error fallbacks
- Rate limiting protection
- Graceful degradation to placeholder images
- Detailed error logging

## Performance Considerations

- Rate limiting: 1-second delays between requests
- Image caching: Generated images are stored in component state
- Fallback images: Unsplash placeholders when AI generation fails
- Progressive loading: Loading states for better UX

## Testing

Visit `/ai-image-test` to test the image generation features:
- Try different models
- Experiment with aspect ratios
- Test custom prompts
- Download generated images

## Future Enhancements

1. **Image Editing**: Conversational image editing with Gemini
2. **Style Transfer**: Apply different artistic styles to generated images
3. **Batch Processing**: Generate multiple variations of the same outfit
4. **Integration**: Save generated images to user's wardrobe
5. **Advanced Prompts**: Template-based prompt generation

## Troubleshooting

### Common Issues:
1. **Missing API Key**: Ensure `gemini_api_key` is set in environment variables
2. **Rate Limiting**: Add delays between requests
3. **Image Loading**: Check network connectivity and API status
4. **Quality Issues**: Try different aspect ratios or models

### Debug Information:
- Check browser console for detailed error logs
- Verify API key permissions and quotas
- Test with simple prompts first
- Ensure proper CORS configuration 