"use client";
import { useState } from "react";
import WeatherBar from "@/components/weatherBar";
import  CalendarApp  from "@/components/calendarApp";
import HisHersCard from "@/components/hisHersCard";

export default function ClientHome({ data }: { data: any }) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (

    <main className="p-8 space-y-8">
      <div>
        <WeatherBar data={data} className="bg-blue-500 text-white p-4 rounded-lg shadow-md" />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="">
          <CalendarApp />
        </div>
        <div>
          <HisHersCard his={true} />
        </div>
        <div>
          <HisHersCard his={false} />
        </div>
        
      </div>
    </main>
  );
}