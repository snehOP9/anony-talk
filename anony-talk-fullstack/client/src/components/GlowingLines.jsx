import { useEffect, useRef } from 'react';

export default function GlowingLines({ count = 30 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const lines = [];
    for (let i = 0; i < count; i++) {
      const line = document.createElement('div');
      line.className = 'glowing-line';
      line.style.setProperty('--left', `${Math.random() * 100}%`);
      line.style.setProperty('--duration', `${Math.random() * 5 + 3}s`);
      line.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(line);
      lines.push(line);
    }

    return () => lines.forEach(l => l.remove());
  }, [count]);

  return <div ref={containerRef} className="glowing-lines" />;
}
