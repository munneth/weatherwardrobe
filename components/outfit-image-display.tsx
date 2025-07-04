import React from "react";

export default function OutfitImageDisplay({
  imageUrl,
  loading,
}: {
  imageUrl?: string;
  loading?: boolean;
}) {
  return (
    <div className="w-full max-w-sm p-4">
      <div className="relative bg-[#70798C] rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px]">
        <h3 className="absolute top-3 left-1/2 transform -translate-x-1/2 text-xl font-semibold text-white font-serif">
          Today's Outfit
        </h3>

        {loading && (
          <div className="text-white mt-12 font-serif">Generating image...</div>
        )}

        {!loading && imageUrl && (
          <img
            src={imageUrl}
            alt="Generated outfit"
            className="rounded-lg shadow-md max-h-56 object-contain"
            onError={(e) => {
              e.currentTarget.src = `https://picsum.photos/400/400?random=1`;
            }}
          />
        )}

        {!loading && !imageUrl && (
          <div className="text-white italic mt-16 font-serif text-center">
            No outfit image available
          </div>
        )}
      </div>
    </div>
  );
}
