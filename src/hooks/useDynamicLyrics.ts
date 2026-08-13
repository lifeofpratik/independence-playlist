import { useState, useEffect } from 'react';

export function useDynamicLyrics(artist: string, title: string, fallbackLyrics?: string[]) {
  const [lyrics, setLyrics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    
    // If we have local lyrics in our database, prefer those and skip network call
    if (fallbackLyrics && fallbackLyrics.length > 0) {
      setLyrics(fallbackLyrics);
      setLoading(false);
      return;
    }

    if (!artist || !title) {
      setLyrics([]);
      return;
    }

    setLoading(true);
    setLyrics([]);

    // Clean up title for better search (remove text in parenthesis, like "(1967)")
    const cleanTitle = title.replace(/\(.*?\)/g, '').trim();
    const cleanArtist = artist.split('&')[0].split(',')[0].trim();

    fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(cleanArtist)}/${encodeURIComponent(cleanTitle)}`)
      .then((res) => res.json())
      .then((data) => {
        if (active && data.lyrics) {
          const lines = data.lyrics.split('\n').map((l: string) => l.trim()).filter(Boolean);
          setLyrics(lines);
        }
      })
      .catch(() => {
        // silently ignore error
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [artist, title]);

  return { lyrics, loading };
}
