import { NextRequest, NextResponse } from 'next/server';

const key = process.env.key;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get('ip');
    
    if (!ip) {
      return NextResponse.json({ error: 'IP parameter is required' }, { status: 400 });
    }

    // Get weather data based on the client IP
    const weatherResponse = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${ip}&days=7`
    );
    
    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.status}`);
    }
    
    const weatherData = await weatherResponse.json();
    
    return NextResponse.json({
      weather: weatherData,
      location: {
        ip: ip,
        city: weatherData.location?.name || 'Unknown',
        country: weatherData.location?.country || 'Unknown',
        region: weatherData.location?.region || 'Unknown'
      }
    });
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
} 