export type MoodFilter = 'all' | 'genz' | 'ungenz';

export type WordSpotPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right' 
  | 'center-left' 
  | 'center-middle' 
  | 'center-right' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

export interface Track {
  id: string;
  youtubeId: string;
  title: string;
  artist: string;
  album: string;
  year?: string;
  cover: string;
  image: string;
  word: string;
  wordSize?: number;
  wordPos?: WordSpotPosition;
  wordPosMobile?: WordSpotPosition;
  focus?: string;
  dur: string;
  isGenZ: boolean;
  fullLyrics?: string[];
  lyricsSnippet?: string;
  description?: string;
}

export interface PlayerState {
  current: number;
  duration: number;
}
