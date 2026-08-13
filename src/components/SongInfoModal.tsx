import React, { useState } from 'react';
import { X, Quote, Heart, Share2, Check, Sparkles, BookOpen } from 'lucide-react';
import { Track } from '../types';

interface SongInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track;
}

export const SongInfoModal: React.FC<SongInfoModalProps> = ({
  isOpen,
  onClose,
  track,
}) => {
  const [copied, setCopied] = useState(false);
  const [favorited, setFavorited] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `Listening to "${track.title}" by ${track.artist} on Azaad Bharat! 🇮🇳\nCheck it out: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-gray-950 border border-white/20 rounded-2xl shadow-2xl overflow-hidden text-white relative">
        
        {/* Cover Header Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-900">
          <img
            src={track.image}
            alt={track.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white transition-all border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hindi Word Badge */}
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <span className="brand-hindi text-3xl font-bold text-amber-300 drop-shadow-md">
              {track.word}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
              {track.isGenZ ? 'Gen Z Choice' : 'Golden Classic'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center justify-between">
              {track.title}
              <button
                onClick={() => setFavorited(!favorited)}
                className={`p-2 rounded-full transition-colors ${
                  favorited ? 'text-red-500 bg-red-500/20' : 'text-white/40 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
              </button>
            </h2>
            <p className="text-sm text-white/70">
              {track.artist} • <span className="text-amber-300 font-medium">{track.album}</span>
            </p>
          </div>

          {/* Lyrics Excerpt */}
          {track.lyricsSnippet && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 relative">
              <Quote className="w-5 h-5 text-amber-400/50 absolute top-3 right-3" />
              <p className="text-xs uppercase font-bold tracking-wider text-amber-400">
                LYRICS HIGHLIGHT
              </p>
              <p className="brand-hindi text-base sm:text-lg text-amber-100 italic leading-relaxed">
                "{track.lyricsSnippet}"
              </p>
            </div>
          )}

          {/* Background Story */}
          {track.description && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-white/60">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>About this Song</span>
              </div>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                {track.description}
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
