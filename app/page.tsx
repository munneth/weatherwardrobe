// app/page.tsx
import React from "react";
import ClientHome from "./ClientHome";
import main from "../genAITest";
const key = process.env.key;

export default async function Home() {
  const res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${key}&q=London&days=7`);
  const data = await res.json();
  await main();
  return <ClientHome data={data} />;
}
