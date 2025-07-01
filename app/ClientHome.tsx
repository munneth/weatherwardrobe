"use client";
import React, { useState, useEffect } from "react";
import WeatherBar from "@/components/weatherBar";
import CalendarApp from "@/components/calendarApp";
import NavbarApp from "@/components/navbarApp";
import FloatingActionButton from "@/components/floating-action-button";
import UserWardrobe from "@/components/user-wardrobe";
import OutfitSuggestion from "@/components/outfit-suggestion";
import OutfitImageDisplay from "@/components/outfit-image-display";
import { useAuth } from "@/lib/auth-context";

//get user ip address


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

export default function ClientHome({ weatherData, locationData }: { weatherData: any; locationData: any }) {
  const [clientLocation, setClientLocation] = useState<any>(null);
  const [clientWeatherData, setClientWeatherData] = useState<any>(weatherData);
  const [clientLocationData, setClientLocationData] = useState<any>(locationData);

  //get user ip address and update weather data
  useEffect(() => {
    const getClientLocation = async () => {
      try {
        const res = await fetch('https://ipinfo.io/json');
        const locationData = await res.json();
        console.log('Client location data:', locationData);
        setClientLocation(locationData);
        
        // Fetch weather data using client IP
        const weatherResponse = await fetch(`/api/weather?ip=${locationData.ip}`);
        const weatherData = await weatherResponse.json();
        console.log('Updated weather data:', weatherData);
        
        // Update the weather and location data with client's actual location
        setClientWeatherData(weatherData.weather);
        setClientLocationData(weatherData.location);
      } catch (error) {
        console.error('Error fetching client location:', error);
      }
    };

    getClientLocation();
  }, []);


  const { user } = useAuth();
  const [hisOutfitImages, setHisOutfitImages] = useState<string[]>([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [generatedOutfits, setGeneratedOutfits] = useState<OutfitSuggestion[]>([]);
  const [selectedOutfitIndex, setSelectedOutfitIndex] = useState(0);

  const generateOutfitImages = async (outfits: OutfitSuggestion[]) => {
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
    } catch (error) {
      console.error('Error generating outfit images:', error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleOutfitsGenerated = (outfits: OutfitSuggestion[]) => {
    setGeneratedOutfits(outfits);
    setSelectedOutfitIndex(0);
    generateOutfitImages(outfits);
  };

  // Generate images when component mounts and user is logged in
  useEffect(() => {
    if (user && generatedOutfits.length > 0 && hisOutfitImages.length === 0 && !imageLoading) {
      generateOutfitImages(generatedOutfits);
    }
  }, [user, generatedOutfits, hisOutfitImages.length, imageLoading, generateOutfitImages]);

  // Get the currently selected image
  const selectedImage = hisOutfitImages[selectedOutfitIndex];

  return (
    <>
      <header>
        <NavbarApp />
      </header>
      <main className="p-8 space-y-8">

        
        <div>
          <WeatherBar data={clientWeatherData} locationData={clientLocationData} className="bg-blue-500 text-white p-4 rounded-lg shadow-md" />
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <CalendarApp />
          </div>
          <div className="md:w-1/3">
            <OutfitSuggestion
              weatherData={clientWeatherData}
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