import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { TRACKS } from './data/playlist';
import { MoodFilter, Track } from './types';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { HeaderOverlay } from './components/HeaderOverlay';
import { BackgroundHero } from './components/BackgroundHero';
import { WordOverlay } from './components/WordOverlay';
import { PlayerDock } from './components/PlayerDock';
import { TrackListDrawer } from './components/TrackListDrawer';
import { SongInfoModal } from './components/SongInfoModal';

export default function App() {
  const [currentMood, setCurrentMood] = useState<MoodFilter>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [progress, setProgress] = useState<{ current: number; duration: number }>({
    current: 0,
    duration: 0,
  });

  // Filtered tracks based on active mood
  const activeTracks = useMemo(() => {
    if (currentMood === 'all') return TRACKS;
    return TRACKS.filter((t) => (currentMood === 'genz' ? t.isGenZ : !t.isGenZ));
  }, [currentMood]);

  const currentTrack: Track = activeTracks[currentIndex] || activeTracks[0] || TRACKS[0];

  const currentTrackRef = useRef(currentTrack);
  currentTrackRef.current = currentTrack;

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const activeTracksRef = useRef(activeTracks);
  activeTracksRef.current = activeTracks;

  // Next track handler
  const handleNextTrack = useCallback(() => {
    const list = activeTracksRef.current;
    const nextIdx = (currentIndexRef.current + 1) % list.length;
    setCurrentIndex(nextIdx);
    const nextTrack = list[nextIdx];
    player.loadAndPlay(nextTrack.youtubeId, 0);
  }, []);

  // Previous track handler
  const handlePrevTrack = useCallback(() => {
    const list = activeTracksRef.current;
    const prevIdx = (currentIndexRef.current - 1 + list.length) % list.length;
    setCurrentIndex(prevIdx);
    const prevTrack = list[prevIdx];
    player.loadAndPlay(prevTrack.youtubeId, 0);
  }, []);

  // YouTube Player Hook
  const player = useYouTubePlayer({
    initialVideoId: TRACKS[0].youtubeId,
    initialStart: 0,
    onEnded: handleNextTrack,
    onError: handleNextTrack,
  });

  // Periodically poll player progress time
  useEffect(() => {
    const interval = setInterval(() => {
      const p = player.getProgress();
      setProgress((prev) => {
        if (prev.current === p.current && prev.duration === p.duration) return prev;
        return p;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [player]);

  // Update page document title
  useEffect(() => {
    if (player.playing && currentTrack) {
      document.title = `${currentTrack.title} — Azaad Bharat`;
    } else {
      document.title = 'Azaad Bharat — Desi Patriotic Bangers';
    }
  }, [player.playing, currentTrack]);

  // Mood filter selection
  const handleSelectMood = useCallback(
    (newMood: MoodFilter) => {
      if (newMood === currentMood) return;
      setCurrentMood(newMood);

      const newFilteredList = TRACKS.filter((t) =>
        newMood === 'all' ? true : newMood === 'genz' ? t.isGenZ : !t.isGenZ
      );

      // Try to keep playing same track if available in new list
      const existingIdx = newFilteredList.findIndex((t) => t.id === currentTrackRef.current.id);
      if (existingIdx >= 0) {
        setCurrentIndex(existingIdx);
      } else {
        setCurrentIndex(0);
        if (newFilteredList[0]) {
          player.loadAndPlay(newFilteredList[0].youtubeId, 0);
        }
      }
    },
    [currentMood, player]
  );

  // Track select from drawer
  const handleSelectTrack = useCallback(
    (track: Track) => {
      const idx = activeTracks.findIndex((t) => t.id === track.id);
      if (idx >= 0) {
        setCurrentIndex(idx);
        player.loadAndPlay(track.youtubeId, 0);
      } else {
        // If track is not in current active filter, switch mood to 'all'
        setCurrentMood('all');
        const allIdx = TRACKS.findIndex((t) => t.id === track.id);
        setCurrentIndex(allIdx >= 0 ? allIdx : 0);
        player.loadAndPlay(track.youtubeId, 0);
      }
    },
    [activeTracks, player]
  );

  // Keyboard shortcut listeners (Space, ArrowLeft, ArrowRight, M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        player.toggle();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextTrack();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevTrack();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        player.toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player, handleNextTrack, handlePrevTrack]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShareApp = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Azaad Bharat',
          text: `Check out Azaad Bharat — Desi patriotic bangers! 🇮🇳 Now playing: ${currentTrack.title}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Azaad Bharat link copied to clipboard! 🇮🇳');
    }
  };

  return (
    <main className="relative min-h-screen min-h-dvh flex flex-col justify-between overflow-hidden select-none">
      
      {/* Background Hero Artwork */}
      <BackgroundHero imageSrc={currentTrack.image} />

      {/* Massive Motion Hindi Word Overlay */}
      <WordOverlay
        word={currentTrack.word}
        position={currentTrack.wordPos || 'top-left'}
        wordSize={currentTrack.wordSize || 1}
      />

      {/* Hidden YouTube IFrame Audio Host */}
      <div className="absolute opacity-0 pointer-events-none w-1 h-1 overflow-hidden">
        <div ref={player.hostRef} />
      </div>

      {/* Header Overlay Controls */}
      <HeaderOverlay
        currentIndex={currentIndex}
        totalTracks={activeTracks.length}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenInfo={() => setIsInfoOpen(true)}
        onShare={handleShareApp}
        isPlaying={player.playing}
      />

      {/* Player Dock Footer Controls */}
      <PlayerDock
        currentTrack={currentTrack}
        currentMood={currentMood}
        onSelectMood={handleSelectMood}
        isPlaying={player.playing}
        isReady={player.ready}
        onTogglePlay={player.toggle}
        onPrevTrack={handlePrevTrack}
        onNextTrack={handleNextTrack}
        volume={player.volume}
        onVolumeChange={player.setVolume}
        onToggleMute={player.toggleMute}
        currentTime={progress.current}
        duration={progress.duration}
        onSeekTo={player.seekToFraction}
      />

      {/* Playlist Track Drawer Modal */}
      <TrackListDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        tracks={TRACKS}
        currentTrackId={currentTrack.id}
        onSelectTrack={handleSelectTrack}
        currentMood={currentMood}
        onSelectMood={handleSelectMood}
        isPlaying={player.playing}
      />

      {/* Song Story & Lyrics Modal */}
      <SongInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        track={currentTrack}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-gray-950 px-4 py-2 rounded-full font-bold text-xs shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          {toastMessage}
        </div>
      )}

    </main>
  );
}
