import React, { useState } from 'react';
import { Search, X, Music, Play, Sparkles, Disc, Flame } from 'lucide-react';
import { Track, MoodFilter } from '../types';

interface TrackListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: Track[];
  currentTrackId: string;
  onSelectTrack: (track: Track) => void;
  currentMood: MoodFilter;
  onSelectMood: (mood: MoodFilter) => void;
  isPlaying: boolean;
}

export const TrackListDrawer: React.FC<TrackListDrawerProps> = ({
  isOpen,
  onClose,
  tracks,
  currentTrackId,
  onSelectTrack,
  currentMood,
  onSelectMood,
  isPlaying,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredTracks = tracks.filter((track) => {
    const matchesMood =
      currentMood === 'all'
        ? true
        : currentMood === 'genz'
        ? track.isGenZ
        : !track.isGenZ;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      track.title.toLowerCase().includes(query) ||
      track.artist.toLowerCase().includes(query) ||
      track.album.toLowerCase().includes(query) ||
      track.word.includes(query);

    return matchesMood && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-gray-950/90 border border-white/15 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh] text-white">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Disc className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Azaad Playlist
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {tracks.length} Bangers
                </span>
              </h2>
              <p className="text-xs text-white/60">
                Curated Indian patriotic anthems for Independence Day & Republic Day
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Mood Filter Bar */}
        <div className="p-4 border-b border-white/10 space-y-3 bg-black/40">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by song name, artist, movie or Hindi word..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-amber-400/70 focus:ring-1 focus:ring-amber-400/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {(['all', 'genz', 'ungenz'] as MoodFilter[]).map((m) => (
              <button
                key={m}
                onClick={() => onSelectMood(m)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  currentMood === m
                    ? 'bg-amber-500 text-gray-950 font-bold shadow-md'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                {m === 'all' ? 'All Songs' : m === 'genz' ? 'Gen Z (Modern)' : 'UnGen Z (Golden Era)'}
              </button>
            ))}
          </div>
        </div>

        {/* Track List Items */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-1 divide-y divide-white/5">
          {filteredTracks.length === 0 ? (
            <div className="text-center py-12 text-white/50 space-y-2">
              <Music className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-sm">No patriotic songs found matching "{searchQuery}"</p>
            </div>
          ) : (
            filteredTracks.map((track, idx) => {
              const isSelected = track.id === currentTrackId;
              return (
                <div
                  key={track.id}
                  onClick={() => {
                    onSelectTrack(track);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 border border-amber-500/40'
                      : 'hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                      <img
                        src={track.cover}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && isPlaying && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="flex gap-0.5 items-end h-4">
                            <span className="w-1 bg-amber-400 h-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1 bg-amber-400 h-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1 bg-amber-400 h-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-semibold truncate ${isSelected ? 'text-amber-300 font-bold' : 'text-white'}`}>
                          {track.title}
                        </h3>
                        <span className="brand-hindi text-xs px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {track.word}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 truncate">
                        {track.artist} • <span className="text-white/40">{track.album}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                    <span className="text-xs font-mono text-white/50">{track.dur}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      track.isGenZ
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {track.isGenZ ? 'Gen Z' : 'Classic'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
