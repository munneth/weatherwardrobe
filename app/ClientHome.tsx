"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import WeatherBar from "@/components/weatherBar";
import CalendarApp from "@/components/calendarApp";
import NavbarApp from "@/components/navbarApp";
import FloatingActionButton from "@/components/floating-action-button";
import UserWardrobe from "@/components/user-wardrobe";
import OutfitSuggestion from "@/components/outfit-suggestion";
import OutfitImageDisplay from "@/components/outfit-image-display";
import { useAuth } from "@/lib/auth-context";
import HomePage from "@/components/ui/homepage";

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

interface ClientWeatherData {
  current: {
    temp_c: number;
    temp_f: number;
    condition: { text: string };
    humidity: number;
    wind_kph: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_f: number;
        mintemp_f: number;
        condition: { text: string; icon: string };
      };
    }>;
  };
  [key: string]: unknown;
}

interface LocationData {
  city?: string;
  region?: string;
  country?: string;
  ip?: string;
  [key: string]: unknown;
}

export default function ClientHome({
  weatherData,
  locationData,
}: {
  weatherData: ClientWeatherData;
  locationData: LocationData;
}) {
  const [clientWeatherData, setClientWeatherData] =
    useState<ClientWeatherData>(weatherData);
  const [clientLocationData, setClientLocationData] =
    useState<LocationData>(locationData);

  //get user ip address and update weather data
  useEffect(() => {
    const getClientLocation = async () => {
      try {
        const res = await fetch("https://ipinfo.io/json");
        const locationData: { ip: string } = await res.json();
        console.log("Client location data:", locationData);

        // Fetch weather data using client IP
        const weatherResponse = await fetch(
          `/api/weather?ip=${locationData.ip}`
        );
        const weatherData: {
          weather: ClientWeatherData;
          location: LocationData;
        } = await weatherResponse.json();
        console.log("Updated weather data:", weatherData);

        // Update the weather and location data with client's actual location
        setClientWeatherData(weatherData.weather);
        setClientLocationData(weatherData.location);
      } catch (error) {
        console.error("Error fetching client location:", error);
      }
    };

    getClientLocation();
  }, []);

  const { user } = useAuth();
  const [hisOutfitImages, setHisOutfitImages] = useState<string[]>([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [generatedOutfits, setGeneratedOutfits] = useState<OutfitSuggestion[]>(
    []
  );
  const [selectedOutfitIndex, setSelectedOutfitIndex] = useState(0);
  const section1 = useRef<HTMLDivElement>(null);
  const generateOutfitImages = useCallback(
    async (outfits: OutfitSuggestion[]) => {
      if (!user || outfits.length === 0) return;
      setImageLoading(true);
      try {
        const response = await fetch("/api/generate-outfit-images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
        console.error("Error generating outfit images:", error);
      } finally {
        setImageLoading(false);
      }
    },
    [user]
  );

  const handleOutfitsGenerated = (outfits: OutfitSuggestion[]) => {
    setGeneratedOutfits(outfits);
    setSelectedOutfitIndex(0);
    generateOutfitImages(outfits);
  };

  useEffect(() => {
    if (
      user &&
      generatedOutfits.length > 0 &&
      hisOutfitImages.length === 0 &&
      !imageLoading
    ) {
      generateOutfitImages(generatedOutfits);
    }
  }, [
    user,
    generatedOutfits,
    hisOutfitImages.length,
    imageLoading,
    generateOutfitImages,
  ]);

  const selectedImage = hisOutfitImages[selectedOutfitIndex];

  return (
    <>
      <header>
        <NavbarApp section1Ref={section1} />
      </header>
      <main className="p-8 space-y-8">
        <div>
          <HomePage />
        </div>

        <div id="section1" ref={section1}>
          <WeatherBar
            data={clientWeatherData}
            locationData={clientLocationData}
            className="bg-blue-500 text-white p-4 rounded-lg shadow-md"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <CalendarApp />
          </div>

          {/* Center the outfit image */}
          <div className="md:w-1/3 flex justify-center items-center">
            <OutfitImageDisplay
              imageUrl={selectedImage}
              loading={imageLoading}
            />
          </div>

          {/* Align outfit suggestion to right */}
          <div className="md:w-1/3 flex flex-col items-end">
            <OutfitSuggestion
              weatherData={clientWeatherData}
              onOutfitsGenerated={handleOutfitsGenerated}
              selectedOutfitIndex={selectedOutfitIndex}
              setSelectedOutfitIndex={setSelectedOutfitIndex}
              generatedOutfits={generatedOutfits}
            />
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
