import { useEffect, useRef } from 'react';

export default function Particles({ count = 50, colors = ['rgba(0,240,255,0.3)', 'rgba(168,85,247,0.3)', 'rgba(255,0,200,0.3)'] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles = [];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 1;
      const duration = Math.random() * 15 + 10;
      const tx = (Math.random() - 0.5) * 200;
      const ty = (Math.random() - 0.5) * 200;

      Object.assign(p.style, {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: colors[Math.floor(Math.random() * colors.length)],
        '--tx': `${tx}px`,
        '--ty': `${ty}px`,
        animationDuration: `${duration}s`,
        animationDelay: `${Math.random() * duration}s`,
        opacity: Math.random() * 0.5 + 0.2,
      });

      container.appendChild(p);
      particles.push(p);
    }

    return () => particles.forEach(p => p.remove());
  }, [count, colors]);

  return <div ref={containerRef} className="particles-container" />;
}
