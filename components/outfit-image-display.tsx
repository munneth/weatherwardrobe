import React from 'react';

export default function OutfitImageDisplay({ imageUrl, loading }: { imageUrl?: string; loading?: boolean }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <h3 className="text-lg font-semibold mb-2">Outfit Image</h3>
      {loading && <div className="text-gray-500">Generating image...</div>}
      {!loading && imageUrl && (
        <img
          src={imageUrl}
          alt="Generated outfit"
          className="w-full h-auto rounded-lg shadow-md"
          onError={(e) => {
            e.currentTarget.src = `https://picsum.photos/400/400?random=1`;
          }}
        />
      )}
      {!loading && !imageUrl && (
        <div className="text-gray-400 italic">No image available</div>
      )}
    </div>
  );
} 