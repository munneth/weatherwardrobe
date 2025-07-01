"use client";
import React, { useState, useEffect } from "react";
import WeatherBar from "@/components/weatherBar";
import  CalendarApp  from "@/components/calendarApp";
import HisHersCard from "@/components/hisHersCard";
import NavbarApp from "@/components/navbarApp";
import FloatingActionButton from "@/components/floating-action-button";
import UserWardrobe from "@/components/user-wardrobe";
import OutfitSuggestion from "@/components/outfit-suggestion";
import OutfitImageDisplay from "@/components/outfit-image-display";
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
  const [selectedOutfitIndex, setSelectedOutfitIndex] = useState(0);

  const generateOutfitImages = async (outfits: any[]) => {
    if (!user || outfits.length === 0) return;
    setImageLoading(true);
    try {
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
      setHisOutfitImages(generatedImages);
      setHersOutfitImages(generatedImages); // For now, using same images for both
    } catch (error) {
      console.error('Error generating outfit images:', error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleOutfitsGenerated = (outfits: any[]) => {
    setGeneratedOutfits(outfits);
    setSelectedOutfitIndex(0);
    generateOutfitImages(outfits);
  };

  // Generate images when component mounts and user is logged in
  useEffect(() => {
    if (user && generatedOutfits.length > 0 && hisOutfitImages.length === 0 && !imageLoading) {
      generateOutfitImages(generatedOutfits);
    }
  }, [user, generatedOutfits]);

  // Get the currently selected outfit and image
  const selectedOutfit = generatedOutfits[selectedOutfitIndex];
  const selectedImage = hisOutfitImages[selectedOutfitIndex];

  return (
    <>
      <header>
        <NavbarApp />
      </header>
      <main className="p-8 space-y-8">
        <div>
          <WeatherBar data={weatherData} locationData={locationData} className="bg-blue-500 text-white p-4 rounded-lg shadow-md" />
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <CalendarApp />
          </div>
          <div className="md:w-1/3">
            <OutfitSuggestion
              weatherData={weatherData}
              onOutfitsGenerated={handleOutfitsGenerated}
              selectedOutfitIndex={selectedOutfitIndex}
              setSelectedOutfitIndex={setSelectedOutfitIndex}
              generatedOutfits={generatedOutfits}
            />
          </div>
          <div className="md:w-1/3">
            <OutfitImageDisplay imageUrl={selectedImage} loading={imageLoading} />
          </div>
        </div>
        <div className="mt-8">
          <UserWardrobe />
        </div>
      </main>
      <FloatingActionButton />
    </>
  );
}