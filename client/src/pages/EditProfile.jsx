import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../utils/api';
import Navbar from '../components/Navbar';
import Particles from '../components/Particles';
import '../styles/profile.css';

const avatarSeeds = ['Kingston', 'Mason', 'Eliza', 'Eden', 'Christian', 'Jocelyn', 'George'];
const moods = ['😎 Chill', '💀 Dead Inside', '🧠 Overthinking', '✨ Manifesting', '😈 Chaos Mode'];
const funfacts = [
  'I eat cereal with a fork 🥣',
  'I talk to my plants 🌿',
  'I have 47 unread messages 📱',
  'My screen time is... classified 🕵️',
  'I name my WiFi networks 📶',
  'I rehearse arguments in the shower 🚿',
];
const themes = ['default', 'cyberpunk', 'midnight', 'pastel'];

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=Kingston`,
    nickname: '',
    mood: moods[0],
    song: '',
    funfact: funfacts[0],
    ghost: false,
    theme: 'default',
  });

  useEffect(() => {
    if (user?.userId) {
      api.getProfile(user.userId).then(setProfile).catch(() => {});
    }
  }, [user]);

  const selectAvatar = (seed) => {
    setProfile(p => ({ ...p, avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}` }));
  };

  const handleSave = async () => {
    if (user?.userId) {
      try {
        await api.saveProfile(user.userId, profile);
      } catch {}
    }
    // Also save locally for offline access
    localStorage.setItem('anonProfile', JSON.stringify(profile));
    navigate('/profile');
  };

  return (
    <div className="page">
      <Navbar />
      <Particles count={40} />
      <div className="page-content">
        <h1 className="section-title" style={{ textAlign: 'center', marginBottom: 32 }}>✏️ Edit Anonymous Profile</h1>

        <div className="edit-profile-container glass">
          {/* Avatar Preview */}
          <div className="avatar-preview">
            <img src={profile.avatar} alt="Avatar" className="profile-avatar-large" />
            <div className="preview-name">{profile.nickname || 'Anonymous'}</div>
          </div>

          {/* Avatar Selection */}
          <div className="form-group">
            <label>Choose Avatar</label>
            <div className="avatar-grid">
              {avatarSeeds.map(seed => (
                <img
                  key={seed}
                  src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`}
                  alt={seed}
                  className={`avatar-option ${profile.avatar.includes(seed) ? 'selected' : ''}`}
                  onClick={() => selectAvatar(seed)}
                />
              ))}
            </div>
          </div>

          {/* Nickname */}
          <div className="form-group">
            <label>Nickname</label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter anonymous nickname"
              value={profile.nickname || ''}
              onChange={(e) => setProfile(p => ({ ...p, nickname: e.target.value }))}
            />
          </div>

          {/* Mood */}
          <div className="form-group">
            <label>Current Mood</label>
            <select className="input-field" value={profile.mood || ''} onChange={(e) => setProfile(p => ({ ...p, mood: e.target.value }))}>
              {moods.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Song */}
          <div className="form-group">
            <label>Currently Vibing To</label>
            <input
              type="text"
              className="input-field"
              placeholder="What song are you listening to?"
              value={profile.song || ''}
              onChange={(e) => setProfile(p => ({ ...p, song: e.target.value }))}
            />
          </div>

          {/* Fun Fact */}
          <div className="form-group">
            <label>Fun Fact</label>
            <select className="input-field" value={profile.funfact || ''} onChange={(e) => setProfile(p => ({ ...p, funfact: e.target.value }))}>
              {funfacts.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          {/* Theme */}
          <div className="form-group">
            <label>Theme</label>
            <select className="input-field" value={profile.theme || 'default'} onChange={(e) => setProfile(p => ({ ...p, theme: e.target.value }))}>
              {themes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>

          {/* Ghost Mode */}
          <div className="form-group ghost-toggle">
            <label>
              <input
                type="checkbox"
                checked={profile.ghost || false}
                onChange={(e) => setProfile(p => ({ ...p, ghost: e.target.checked }))}
              />
              <span>👻 Ghost Mode</span>
            </label>
          </div>

          <button className="btn btn-glow" style={{ width: '100%', marginTop: 16 }} onClick={handleSave}>
            Save & View Profile
          </button>
        </div>
      </div>
    </div>
  );
}
