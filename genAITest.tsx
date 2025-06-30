import { GoogleGenAI } from "@google/genai";

// Access the API key from the environment variable
const ai = new GoogleGenAI({
  apiKey: process.env.gemini_api_key
});

export default async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

main();