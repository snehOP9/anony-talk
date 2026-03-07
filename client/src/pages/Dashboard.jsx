import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/dashboard.css';

// ── Constants ────────────────────────────────────────────────────────────────
const MOODS = [
  { emoji: '😊', label: 'Happy',   color: '#fbbf24' },
  { emoji: '😌', label: 'Calm',    color: '#34d399' },
  { emoji: '😰', label: 'Anxious', color: '#a78bfa' },
  { emoji: '😔', label: 'Sad',     color: '#60a5fa' },
  { emoji: '😠', label: 'Angry',   color: '#f87171' },
  { emoji: '😴', label: 'Tired',   color: '#94a3b8' },
];

const AFFIRMATIONS = [
  "You are enough, exactly as you are right now.",
  "You have survived 100% of your hardest days.",
  "It's okay to not be okay — feelings are not permanent.",
  "You are stronger and more resilient than you realise.",
  "Progress matters more than perfection. Always.",
  "Your story deserves to be told. Your voice deserves to be heard.",
  "Rest is not laziness — it's how you recharge your strength.",
  "You are worthy of love, care, and belonging.",
  "Small steps still move you forward.",
  "This feeling is temporary. You will get through it.",
  "You don't have to do everything alone.",
  "Being yourself is the bravest thing you can do.",
  "Healing is not linear — and that's completely okay.",
  "You deserve the same compassion you give to others.",
];

const QUICK_LINKS = [
  { icon: '🤖', label: 'AI Chat',    sub: 'Talk to your companion', route: '/bot',        color: '#00e5c8' },
  { icon: '🌐', label: 'Community',  sub: 'Read & share posts',     route: '/feed',       color: '#a78bfa' },
  { icon: '🔍', label: 'Explore',    sub: 'Discover resources',     route: '/explore',    color: '#f472b6' },
  { icon: '🎮', label: 'Games',      sub: 'Lift your mood',         route: '/games',      color: '#2dd4bf' },
  { icon: '💪', label: 'Wellness',   sub: 'Exercises & breathing',  route: '/exercise',   color: '#fbbf24' },
  { icon: '💡', label: 'Motivation', sub: 'Daily inspiration',      route: '/motivation', color: '#fb923c' },
  { icon: '📖', label: 'Stories',    sub: 'Real anonymous stories', route: '/stories',    color: '#818cf8' },
  { icon: '👥', label: 'Social',     sub: 'Meet like-minded people',route: '/social',     color: '#34d399' },
];

const BREATHING_PHASES = [
  { label: 'Breathe In',  secs: 4, scale: 1.4 },
  { label: 'Hold',        secs: 4, scale: 1.4 },
  { label: 'Breathe Out', secs: 4, scale: 1.0 },
];

const DEFAULT_TASKS = [
  { id: 1, icon: '💧', text: 'Drink 8 glasses of water', done: false },
  { id: 2, icon: '🚶', text: 'Take a 10-minute walk outside', done: false },
  { id: 3, icon: '📵', text: 'Phone-free time for 30 mins', done: false },
  { id: 4, icon: '💬', text: 'Tell someone you appreciate them', done: false },
  { id: 5, icon: '📝', text: 'Write 3 things you are grateful for', done: false },
];

const TASK_EMOJIS = ['💧','🚶','📵','💬','📝','🧘','🌿','🎵','📚','☀️','🍎','😴','🏃','🌸','✍️'];

// ── Helpers ──────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { word: 'Good morning', emoji: '🌅' };
  if (h < 17) return { word: 'Good afternoon', emoji: '☀️' };
  return { word: 'Good evening', emoji: '🌙' };
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function pastKey(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function getDayLabel(daysAgo) {
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  return new Date(Date.now() - daysAgo * 86400000).toLocaleDateString('en-US', { weekday: 'short' });
}

// ── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const greeting = getGreeting();

  // ── Mood ──
  const [todayMood, setTodayMood] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mood_' + todayKey())); } catch { return null; }
  });
  const [moodJustSet, setMoodJustSet] = useState(false);

  const pickMood = (mood) => {
    localStorage.setItem('mood_' + todayKey(), JSON.stringify(mood));
    setTodayMood(mood);
    setMoodJustSet(true);
    setTimeout(() => setMoodJustSet(false), 2800);
  };

  // Weekly mood history (last 7 days)
  const moodHistory = Array.from({ length: 7 }, (_, i) => {
    try {
      const m = JSON.parse(localStorage.getItem('mood_' + pastKey(6 - i)));
      return { ...m, label: getDayLabel(6 - i) };
    } catch { return null; }
  });

  // ── Streak ──
  const [streak] = useState(() => {
    const data = JSON.parse(localStorage.getItem('streak_data') || '{}');
    const today = todayKey();
    const prev = new Date(); prev.setDate(prev.getDate() - 1);
    const yd = `${prev.getFullYear()}-${prev.getMonth()}-${prev.getDate()}`;
    if (data.last === today) return data.count || 1;
    if (data.last === yd) {
      const c = (data.count || 0) + 1;
      localStorage.setItem('streak_data', JSON.stringify({ last: today, count: c }));
      return c;
    }
    localStorage.setItem('streak_data', JSON.stringify({ last: today, count: 1 }));
    return 1;
  });

  // ── Breathing ──
  const [breathActive, setBreathActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0);
  const [breathScale, setBreathScale] = useState(1.0);
  const [breathTimer, setBreathTimer] = useState(4);
  const breathRef = useRef(null);

  useEffect(() => {
    if (!breathActive) { setBreathPhase(0); setBreathScale(1.0); setBreathTimer(4); return; }
    let phaseIdx = 0;
    let secs = BREATHING_PHASES[0].secs;

    const tick = () => {
      secs -= 1;
      setBreathTimer(secs);
      if (secs <= 0) {
        phaseIdx = (phaseIdx + 1) % 3;
        secs = BREATHING_PHASES[phaseIdx].secs;
        setBreathPhase(phaseIdx);
        setBreathScale(BREATHING_PHASES[phaseIdx].scale);
        setBreathTimer(secs);
      }
    };

    setBreathPhase(0);
    setBreathScale(BREATHING_PHASES[0].scale);
    setBreathTimer(BREATHING_PHASES[0].secs);
    breathRef.current = setInterval(tick, 1000);
    return () => clearInterval(breathRef.current);
  }, [breathActive]);

  // ── Affirmation ──
  const [affIdx, setAffIdx] = useState(() => {
    const d = new Date();
    return (d.getDate() + d.getMonth() * 31) % AFFIRMATIONS.length;
  });
  const [affAnim, setAffAnim] = useState(false);
  const cycleAff = () => {
    setAffAnim(true);
    setTimeout(() => {
      setAffIdx((i) => (i + 1) % AFFIRMATIONS.length);
      setAffAnim(false);
    }, 300);
  };

  // ── Tasks (editable, persisted) ──
  const TASK_KEY = 'db_tasks_v2';
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(TASK_KEY));
      return saved?.length ? saved : DEFAULT_TASKS;
    } catch { return DEFAULT_TASKS; }
  });
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskEmoji, setNewTaskEmoji] = useState('✨');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [celebrate, setCelebrate] = useState(false);

  const saveTasks = (t) => { setTasks(t); localStorage.setItem(TASK_KEY, JSON.stringify(t)); };

  const toggleTask = (id) => {
    const updated = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    saveTasks(updated);
    if (updated.every(t => t.done) && updated.length > 0) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 3000);
    }
  };

  const deleteTask = (id) => saveTasks(tasks.filter(t => t.id !== id));

  const addTask = () => {
    if (!newTaskText.trim()) return;
    const t = { id: Date.now(), icon: newTaskEmoji, text: newTaskText.trim(), done: false };
    saveTasks([...tasks, t]);
    setNewTaskText('');
    setNewTaskEmoji('✨');
    setShowEmojiPicker(false);
  };

  const startEdit = (task) => { setEditingId(task.id); setEditText(task.text); };
  const saveEdit = (id) => {
    if (editText.trim()) saveTasks(tasks.map(t => t.id === id ? { ...t, text: editText.trim() } : t));
    setEditingId(null);
  };

  const doneCount = tasks.filter(t => t.done).length;
  const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;
  const circumference = 2 * Math.PI * 22;

  return (
    <div className="db-root">
      <Navbar />

      {/* Animated background blobs */}
      <div className="db-blobs" aria-hidden>
        <div className="db-blob db-blob-1" />
        <div className="db-blob db-blob-2" />
        <div className="db-blob db-blob-3" />
      </div>

      {celebrate && <Confetti />}

      <div className="db-content">

        {/* ── Header ── */}
        <div className="db-header">
          <div className="db-greeting">
            <span className="db-greeting-emoji">{greeting.emoji}</span>
            <div>
              <h1 className="db-greeting-text">
                {greeting.word}, <span className="db-name">{user.username || 'friend'}</span>
              </h1>
              <p className="db-date">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="db-streak-badge">
            <span className="db-streak-fire">🔥</span>
            <div>
              <div className="db-streak-count">{streak}</div>
              <div className="db-streak-label">day streak</div>
            </div>
          </div>
        </div>

        {/* ── Row 1: Mood + Affirmation ── */}
        <div className="db-row db-row-2">

          {/* Mood card */}
          <div className="db-card db-mood-card">
            <div className="db-card-title">🌡️ How are you feeling today?</div>

            {moodJustSet ? (
              <div className="db-mood-saved">
                <div className="db-mood-saved-emoji">{todayMood.emoji}</div>
                <p>Feeling <strong>{todayMood.label}</strong> — logged ✓</p>
                <span className="db-mood-saved-note">Come back tomorrow to log again</span>
              </div>
            ) : todayMood ? (
              <div className="db-mood-done">
                <div className="db-mood-done-inner" style={{ '--mc': todayMood.color }}>
                  <span className="db-mood-done-emoji">{todayMood.emoji}</span>
                  <div>
                    <p className="db-mood-done-label">Today you feel <strong>{todayMood.label}</strong></p>
                    <button className="db-reset-btn" onClick={() => setTodayMood(null)}>Change →</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="db-mood-grid">
                {MOODS.map((m) => (
                  <button key={m.label} className="db-mood-btn" style={{ '--mc': m.color }} onClick={() => pickMood(m)}>
                    <span className="db-mood-em">{m.emoji}</span>
                    <span className="db-mood-lbl">{m.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* 7-day mood history */}
            <div className="db-mood-history">
              <div className="db-mood-history-label">Last 7 days</div>
              <div className="db-mood-dots">
                {moodHistory.map((m, i) => (
                  <div key={i} className="db-mood-dot-wrap" title={m ? `${m.label} — ${m.label}` : 'No data'}>
                    <div
                      className="db-mood-dot"
                      style={{ background: m ? m.color : 'rgba(255,255,255,0.06)', opacity: m ? 1 : 0.4 }}
                    >
                      {m ? m.emoji : '·'}
                    </div>
                    <span className="db-mood-dot-day">{getDayLabel(6 - i).slice(0, 3)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Affirmation card */}
          <div className="db-card db-aff-card">
            <div className="db-card-title">✨ Today's Affirmation</div>
            <div className={`db-aff-body ${affAnim ? 'db-aff-fade' : ''}`}>
              <div className="db-aff-quote">"</div>
              <p className="db-aff-text">{AFFIRMATIONS[affIdx]}</p>
            </div>
            <div className="db-aff-counter">{affIdx + 1} / {AFFIRMATIONS.length}</div>
            <button className="db-aff-btn" onClick={cycleAff}>↻ Next affirmation</button>
          </div>

        </div>

        {/* ── Row 2: Tasks + Breathing ── */}
        <div className="db-row db-row-2">

          {/* Editable Tasklist */}
          <div className="db-card db-focus-card">
            <div className="db-focus-header">
              <div className="db-card-title" style={{ margin: 0 }}>🎯 My Daily Goals</div>
              {/* Progress ring */}
              <div className="db-ring-wrap" title={`${doneCount} of ${tasks.length} done`}>
                <svg className="db-ring" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="22" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
                  <circle
                    cx="25" cy="25" r="22" fill="none"
                    stroke={pct === 100 ? '#34d399' : '#fbbf24'}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - pct / 100)}
                    transform="rotate(-90 25 25)"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                </svg>
                <span className="db-ring-pct">{pct}%</span>
              </div>
            </div>

            <div className="db-focus-list">
              {tasks.map((task) => (
                <div key={task.id} className={`db-focus-item ${task.done ? 'db-focus-done' : ''}`}>
                  <button className="db-task-check" onClick={() => toggleTask(task.id)}>
                    <span>{task.done ? '✅' : task.icon}</span>
                  </button>

                  {editingId === task.id ? (
                    <input
                      className="db-task-edit-input"
                      value={editText}
                      autoFocus
                      onChange={e => setEditText(e.target.value)}
                      onBlur={() => saveEdit(task.id)}
                      onKeyDown={e => { if (e.key === 'Enter') saveEdit(task.id); if (e.key === 'Escape') setEditingId(null); }}
                    />
                  ) : (
                    <span
                      className="db-focus-text"
                      onDoubleClick={() => startEdit(task)}
                      title="Double-click to edit"
                    >
                      {task.text}
                    </span>
                  )}

                  <div className="db-task-actions">
                    <button className="db-task-edit-btn" onClick={() => startEdit(task)} title="Edit">✏️</button>
                    <button className="db-task-del-btn" onClick={() => deleteTask(task.id)} title="Delete">×</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add task row */}
            <div className="db-add-task-row">
              <div className="db-emoji-pick-wrap">
                <button className="db-emoji-trigger" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                  {newTaskEmoji}
                </button>
                {showEmojiPicker && (
                  <div className="db-emoji-picker">
                    {TASK_EMOJIS.map(e => (
                      <button key={e} className="db-emoji-opt" onClick={() => { setNewTaskEmoji(e); setShowEmojiPicker(false); }}>{e}</button>
                    ))}
                  </div>
                )}
              </div>
              <input
                className="db-add-input"
                placeholder="Add a new goal…"
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTask()}
              />
              <button className="db-add-btn" onClick={addTask}>+</button>
            </div>

            {celebrate && (
              <div className="db-all-done">🎉 All goals completed! You're incredible!</div>
            )}
          </div>

          {/* Breathing */}
          <div className="db-card db-breath-card">
            <div className="db-card-title">🌬️ Box Breathing</div>
            <p className="db-breath-sub">4 sec each · Reduces stress instantly</p>

            <div className="db-breath-stage">
              <div className="db-breath-rings">
                {breathActive && <div className="db-ripple" />}
                {breathActive && <div className="db-ripple db-ripple-2" />}
                <div className="db-breath-circle" style={{ transform: `scale(${breathActive ? breathScale : 1})` }}>
                  <div className="db-breath-inner">
                    {breathActive ? (
                      <>
                        <div className="db-breath-phase-name">{BREATHING_PHASES[breathPhase].label}</div>
                        <div className="db-breath-timer">{breathTimer}s</div>
                      </>
                    ) : 'Start'}
                  </div>
                </div>
              </div>

              {breathActive && (
                <div className="db-breath-phases">
                  {BREATHING_PHASES.map((p, i) => (
                    <div key={p.label} className={`db-bphase ${i === breathPhase ? 'db-bphase-active' : ''}`}>
                      {p.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              className={`db-breath-btn ${breathActive ? 'db-breath-stop' : ''}`}
              onClick={() => setBreathActive(!breathActive)}
            >
              {breathActive ? '⏹ Stop' : '▶ Start Breathing'}
            </button>
          </div>

        </div>

        {/* ── Quick Access ── */}
        <div className="db-card db-quick-card">
          <div className="db-card-title">⚡ Quick Access</div>
          <div className="db-quick-grid">
            {QUICK_LINKS.map((q, i) => (
              <button
                key={q.route}
                className="db-quick-btn"
                style={{ '--qc': q.color, animationDelay: `${i * 0.06}s` }}
                onClick={() => navigate(q.route)}
              >
                <span className="db-quick-icon">{q.icon}</span>
                <span className="db-quick-label">{q.label}</span>
                <span className="db-quick-sub">{q.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Support strip ── */}
        <div className="db-support-strip">
          <span>Need support?</span>
          <div className="db-support-btns">
            <button onClick={() => navigate('/anxiety')}      className="db-support-btn db-support-a">😰 Anxiety</button>
            <button onClick={() => navigate('/depression')}   className="db-support-btn db-support-d">🌧️ Depression</button>
            <button onClick={() => navigate('/relationship')} className="db-support-btn db-support-r">💑 Relationships</button>
            <button onClick={() => navigate('/bot')}          className="db-support-btn db-support-ai">🤖 Talk to AI</button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Confetti ─────────────────────────────────────────────────────────────────
function Confetti() {
  const colors = ['#00e5c8','#a78bfa','#f472b6','#fbbf24','#34d399','#60a5fa'];
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: Math.random() * 100,
    delay: Math.random() * 1.2,
    size: 6 + Math.random() * 8,
    duration: 1.5 + Math.random() * 1,
  }));
  return (
    <div className="db-confetti" aria-hidden>
      {pieces.map(p => (
        <div
          key={p.id}
          className="db-confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
