import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WordSpotPosition } from '../types';

interface WordOverlayProps {
  word: string;
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
  position = 'top-left',
  wordSize = 1,
}) => {
  const alignClasses = getPositionClasses((position as WordSpotPosition) || 'top-left');

  return (
    <div className={`fixed inset-0 z-10 pointer-events-none flex ${alignClasses}`}>
      <AnimatePresence mode="wait">
        <motion.h1
          key={`${word}-${position}`}
          initial={{ opacity: 0, scale: 0.92, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: 20 }}
          transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            fontSize: `calc(clamp(56px, 12vw, 190px) * ${wordSize})`,
            lineHeight: 1.1,
          }}
          className="brand-hindi font-normal tracking-wide text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.7)] selection:bg-amber-500/30 select-none"
        >
          {word}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};
