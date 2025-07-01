import { NextRequest, NextResponse } from 'next/server';
import { generateOutfitImageWithImagen, generateOutfitImageWithAspectRatio, generateOutfitImage } from '@/lib/gemini-image-service';

export async function POST(request: NextRequest) {
  try {
    const { outfit, model, aspectRatio } = await request.json();
    
    if (!outfit) {
      return NextResponse.json(
        { error: 'Missing outfit data' },
        { status: 400 }
      );
    }

    console.log('API Route: Generating single image with model:', model, 'aspectRatio:', aspectRatio);
    
    let imageUrl: string;

    if (model === 'imagen' && aspectRatio) {
      imageUrl = await generateOutfitImageWithAspectRatio(outfit, aspectRatio);
    } else if (model === 'imagen') {
      imageUrl = await generateOutfitImageWithImagen(outfit);
    } else {
      imageUrl = await generateOutfitImage(outfit);
    }
    
    console.log('API Route: Generated single image successfully');
    
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 