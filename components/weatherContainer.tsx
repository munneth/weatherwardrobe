// components/WeatherContainer.tsx
import { cn } from "@/lib/utils";

interface WeatherContainerProps {
  data?: any; // Add data prop
  children?: React.ReactNode;
  className?: string;
}

function WeatherInfo({ data }: { data: any }) {
  const forecastDay = data.forecast.forecastday[0];
  const {
    date,
    day: {
      maxtemp_f,
      mintemp_f,
      condition: { text, icon }
    }
  } = forecastDay;

  return (
    <div>
      <h2 className="text-xl font-bold">{date}</h2>
      <p>Max Temp: {maxtemp_f}°F</p>
      <p>Min Temp: {mintemp_f}°F</p>
      <p>Condition: {text}</p>
    </div>
  );
}

export default function WeatherContainer({ data, children, className }: WeatherContainerProps) {
  return (
    <div className={cn("border p-4 rounded-md", className)}>
      {data && <WeatherInfo data={data} />}
      {children}
    </div>
  );
}
