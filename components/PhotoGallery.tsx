
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, Moon, Loader2 } from 'lucide-react';

interface PhotoGalleryProps {
  onComplete: () => void;
}

// Optimized IDs that closely match the scenes Nodi provided
const NODI_PHOTOS = [
  "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=1000", // Pink vibe / Portrait
  "https://images.unsplash.com/photo-1610030469668-935142b96fe4?auto=format&fit=crop&q=80&w=1000", // Traditional Saree vibe
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000", // Yellow field / nature
  "https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&q=80&w=1000", // Yellow dress / bright vibe
  "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80&w=1000", // Green / Sitting elegant
];

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [entryPhase, setEntryPhase] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setEntryPhase(1), 300);
    return () => clearTimeout(timer);
  }, []);

  const nextPhoto = () => {
    if (currentIndex < NODI_PHOTOS.length - 1) {
      setLoading(true);
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowFinalMessage(true);
    }
  };

  const prevPhoto = () => {
    if (showFinalMessage) {
      setShowFinalMessage(false);
    } else if (currentIndex > 0) {
      setLoading(true);
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className={`fixed inset-0 z-40 bg-black flex flex-col items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background Ambience */}
      <div 
        className="absolute inset-0 transition-all duration-[2000ms]"
        style={{
          background: showFinalMessage 
            ? 'radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 1) 80%)' 
            : 'radial-gradient(circle at center, rgba(255, 182, 193, 0.1) 0%, rgba(0, 0, 0, 1) 80%)'
        }}
      />
      
      <div className="relative w-full max-w-xl px-6 flex flex-col items-center z-10">
        {!showFinalMessage ? (
          <div className={`relative w-full aspect-[3/4] max-w-md group overflow-hidden rounded-[2.5rem] bg-white/5 shadow-[0_0_100px_rgba(255,182,193,0.05)] transition-all duration-1000 ${entryPhase >= 1 ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-10 opacity-0'}`}>
            
            {/* Loading Indicator */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20 backdrop-blur-sm">
                <Loader2 className="text-pink-300 animate-spin" size={32} />
              </div>
            )}

            <img 
              key={currentIndex}
              src={NODI_PHOTOS[currentIndex]} 
              alt={`Nodi's Memory ${currentIndex + 1}`} 
              onLoad={() => setLoading(false)}
              className={`w-full h-full object-cover transition-all duration-1000 ${loading ? 'opacity-0 scale-110' : 'opacity-100 scale-100'} animate-in fade-in zoom-in-105`}
            />
            
            {/* Cinematic Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 pointer-events-none" />
            
            {/* Navigation Buttons */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 flex justify-between items-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <button 
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                className={`p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white transition-all hover:bg-white/10 active:scale-90 ${currentIndex === 0 ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
              >
                <ChevronLeft size={28} />
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                className="p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white transition-all hover:bg-white/10 active:scale-90"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {/* Step Counter */}
            <div className="absolute top-8 right-8 text-white/40 text-[10px] tracking-[0.4em] uppercase font-light">
              {currentIndex + 1} / {NODI_PHOTOS.length}
            </div>

            {/* Indicators */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
              {NODI_PHOTOS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-0.5 rounded-full transition-all duration-700 ${i === currentIndex ? 'bg-pink-400 w-12' : 'bg-white/10 w-4'}`} 
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-12 animate-in fade-in zoom-in-95 duration-1000 px-4 py-20">
            <div className="relative group">
              <div className="absolute -inset-8 bg-pink-500/20 blur-[40px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity" />
              <Heart className="text-pink-500 animate-pulse fill-pink-500 relative" size={72} />
              <Moon className="text-white/40 absolute -top-8 -right-8 animate-bounce duration-[5000ms]" size={32} />
            </div>
            
            <div className="space-y-10 max-w-lg">
              <p className="text-2xl md:text-3xl font-light text-pink-100/90 leading-relaxed italic animate-in slide-in-from-bottom-4 duration-1000">
                "তুমি পৃথীবির সুন্দর একজন নারী আমার কাছে।"
              </p>
              <h2 className="text-6xl md:text-8xl font-bold text-white tracking-[0.1em] playfair drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] animate-in slide-in-from-bottom-8 duration-1000 delay-300">
                তুমি চাঁদ।
              </h2>
              <p className="text-xl md:text-2xl font-light text-white/60 tracking-widest animate-in slide-in-from-bottom-10 duration-1000 delay-500">
                আমি তোমাকে আমার থেকেও বেশি ভালোবাসি।
              </p>
            </div>

            <button 
              onClick={onComplete}
              className="mt-20 px-16 py-5 bg-white text-black rounded-full font-bold tracking-[0.4em] uppercase hover:bg-pink-50 transition-all hover:shadow-[0_0_50px_rgba(255,255,255,0.25)] hover:-translate-y-1 active:scale-95 animate-in fade-in slide-in-from-bottom-12 delay-1000"
            >
              প্রবেশ করুন
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-10 left-0 right-0 text-center pointer-events-none opacity-20">
        <span className="text-[10px] tracking-[0.8em] uppercase text-white font-thin">
          Nodi's Eternal Light
        </span>
      </div>
    </div>
  );
};

export default PhotoGallery;
