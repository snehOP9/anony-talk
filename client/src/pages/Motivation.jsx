import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Particles from '../components/Particles';
import '../styles/motivation.css';

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
];

const cubeFaces = [
  "Rise Above Challenges",
  "Find Your Inner Strength",
  "Embrace the Journey",
  "Believe in Yourself",
  "Dream Big",
  "Never Give Up",
];

export default function Motivation() {
  const [quote, setQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
  const [cubeRot, setCubeRot] = useState({ x: 0, y: 0 });
  const cubeRef = useRef(null);

  const refreshQuote = () => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  const rotateCube = (axis, deg) => {
    setCubeRot(prev => ({
      x: prev.x + (axis === 'x' ? deg : 0),
      y: prev.y + (axis === 'y' ? deg : 0),
    }));
  };

  return (
    <div className="page">
      <Navbar />
      <Particles count={40} colors={['rgba(255,149,0,0.3)', 'rgba(255,100,50,0.3)', 'rgba(255,200,0,0.2)']} />

      <div className="page-content">
        <section className="hero" style={{ minHeight: '30vh' }}>
          <h1>🔥 Motivation Hub</h1>
          <p>Fuel your fire with inspirational quotes and visual motivation</p>
        </section>

        {/* Daily Quote */}
        <section className="dashboard-section">
          <h2 className="section-title">💡 Daily Quote</h2>
          <div className="card quote-card">
            <p className="quote-text">"{quote.text}"</p>
            <span className="quote-author">— {quote.author}</span>
            <button className="btn btn-secondary" onClick={refreshQuote} style={{ marginTop: 20 }}>
              <i className="fas fa-sync-alt"></i> New Quote
            </button>
          </div>
        </section>

        {/* 3D Motivation Cube */}
        <section className="dashboard-section">
          <h2 className="section-title">🎲 Inspiration Cube</h2>
          <div className="cube-container">
            <div
              ref={cubeRef}
              className="cube"
              style={{ transform: `translateZ(-150px) rotateX(${cubeRot.x}deg) rotateY(${cubeRot.y}deg)` }}
            >
              {cubeFaces.map((face, i) => (
                <div key={i} className="cube-face">
                  <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{face}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="cube-controls">
            <button className="cube-btn" onClick={() => rotateCube('y', -90)}>⬅</button>
            <button className="cube-btn" onClick={() => rotateCube('x', -90)}>⬆</button>
            <button className="cube-btn" onClick={() => rotateCube('x', 90)}>⬇</button>
            <button className="cube-btn" onClick={() => rotateCube('y', 90)}>➡</button>
          </div>
        </section>

        {/* Motivational Music */}
        <section className="dashboard-section">
          <h2 className="section-title">🎵 Motivational Music</h2>
          <div className="grid-2">
            <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>
              <iframe
                style={{ borderRadius: 12 }}
                src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Motivational playlist"
              />
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>
              <iframe
                style={{ borderRadius: 12 }}
                src="https://open.spotify.com/embed/playlist/37i9dQZF1DX3rxVfibe1L0"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Mood booster playlist"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
