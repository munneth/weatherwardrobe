// components/WeatherBar.tsx
import { cn } from "@/lib/utils"; // shadcn's class utility
import WeatherContainer from "@/components/weatherContainer"; // Assuming this is the correct import path

interface WeatherBarProps {
  data?: any;
  className?: string;
  locationData?: any;
}

export default function WeatherBar({ data, locationData }: WeatherBarProps) {
  return (
    <div className="space-y-4">
      {locationData && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Weather in {locationData.city}, {locationData.country}
          </h2>
        </div>
      )}
      
      <div
        className={cn(
          "flex items-center justify-between bg-[#F5F1ED] rounded-full px-20 py-2 overflow-x-auto"
        )}
      >
        {data && <WeatherContainer data={data} dayIndex={0}/>}
        {data && <WeatherContainer data={data} dayIndex={1}/>}
        {data && <WeatherContainer data={data} dayIndex={2}/>}
        {data && <WeatherContainer data={data} dayIndex={3}/>}  
        {data && <WeatherContainer data={data} dayIndex={4}/>}
        {data && <WeatherContainer data={data} dayIndex={5}/>}
        {data && <WeatherContainer data={data} dayIndex={6}/>}
        {/* Add more WeatherContainer components as needed */}
      </div>
    </div>
  );
}
