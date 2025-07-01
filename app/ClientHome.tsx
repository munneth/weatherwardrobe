"use client";
import { useState, useEffect } from "react";
import WeatherBar from "@/components/weatherBar";
import  CalendarApp  from "@/components/calendarApp";
import HisHersCard from "@/components/hisHersCard";
import NavbarApp from "@/components/navbarApp";
import FloatingActionButton from "@/components/floating-action-button";
import UserWardrobe from "@/components/user-wardrobe";
import OutfitSuggestion from "@/components/outfit-suggestion";
import { useAuth } from "@/lib/auth-context";
import { WardrobeService } from "@/lib/wardrobe-service";

import { Button } from "@/components/ui/button";

export default function ClientHome({ weatherData, locationData }: { weatherData: any; locationData: any }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { user } = useAuth();
  const [hisOutfitImages, setHisOutfitImages] = useState<string[]>([]);
  const [hersOutfitImages, setHersOutfitImages] = useState<string[]>([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [generatedOutfits, setGeneratedOutfits] = useState<any[]>([]);

  const generateOutfitImages = async (outfits: any[]) => {
    if (!user || outfits.length === 0) return;
    
    setImageLoading(true);
    
    try {
      console.log('Generating images for outfits:', outfits);
      
      // Call the API route for image generation
      const response = await fetch('/api/generate-outfit-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ outfits }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const generatedImages = data.images;

      // Set the generated images
      console.log('Generated images:', generatedImages);
      setHisOutfitImages(generatedImages);
      setHersOutfitImages(generatedImages); // For now, using same images for both

    } catch (error) {
      console.error('Error generating outfit images:', error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleOutfitsGenerated = (outfits: any[]) => {
    console.log('Outfits generated:', outfits);
    setGeneratedOutfits(outfits);
    generateOutfitImages(outfits);
  };

  // Generate images when component mounts and user is logged in
  useEffect(() => {
    if (user && generatedOutfits.length > 0 && hisOutfitImages.length === 0 && !imageLoading) {
      generateOutfitImages(generatedOutfits);
    }
  }, [user, generatedOutfits]);

  return (
    <>
      <header>
        <NavbarApp />
      </header>
      <main className="p-8 space-y-8">
        <div>
          <WeatherBar data={weatherData} locationData={locationData} className="bg-blue-500 text-white p-4 rounded-lg shadow-md" />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="">
            <CalendarApp />
          </div>
          <div>
            <HisHersCard his={true} outfitImages={hisOutfitImages} loading={imageLoading} />
            {user && (
              <Button 
                onClick={() => generateOutfitImages(generatedOutfits)} 
                disabled={imageLoading || generatedOutfits.length === 0}
                className="mt-2 w-full"
                variant="outline"
              >
                {imageLoading ? 'Generating AI Images...' : 'Generate AI Outfit Images'}
              </Button>
            )}
          </div>
          {/* <div>
            <HisHersCard his={false} outfitImages={hersOutfitImages} loading={imageLoading} />
          </div> */}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <UserWardrobe />
          </div>
          <div>
            <OutfitSuggestion weatherData={weatherData} onOutfitsGenerated={handleOutfitsGenerated} />
          </div>
        </div>
      </main>
      <FloatingActionButton />
    </>
  );
}