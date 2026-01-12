
import React, { useEffect, useState } from 'react';

const FloatingParticles: React.FC = () => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white/20 blur-[1px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `float ${p.duration}s infinite linear`,
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default FloatingParticles;
