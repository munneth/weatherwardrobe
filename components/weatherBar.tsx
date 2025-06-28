// components/WeatherBar.tsx
import { cn } from "@/lib/utils"; // shadcn's class utility
import { ReactNode } from "react";

interface WeatherBarProps {
  children: ReactNode;
  className?: string;
}

export default function WeatherBar({ children, className }: WeatherBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between bg-gray-200 rounded-full p-2 overflow-x-auto",
        className
      )}
    >
      {children}
    </div>
  );
}
