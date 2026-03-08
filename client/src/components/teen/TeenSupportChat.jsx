import { useState, useRef, useMemo, useEffect } from 'react';
import TeenCard from './TeenCard';

const replies = [
  "I hear you. Take your time — this is a safe space.",
  "Thank you for reaching out. You are not alone in this.",
  "That sounds really difficult. Let's work through this together.",
  "Your feelings are completely valid. Can you tell me more?",
  "I'm here with you. We'll take this one step at a time.",
  "It takes courage to talk about this. I'm listening.",
];

export default function TeenSupportChat() {
  const [connected, setConnected] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  const canSend = useMemo(() => input.trim().length > 0, [input]);

  const handleConnect = () => {
    setConnected(true);
    setShowBanner(true);
    setMessages([
      { id: 1, role: 'assistant', text: "Hello, I'm here to support you. Everything you share here is private and confidential. How are you feeling today?" },
    ]);
    setTimeout(() => setShowBanner(false), 4000);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!canSend) return;
    const next = [
      ...messages,
      { id: Date.now(),     role: 'user',      text: input.trim() },
      { id: Date.now() + 1, role: 'assistant', text: replies[Math.floor(Math.random() * replies.length)] },
    ];
    setMessages(next);
    setInput('');
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  };

  useEffect(() => {
    if (connected) requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  }, [messages, connected]);

  return (
    <TeenCard title="Help Chat" icon="💬" accent="ts-card-chat">
      {!connected ? (
        <div className="ts-connect-screen">
          <div className="ts-connect-avatar">🩺</div>
          <p className="ts-connect-title">Talk to a Care Specialist</p>
          <p className="ts-connect-desc">
            Connect instantly with a trained care specialist. Your conversation is completely private — no names, no records.
          </p>
          <div className="ts-connect-pills">
            <span className="ts-connect-pill">🔒 Private</span>
            <span className="ts-connect-pill">👤 Anonymous</span>
            <span className="ts-connect-pill">⚡ Instant</span>
          </div>
          <button className="ts-connect-btn" onClick={handleConnect}>Connect Now →</button>
        </div>
      ) : (
        <>
          {showBanner && (
            <div className="ts-connected-banner">
              <span className="ts-connected-dot" />
              Care specialist connected — you are in a safe space
            </div>
          )}
          <div className="ts-chat-status">
            <span className="ts-online-dot" /> Care specialist is online
          </div>
          <div className="ts-chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={'ts-msg ' + msg.role}>{msg.text}</div>
            ))}
            <div ref={endRef} />
          </div>
          <form className="ts-chat-form" onSubmit={handleSend}>
            <input
              type="text"
              className="ts-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              autoFocus
            />
            <button type="submit" className="ts-chat-send" disabled={!canSend}>Send ➤</button>
          </form>
        </>
      )}
    </TeenCard>
  );
}
