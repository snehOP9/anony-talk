import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import GlowingLines from '../components/GlowingLines';
import * as api from '../utils/api';
import '../styles/bot.css';

export default function Bot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Welcome to AnonyTalk's AI companion! 🧠 I'm here to listen, support, and help you navigate your thoughts. Ask me anything about mental health, emotions, or just chat!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const msg = input.trim();
    if (!msg) return;

    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);

    try {
      const data = await api.sendChatMessage(msg);
      setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: "I'm having trouble connecting. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <GlowingLines />
      <div className="page-content bot-page">
        <div className="bot-header glass">
          <h2>🤖 AI Companion</h2>
          <p>Your safe space to talk, vent, or explore thoughts anonymously</p>
        </div>

        <div className="chat-container glass">
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.role}`}>
                <div className="bubble-content">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-bubble bot">
                <div className="bubble-content typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={sendMessage}>
            <input
              type="text"
              className="input-field"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="btn btn-glow send-btn" disabled={loading || !input.trim()}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
