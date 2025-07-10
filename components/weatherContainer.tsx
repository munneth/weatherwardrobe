import { cn } from "@/lib/utils";

interface WeatherContainerProps {
  data?: ClientWeatherData;
  children?: React.ReactNode;
  className?: string;
}

interface WeatherInfoProps {
  data: ClientWeatherData;
  dayIndex?: number;
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

function WeatherInfo({ data, dayIndex = 0 }: WeatherInfoProps) {
  const forecastDay = data.forecast.forecastday[dayIndex];
  if (!forecastDay) return <div>No data for this day.</div>;

  const newDate = forecastDay.date.slice(5, 10);

  const {
    day: {
      maxtemp_f,
      mintemp_f,
      condition: { text, icon },
    },
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

export default function WeatherContainer({
  data,
  children,
  className,
  dayIndex,
}: WeatherContainerProps & { dayIndex?: number }) {
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
