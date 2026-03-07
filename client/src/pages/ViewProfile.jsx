import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/profile.css';

const AVATARS = [
  'Kingston', 'Mason', 'Eliza', 'Eden', 'Christian', 'Jocelyn', 'George',
  'Avery', 'Riley', 'Jordan', 'Quinn', 'Sage', 'River',
];

const INTEREST_SUGGESTIONS = [
  'Music', 'Journaling', 'Gaming', 'Art', 'Reading', 'Meditation',
  'Fitness', 'Anime', 'Nature', 'Cooking', 'Movies', 'Coding',
  'Photography', 'Dancing', 'Podcasts', 'Travel',
];

const MOOD_MAP = {
  '😊': { label: 'Happy', color: '#fbbf24' },
  '😔': { label: 'Sad', color: '#60a5fa' },
  '😤': { label: 'Frustrated', color: '#f87171' },
  '😴': { label: 'Tired', color: '#a78bfa' },
  '😰': { label: 'Anxious', color: '#34d399' },
  '😐': { label: 'Neutral', color: '#9ca3af' },
};

function getTodayMood() {
  const today = new Date();
  const key = `mood_${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  return localStorage.getItem(key);
}

function getMoodLogCount() {
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i)?.startsWith('mood_')) count++;
  }
  return count;
}

function getStreak() {
  return parseInt(localStorage.getItem('db_streak') || '0');
}

export default function ViewProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const stored = JSON.parse(localStorage.getItem('user') || '{}');
  const username = user?.username || stored.username || 'Anonymous';
  const email    = user?.email    || stored.email    || '';
  const age      = user?.age      || stored.age      || null;
  const ageGroup = user?.ageGroup || stored.ageGroup || null;

  const [extra, setExtra] = useState(() => {
    try { return JSON.parse(localStorage.getItem('profile_extra') || '{}'); } catch { return {}; }
  });

  const [avatarSeed, setAvatarSeed] = useState(extra.avatarSeed || 'Kingston');
  const [bio, setBio]               = useState(extra.bio || '');
  const [song, setSong]             = useState(extra.song || '');
  const [interests, setInterests]   = useState(extra.interests || []);
  const [newTag, setNewTag]         = useState('');
  const [editing, setEditing]       = useState(false);
  const [saved, setSaved]           = useState(false);

  const todayMood  = getTodayMood();
  const moodLogs   = getMoodLogCount();
  const streak     = getStreak();
  const moodInfo   = todayMood ? MOOD_MAP[todayMood] : null;

  const bioRef = useRef(null);

  const addInterest = (tag) => {
    const t = tag.trim();
    if (t && !interests.includes(t) && interests.length < 10) {
      setInterests(prev => [...prev, t]);
    }
    setNewTag('');
  };

  const removeInterest = (tag) => setInterests(prev => prev.filter(t => t !== tag));

  const handleSave = () => {
    const data = { avatarSeed, bio, song, interests };
    localStorage.setItem('profile_extra', JSON.stringify(data));
    setExtra(data);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${avatarSeed}`;

  return (
    <div className="pf-root">
      <Navbar />

      {/* background blobs */}
      <div className="pf-blob pf-blob-1" />
      <div className="pf-blob pf-blob-2" />
      <div className="pf-blob pf-blob-3" />

      <div className="pf-page">

        {/* ── Hero card ── */}
        <div className="pf-hero glass">
          <div className="pf-avatar-wrap">
            <img src={avatarUrl} alt="avatar" className="pf-avatar" />
            {editing && (
              <div className="pf-avatar-overlay">
                <span>change</span>
              </div>
            )}
          </div>

          <div className="pf-hero-info">
            <h1 className="pf-username">{username}</h1>
            <div className="pf-chips">
              {ageGroup && (
                <span className={`pf-chip pf-chip-${ageGroup}`}>
                  {ageGroup === 'teen' ? '🧑 Teen' : '🎓 Young Adult'}
                </span>
              )}
              {email && <span className="pf-chip pf-chip-email">✉ {email}</span>}
              {age && <span className="pf-chip pf-chip-age">🎂 Age {age}</span>}
            </div>

            {/* today's mood pill */}
            {moodInfo ? (
              <div className="pf-mood-today" style={{ '--mc': moodInfo.color }}>
                <span className="pf-mood-emoji">{todayMood}</span>
                <span>Feeling <strong>{moodInfo.label}</strong> today</span>
              </div>
            ) : (
              <div className="pf-mood-today pf-mood-none">
                <span>No mood logged today</span>
                <button className="pf-mood-link" onClick={() => navigate('/dashboard')}>Log it →</button>
              </div>
            )}
          </div>

          <div className="pf-hero-actions">
            {editing ? (
              <>
                <button className="pf-btn-save" onClick={handleSave}>
                  {saved ? '✓ Saved!' : 'Save Profile'}
                </button>
                <button className="pf-btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
              </>
            ) : (
              <button className="pf-btn-edit" onClick={() => setEditing(true)}>✏ Edit Profile</button>
            )}
            <button className="pf-btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="pf-stats-row">
          <div className="pf-stat glass">
            <span className="pf-stat-val">{streak}</span>
            <span className="pf-stat-label">🔥 Day Streak</span>
          </div>
          <div className="pf-stat glass">
            <span className="pf-stat-val">{moodLogs}</span>
            <span className="pf-stat-label">📊 Mood Logs</span>
          </div>
          <div className="pf-stat glass">
            <span className="pf-stat-val">{ageGroup === 'teen' ? '12–19' : ageGroup === 'young-adult' ? '20–25' : '—'}</span>
            <span className="pf-stat-label">👤 Age Group</span>
          </div>
          <div className="pf-stat glass">
            <span className="pf-stat-val">100%</span>
            <span className="pf-stat-label">🔒 Anonymous</span>
          </div>
        </div>

        {/* ── Body grid ── */}
        <div className="pf-body">

          {/* Avatar picker (edit mode) */}
          {editing && (
            <div className="pf-card glass pf-avatars-card">
              <h3 className="pf-card-title">Choose Avatar</h3>
              <div className="pf-avatar-grid">
                {AVATARS.map(seed => (
                  <img
                    key={seed}
                    src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`}
                    alt={seed}
                    className={`pf-avatar-opt ${avatarSeed === seed ? 'selected' : ''}`}
                    onClick={() => setAvatarSeed(seed)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* About / Bio */}
          <div className="pf-card glass">
            <h3 className="pf-card-title">About Me</h3>
            {editing ? (
              <textarea
                ref={bioRef}
                className="pf-textarea"
                placeholder="Write a little about yourself... (stays anonymous)"
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={4}
                maxLength={300}
              />
            ) : (
              <p className="pf-bio-text">{bio || <span className="pf-placeholder">Nothing yet — click Edit Profile to add a bio.</span>}</p>
            )}
          </div>

          {/* Interests */}
          <div className="pf-card glass">
            <h3 className="pf-card-title">Interests</h3>
            <div className="pf-tags">
              {interests.map(tag => (
                <span key={tag} className="pf-tag">
                  {tag}
                  {editing && (
                    <button className="pf-tag-rm" onClick={() => removeInterest(tag)}>×</button>
                  )}
                </span>
              ))}
              {interests.length === 0 && !editing && (
                <span className="pf-placeholder">No interests added yet.</span>
              )}
            </div>

            {editing && (
              <div className="pf-tag-input-row">
                <input
                  className="pf-input"
                  placeholder="Add interest..."
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addInterest(newTag)}
                  maxLength={30}
                />
                <button className="pf-btn-add-tag" onClick={() => addInterest(newTag)}>+</button>
              </div>
            )}

            {editing && (
              <div className="pf-suggestions">
                {INTEREST_SUGGESTIONS.filter(s => !interests.includes(s)).slice(0, 8).map(s => (
                  <button key={s} className="pf-suggest-tag" onClick={() => addInterest(s)}>{s}</button>
                ))}
              </div>
            )}
          </div>

          {/* Currently Listening */}
          <div className="pf-card glass">
            <h3 className="pf-card-title">🎵 Currently Listening To</h3>
            {editing ? (
              <input
                className="pf-input"
                placeholder="What song is stuck in your head?"
                value={song}
                onChange={e => setSong(e.target.value)}
                maxLength={80}
              />
            ) : (
              <p className="pf-bio-text pf-song">
                {song ? <>🎧 {song}</> : <span className="pf-placeholder">No song added yet.</span>}
              </p>
            )}
          </div>

          {/* Quick links */}
          <div className="pf-card glass pf-quicklinks-card">
            <h3 className="pf-card-title">Quick Access</h3>
            <div className="pf-quicklinks">
              {[
                { icon: '🤖', label: 'AI Chat',    route: '/bot' },
                { icon: '📊', label: 'Dashboard',  route: '/dashboard' },
                { icon: '🌐', label: 'Community',  route: '/feed' },
                { icon: '📖', label: 'Stories',    route: '/stories' },
                { icon: '🎮', label: 'Games',      route: '/games' },
                { icon: '💪', label: 'Exercise',   route: '/exercise' },
              ].map(l => (
                <button key={l.route} className="pf-ql-btn" onClick={() => navigate(l.route)}>
                  <span className="pf-ql-icon">{l.icon}</span>
                  <span className="pf-ql-label">{l.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
