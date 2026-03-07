import { Link } from 'react-router-dom';
import Particles from '../components/Particles';
import '../styles/intro.css';

export default function Intro() {
  return (
    <div className="intro-page">
      <Particles count={100} />

      <nav className="intro-nav">
        <div className="logo">🧠 AnonyTalk</div>
        <div className="intro-nav-links">
          <Link to="/login">Login</Link>
          <Link to="/dashboard" className="btn btn-glow" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
            Start Talking →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero intro-hero">
        <h1>Your Safe Space.<br />Your Story.</h1>
        <p>
          A sanctuary where you can speak freely, find support, and connect with a
          global community of understanding souls — completely anonymous.
        </p>
        <div className="hero-buttons">
          <Link to="/dashboard" className="btn btn-primary">Enter Dashboard</Link>
          <Link to="/explore" className="btn btn-secondary">Explore Resources</Link>
        </div>
      </section>

      {/* Carousel Cards */}
      <section className="carousel-section">
        <div className="carousel">
          <div className="carousel-card">
            <div className="card-icon">💬</div>
            <h3>Speak Freely</h3>
            <p>Express yourself without fear of judgment in a safe, encrypted environment.</p>
          </div>
          <div className="carousel-card">
            <div className="card-icon">💧</div>
            <h3>Emotional Release</h3>
            <p>Let go of bottled emotions through writing, sharing, and community support.</p>
          </div>
          <div className="carousel-card">
            <div className="card-icon">🔒</div>
            <h3>True Anonymity</h3>
            <p>Zero-knowledge architecture ensures your identity stays completely private.</p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="vision-section">
        <h2 className="section-title">Our Vision</h2>
        <p>
          We believe everyone deserves a space to be heard. AnonyTalk bridges the gap
          between silence and support, offering mental health resources, anonymous
          community interaction, and AI-powered assistance — all without ever knowing
          who you are.
        </p>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <h2 className="section-title">Core Features</h2>
        <div className="grid-4">
          {[
            { icon: '🕵️', title: 'Complete Anonymity', desc: 'No personal data required. Ever.' },
            { icon: '🔐', title: 'Encrypted Space', desc: 'Your conversations stay private and secure.' },
            { icon: '🤖', title: 'AI Support', desc: 'Real-time AI chatbot for instant help.' },
            { icon: '🌍', title: 'Global Community', desc: '10,000+ members across 150+ countries.' },
          ].map((f, i) => (
            <div className="card feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to Start Your Journey?</h2>
        <p>Join thousands who have found their voice through AnonyTalk.</p>
        <Link to="/login" className="btn btn-glow" style={{ fontSize: '1.1rem', padding: '16px 40px' }}>
          Get Started — It's Free
        </Link>
      </section>
    </div>
  );
}
