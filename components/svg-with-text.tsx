import React from 'react';

interface SvgWithTextProps {
  text: string;
  headerText: string;
  className?: string;
}

export default function SvgWithText({ text, headerText, className = '' }: SvgWithTextProps) {
  // Parse the headerText and split at comma
  const parseHeaderText = (headerText: string) => {
    // Split at comma and trim whitespace
    const parts = headerText.split(',').map(part => part.trim());
    
    if (parts.length > 1) {
      return {
        firstLine: parts[0],
        secondLine: parts.slice(1).join(', ') // Join remaining parts in case of multiple commas
      };
    }
    
    return {
      firstLine: headerText,
      secondLine: null
    };
  };

  const { firstLine, secondLine } = parseHeaderText(headerText);
  return (
    <div className={`relative ${className}`}>
      <svg width="867" height="528" viewBox="0 0 867 528" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0H867V528H0V0Z" fill="url(#paint0_radial_25_95)"/>
        <defs>
          <radialGradient id="paint0_radial_25_95" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(433.5 264) rotate(90) scale(264 433.5)">
            <stop stopColor="#B6A4BD"/>
            <stop offset="1" stopColor="#FFF2FF" stopOpacity="0"/>
          </radialGradient>
        </defs>
      </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-serif font-semibold text-black text-center">
            {firstLine}
          </h1>
          {secondLine && (
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-black text-center mt-2">
              {secondLine}
            </h2>
          )}
          <p className="mt-4 text-lg text-black text-center">
            {text}
          </p>
        </div>
    </div>
  );
} 