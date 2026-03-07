import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Particles from '../components/Particles';
import '../styles/explore.css';

const categories = [
  { title: 'Motivation', emoji: '🔥', desc: 'Inspiring thoughts and personal revelations', path: '/motivation', color: 'rgba(255,149,0,0.2)' },
  { title: 'Exercise & Wellness', emoji: '🧘', desc: 'Wellness routines and fitness stories', path: '/exercise', color: 'rgba(0,240,255,0.2)' },
  { title: 'Stories', emoji: '📖', desc: 'Real-life battles with depression & anxiety', path: '/stories', color: 'rgba(168,85,247,0.2)' },
  { title: 'Games', emoji: '🎮', desc: 'Relaxing games for mental ease', path: '/games', color: 'rgba(255,0,200,0.2)' },
  { title: 'Anxiety Relief', emoji: '🌿', desc: 'Tools and techniques for managing anxiety', path: '/anxiety', color: 'rgba(76,175,80,0.2)' },
  { title: 'Depression Support', emoji: '💙', desc: 'Resources for navigating depression', path: '/depression', color: 'rgba(33,150,243,0.2)' },
  { title: 'Relationships', emoji: '❤️', desc: 'Building healthier connections', path: '/relationship', color: 'rgba(244,67,54,0.2)' },
  { title: 'Social Space', emoji: '💬', desc: 'Connect with the community', path: '/social', color: 'rgba(255,193,7,0.2)' },
];

export default function Explore() {
  return (
    <div className="page">
      <Navbar />
      <Particles count={50} colors={['rgba(255,149,0,0.3)', 'rgba(255,0,200,0.3)', 'rgba(168,85,247,0.3)', 'rgba(255,255,255,0.2)']} />

      <div className="page-content">
        <section className="hero" style={{ minHeight: '40vh' }}>
          <h1>Explore AnonyTalk</h1>
          <p>Discover resources, tools, and stories crafted for your mental wellness journey</p>
        </section>

        <section className="explore-grid">
          <div className="grid-2">
            {categories.map((cat, i) => (
              <Link to={cat.path} key={i} className="card explore-card" style={{ background: cat.color, borderColor: cat.color.replace('0.2', '0.4') }}>
                <div className="explore-emoji">{cat.emoji}</div>
                <h3>{cat.title}</h3>
                <p>{cat.desc}</p>
                <span className="explore-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="explore-stats">
          <div className="grid-3">
            <div className="card stat-card">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Daily Inspirations</div>
            </div>
            <div className="card stat-card">
              <div className="stat-number">95%</div>
              <div className="stat-label">Positive Feedback</div>
            </div>
            <div className="card stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
