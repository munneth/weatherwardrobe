// app/page.tsx
import React from "react";
import ClientHome from "./ClientHome";
import main from "../genAITest";
const key = process.env.key;

// Function to get weather data with fallback location
async function getWeatherData() {
  try {
    // Use a default location for initial load
    const weatherResponse = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=London&days=7`
    );
    const weatherData = await weatherResponse.json();
    
    return {
      weather: weatherData,
      location: {
        ip: 'Loading...',
        city: weatherData.location?.name || 'Unknown',
        country: weatherData.location?.country || 'Unknown',
        region: weatherData.location?.region || 'Unknown'
      }
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Fallback to London if there's an error
    const fallbackResponse = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${key}&q=London&days=7`);
    const fallbackData = await fallbackResponse.json();
    return {
      weather: fallbackData,
      location: {
        ip: 'Unknown',
        city: 'London',
        country: 'UK',
        region: 'England'
      }
    };
  }
}

export default async function Home() {
  const { weather, location } = await getWeatherData();
  await main();
  return <ClientHome weatherData={weather} locationData={location} />;
}
