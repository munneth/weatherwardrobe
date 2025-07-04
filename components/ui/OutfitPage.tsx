"use client"

import { useState } from "react"
import OutfitImageDisplay from "@/components/outfit-image-display";
import OutfitSuggestion from "@/components/outfit-suggestion";

export default function OutfitPage({ weatherData }: { weatherData: any }) {
  const [selectedOutfitIndex, setSelectedOutfitIndex] = useState(0)
  const [generatedOutfits, setGeneratedOutfits] = useState([])

  return (
    <div className="flex justify-center items-center gap-12 p-8 min-h-[450px]">
      {/* Left: Outfit Image Display */}
      <div className="flex-1 flex justify-center">
        <OutfitImageDisplay
          imageUrl={generatedOutfits[selectedOutfitIndex]?.imageUrl}
          loading={false} // you can wire loading state if needed
        />
      </div>

      {/* Right: Outfit Suggestion Button + Details */}
      <div className="flex-1 max-w-md">
        <OutfitSuggestion
          weatherData={weatherData}
          selectedOutfitIndex={selectedOutfitIndex}
          setSelectedOutfitIndex={setSelectedOutfitIndex}
          generatedOutfits={generatedOutfits}
          onOutfitsGenerated={(outfits) => setGeneratedOutfits(outfits)}
        />
      </div>
    </div>
  )
}
