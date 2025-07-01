import { NextRequest, NextResponse } from 'next/server';
import { generateMultipleOutfitImages } from '@/lib/gemini-image-service';

export async function POST(request: NextRequest) {
  try {
    const { outfits } = await request.json();
    
    if (!outfits || !Array.isArray(outfits)) {
      return NextResponse.json(
        { error: 'Missing or invalid outfits array' },
        { status: 400 }
      );
    }

    console.log('API Route: Generating images for', outfits.length, 'outfits');
    
    const images = await generateMultipleOutfitImages(outfits);
    
    console.log('API Route: Generated', images.length, 'images');
    
    return NextResponse.json({ images });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 