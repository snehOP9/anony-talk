import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../utils/api';
import Particles from '../components/Particles';
import '../styles/login.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [anonId, setAnonId] = useState('');
  const [key, setKey] = useState('');
  const [message, setMessage] = useState({ text: '', color: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const showMsg = (text, color = 'var(--neon-cyan)') => {
    setMessage({ text, color });
    setTimeout(() => setMessage({ text: '', color: '' }), 3000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!anonId.trim() || !key.trim()) return showMsg('All fields are required', 'red');
    setLoading(true);
    try {
      await api.register(anonId.trim(), key.trim());
      showMsg('Identity generated successfully!');
      setTimeout(() => { setIsLogin(true); setAnonId(''); setKey(''); }, 1000);
    } catch (err) {
      showMsg(err.message, 'red');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!anonId.trim() || !key.trim()) return showMsg('Please fill in both fields', 'red');
    setLoading(true);
    showMsg('Decrypting...');
    try {
      const data = await api.login(anonId.trim(), key.trim());
      login({ userId: data.userId, anonymousId: data.anonymousId });
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      showMsg(err.message, 'red');
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setAnonId('');
    setKey('');
    setMessage({ text: '', color: '' });
  };

  return (
    <div className="login-page">
      <Particles count={60} />

      <div className="login-container glass">
        <div className="login-header">
          <div className="lock-icon">🔐</div>
          <h1>{isLogin ? 'Access Secure Channel' : 'Create Anonymous Identity'}</h1>
          <p>{isLogin ? 'Enter your credentials to decrypt' : 'Generate your unique anonymous identity'}</p>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <div className="form-group">
            <label>{isLogin ? 'Anonymous ID' : 'Unique Identifier'}</label>
            <input
              type="text"
              className="input-field"
              placeholder={isLogin ? 'Enter your Anonymous ID' : 'Choose a unique identifier'}
              value={anonId}
              onChange={(e) => setAnonId(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>{isLogin ? 'Verification Code' : 'Encryption Key'}</label>
            <input
              type="password"
              className="input-field"
              placeholder={isLogin ? 'Enter verification code' : 'Create an encryption key'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>

          {message.text && (
            <div className="status-message" style={{ color: message.color }}>
              {message.text}
            </div>
          )}

          <button type="submit" className="btn btn-glow login-btn" disabled={loading}>
            {loading ? '...' : isLogin ? 'Decrypt & Enter' : 'Generate Identity'}
          </button>
        </form>

        <div className="form-toggle">
          <span>{isLogin ? "Don't have an identity?" : 'Already have an identity?'}</span>
          <button className="toggle-btn" onClick={toggleForm}>
            {isLogin ? 'Create One' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
