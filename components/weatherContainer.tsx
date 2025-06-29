// components/WeatherContainer.tsx
import { cn } from "@/lib/utils";

interface WeatherContainerProps {
  data?: any; // Add data prop
  children?: React.ReactNode;
  className?: string;
  
}

interface WeatherInfoProps {
  data: any;
  dayIndex?: number;
}

function WeatherInfo({ data, dayIndex = 0 }: WeatherInfoProps) {
  const forecastDay = data.forecast.forecastday[dayIndex];
  if (!forecastDay) return <div>No data for this day.</div>;

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

export default function WeatherContainer({ data, children, className, dayIndex }: WeatherContainerProps & { dayIndex?: number }) {
  return (
    <div className={cn("border p-4 rounded-md", className)}>
      {data && <WeatherInfo data={data} dayIndex={dayIndex} />}
      {children}
    </div>
  );
}
