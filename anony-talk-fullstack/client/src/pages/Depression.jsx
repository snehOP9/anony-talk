import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Particles from '../components/Particles';
import MoodCalendar from '../components/MoodCalendar';
import { useAuth } from '../context/AuthContext';
import * as api from '../utils/api';
import '../styles/wellness.css';

const tabs = ['Recovery Journeys', 'Therapeutic Fiction', 'Quotes', 'Guided', 'Challenges', 'Mood Tracker'];

const recoveryStories = [
  { name: "John's Recovery", subtitle: "10-year addiction recovery — helped 500+", content: "John struggled with addiction and depression for a decade. Through rehabilitation, community support, and sheer determination, he rebuilt his life and now runs a support group that has helped over 500 people." },
  { name: "Maria's Survival", subtitle: "Suicide attempt survivor — 7 years strong", content: "After a dark period in her life, Maria found strength through therapy, art, and the love of her family. She now advocates for mental health awareness and runs a nonprofit." },
];

const fictionStories = [
  { title: 'The Unexpected Podcast Host', content: 'A socially anxious programmer starts an anonymous podcast about mental health. The anonymity gives her confidence, and she discovers how many people share similar struggles.', lesson: 'Anonymity can be a stepping stone to confidence.' },
  { title: "The CEO's Sabbatical", content: 'A burnt-out CEO takes a sabbatical to an ashram in India. No phone, no emails — just meditation and cultural immersion. She returns with a completely new perspective on success.', lesson: 'Disconnecting can be the most productive thing you do.' },
];

const dailyQuotes = [
  "Even the darkest night will end, and the sun will rise. — Victor Hugo",
  "In the midst of winter, I found there was, within me, an invincible summer. — Albert Camus",
  "The wound is the place where the Light enters you. — Rumi",
  "You are not your illness. You have an individual story to tell. — Julian Seifter",
  "There is hope, even when your brain tells you there isn't. — John Green",
];

const challenges = [
  { id: '1', text: 'Get out of bed and take a shower' },
  { id: '2', text: 'Eat a nutritious meal today' },
  { id: '3', text: 'Send one message to someone you care about' },
  { id: '4', text: 'Listen to one uplifting song' },
  { id: '5', text: 'Write one positive thing about yourself' },
  { id: '6', text: 'Spend 10 minutes outside in sunlight' },
];

export default function Depression() {
  const [activeTab, setActiveTab] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState({});
  const [moodLogs, setMoodLogs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.userId) {
      api.getMoodLogs(user.userId).then(setMoodLogs).catch(() => {});
      api.getChallenges(user.userId, 'depression').then(data => {
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
      try { await api.updateChallenge(user.userId, id, 'depression', newState); } catch {}
    }
  };

  return (
    <div className="page">
      <Navbar />
      <Particles count={40} colors={['rgba(33,150,243,0.2)', 'rgba(168,85,247,0.2)']} />

      <div className="page-content">
        <section className="hero" style={{ minHeight: '25vh' }}>
          <h1>💙 Mindful Space</h1>
          <p>A gentle place for healing, recovery, and finding hope</p>
        </section>

        <div className="tabs">
          {tabs.map((tab, i) => (
            <button key={i} className={`tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{tab}</button>
          ))}
        </div>

        <div className="wellness-content">
          {activeTab === 0 && (
            <div className="grid-2">
              {recoveryStories.map((s, i) => (
                <div key={i} className="card">
                  <h3 style={{ color: 'var(--neon-purple)' }}>{s.name}</h3>
                  <small style={{ color: 'var(--text-muted)' }}>{s.subtitle}</small>
                  <p style={{ marginTop: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{s.content}</p>
                </div>
              ))}
            </div>
          )}

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

          {activeTab === 2 && (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--neon-purple)', lineHeight: 1.7, marginBottom: 20 }}>
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

          {activeTab === 3 && (
            <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>
              <iframe
                width="100%"
                height="400"
                src="https://www.youtube.com/embed/XiCrniLQGYc"
                title="Depression Support Guided Session"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}

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

          {activeTab === 5 && (
            <div className="card" style={{ padding: 32 }}>
              <h3 style={{ marginBottom: 16, color: 'var(--neon-purple)' }}>How are you feeling today?</h3>
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
