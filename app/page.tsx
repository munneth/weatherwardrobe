// app/page.tsx
import Image from "next/image";
import WeatherBar from "@/components/weatherBar";
import WeatherContainer from "@/components/weatherContainer";
import { ReceiptRussianRubleIcon } from "lucide-react";

const key = process.env.key;



export default async function Home() {
  const res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${key}&q=London&days=7`);
  const data = await res.json();
  return (
    <main className="p-8 space-y-8">
      <WeatherBar data={data} className="bg-blue-500 text-white p-4 rounded-lg shadow-md" />
    </main>
  );
}
