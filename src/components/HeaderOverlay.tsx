import React, { useState, useEffect } from 'react';
import { ListMusic, Info, Share2, Disc3 } from 'lucide-react';

interface HeaderOverlayProps {
  currentIndex: number;
  totalTracks: number;
  onOpenDrawer: () => void;
  onOpenInfo: () => void;
  onShare: () => void;
  isPlaying: boolean;
}

export const HeaderOverlay: React.FC<HeaderOverlayProps> = ({
  currentIndex,
  totalTracks,
  onOpenDrawer,
  onOpenInfo,
  onShare,
  isPlaying,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  const dateStr = time.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 pointer-events-none">
      {/* Top Left: Clock & Date */}
      <div className="pointer-events-auto flex items-center gap-3 backdrop-blur-md bg-black/25 px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
        <div className="flex items-baseline font-mono text-sm sm:text-base font-bold tracking-tight text-white">
          <span>{hours}</span>
          <span className="animate-pulse mx-0.5 text-amber-400">:</span>
          <span>{minutes}</span>
          <span className="text-xs text-white/50 ml-1.5 hidden sm:inline">{seconds}</span>
        </div>
        <div className="h-3 w-px bg-white/20 hidden sm:block" />
        <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-white/70 uppercase">
          {dateStr}
        </span>
      </div>

      {/* Top Right: Track Counter, Live Indicator & Controls */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        {/* Track counter badge */}
        <div className="flex items-center gap-2 backdrop-blur-md bg-black/25 px-3 py-1.5 rounded-full border border-white/10 text-xs font-medium text-white/90">
          <span className="relative flex h-2 w-2">
            {isPlaying && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </span>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-white/80">
            {isPlaying ? 'PLAYING' : 'READY'}
          </span>
          <span className="text-white/40">•</span>
          <span className="font-mono text-[11px] font-bold text-amber-300">
            {String(currentIndex + 1).padStart(2, '0')}/{String(totalTracks).padStart(2, '0')}
          </span>
        </div>

        {/* Quick Action Buttons */}
        <button
          onClick={onOpenInfo}
          title="Track Story & Lyrics"
          className="p-2 sm:p-2.5 rounded-full backdrop-blur-md bg-black/25 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white transition-all transform active:scale-95 shadow-lg"
        >
          <Info className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </button>

        <button
          onClick={onShare}
          title="Share Azaad Bharat"
          className="p-2 sm:p-2.5 rounded-full backdrop-blur-md bg-black/25 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white transition-all transform active:scale-95 shadow-lg"
        >
          <Share2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </button>

        <button
          onClick={onOpenDrawer}
          title="All Songs Playlist"
          className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-md bg-white/15 hover:bg-white/25 border border-white/20 text-white font-medium text-xs sm:text-sm transition-all transform active:scale-95 shadow-xl hover:border-amber-400/50"
        >
          <ListMusic className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline font-semibold">Playlist</span>
        </button>
      </div>
    </header>
  );
};
