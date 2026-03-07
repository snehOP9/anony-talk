import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../utils/api';
import Navbar from '../components/Navbar';
import Particles from '../components/Particles';
import '../styles/profile.css';

export default function ViewProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      // Try server first, then localStorage
      if (user?.userId) {
        try {
          const p = await api.getProfile(user.userId);
          setProfile(p);
          return;
        } catch {}
      }
      const local = localStorage.getItem('anonProfile');
      if (local) {
        setProfile(JSON.parse(local));
      } else {
        navigate('/profile/edit');
      }
    };
    loadProfile();
  }, [user, navigate]);

  if (!profile) return null;

  return (
    <div className={`page theme-${profile.theme || 'default'} ${profile.ghost ? 'ghost-mode' : ''}`}>
      <Navbar />
      <Particles count={40} />
      <div className="page-content">
        <div className="profile-view-container glass">
          <div className="profile-header">
            <img src={profile.avatar} alt="Avatar" className="profile-avatar-large" />
            <h2 className="glow-text">{profile.nickname || 'Anonymous'}</h2>
          </div>

          <div className="profile-details">
            <div className="profile-row">
              <span className="label">Mood</span>
              <span className="value">{profile.mood}</span>
            </div>
            <div className="profile-row">
              <span className="label">Currently Vibing To</span>
              <span className="value">{profile.song || '—'}</span>
            </div>
            <div className="profile-row">
              <span className="label">Fun Fact</span>
              <span className="value">{profile.funfact}</span>
            </div>
            <div className="profile-row">
              <span className="label">Ghost Mode</span>
              <span className="value">{profile.ghost ? '👻 Active' : '🟢 Visible'}</span>
            </div>
          </div>

          <Link to="/profile/edit" className="btn btn-glow" style={{ width: '100%', justifyContent: 'center', marginTop: 24 }}>
            ✏️ Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
