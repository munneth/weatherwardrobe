// app/page.tsx
import Image from "next/image";
import WeatherBar from "@/components/weatherBar";
import WeatherContainer from "@/components/weatherContainer";

const key = process.env.key;

export default function Home() {
  return (
    <main className="p-8 space-y-8">
      <section>
        <h1 className="text-xl font-bold">Hello World</h1>
      </section>

      <section>
        <h2 className="text-sm mb-4">weather app</h2>
        <WeatherBar>
          <WeatherContainer />
          <WeatherContainer />
          <WeatherContainer />
          <WeatherContainer />
          <WeatherContainer />
          <WeatherContainer />
        </WeatherBar>
      </section>
    </main>
  );
}
