import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Particles from '../components/Particles';
import { useAuth } from '../context/AuthContext';
import * as api from '../utils/api';
import '../styles/wellness.css';

const tabs = ['Insights', 'Challenges', 'Stories', 'Quotes', 'Bonding'];

const relationshipQuotes = [
  { text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },
  { text: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" },
  { text: "The greatest thing you'll ever learn is just to love and be loved in return.", author: "Nat King Cole" },
  { text: "We loved with a love that was more than love.", author: "Edgar Allan Poe" },
  { text: "Where there is love there is life.", author: "Mahatma Gandhi" },
  { text: "Love recognizes no barriers.", author: "Maya Angelou" },
  { text: "The heart was made to be broken.", author: "Oscar Wilde" },
  { text: "You know you're in love when you can't fall asleep.", author: "Dr. Seuss" },
  { text: "Love is an irresistible desire to be irresistibly desired.", author: "Robert Frost" },
  { text: "I have decided to stick with love. Hate is too great a burden.", author: "Martin Luther King Jr." },
];

const challenges = [
  { id: '1', text: '15-Minute Uninterrupted Talk' },
  { id: '2', text: 'Digital-Free Dinner Date' },
  { id: '3', text: 'Write a Love Letter' },
  { id: '4', text: 'Play a Game Together' },
  { id: '5', text: 'Share 3 Things You Appreciate' },
  { id: '6', text: 'Cook a Meal Together' },
  { id: '7', text: 'Take a Walk Together' },
  { id: '8', text: 'Watch Sunset Together' },
  { id: '9', text: 'Create a Playlist Together' },
  { id: '10', text: 'Share a Childhood Memory' },
];

const bondingActivities = [
  { icon: '🎲', title: 'Board Game Night', desc: 'Pick a game and enjoy quality time' },
  { icon: '🎨', title: 'Art Together', desc: 'Paint, draw, or craft side by side' },
  { icon: '📸', title: 'Photo Walk', desc: 'Explore your neighborhood through a lens' },
  { icon: '🍳', title: 'Recipe Challenge', desc: 'Cook a new recipe together' },
];

export default function Relationship() {
  const [activeTab, setActiveTab] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    if (user?.userId) {
      api.getChallenges(user.userId, 'relationship').then(data => {
        const map = {};
        data.forEach(c => { map[c.challenge_id] = !!c.completed; });
        setCompletedChallenges(map);
      }).catch(() => {});
    }
  }, [user]);

  const toggleChallenge = async (id) => {
    const newState = !completedChallenges[id];
    setCompletedChallenges(prev => ({ ...prev, [id]: newState }));
    if (user?.userId) {
      try { await api.updateChallenge(user.userId, id, 'relationship', newState); } catch {}
    }
  };

  return (
    <div className="page">
      <Navbar />
      <Particles count={40} colors={['rgba(244,67,54,0.2)', 'rgba(255,0,200,0.2)']} />

      <div className="page-content">
        <section className="hero" style={{ minHeight: '25vh' }}>
          <h1>❤️ LoveLens Relationship Suite</h1>
          <p>Strengthen your connections and nurture your relationships</p>
        </section>

        <div className="tabs">
          {tabs.map((tab, i) => (
            <button key={i} className={`tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{tab}</button>
          ))}
        </div>

        <div className="wellness-content">
          {/* Insights */}
          {activeTab === 0 && (
            <div className="grid-2">
              <div className="card">
                <h3 style={{ color: 'var(--neon-cyan)', marginBottom: 16 }}>Communication Health</h3>
                <div className="relationship-progress">
                  <div className="label-row"><span>Score</span><span>75%</span></div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: '75%' }} /></div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Good communication is the foundation of every healthy relationship.</p>
              </div>
              <div className="card">
                <h3 style={{ color: 'var(--neon-pink)', marginBottom: 16 }}>Intimacy Spectrum</h3>
                <div className="relationship-progress">
                  <div className="label-row"><span>Score</span><span>60%</span></div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: '60%', background: 'linear-gradient(90deg, #ff00c8, #a855f7)' }} /></div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Emotional and physical intimacy require consistent nurturing.</p>
              </div>
            </div>
          )}

          {/* Challenges */}
          {activeTab === 1 && (
            <div>
              {challenges.map(c => (
                <div key={c.id} className={`challenge-item ${completedChallenges[c.id] ? 'completed' : ''}`}>
                  <span>{c.text}</span>
                  <button className="challenge-btn" onClick={() => toggleChallenge(c.id)}>
                    {completedChallenges[c.id] ? 'Completed ✓' : 'Start'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Stories */}
          {activeTab === 2 && (
            <div className="grid-2">
              <div className="card">
                <h3 style={{ color: 'var(--positive)' }}>Sarah & James</h3>
                <p style={{ marginTop: 8, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  After 3 years of growing apart, Sarah and James decided to attend couples therapy. Through honest conversations and dedicated date nights, they rediscovered why they fell in love.
                </p>
              </div>
              <div className="card">
                <h3 style={{ color: 'var(--positive)' }}>Rebuilding Trust</h3>
                <p style={{ marginTop: 8, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  "Trust takes years to build, seconds to break, and forever to repair. But every day of rebuilding was worth it." — Anonymous couple, married 15 years.
                </p>
              </div>
            </div>
          )}

          {/* Quotes */}
          {activeTab === 3 && (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <p style={{ fontSize: '1.3rem', fontStyle: 'italic', color: 'var(--neon-pink)', lineHeight: 1.7, marginBottom: 12 }}>
                "{relationshipQuotes[quoteIndex].text}"
              </p>
              <span style={{ color: 'var(--text-muted)' }}>— {relationshipQuotes[quoteIndex].author}</span>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={() => setQuoteIndex((quoteIndex - 1 + relationshipQuotes.length) % relationshipQuotes.length)}>← Prev</button>
                <button className="btn btn-secondary" onClick={() => setQuoteIndex((quoteIndex + 1) % relationshipQuotes.length)}>Next →</button>
              </div>
            </div>
          )}

          {/* Bonding */}
          {activeTab === 4 && (
            <div className="grid-2">
              {bondingActivities.map((b, i) => (
                <div key={i} className="card bonding-card">
                  <div className="bonding-icon">{b.icon}</div>
                  <h3 style={{ color: 'var(--neon-cyan)', marginBottom: 8 }}>{b.title}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
