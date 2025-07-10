import { cn } from "@/lib/utils";
import WeatherContainer from "@/components/weatherContainer";

interface WeatherBarProps {
  data?: ClientWeatherData;
  className?: string;
  locationData?: LocationData;
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

export default function WeatherBar({ data, locationData }: WeatherBarProps) {
  return (
    <div className="space-y-7 w-full">
      {locationData && (
        <div className="text-center">
          <h2 className="text-2xl font-bold font-serif text-black">
            Weather in {locationData.city}, {locationData.country}
          </h2>
        </div>
      )}

      <div
        className={cn(
          "grid grid-cols-7 gap-4 bg-[#70798C] rounded-full px-12 py-2 w-full max-w-screen-lg mx-auto"
        )}
      >
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <WeatherContainer key={i} data={data} dayIndex={i} />
        ))}
      </div>
    </div>
  );
}
