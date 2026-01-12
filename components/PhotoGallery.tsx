
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, Moon } from 'lucide-react';

interface PhotoGalleryProps {
  onComplete: () => void;
}

// These are placeholders for the 5 photos provided by the user
const NODI_PHOTOS = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800", // Pink Floral (Cafe)
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800", // Pink Saree (Garden)
  "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=800", // Yellow Dress (Mustard Field - Standing)
  "https://images.unsplash.com/photo-1516589174184-c6852651428c?auto=format&fit=crop&q=80&w=800", // Yellow Dress (Mustard Field - Looking away)
  "https://images.unsplash.com/photo-1529139578598-384403b21b6a?auto=format&fit=crop&q=80&w=800", // Green Saree (Sitting)
];

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [entryPhase, setEntryPhase] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    // Sequence of entry animations
    const timer = setTimeout(() => setEntryPhase(1), 500);
    return () => clearTimeout(timer);
  }, []);

  const nextPhoto = () => {
    if (currentIndex < NODI_PHOTOS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowFinalMessage(true);
    }
  };

  const prevPhoto = () => {
    if (showFinalMessage) {
      setShowFinalMessage(false);
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className={`fixed inset-0 z-40 bg-black flex flex-col items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Dynamic Background Glow */}
      <div 
        className="absolute inset-0 transition-all duration-[3000ms]"
        style={{
          background: showFinalMessage 
            ? 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 1) 70%)' 
            : 'radial-gradient(circle at center, rgba(255, 182, 193, 0.15) 0%, rgba(0, 0, 0, 1) 70%)'
        }}
      />
      
      <div className="relative w-full max-w-xl px-6 flex flex-col items-center z-10">
        {!showFinalMessage ? (
          <div className={`relative w-full aspect-[3/4] max-w-md group overflow-hidden rounded-[2rem] shadow-[0_0_80px_rgba(255,182,193,0.1)] transition-all duration-1000 ${entryPhase >= 1 ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-10 opacity-0'}`}>
            <img 
              key={currentIndex}
              src={NODI_PHOTOS[currentIndex]} 
              alt="Nodi" 
              className="w-full h-full object-cover transition-all duration-1000 scale-100 hover:scale-110 animate-in fade-in zoom-in-105"
            />
            
            {/* Soft Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            
            {/* Navigation UI */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <button 
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                className={`p-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white transition-all hover:bg-white/20 active:scale-90 ${currentIndex === 0 ? 'opacity-0' : 'opacity-100'}`}
              >
                <ChevronLeft size={28} />
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                className="p-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white transition-all hover:bg-white/20 active:scale-90"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {/* Pagination Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
              {NODI_PHOTOS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-700 ${i === currentIndex ? 'bg-pink-400 w-8' : 'bg-white/10 w-4'}`} 
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in zoom-in-95 duration-1000 px-4 py-20 relative">
            {/* The Moon Glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-white/5 blur-[80px] rounded-full animate-pulse" />
            
            <div className="relative">
              <Moon className="text-white/80 absolute -top-12 -right-12 animate-bounce duration-[4000ms]" size={32} />
              <Heart className="text-pink-500 animate-pulse fill-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]" size={64} />
            </div>
            
            <div className="space-y-8 max-w-lg">
              <p className="text-2xl md:text-3xl font-light text-pink-50 leading-relaxed italic animate-in slide-in-from-bottom-4 duration-1000">
                "তুমি পৃথীবির সুন্দর একজন নারী আমার কাছে।"
              </p>
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-[0.2em] playfair animate-in slide-in-from-bottom-8 duration-1000 delay-300">
                তুমি চাঁদ।
              </h2>
              <p className="text-xl md:text-2xl font-light text-white/70 tracking-wide animate-in slide-in-from-bottom-10 duration-1000 delay-500">
                আমি তোমাকে আমার থেকেও বেশি ভালোবাসি।
              </p>
            </div>

            <button 
              onClick={onComplete}
              className="mt-16 px-14 py-5 bg-white text-black rounded-full font-semibold tracking-[0.3em] uppercase hover:bg-pink-50 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:-translate-y-1 active:scale-95 animate-in fade-in slide-in-from-bottom-12 delay-1000"
            >
              প্রবেশ করুন
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-10 text-white/20 text-[10px] tracking-[0.6em] uppercase z-50">
        Everything for Noor
      </div>
    </div>
  );
};

export default PhotoGallery;
