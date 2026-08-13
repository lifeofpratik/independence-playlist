import React, { useRef, useState, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Volume1 } from 'lucide-react';
import { Track, MoodFilter } from '../types';

interface PlayerDockProps {
  currentTrack: Track;
  currentMood: MoodFilter;
  onSelectMood: (mood: MoodFilter) => void;
  isPlaying: boolean;
  isReady: boolean;
  onTogglePlay: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  currentTime: number;
  duration: number;
  onSeekTo: (fraction: number) => void;
}

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const PlayerDock: React.FC<PlayerDockProps> = ({
  currentTrack,
  currentMood,
  onSelectMood,
  isPlaying,
  isReady,
  onTogglePlay,
  onPrevTrack,
  onNextTrack,
  volume,
  onVolumeChange,
  onToggleMute,
  currentTime,
  duration,
  onSeekTo,
}) => {
  const seekRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragFraction, setDragFraction] = useState<number | null>(null);

  const activeFraction = dragFraction !== null
    ? dragFraction
    : duration > 0 ? currentTime / duration : 0;

  const calculateFraction = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!seekRef.current) return 0;
    const rect = seekRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    return Math.min(1, Math.max(0, x / rect.width));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    const frac = calculateFraction(e);
    setDragFraction(frac);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const frac = calculateFraction(e);
    setDragFraction(frac);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    const frac = calculateFraction(e);
    onSeekTo(frac);
    setTimeout(() => setDragFraction(null), 300);
  };

  const moodOptions: { id: MoodFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'genz', label: 'Gen Z' },
    { id: 'ungenz', label: 'UnGen Z' },
  ];

  return (
    <footer className="fixed left-0 right-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-10 pb-0 px-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-4 md:gap-6 pb-4">
          
          {/* Now Playing Information */}
          <div className="flex items-center gap-4 min-w-0 w-full md:w-auto text-center md:text-left justify-center md:justify-start">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shadow-2xl border border-white/15 flex-shrink-0 hidden sm:block"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-[0.25em] text-amber-400/90 uppercase mb-0.5">
                NOW PLAYING
              </p>
              <h2 className="text-base sm:text-lg font-bold text-white truncate max-w-[280px] sm:max-w-xs md:max-w-md">
                {currentTrack.title}
              </h2>
              <p className="text-xs sm:text-sm text-white/70 truncate max-w-[280px] sm:max-w-xs">
                {currentTrack.artist}
                <span className="text-white/40 mx-1.5">•</span>
                <span className="text-amber-300/80 font-medium">{currentTrack.album}</span>
                <span className="font-mono text-xs text-white/50 ml-3 font-semibold">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </p>
            </div>
          </div>

          {/* Mood Selector Tabs */}
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/15 shadow-inner my-1 md:my-0">
            {moodOptions.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelectMood(m.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  currentMood === m.id
                    ? 'bg-white text-gray-900 shadow-md font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Audio Controls */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Volume Control */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleMute}
                className="text-white/80 hover:text-white transition-colors p-1"
                title={volume === 0 ? 'Unmute' : 'Mute'}
              >
                {volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-red-400" />
                ) : volume < 50 ? (
                  <Volume1 className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="vol-range"
                style={{ '--fill': `${volume}%` } as React.CSSProperties}
              />
            </div>

            {/* Skip Previous */}
            <button
              type="button"
              onClick={onPrevTrack}
              className="text-white/80 hover:text-white hover:scale-110 active:scale-95 transition-all p-1.5"
              title="Previous Track"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            {/* Main Play / Pause Button */}
            <button
              type="button"
              disabled={!isReady}
              onClick={onTogglePlay}
              className="w-12 h-12 sm:w-13 sm:h-13 rounded-full border-2 border-white/90 bg-white/10 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed hover:border-amber-400"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Skip Next */}
            <button
              type="button"
              onClick={onNextTrack}
              className="text-white/80 hover:text-white hover:scale-110 active:scale-95 transition-all p-1.5"
              title="Next Track"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>

        </div>
      </div>

      {/* Tricolor Interactive Seek Bar */}
      <div
        ref={seekRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative h-4 group cursor-pointer touch-none flex items-end"
      >
        <div className="relative w-full h-1.5 bg-white/20 group-hover:h-2.5 transition-all duration-200">
          <div
            className="h-full tricolor-seek-fill transition-all duration-75"
            style={{ width: `${activeFraction * 100}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-1/2"
            style={{ left: `${activeFraction * 100}%` }}
          />
        </div>
      </div>
    </footer>
  );
};
