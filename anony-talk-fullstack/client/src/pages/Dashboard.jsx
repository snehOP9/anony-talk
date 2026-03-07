import { useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Particles from '../components/Particles';
import '../styles/dashboard.css';

const moodQuestions = [
  { question: "How are you feeling right now?", options: ["😊 Happy", "😢 Sad", "😠 Angry", "😨 Anxious", "😌 Peaceful", "😴 Tired"] },
  { question: "How was your day?", options: ["🌟 Great", "👍 Good", "😐 Okay", "👎 Tough", "💀 Terrible"] },
  { question: "What do you need most right now?", options: ["💬 Someone to talk to", "🤗 Comfort", "🎯 Motivation", "😴 Rest", "🎉 Fun"] },
];

const affirmations = [
  { text: "You are enough just as you are.", author: "AnonyTalk" },
  { text: "Your feelings are valid and important.", author: "AnonyTalk" },
  { text: "It's okay to not be okay sometimes.", author: "AnonyTalk" },
  { text: "You have survived 100% of your bad days so far.", author: "AnonyTalk" },
  { text: "Progress, not perfection, is what matters.", author: "AnonyTalk" },
  { text: "You are stronger than you think.", author: "AnonyTalk" },
  { text: "Your voice matters and deserves to be heard.", author: "AnonyTalk" },
  { text: "Self-care is not selfish—it's essential.", author: "AnonyTalk" },
  { text: "You are worthy of love and belonging.", author: "AnonyTalk" },
  { text: "This feeling is temporary. Brighter days are ahead.", author: "AnonyTalk" },
];

export default function Dashboard() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [affirmation, setAffirmation] = useState(() => affirmations[Math.floor(Math.random() * affirmations.length)]);

  const selectAnswer = useCallback((answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (currentQ + 1 >= moodQuestions.length) {
      setShowResult(true);
    } else {
      setCurrentQ(currentQ + 1);
    }
  }, [answers, currentQ]);

  const resetMood = () => {
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
  };

  const getMoodResult = () => {
    const first = answers[0] || '';
    if (first.includes('Happy') || first.includes('Peaceful')) {
      return { emoji: '😊', text: "It's wonderful that you're feeling positive! Remember to spread that joy to others who might need it." };
    } else if (first.includes('Sad') || first.includes('Tired')) {
      return { emoji: '🤗', text: "It's okay to feel this way. You're not alone, and your feelings are valid. Consider reaching out to someone you trust." };
    } else if (first.includes('Angry')) {
      return { emoji: '🧘', text: "Anger is a natural emotion. Try to find healthy ways to express it, like journaling or physical activity." };
    } else if (first.includes('Anxious')) {
      return { emoji: '🌬️', text: "Anxiety can be challenging. Remember to breathe deeply and focus on the present moment." };
    }
    return { emoji: '💖', text: "Your emotions are complex and valid. Remember that it's okay to feel whatever you're feeling right now." };
  };

  const refreshAffirmation = () => {
    setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
  };

  return (
    <div className="page">
      <Navbar />
      <Particles count={80} />

      <div className="page-content">
        {/* Welcome */}
        <section className="dashboard-welcome">
          <h1 className="glow-text">Welcome to AnonyTalk</h1>
          <p>Your anonymous sanctuary for mental wellness and support</p>
        </section>

        {/* Mood Test */}
        <section className="dashboard-section">
          <h2 className="section-title">🧠 Quick Mood Check</h2>
          <div className="card mood-test-card">
            {!showResult ? (
              <div className="mood-question">
                <h3>{moodQuestions[currentQ].question}</h3>
                <div className="mood-options">
                  {moodQuestions[currentQ].options.map((opt) => (
                    <button key={opt} className="mood-option" onClick={() => selectAnswer(opt)}>
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="mood-progress">
                  Question {currentQ + 1} of {moodQuestions.length}
                </div>
              </div>
            ) : (
              <div className="mood-result">
                <div className="result-emoji">{getMoodResult().emoji}</div>
                <p className="result-text">{getMoodResult().text}</p>
                <button className="btn btn-secondary" onClick={resetMood}>Take Again</button>
              </div>
            )}
          </div>
        </section>

        {/* Affirmation */}
        <section className="dashboard-section">
          <h2 className="section-title">✨ Daily Affirmation</h2>
          <div className="card affirmation-card">
            <p className="affirmation-text">"{affirmation.text}"</p>
            <span className="affirmation-author">— {affirmation.author}</span>
            <button className="btn btn-secondary" onClick={refreshAffirmation} style={{ marginTop: 16 }}>
              <i className="fas fa-sync-alt"></i> New Affirmation
            </button>
          </div>
        </section>

        {/* Community Stats */}
        <section className="dashboard-section">
          <h2 className="section-title">🌍 Community</h2>
          <div className="grid-4">
            {[
              { number: '10K+', label: 'Active Users' },
              { number: '500K+', label: 'Messages Sent' },
              { number: '150+', label: 'Countries' },
              { number: '24/7', label: 'Support Available' },
            ].map((stat, i) => (
              <div className="card stat-card" key={i}>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
