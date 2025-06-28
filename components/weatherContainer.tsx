// components/WeatherContainer.tsx
import { cn } from "@/lib/utils";

interface WeatherContainerProps {
  children?: React.ReactNode;
  className?: string;
}

export default function WeatherContainer({ children, className }: WeatherContainerProps) {
  return (
    <div
      className={cn(
        "w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center text-white mx-1",
        className
      )}
    >
      {children || "🌤️"}
    </div>
  );
}
