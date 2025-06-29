// components/WeatherContainer.tsx
import { cn } from "@/lib/utils";

interface WeatherContainerProps {
  children?: React.ReactNode;
  className?: string;
}

export default function WeatherContainer({ children, className }: WeatherContainerProps) {
  return (
    <div className={cn("border p-4 rounded-md", className)}>
      {children}
    </div>
  );
}
