
import React, { useEffect, useState } from 'react';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1000),  // Start
      setTimeout(() => setStep(2), 3500),  // Poetic 1
      setTimeout(() => setStep(3), 6500),  // Poetic 2
      setTimeout(() => setStep(4), 9500),  // Final Name Reveal
      setTimeout(() => setStep(5), 13500), // Ready to Enter
      setTimeout(() => onComplete(), 15500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#020202] flex items-center justify-center z-50 overflow-hidden">
      {/* Moving Aurora Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="aurora-bg absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
      </div>

      <div className="relative z-10 w-full text-center px-10">
        {/* Subtle Poetic Text */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-[2000ms] ${step === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
          <p className="text-2xl md:text-4xl font-extralight tracking-[0.3em] text-white/40 italic">
            "অন্ধকার আকাশের মাঝে যেমন হাজারো তারা..."
          </p>
        </div>

        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-[2000ms] ${step === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
          <p className="text-2xl md:text-4xl font-extralight tracking-[0.3em] text-white/40 italic">
            "তেমনি আমার শূন্য হৃদয়ে শুধু তুমি।"
          </p>
        </div>

        {/* Cinematic Name Reveal */}
        <div className={`flex flex-col items-center transition-all duration-[4000ms] ${step >= 4 ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-125 blur-3xl'}`}>
          <h1 className="text-9xl md:text-[14rem] font-extralight tracking-[0.4em] text-white drop-shadow-[0_0_80px_rgba(255,255,255,0.2)]">
            নদি
          </h1>
          <div className="relative mt-8 group">
            <div className="absolute -inset-x-20 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-[3000ms]" />
            <p className="text-4xl md:text-5xl text-white/10 playfair tracking-[1em] uppercase font-thin mt-4">
              Noor
            </p>
          </div>
        </div>
      </div>

      {/* Floating Sparkle Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDuration: `${Math.random() * 5 + 3}s`,
              opacity: step >= 4 ? 0.4 : 0.1
            }}
          />
        ))}
      </div>

      <div className={`absolute bottom-20 text-white/5 text-xs tracking-[2em] transition-opacity duration-[3000ms] uppercase ${step >= 4 ? 'opacity-100' : 'opacity-0'}`}>
        Everything for Noor
      </div>
    </div>
  );
};

export default IntroAnimation;
