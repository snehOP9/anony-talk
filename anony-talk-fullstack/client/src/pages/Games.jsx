import { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Particles from '../components/Particles';
import '../styles/games.css';

// ===== Breathing Game =====
function BreathingGame() {
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(4);

  return (
    <div className="game-content">
      <h3>🌀 Cosmic Breathing</h3>
      <p>Breathe in as the circle expands, breathe out as it contracts</p>
      <div
        className="breathing-circle"
        style={{
          animation: running ? `breathe ${speed}s ease-in-out infinite` : 'none',
          transform: running ? undefined : 'scale(0.8)',
        }}
      />
      <div className="speed-control">
        <label>Speed: {speed}s</label>
        <input type="range" min="2" max="8" value={speed} onChange={e => setSpeed(Number(e.target.value))} />
      </div>
      <div className="game-controls">
        <button className="btn btn-glow" onClick={() => setRunning(!running)}>
          {running ? '⏸ Pause' : '▶ Start'}
        </button>
        <button className="btn btn-secondary" onClick={() => { setRunning(false); }}>
          🔄 Reset
        </button>
      </div>
    </div>
  );
}

// ===== Memory Game =====
const EMOJIS = ['🌟', '🌙', '🌈', '🦋', '🌸', '🌊', '⭐', '🔮'];

function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);

  const initGame = useCallback(() => {
    const shuffled = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5).map((emoji, i) => ({ id: i, emoji }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setScore(0);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const flipCard = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped;
      if (cards[a].emoji === cards[b].emoji) {
        setMatched(prev => [...prev, a, b]);
        setScore(prev => prev + 1);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  return (
    <div className="game-content">
      <h3>✨ Stellar Memory</h3>
      <p>Score: {score}/{EMOJIS.length}</p>
      <div className="memory-grid">
        {cards.map(card => (
          <div
            key={card.id}
            className={`memory-card ${flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''}`}
            onClick={() => flipCard(card.id)}
          >
            {(flipped.includes(card.id) || matched.includes(card.id)) ? card.emoji : '?'}
          </div>
        ))}
      </div>
      {matched.length === cards.length && cards.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <p style={{ color: 'var(--positive)', fontSize: '1.2rem' }}>🎉 You Won!</p>
          <button className="btn btn-glow" onClick={initGame} style={{ marginTop: 8 }}>Play Again</button>
        </div>
      )}
    </div>
  );
}

// ===== Color Canvas =====
function ColorCanvas() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#00f0ff');
  const [brushSize, setBrushSize] = useState(4);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e) => {
    setDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDraw = () => setDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="game-content">
      <h3>🎨 Nebula Colors</h3>
      <p>Free-draw to express your emotions through color</p>
      <canvas
        ref={canvasRef}
        className="color-canvas"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
      <div className="canvas-controls">
        <input type="color" value={color} onChange={e => setColor(e.target.value)} />
        <input type="range" min="1" max="20" value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} />
        <button className="btn btn-secondary" onClick={clearCanvas}>Clear</button>
      </div>
    </div>
  );
}

// ===== Focus Timer =====
function FocusTimer() {
  const [mode, setMode] = useState('work'); // work | break
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
    setRunning(false);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div className="game-content">
      <h3>⏳ Galactic Focus</h3>
      <div className="timer-modes">
        <button className={`tab ${mode === 'work' ? 'active' : ''}`} onClick={() => switchMode('work')}>Work (25m)</button>
        <button className={`tab ${mode === 'break' ? 'active' : ''}`} onClick={() => switchMode('break')}>Break (5m)</button>
      </div>
      <div className="timer-display">{formatTime(timeLeft)}</div>
      <div className="game-controls">
        <button className="btn btn-glow" onClick={() => setRunning(!running)}>
          {running ? '⏸ Pause' : '▶ Start'}
        </button>
        <button className="btn btn-secondary" onClick={() => switchMode(mode)}>🔄 Reset</button>
      </div>
    </div>
  );
}

// ===== Main Games Page =====
export default function Games() {
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    { id: 'breathing', emoji: '🌀', title: 'Cosmic Breathing', desc: 'Guided breathing with visual feedback', component: <BreathingGame /> },
    { id: 'memory', emoji: '✨', title: 'Stellar Memory', desc: 'Match pairs to sharpen your mind', component: <MemoryGame /> },
    { id: 'color', emoji: '🎨', title: 'Nebula Colors', desc: 'Express emotions through free-drawing', component: <ColorCanvas /> },
    { id: 'focus', emoji: '⏳', title: 'Galactic Focus', desc: 'Pomodoro timer for deep work sessions', component: <FocusTimer /> },
  ];

  return (
    <div className="page">
      <Navbar />
      <Particles count={60} colors={['rgba(168,85,247,0.3)', 'rgba(0,240,255,0.2)', 'rgba(255,0,200,0.2)']} />

      <div className="page-content">
        <section className="hero" style={{ minHeight: '25vh' }}>
          <h1>🎮 Cosmic Mind Games</h1>
          <p>Relaxing games designed to calm your mind and sharpen your focus</p>
        </section>

        {/* Game Cards */}
        {!activeGame && (
          <div className="grid-2">
            {games.map(game => (
              <div key={game.id} className="card game-card" onClick={() => setActiveGame(game.id)}>
                <div className="game-emoji">{game.emoji}</div>
                <h3>{game.title}</h3>
                <p>{game.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Active Game */}
        {activeGame && (
          <div className="active-game glass">
            <button className="back-btn btn btn-secondary" onClick={() => setActiveGame(null)}>
              ← Back to Games
            </button>
            {games.find(g => g.id === activeGame)?.component}
          </div>
        )}
      </div>
    </div>
  );
}
