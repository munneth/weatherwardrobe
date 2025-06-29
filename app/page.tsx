// app/page.tsx
import Image from "next/image";
import WeatherBar from "@/components/weatherBar";
import WeatherContainer from "@/components/weatherContainer";
import { ReceiptRussianRubleIcon } from "lucide-react";

const key = process.env.key;



export default async function Home() {
  const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${key}&q=London&days=1`);
  const data = await res.json();
  return (
    <main className="p-8 space-y-8">
      <WeatherContainer>{JSON.stringify(data)}</WeatherContainer>
    </main>
  );
}
