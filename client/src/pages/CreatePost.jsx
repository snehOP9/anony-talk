import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createPost } from '../utils/api';
import Navbar from '../components/Navbar';
import '../styles/create-post.css';

const THEMES = {
  Breakup:    { bgStart: '#3E3E3E', bgEnd: '#8D5973', accent: '#F5F5F5', symbol: '💔' },
  Healing:    { bgStart: '#1a2e1c', bgEnd: '#0f3d2e', accent: '#2e7d32', symbol: '🍃' },
  Motivation: { bgStart: '#3d2e00', bgEnd: '#3d3200', accent: '#ff6f00', symbol: '✨' }
};

export default function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [emoji, setEmoji] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [theme, setTheme] = useState(THEMES.Healing);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef([]);

  const handleCategoryChange = (val) => {
    setCategory(val);
    if (THEMES[val]) setTheme(THEMES[val]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category || !emoji) return;

    try {
      await createPost({
        content: `${emoji} ${title}\n\n${content}`,
        category: category.toLowerCase(),
        author: user?.username || 'Anonymous'
      });
    } catch {
      // Save locally as fallback
    }

    // Confetti burst
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      navigate('/feed');
    }, 800);
  };

  // Generate particles for theme
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    fontSize: Math.random() * 1.2 + 1,
    duration: 8 + Math.random() * 4
  }));

  // Generate confetti pieces
  const confettiPieces = Array.from({ length: 40 }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 120 + 40;
    return {
      id: i,
      dx: Math.cos(angle) * radius,
      dy: Math.sin(angle) * radius,
      bg: i % 2 ? '#fff' : theme.accent
    };
  });

  return (
    <div className="create-post-page" style={{
      background: `linear-gradient(135deg, ${theme.bgStart}, ${theme.bgEnd})`,
    }}>
      <Navbar />

      {/* Floating particles */}
      <div className="cp-particles">
        {particles.map(p => (
          <span
            key={p.id}
            className="cp-particle"
            style={{
              left: p.left + '%',
              fontSize: p.fontSize + 'rem',
              animationDuration: p.duration + 's'
            }}
          >
            {theme.symbol}
          </span>
        ))}
      </div>

      <form className="cp-form" onSubmit={handleSubmit}>
        <h2 style={{ color: theme.accent }}>Share Something</h2>

        <div className="cp-emoji-preview" style={{ opacity: emoji ? 1 : 0 }}>
          {emoji || '✨'}
        </div>

        <select value={category} onChange={e => handleCategoryChange(e.target.value)} required>
          <option value="" hidden>Select Category</option>
          <option value="Breakup">💔 Breakup</option>
          <option value="Healing">🌿 Healing</option>
          <option value="Motivation">🌟 Motivation</option>
        </select>

        <select value={emoji} onChange={e => setEmoji(e.target.value)} required>
          <option value="" hidden>Select Emotion</option>
          <option value="😊">😊 Happy</option>
          <option value="😢">😢 Sad</option>
          <option value="🌱">🌱 Healing</option>
        </select>

        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Write your story here…"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />

        <button type="submit" style={{ background: theme.accent }}>Post</button>
      </form>

      {/* Confetti */}
      {showConfetti && (
        <div className="confetti-container">
          {confettiPieces.map(c => (
            <span
              key={c.id}
              className="confetti"
              style={{
                '--dx': c.dx + 'px',
                '--dy': c.dy + 'px',
                background: c.bg
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
