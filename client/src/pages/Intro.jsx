import { useNavigate, Link } from 'react-router-dom';
import Particles from '../components/Particles';
import '../styles/intro.css';

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI Mental Health Chat',
    desc: 'Talk to our always-available AI companion. Vent, reflect, or ask for coping strategies — no judgment, 24/7.',
    route: '/bot',
    accent: 'cyan',
  },
  {
    icon: '🌐',
    title: 'Community Feed',
    desc: 'Post anonymously, read others\' stories, and give upvotes. You are never alone in what you feel.',
    route: '/feed',
    accent: 'purple',
  },
  {
    icon: '🔍',
    title: 'Explore Resources',
    desc: 'Curated mental health articles, tips, and tools — all in one place to guide your wellness journey.',
    route: '/explore',
    accent: 'pink',
  },
  {
    icon: '🎮',
    title: 'Wellness Games',
    desc: 'Fun mini-games designed to lift your mood, sharpen focus, and help you relax in minutes.',
    route: '/games',
    accent: 'teal',
  },
  {
    icon: '📖',
    title: 'Real Anonymous Stories',
    desc: 'Read raw, real stories shared by people just like you. Share yours and feel heard.',
    route: '/stories',
    accent: 'cyan',
  },
  {
    icon: '💪',
    title: 'Exercise & Wellness',
    desc: 'Breathing exercises, mindfulness routines, and physical activity guides tailored for mental wellness.',
    route: '/exercise',
    accent: 'purple',
  },
  {
    icon: '😰',
    title: 'Anxiety Support',
    desc: 'Guided techniques, calming exercises, and a supportive space to manage anxiety day by day.',
    route: '/anxiety',
    accent: 'pink',
  },
  {
    icon: '🌧️',
    title: 'Depression Help',
    desc: 'Resources, mood tracking, and community connection to help you find light on harder days.',
    route: '/depression',
    accent: 'teal',
  },
  {
    icon: '💑',
    title: 'Relationship Advice',
    desc: 'Navigate friendships, romance, and family dynamics with peer advice and guided content.',
    route: '/relationship',
    accent: 'cyan',
  },
  {
    icon: '💡',
    title: 'Daily Motivation',
    desc: 'Start every day with a fresh dose of inspiration, affirmations, and micro-challenges.',
    route: '/motivation',
    accent: 'purple',
  },
  {
    icon: '📊',
    title: 'Mood Tracker',
    desc: 'Log your mood daily and watch your emotional patterns — understanding yourself is the first step.',
    route: '/dashboard',
    accent: 'pink',
  },
  {
    icon: '👥',
    title: 'Social Space',
    desc: 'Meet like-minded people in a safe, anonymous social environment built around empathy.',
    route: '/social',
    accent: 'teal',
  },
];

const STEPS = [
  {
    num: '01',
    icon: '👤',
    title: 'Create an Anonymous Account',
    desc: 'Sign up with just a nickname and email — or skip entirely and join as a Ghost. No real name, no phone number, no tracking.',
  },
  {
    num: '02',
    icon: '🗺️',
    title: 'Explore Your Space',
    desc: 'Browse 12+ features built for mental wellness — from AI chat and community posts to games and support guides.',
  },
  {
    num: '03',
    icon: '🌱',
    title: 'Grow at Your Own Pace',
    desc: 'Track your mood, share your story, find support, and build resilience — all on your own terms, completely privately.',
  },
];

const STATS = [
  { val: '100%', label: 'Anonymous' },
  { val: '12+', label: 'Features' },
  { val: '24/7', label: 'AI Support' },
  { val: 'Free', label: 'Forever' },
];

export default function Intro() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const goTo = (route) => {
    if (isLoggedIn) navigate(route);
    else navigate('/auth');
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="lp-root">
      <Particles count={60} />

      {/* ── Navbar ── */}
      <nav className="lp-nav">
        <div className="lp-nav-logo">
          <span>🧠</span>
          <span className="lp-logo-text">AnonyTalk</span>
        </div>
        <div className="lp-nav-links">
          <button className="lp-nav-link" onClick={() => scrollTo('features')}>Features</button>
          <button className="lp-nav-link" onClick={() => scrollTo('how')}>How It Works</button>
          <Link to="/auth" className="lp-btn-outline">Log In</Link>
          <Link to="/auth" className="lp-btn-solid">Get Started Free →</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-badge">No name. No judgment. Just you.</div>
        <h1 className="lp-hero-title">
          A place to talk<br />
          <span className="lp-gradient-text">when you can't out loud</span>
        </h1>
        <p className="lp-hero-sub">
          AnonyTalk is for teens and young adults who need somewhere real to go.
          Vent, reflect, find support — fully anonymous, completely free, no strings attached.
        </p>
        <div className="lp-hero-cta">
          <Link to="/auth" className="lp-btn-solid lp-btn-lg">Get Started — It's Free</Link>
          <button className="lp-btn-ghost-lg" onClick={() => scrollTo('features')}>
            See What's Inside ↓
          </button>
        </div>

        <div className="lp-stats">
          {STATS.map((s) => (
            <div key={s.label} className="lp-stat">
              <span className="lp-stat-val">{s.val}</span>
              <span className="lp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="lp-section" id="how">
        <div className="lp-section-inner">
          <p className="lp-eyebrow">Simple &amp; Private</p>
          <h2 className="lp-section-title">How AnonyTalk Works</h2>
          <p className="lp-section-sub">Three steps to your safe space. No ID required.</p>

          <div className="lp-steps">
            {STEPS.map((s) => (
              <div key={s.num} className="lp-step">
                <div className="lp-step-num">{s.num}</div>
                <div className="lp-step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="lp-section lp-section-dark" id="features">
        <div className="lp-section-inner">
          <p className="lp-eyebrow">Everything You Need</p>
          <h2 className="lp-section-title">12 Features, One Platform</h2>
          <p className="lp-section-sub">
            Every tool below is designed specifically for mental wellness. Click any card to explore.
          </p>

          <div className="lp-features-grid">
            {FEATURES.map((f) => (
              <div key={f.route} className={`lp-feature-card lp-accent-${f.accent}`}>
                <div className="lp-feature-icon">{f.icon}</div>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-desc">{f.desc}</p>
                <button
                  className={`lp-feature-btn lp-feature-btn-${f.accent}`}
                  onClick={() => goTo(f.route)}
                >
                  {isLoggedIn ? 'Open →' : 'Explore →'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Support Highlight ── */}
      <section className="lp-section">
        <div className="lp-section-inner">
          <p className="lp-eyebrow">We've Got You</p>
          <h2 className="lp-section-title">Dedicated Mental Health Support</h2>
          <p className="lp-section-sub">
            Three focused spaces for the most common struggles young people face.
          </p>

          <div className="lp-support-row">
            <div className="lp-support-card lp-support-anxiety" onClick={() => goTo('/anxiety')}>
              <div className="lp-support-icon">😰</div>
              <h3>Anxiety</h3>
              <p>Breathing techniques, grounding exercises, and peer stories to calm racing thoughts.</p>
              <span className="lp-support-link">Explore Anxiety Support →</span>
            </div>
            <div className="lp-support-card lp-support-depression" onClick={() => goTo('/depression')}>
              <div className="lp-support-icon">🌧️</div>
              <h3>Depression</h3>
              <p>Resources, mood calendars, and community warmth to help you through hard days.</p>
              <span className="lp-support-link">Explore Depression Help →</span>
            </div>
            <div className="lp-support-card lp-support-relationship" onClick={() => goTo('/relationship')}>
              <div className="lp-support-icon">💑</div>
              <h3>Relationships</h3>
              <p>Advice on navigating friendships, family, romance, and self-worth.</p>
              <span className="lp-support-link">Explore Relationship Advice →</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Privacy Promise ── */}
      <section className="lp-section lp-section-dark">
        <div className="lp-section-inner lp-privacy">
          <div className="lp-privacy-icon">🔐</div>
          <h2 className="lp-section-title">Your Privacy is Non-Negotiable</h2>
          <p className="lp-privacy-text">
            We built AnonyTalk on one principle:{' '}
            <strong>you should never have to reveal yourself to get help.</strong>{' '}
            No real names, no phone numbers, no tracking, no ads. Your data stays with you.
            Even our team cannot see your identity. You can even join as a Ghost — no account needed at all.
          </p>
          <div className="lp-privacy-pills">
            <span>🚫 No Real Name Required</span>
            <span>🔒 End-to-End Private</span>
            <span>👻 Ghost Mode Available</span>
            <span>📵 No Ads, No Tracking</span>
            <span>🆓 Completely Free</span>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta">
        <div className="lp-cta-glow" />
        <p className="lp-eyebrow">Whenever you're ready</p>
        <h2 className="lp-cta-title">Someone's always here</h2>
        <p className="lp-cta-sub">
          No pressure, no timeline. Come as you are — and say whatever you need to say.
        </p>
        <div className="lp-cta-buttons">
          <Link to="/auth" className="lp-btn-solid lp-btn-lg">Start Talking — Free</Link>
          <Link to="/auth" className="lp-btn-outline lp-btn-lg">👻 Skip Sign Up, Join as Ghost</Link>
        </div>
        <p className="lp-crisis">
          Feeling unsafe right now? Please reach out — iCall India{' '}
          <a href="tel:9152987821">9152987821</a>
        </p>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <span>🧠 AnonyTalk · Built with care for young minds</span>
        <span>© 2026 · Free · Private · Always</span>
      </footer>
    </div>
  );
}
