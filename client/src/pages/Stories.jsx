import { useState } from 'react';
import Navbar from '../components/Navbar';
import Particles from '../components/Particles';
import '../styles/stories.css';

const storyCategories = [
  {
    title: '📖 Fictional Stories',
    stories: [
      { title: 'The Shy Artist', content: 'A girl who never showed her art to anyone finally submits a painting to a local exhibition — and wins. Through creative expression, she overcomes her crippling social anxiety and discovers her voice.', lesson: 'Art as expression can heal what words cannot.' },
      { title: 'The Mindful Traveler', content: 'A burned-out executive leaves everything behind for a three-month solo backpacking trip. Through encounters with strangers and nature, he discovers that mindfulness and adventure are the best therapy.', lesson: 'Sometimes you need to lose yourself to find yourself.' },
    ]
  },
  {
    title: '👤 Real Experiences',
    stories: [
      { title: "Emily's Journey: Panic to Peace", content: "For five years, Emily dealt with debilitating panic attacks. Through CBT therapy, meditation, and the support of online communities, she not only recovered but now helps over 500 others navigate their anxiety.", lesson: "5 years of recovery — now helping 500+ others." },
      { title: "Mark's Social Anxiety", content: "Mark avoided social situations for years. With gradual exposure therapy and supportive friends, he went from barely leaving his room to hosting community events.", lesson: "4 years of growth — one small step at a time." },
    ]
  },
  {
    title: '🎬 Video Stories',
    videos: [
      { title: 'Overcoming Depression', url: 'https://www.youtube.com/embed/XiCrniLQGYc' },
      { title: 'Anxiety: What It Feels Like', url: 'https://www.youtube.com/embed/BVJkf0dFfnc' },
    ]
  },
  {
    title: '✍️ Poetry & Prose',
    poems: [
      { title: 'The Storm Inside', text: 'The storm inside me rages still,\nBut I have learned to stand quite still.\nTo let the thunder roar and fade,\nAnd find the peace the storm has made.' },
      { title: 'Broken but Growing', text: 'Like kintsugi gold between the cracks,\nMy broken pieces shine right back.\nEach scar a story, each wound a guide —\nI am not broken; I am tried.' },
    ]
  },
];

export default function Stories() {
  const [activeTab, setActiveTab] = useState(0);
  const [cubeRot, setCubeRot] = useState({ x: 0, y: 0 });

  const rotateCube = (axis, deg) => {
    setCubeRot(prev => ({
      x: prev.x + (axis === 'x' ? deg : 0),
      y: prev.y + (axis === 'y' ? deg : 0),
    }));
  };

  const category = storyCategories[activeTab];

  return (
    <div className="page">
      <Navbar />
      <Particles count={40} colors={['rgba(168,85,247,0.3)', 'rgba(255,0,200,0.2)', 'rgba(0,240,255,0.2)']} />

      <div className="page-content">
        <section className="hero" style={{ minHeight: '25vh' }}>
          <h1>📖 Stories & Experiences</h1>
          <p>Healing stories, real experiences, and creative expressions</p>
        </section>

        {/* Navigation Cube */}
        <div className="cube-container">
          <div className="cube" style={{ transform: `translateZ(-150px) rotateX(${cubeRot.x}deg) rotateY(${cubeRot.y}deg)` }}>
            {storyCategories.map((cat, i) => (
              <div key={i} className="cube-face" onClick={() => setActiveTab(i)} style={{ cursor: 'pointer' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{cat.title}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cube-controls" style={{ marginBottom: 40 }}>
          <button className="cube-btn" onClick={() => rotateCube('y', -90)}>⬅</button>
          <button className="cube-btn" onClick={() => rotateCube('x', -90)}>⬆</button>
          <button className="cube-btn" onClick={() => rotateCube('x', 90)}>⬇</button>
          <button className="cube-btn" onClick={() => rotateCube('y', 90)}>➡</button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {storyCategories.map((cat, i) => (
            <button key={i} className={`tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>
              {cat.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="stories-content">
          {category.stories && category.stories.map((story, i) => (
            <div key={i} className="card story-card">
              <h3>{story.title}</h3>
              <p>{story.content}</p>
              {story.lesson && <div className="story-lesson">💡 {story.lesson}</div>}
            </div>
          ))}

          {category.videos && category.videos.map((vid, i) => (
            <div key={i} className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12, marginBottom: 24 }}>
              <iframe
                width="100%"
                height="350"
                src={vid.url}
                title={vid.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ))}

          {category.poems && category.poems.map((poem, i) => (
            <div key={i} className="card story-card poem-card">
              <h3>{poem.title}</h3>
              <pre className="poem-text">{poem.text}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
