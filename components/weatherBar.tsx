// components/WeatherBar.tsx
import { cn } from "@/lib/utils"; // shadcn's class utility
import { ReactNode } from "react";
import WeatherContainer from "@/components/weatherContainer"; // Assuming this is the correct import path

interface WeatherBarProps {
  data?: any;
  className?: string;
}

export default function WeatherBar({ data, className }: WeatherBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between bg-gray-200 rounded-full p-2 overflow-x-auto",
        className
      )}
    >
      {data && <WeatherContainer data={data} />}
    </div>
  );
}
