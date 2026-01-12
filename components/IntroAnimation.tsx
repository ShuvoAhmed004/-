
import React, { useEffect, useState } from 'react';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1000), // Fade in light
      setTimeout(() => setStep(2), 3000), // Show Name
      setTimeout(() => setStep(3), 6000), // Fade name
      setTimeout(() => onComplete(), 7500), // Finish
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      {/* Radial Gradient Glow */}
      <div 
        className={`absolute inset-0 transition-opacity duration-[3000ms] ease-in-out ${step >= 1 ? 'opacity-30' : 'opacity-0'}`}
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 182, 193, 0.4) 0%, rgba(0, 0, 0, 0) 70%)'
        }}
      />

      <div className={`transition-all duration-[2000ms] flex flex-col items-center ${step === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <h1 className="text-6xl md:text-8xl text-white font-light tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] mb-4">
          নদি
        </h1>
        <p className="text-xl md:text-2xl text-pink-200/80 playfair tracking-widest uppercase">
          Noor
        </p>
      </div>

      <div className={`absolute bottom-20 text-white/40 text-sm tracking-[0.2em] transition-opacity duration-1000 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        ALWAYS YOURS
      </div>
    </div>
  );
};

export default IntroAnimation;
