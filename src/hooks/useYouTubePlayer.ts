import { useEffect, useRef, useState, useCallback } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

let ytPromise: Promise<any> | null = null;

function loadYouTubeIframeApi(): Promise<any> {
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }

  if (ytPromise) {
    return ytPromise;
  }

  ytPromise = new Promise((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousReady === 'function') {
        previousReady();
      }
      resolve(window.YT);
    };

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.head.appendChild(script);
  });

  return ytPromise;
}

interface UseYouTubePlayerProps {
  initialVideoId: string;
  initialStart?: number;
  onEnded?: () => void;
  onError?: () => void;
}

export function useYouTubePlayer({
  initialVideoId,
  initialStart = 0,
  onEnded,
  onError,
}: UseYouTubePlayerProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);

  const onEndedRef = useRef(onEnded);
  const onErrorRef = useRef(onError);

  onEndedRef.current = onEnded;
  onErrorRef.current = onError;

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(70);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let unmounted = false;

    loadYouTubeIframeApi().then((YT) => {
      if (unmounted || !hostRef.current || playerRef.current) return;

      playerRef.current = new YT.Player(hostRef.current, {
        videoId: initialVideoId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          start: initialStart,
          autoplay: 0,
        },
        events: {
          onReady: (event: any) => {
            if (unmounted) return;
            setReady(true);
            try {
              const currentVol = event.target.getVolume();
              if (typeof currentVol === 'number') {
                setVolumeState(Math.round(currentVol));
              }
            } catch (e) {
              // ignore
            }
          },
          onStateChange: (event: any) => {
            if (unmounted) return;
            const State = window.YT.PlayerState;
            if (event.data === State.PLAYING) {
              setPlaying(true);
            } else if (event.data === State.PAUSED) {
              setPlaying(false);
            } else if (event.data === State.ENDED) {
              setPlaying(false);
              onEndedRef.current?.();
            }
          },
          onError: () => {
            if (unmounted) return;
            onErrorRef.current?.();
          },
        },
      });
    });

    return () => {
      unmounted = true;
    };
  }, []);

  const play = useCallback(() => {
    playerRef.current?.playVideo();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, []);

  const toggle = useCallback(() => {
    if (playing) {
      pause();
    } else {
      play();
    }
  }, [playing, play, pause]);

  const loadAndPlay = useCallback((videoId: string, startSeconds = 0) => {
    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      playerRef.current.loadVideoById({
        videoId,
        startSeconds,
      });
    }
  }, []);

  const setVolume = useCallback((val: number) => {
    const clamped = Math.min(100, Math.max(0, Math.round(val)));
    setVolumeState(clamped);
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(clamped);
      if (clamped === 0) {
        playerRef.current.mute();
        setIsMuted(true);
      } else {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (isMuted || volume === 0) {
      setVolume(70);
    } else {
      setVolume(0);
    }
  }, [isMuted, volume, setVolume]);

  const getProgress = useCallback(() => {
    const p = playerRef.current;
    if (p && typeof p.getCurrentTime === 'function') {
      const current = p.getCurrentTime() || 0;
      const duration = p.getDuration() || 0;
      return { current, duration };
    }
    return { current: 0, duration: 0 };
  }, []);

  const seekToFraction = useCallback((fraction: number) => {
    const p = playerRef.current;
    if (!p) return;
    const duration = p.getDuration();
    if (duration) {
      p.seekTo(duration * Math.min(1, Math.max(0, fraction)), true);
    }
  }, []);

  return {
    hostRef,
    ready,
    playing,
    volume,
    isMuted,
    play,
    pause,
    toggle,
    loadAndPlay,
    setVolume,
    toggleMute,
    getProgress,
    seekToFraction,
  };
}
