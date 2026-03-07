import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Particles from '../components/Particles';
import MoodCalendar from '../components/MoodCalendar';
import { useAuth } from '../context/AuthContext';
import * as api from '../utils/api';
import '../styles/wellness.css';

const tabs = ['Stories', 'Fiction', 'Quotes', 'Guided', 'Challenges', 'Mood Tracker'];

const successStories = [
  { name: "Emily's Journey", subtitle: "Panic to Peace — 5 years", content: "For years, Emily dealt with debilitating panic attacks. Through CBT therapy, meditation, and support groups, she found tools that worked. Today she helps 500+ others navigate anxiety." },
  { name: "Mark's Transformation", subtitle: "Social Anxiety — 4 years", content: "Mark avoided all social situations. With gradual exposure therapy and supportive friends, he went from barely leaving his room to hosting community events." },
];

const fictionStories = [
  { title: 'The Shy Artist', content: 'She never showed anyone her art until she entered a local exhibition. Winning it changed her perspective on social anxiety.', lesson: 'Art as expression can heal what words cannot.' },
  { title: 'The Mindful Traveler', content: 'An executive left his job for a 3-month solo trip. He discovered mindfulness practices that transformed his daily life.', lesson: 'Sometimes you need to lose yourself to find yourself.' },
];

const dailyQuotes = [
  "Anxiety is a thin stream of fear trickling through the mind. If encouraged, it cuts a channel into which all other thoughts are drained. — Arthur Somers Roche",
  "You don't have to control your thoughts. You just have to stop letting them control you. — Dan Millman",
  "Nothing diminishes anxiety faster than action. — Walter Anderson",
  "Worry does not empty tomorrow of its sorrow, it empties today of its strength. — Corrie ten Boom",
  "Do not anticipate trouble, or worry about what may never happen. Keep in the sunlight. — Benjamin Franklin",
];

const challenges = [
  { id: '1', text: 'Practice 5-minute deep breathing' },
  { id: '2', text: 'Write 3 things you are grateful for' },
  { id: '3', text: 'Take a 15-minute nature walk' },
  { id: '4', text: 'Try a grounding exercise (5-4-3-2-1)' },
  { id: '5', text: 'Journal about your feelings for 10 minutes' },
  { id: '6', text: 'Call or text someone you care about' },
];

export default function Anxiety() {
  const [activeTab, setActiveTab] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState({});
  const [moodLogs, setMoodLogs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.userId) {
      api.getMoodLogs(user.userId).then(setMoodLogs).catch(() => {});
      api.getChallenges(user.userId, 'anxiety').then(data => {
        const map = {};
        data.forEach(c => { map[c.challenge_id] = !!c.completed; });
        setCompletedChallenges(map);
      }).catch(() => {});
    }
  }, [user]);

  const logMood = async (emoji) => {
    const date = new Date().toISOString().split('T')[0];
    const newLog = { mood: emoji, date };
    setMoodLogs(prev => {
      const filtered = prev.filter(l => l.date !== date);
      return [...filtered, newLog];
    });
    if (user?.userId) {
      try { await api.logMood(user.userId, emoji, date); } catch {}
    }
  };

  const toggleChallenge = async (id) => {
    const newState = !completedChallenges[id];
    setCompletedChallenges(prev => ({ ...prev, [id]: newState }));
    if (user?.userId) {
      try { await api.updateChallenge(user.userId, id, 'anxiety', newState); } catch {}
    }
  };

  return (
    <div className="page">
      <Navbar />
      <Particles count={40} colors={['rgba(76,175,80,0.2)', 'rgba(0,240,255,0.2)']} />

      <div className="page-content">
        <section className="hero" style={{ minHeight: '25vh' }}>
          <h1>🌿 Anxiety Relief Hub</h1>
          <p>Resources and tools to help you manage anxiety effectively</p>
        </section>

        {/* Tabs */}
        <div className="tabs">
          {tabs.map((tab, i) => (
            <button key={i} className={`tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{tab}</button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="wellness-content">
          {/* Stories */}
          {activeTab === 0 && (
            <div className="grid-2">
              {successStories.map((s, i) => (
                <div key={i} className="card">
                  <h3 style={{ color: 'var(--positive)' }}>{s.name}</h3>
                  <small style={{ color: 'var(--text-muted)' }}>{s.subtitle}</small>
                  <p style={{ marginTop: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{s.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Fiction */}
          {activeTab === 1 && (
            <div className="grid-2">
              {fictionStories.map((s, i) => (
                <div key={i} className="card">
                  <h3 style={{ color: 'var(--neon-cyan)' }}>{s.title}</h3>
                  <p style={{ marginTop: 8, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{s.content}</p>
                  <div className="story-lesson">💡 {s.lesson}</div>
                </div>
              ))}
            </div>
          )}

          {/* Quotes */}
          {activeTab === 2 && (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--neon-cyan)', lineHeight: 1.7, marginBottom: 20 }}>
                "{dailyQuotes[quoteIndex]}"
              </p>
              <div className="progress-bar" style={{ marginBottom: 16 }}>
                <div className="progress-fill" style={{ width: `${((quoteIndex + 1) / dailyQuotes.length) * 100}%` }} />
              </div>
              <button className="btn btn-secondary" onClick={() => setQuoteIndex((quoteIndex + 1) % dailyQuotes.length)}>
                Next Quote ({quoteIndex + 1}/{dailyQuotes.length})
              </button>
            </div>
          )}

          {/* Guided */}
          {activeTab === 3 && (
            <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>
              <iframe
                width="100%"
                height="400"
                src="https://www.youtube.com/embed/O-6f5wQXSu8"
                title="Guided Anxiety Relief"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}

          {/* Challenges */}
          {activeTab === 4 && (
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

          {/* Mood Tracker */}
          {activeTab === 5 && (
            <div className="card" style={{ padding: 32 }}>
              <h3 style={{ marginBottom: 16, color: 'var(--neon-cyan)' }}>How are you feeling today?</h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
                {['😊', '😢', '😠', '😨', '😌', '😴'].map(emoji => (
                  <button key={emoji} className="mood-option" onClick={() => logMood(emoji)} style={{ fontSize: '1.5rem', padding: '12px 16px' }}>
                    {emoji}
                  </button>
                ))}
              </div>
              <h4 style={{ marginBottom: 12, color: 'var(--text-muted)' }}>Last 7 Days</h4>
              <MoodCalendar moodLogs={moodLogs} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
