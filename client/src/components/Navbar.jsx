import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="logo">🧠 AnonyTalk</Link>
      <ul className="nav-links">
        <li><Link to="/dashboard" className={isActive('/dashboard')}>Home</Link></li>
        <li><Link to="/explore" className={isActive('/explore')}>Explore</Link></li>
        <li><Link to="/bot" className={isActive('/bot')}>AI Chat</Link></li>
        <li><Link to="/feed" className={isActive('/feed')}>Community</Link></li>
        <li><Link to="/teen-space" className={isActive('/teen-space')}>Teen Space</Link></li>
        <li><Link to="/profile" className={isActive('/profile')}>Profile</Link></li>
        {user ? (
          <>
            <li style={{ fontSize: '0.85rem', opacity: 0.8 }}>👋 {user.username}</li>
            <li>
              <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={logout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <li><Link to="/login" className={`btn btn-primary ${isActive('/login')}`} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Login</Link></li>
        )}
      </ul>
    </nav>
  );
}
