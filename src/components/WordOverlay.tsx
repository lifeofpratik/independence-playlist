import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WordSpotPosition } from '../types';

interface WordOverlayProps {
  word: string;
  lyricsSnippet?: string;
  lyricsList?: string[];
  progressFraction?: number;
  isDynamicLyricsEnabled?: boolean;
  position?: WordSpotPosition;
  wordSize?: number;
}

const getPositionClasses = (pos: WordSpotPosition = 'top-left'): string => {
  switch (pos) {
    case 'top-left':
      return 'items-start justify-start text-left pt-20 sm:pt-28 pl-6 sm:pl-16';
    case 'top-center':
      return 'items-start justify-center text-center pt-20 sm:pt-28 px-4';
    case 'top-right':
      return 'items-start justify-end text-right pt-20 sm:pt-28 pr-6 sm:pr-16';
    case 'center-left':
      return 'items-center justify-start text-left pl-6 sm:pl-16';
    case 'center-middle':
      return 'items-center justify-center text-center px-4';
    case 'center-right':
      return 'items-center justify-end text-right pr-6 sm:pr-16';
    case 'bottom-left':
      return 'items-end justify-start text-left pb-36 sm:pb-44 pl-6 sm:pl-16';
    case 'bottom-center':
      return 'items-end justify-center text-center pb-36 sm:pb-44 px-4';
    case 'bottom-right':
      return 'items-end justify-end text-right pb-36 sm:pb-44 pr-6 sm:pr-16';
    default:
      return 'items-start justify-start text-left pt-20 sm:pt-28 pl-6 sm:pl-16';
  }
};

export const WordOverlay: React.FC<WordOverlayProps> = ({
  word,
  lyricsSnippet,
  lyricsList = [],
  progressFraction = 0,
  isDynamicLyricsEnabled = true,
  position = 'top-left',
  wordSize = 1,
}) => {
  const alignClasses = getPositionClasses((position as WordSpotPosition) || 'top-left');

  // Calculate the current active line in the dynamic lyrics list
  const activeLineIndex = (isDynamicLyricsEnabled && lyricsList.length > 0)
    ? Math.min(Math.floor(progressFraction * lyricsList.length), lyricsList.length - 1)
    : -1;

  // Find a small window of lyrics to show
  const displayLyrics = activeLineIndex >= 0 
    ? lyricsList.slice(Math.max(0, activeLineIndex - 1), activeLineIndex + 2)
    : [];

  return (
    <div className={`fixed inset-0 z-10 pointer-events-none flex ${alignClasses}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${word}-${position}`}
          initial={{ opacity: 0, scale: 0.92, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: 20 }}
          transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col max-w-4xl px-2"
        >
          <h1
            style={{
              fontSize: `calc(clamp(56px, 12vw, 190px) * ${wordSize})`,
              lineHeight: 1.1,
            }}
            className="brand-hindi font-normal tracking-wide text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.7)] selection:bg-amber-500/30 select-none mb-1 sm:mb-2"
          >
            {word}
          </h1>
          
          {isDynamicLyricsEnabled && lyricsList.length > 0 ? (
            <div className="flex flex-col gap-2 transition-all duration-700">
              {displayLyrics.map((line, idx) => {
                // To figure out if it's the "active" line in our small slice
                const isCurrent = (activeLineIndex === 0 && idx === 0) || (activeLineIndex > 0 && idx === 1) || (activeLineIndex === lyricsList.length - 1 && displayLyrics.length < 3 && idx === displayLyrics.length - 1);
                return (
                  <motion.p
                    key={`${line}-${activeLineIndex}-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isCurrent ? 1 : 0.4, y: 0, scale: isCurrent ? 1 : 0.95 }}
                    className={`brand-hindi ${isCurrent ? 'text-2xl sm:text-4xl text-amber-50 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]' : 'text-lg sm:text-2xl text-white/60 drop-shadow-sm'} leading-snug italic max-w-2xl font-light transition-all duration-500`}
                  >
                    {line}
                  </motion.p>
                );
              })}
            </div>
          ) : lyricsSnippet ? (
            <p className="brand-hindi text-xl sm:text-3xl md:text-4xl text-amber-50 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] leading-snug italic max-w-2xl font-light">
              "{lyricsSnippet}"
            </p>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
