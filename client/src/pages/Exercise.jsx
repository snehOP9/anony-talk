import { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Particles from '../components/Particles';
import '../styles/exercise.css';

export default function Exercise() {
  const [exerciseRunning, setExerciseRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [dotPos, setDotPos] = useState({ x: 50, y: 50 });
  const intervalRef = useRef(null);
  const dotRef = useRef(null);
  const stepRef = useRef(0);

  // 8-point circular path
  const getPoint = useCallback((step) => {
    const angle = (step / 8) * Math.PI * 2;
    const radius = 30;
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    };
  }, []);

  useEffect(() => {
    if (!exerciseRunning) return;

    const timerInterval = setInterval(() => setTimer(t => t + 1), 1000);
    const moveInterval = setInterval(() => {
      stepRef.current = (stepRef.current + 1) % 8;
      setDotPos(getPoint(stepRef.current));
    }, 2000);

    return () => {
      clearInterval(timerInterval);
      clearInterval(moveInterval);
    };
  }, [exerciseRunning, getPoint]);

  const startExercise = () => {
    setExerciseRunning(true);
  };

  const stopExercise = () => {
    setExerciseRunning(false);
  };

  const resetExercise = () => {
    setExerciseRunning(false);
    setTimer(0);
    stepRef.current = 0;
    setDotPos({ x: 50, y: 50 });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const wellnessCards = [
    { icon: '🌬️', title: 'Mindful Breathing', desc: 'Practice deep breathing exercises to calm your nervous system.' },
    { icon: '🌙', title: 'Moon Sleep', desc: 'Wind down with relaxation techniques before bed.' },
    { icon: '💪', title: 'Muscle Relaxation', desc: 'Progressive muscle relaxation to release physical tension.' },
    { icon: '🧘', title: 'Stretching', desc: 'Gentle stretching routines for body and mind.' },
  ];

  return (
    <div className="page">
      <Navbar />
      <Particles count={30} colors={['rgba(0,240,255,0.2)', 'rgba(79,255,208,0.2)']} />

      <div className="page-content">
        <section className="hero" style={{ minHeight: '25vh' }}>
          <h1>🧘 Wellness & Eye Care Hub</h1>
          <p>Exercise your eyes, relax your mind, rejuvenate your body</p>
        </section>

        {/* Eye Exercise */}
        <section className="dashboard-section">
          <h2 className="section-title">👁️ Eye Exercise</h2>
          <div className="card eye-exercise-card">
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
              Follow the dot with your eyes to relieve strain
            </p>
            <div className="eye-exercise-container">
              <div
                ref={dotRef}
                className="eye-dot"
                style={{
                  left: `${dotPos.x}%`,
                  top: `${dotPos.y}%`,
                  transition: 'left 2s ease-in-out, top 2s ease-in-out',
                }}
              />
            </div>
            <div className="exercise-timer">{formatTime(timer)}</div>
            <div className="exercise-controls">
              {!exerciseRunning ? (
                <button className="btn btn-glow" onClick={startExercise}>▶ Start</button>
              ) : (
                <button className="btn btn-secondary" onClick={stopExercise}>⏸ Pause</button>
              )}
              <button className="btn btn-secondary" onClick={resetExercise}>🔄 Reset</button>
            </div>
          </div>
        </section>

        {/* Guided Video */}
        <section className="dashboard-section">
          <h2 className="section-title">🎬 Guided Session</h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>
            <iframe
              width="100%"
              height="400"
              src="https://www.youtube.com/embed/O-6f5wQXSu8"
              title="Anxiety Relief Guided Session"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </section>

        {/* Wellness Cards */}
        <section className="dashboard-section">
          <h2 className="section-title">🌿 Wellness Activities</h2>
          <div className="grid-2">
            {wellnessCards.map((w, i) => (
              <div className="card wellness-card" key={i}>
                <div className="wellness-icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
