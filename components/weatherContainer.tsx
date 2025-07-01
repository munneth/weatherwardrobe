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

  const newDate = forecastDay.date.slice(5, 10);

  const {
    day: {
      maxtemp_f,
      mintemp_f,
      condition: { text, icon }
    }
  } = forecastDay;

  return (
    <div>
      <h2 className="text-xl font-bold">{newDate}</h2>
      <p>Max: {maxtemp_f}°F</p>
      <p>Min: {mintemp_f}°F</p>
      <img src={icon} alt={text} />
    </div>
  );
}

export default function WeatherContainer({ data, children, className, dayIndex }: WeatherContainerProps & { dayIndex?: number }) {
  return (
    <div className={cn("border p-4 rounded-md bg-[#42433F] text-white", className)}>
      {data && <WeatherInfo data={data} dayIndex={dayIndex} />}
      {children}
    </div>
  );
}
