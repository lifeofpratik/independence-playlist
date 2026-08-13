import React, { useState, useEffect } from 'react';

interface BackgroundHeroProps {
  imageSrc: string;
}

export const BackgroundHero: React.FC<BackgroundHeroProps> = ({ imageSrc }) => {
  const [currentSrc, setCurrentSrc] = useState(imageSrc);
  const [prevSrc, setPrevSrc] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (imageSrc !== currentSrc) {
      setPrevSrc(currentSrc);
      setCurrentSrc(imageSrc);
      setIsAnimating(true);

      const timer = setTimeout(() => {
        setPrevSrc(null);
        setIsAnimating(false);
      }, 900);

      return () => clearTimeout(timer);
    }
  }, [imageSrc, currentSrc]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0d2242]">
      {/* Previous image fading out */}
      {prevSrc && (
        <img
          src={prevSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-0 transition-opacity duration-900 ease-out"
        />
      )}

      {/* Current image zooming and fading in */}
      <img
        key={currentSrc}
        src={currentSrc}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-all duration-1000 ${
          isAnimating ? 'shot-in opacity-100' : 'opacity-100 scale-100'
        }`}
      />

      {/* Vignette Gradients & Dark Tint */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/30 via-transparent to-black/30" />
    </div>
  );
};
