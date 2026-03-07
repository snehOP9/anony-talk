import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import GlowingLines from '../components/GlowingLines';
import * as api from '../utils/api';
import '../styles/bot.css';

const LANGUAGES = [
  { code: 'GB', name: 'English',   native: 'English'   },
  { code: 'IN', name: 'Hindi',     native: 'हिंदी'      },
  { code: 'IN', name: 'Marathi',   native: 'मराठी'      },
  { code: 'IN', name: 'Bengali',   native: 'বাংলা'      },
  { code: 'IN', name: 'Tamil',     native: 'தமிழ்'     },
  { code: 'IN', name: 'Telugu',    native: 'తెలుగు'    },
  { code: 'IN', name: 'Kannada',   native: 'ಕನ್ನಡ'     },
  { code: 'IN', name: 'Gujarati',  native: 'ગુજરાતી'   },
  { code: 'IN', name: 'Punjabi',   native: 'ਪੰਜਾਬੀ'   },
  { code: 'IN', name: 'Malayalam', native: 'മലയാളം'   },
];

export default function Bot() {
  const [step, setStep] = useState('language');
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startChat = () => {
    setMessages([
      {
        role: 'bot',
        text: `Welcome to AnonyTalk's AI companion! 🧠 I'll respond in ${selectedLang.name}. I'm here to listen, support, and help you navigate your thoughts. Ask me anything about mental health, emotions, or just chat!`,
      },
    ]);
    setStep('chat');
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const msg = input.trim();
    if (!msg) return;

    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);

    try {
      const data = await api.sendChatMessage(msg, selectedLang.name);
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
      <div className="page-content bot-page-wrapper">

        {step === 'language' && (
          <div className="lang-card glass">
            <div className="lang-globe">🌐</div>
            <h2 className="lang-title">Choose your language</h2>
            <p className="lang-subtitle">
              Select the language you are most comfortable with. The AI will
              respond in that language throughout your session.
            </p>

            <div className="lang-grid">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.name}
                  className={'lang-option' + (selectedLang.name === lang.name ? ' selected' : '')}
                  onClick={() => setSelectedLang(lang)}
                >
                  <span className="lang-code">{lang.code}</span>
                  <span className="lang-native">{lang.native}</span>
                  <span className="lang-name">{lang.name}</span>
                </button>
              ))}
            </div>

            <button className="btn-continue" onClick={startChat}>
              Continue in {selectedLang.name} →
            </button>
          </div>
        )}

        {step === 'chat' && (
          <div className="bot-chat-wrapper">
            <div className="bot-header glass">
              <h2>🤖 AI Companion</h2>
              <p>Your safe space to talk, vent, or explore thoughts anonymously</p>
              <button className="change-lang-btn" onClick={() => setStep('language')}>
                🌐 {selectedLang.name}
              </button>
            </div>

            <div className="chat-container glass">
              <div className="chat-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={'chat-bubble ' + msg.role}>
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
        )}

      </div>
    </div>
  );
}
