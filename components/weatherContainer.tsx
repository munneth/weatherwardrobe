import { cn } from "@/lib/utils";

interface WeatherContainerProps {
  data?: any;
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
    <div className="text-black font-serif text-center space-y-1">
      <h2 className="text-sm font-semibold">{newDate}</h2>
      <p className="text-xs">Max: {maxtemp_f}°F</p>
      <p className="text-xs">Min: {mintemp_f}°F</p>
      <img src={icon} alt={text} className="mx-auto w-8 h-8" />
    </div>
  );
}

export default function WeatherContainer({ data, children, className, dayIndex }: WeatherContainerProps & { dayIndex?: number }) {
  return (
    <div
      className={cn(
        "bg-white text-black rounded-md p-2 shadow-sm h-full flex items-center justify-center",
        className
      )}
    >
      {data && <WeatherInfo data={data} dayIndex={dayIndex} />}
      {children}
    </div>
  );
}
