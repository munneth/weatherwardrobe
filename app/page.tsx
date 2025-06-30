// app/page.tsx
import React from "react";
import ClientHome from "./ClientHome";

const key = process.env.key;

export default async function Home() {
  const res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${key}&q=London&days=7`);
  const data = await res.json();

  return <ClientHome data={data} />;
}
