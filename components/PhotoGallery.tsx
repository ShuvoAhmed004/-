
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

interface PhotoGalleryProps {
  onComplete: () => void;
}

const NODI_PHOTOS = [
  "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=80&w=800", // Placeholder for Cafe Image
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800", // Placeholder for Saree Image
  "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=800", // Placeholder for Field Image
  "https://images.unsplash.com/photo-1516589174184-c6852651428c?auto=format&fit=crop&q=80&w=800", // Placeholder for Green Saree
];

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
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
      <div className="absolute inset-0 bg-gradient-to-b from-pink-900/20 via-black to-teal-900/20 opacity-40 pointer-events-none" />
      
      <div className="relative w-full max-w-xl aspect-[3/4] md:max-w-md px-6 flex flex-col items-center">
        {!showFinalMessage ? (
          <div className="relative w-full h-full group overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(255,182,193,0.2)]">
            <img 
              key={currentIndex}
              src={NODI_PHOTOS[currentIndex]} 
              alt="Nodi" 
              className="w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-110 animate-in fade-in zoom-in-95"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Navigation Buttons */}
            <button 
              onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
              className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-transform hover:scale-110 active:scale-95 ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-transform hover:scale-110 active:scale-95"
            >
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {NODI_PHOTOS.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'bg-pink-400 w-4' : 'bg-white/20'}`} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-1000 px-4">
            <Heart className="text-pink-400 animate-pulse fill-pink-400" size={48} />
            
            <div className="space-y-6">
              <p className="text-2xl md:text-3xl font-light text-pink-50 leading-relaxed italic">
                "তুমি পৃথীবির সুন্দর একজন নারী আমার কাছে।"
              </p>
              <p className="text-4xl md:text-5xl font-bold text-white tracking-widest playfair">
                তুমি চাঁদ।
              </p>
              <p className="text-xl md:text-2xl font-light text-white/80">
                আমি তোমাকে আমার থেকেও বেশি ভালোবাসি।
              </p>
            </div>

            <button 
              onClick={onComplete}
              className="mt-12 px-10 py-4 bg-white text-black rounded-full font-medium tracking-[0.2em] uppercase hover:bg-pink-50 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-1 active:scale-95"
            >
              প্রবেশ করুন
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-white/30 text-[10px] tracking-[0.5em] uppercase">
        Memories of Noor
      </div>
    </div>
  );
};

export default PhotoGallery;
