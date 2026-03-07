import { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import GlowingLines from '../components/GlowingLines';
import * as api from '../utils/api';
import '../styles/bot.css';

const LANGUAGES = [
  { code: 'English',   label: 'English',   native: 'English',   flag: '🇬🇧', locale: 'en-IN'  },
  { code: 'Hindi',     label: 'Hindi',     native: 'हिंदी',     flag: '🇮🇳', locale: 'hi-IN'  },
  { code: 'Marathi',   label: 'Marathi',   native: 'मराठी',   flag: '🇮🇳', locale: 'mr-IN'  },
  { code: 'Bengali',   label: 'Bengali',   native: 'বাংলা',   flag: '🇮🇳', locale: 'bn-IN'  },
  { code: 'Tamil',     label: 'Tamil',     native: 'தமிழ்',     flag: '🇮🇳', locale: 'ta-IN'  },
  { code: 'Telugu',    label: 'Telugu',    native: 'తెలుగు',    flag: '🇮🇳', locale: 'te-IN'  },
  { code: 'Kannada',   label: 'Kannada',   native: 'ಕನ್ನಡ',   flag: '🇮🇳', locale: 'kn-IN'  },
  { code: 'Gujarati',  label: 'Gujarati',  native: 'ગુજરાતી',  flag: '🇮🇳', locale: 'gu-IN'  },
  { code: 'Punjabi',   label: 'Punjabi',   native: 'ਪੰਜਾਬੀ',   flag: '🇮🇳', locale: 'pa-IN'  },
  { code: 'Malayalam', label: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳', locale: 'ml-IN'  },
];

const WELCOME_MESSAGES = {
  English:   "Welcome to AnonyTalk's AI companion! I'm here to listen, support, and help you navigate your thoughts. Ask me anything about mental health, emotions, or just chat!",
  Hindi:     'AnonyTalk के AI साथी में आपका स्वागत है! मैं यहाँ आपकी बात सुनने और सहयोग करने के लिए हूँ।',
  Marathi:   'AnonyTalk च्या AI सोबत्यामध्ये आपले स्वागत आहे! मी येथे ऐकण्यासाठी आणि आधार देण्यासाठी आहे.',
  Bengali:   'AnonyTalk-এর AI সঙ্গীতে স্বাগতম! আমি এখানে শুনতে এবং সহায়তা করতে আছি।',
  Tamil:     'AnonyTalk AI தோழரில் உங்களை வரவேற்கிறோம்! நான் இங்கே கேட்கவும் ஆதரவளிக்கவும் இருக்கிறேன்.',
  Telugu:    'AnonyTalk AI సహచరికి స్వాగతం! నేను వినడానికి మరియు మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను.',
  Kannada:   'AnonyTalk AI ಸ್ನೇಹಿತರಿಗೆ ಸ್ವಾಗತ! ನಾನು ಇಲ್ಲಿ ಕೇಳಲು ಮತ್ತು ಬೆಂಬಲಿಸಲು ಇದ್ದೇನೆ.',
  Gujarati:  'AnonyTalk AI સાથીમાં આપનું સ્વાગત છે! હું અહીં સાંભળવા અને સહાય કરવા છું.',
  Punjabi:   'AnonyTalk AI ਸਾਥੀ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ! ਮੈਂ ਇੱਥੇ ਸੁਣਨ ਅਤੇ ਸਹਾਇਤਾ ਕਰਨ ਲਈ ਹਾਂ।',
  Malayalam: 'AnonyTalk AI കൂട്ടുകാരനിലേക്ക് സ്വാഗതം! ഞാൻ ഇവിടെ കേൾക്കാനും പിന്തുണയ്ക്കാനും ഉണ്ട്.',
};

const PLACEHOLDERS = {
  English:   'Type your message...',
  Hindi:     'अपना संदेश लिखें...',
  Marathi:   'तुमचा संदेश लिहा...',
  Bengali:   'আপনার বার্তা লিখুন...',
  Tamil:     'உங்கள் செய்தி டைப் செய்யுங்கள்...',
  Telugu:    'మీ సందేశం టైప్ చేయండి...',
  Kannada:   'ನಿಮ್ಮ ಸಂದೇಶ ಟೈಪ್ ಮಾಡಿ...',
  Gujarati:  'તમારો સંદેશ ટાઇપ કરો...',
  Punjabi:   'ਆਪਣਾ ਸੁਨੇਹਾ ਲਿਖੋ...',
  Malayalam: 'നിങ്ങളുടെ സന്ദേശം ടൈപ്പ് ചെയ്യൂ...',
};

export default function Bot() {
  const [language, setLanguage]       = useState(null);
  const [selected, setSelected]       = useState('English');
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [voiceOn, setVoiceOn]         = useState(false);
  const [voiceMode, setVoiceMode]     = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('idle'); // idle|listening|thinking|speaking
  const [listening, setListening]     = useState(false);
  const [noSpeech, setNoSpeech]       = useState(false);
  const chatEndRef   = useRef(null);
  const recognRef    = useRef(null);
  const voiceModeRef = useRef(false);

  // keep ref in sync so stale-closure callbacks read current voiceMode
  useEffect(() => { voiceModeRef.current = voiceMode; }, [voiceMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Build / rebuild SpeechRecognition when language changes
  useEffect(() => {
    if (!language) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setNoSpeech(true); return; }
    const r = new SR();
    const lang = LANGUAGES.find(l => l.code === language);
    r.lang = lang ? lang.locale : 'en-IN';
    r.interimResults = true;
    r.continuous = false;
    r.onresult = (e) => {
      const t = Array.from(e.results).map(x => x[0].transcript).join('');
      if (t) setInput(t);
    };
    r.onend   = () => setListening(false);
    r.onerror = () => setListening(false);
    recognRef.current = r;
    return () => { try { r.abort(); } catch {} };
  }, [language]);

  const toggleMic = useCallback(() => {
    if (!recognRef.current) return;
    if (listening) { recognRef.current.stop(); setListening(false); }
    else { setInput(''); recognRef.current.start(); setListening(true); }
  }, [listening]);

  const startChat = () => {
    setLanguage(selected);
    setMessages([{ role: 'bot', text: WELCOME_MESSAGES[selected] }]);
  };

  // TTS helper with optional onEnd callback
  const speakText = useCallback((text, locale, onEnd) => {
    if (!window.speechSynthesis) { onEnd?.(); return; }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang  = locale;
    utt.rate  = 0.9;
    utt.onend  = () => { setVoiceStatus('idle'); onEnd?.(); };
    utt.onerror = () => { setVoiceStatus('idle'); onEnd?.(); };
    window.speechSynthesis.speak(utt);
  }, []);

  const sendMessage = useCallback(async (e) => {
    if (e) e.preventDefault();
    const msg = input.trim();
    if (!msg) return;
    if (listening) { recognRef.current?.stop(); setListening(false); }
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);
    if (voiceModeRef.current) setVoiceStatus('thinking');
    try {
      const data = await api.sendChatMessage(msg, language);
      setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
      const lang   = LANGUAGES.find(l => l.code === language);
      const locale = lang?.locale ?? 'en-IN';
      if (voiceModeRef.current || voiceOn) {
        setVoiceStatus('speaking');
        speakText(data.response, locale, () => {
          // in voice mode: auto-restart mic after AI finishes speaking
          if (voiceModeRef.current && recognRef.current) {
            setTimeout(() => {
              if (!voiceModeRef.current) return;
              try {
                setInput('');
                recognRef.current.start();
                setListening(true);
                setVoiceStatus('listening');
              } catch {}
            }, 500);
          }
        });
      }
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: "I'm having trouble connecting. Please try again." }]);
      setVoiceStatus('idle');
    } finally {
      setLoading(false);
    }
  }, [input, language, listening, voiceOn, speakText]);

  // Auto-send after mic stops (immediate in voice mode, 500 ms in text mode)
  useEffect(() => {
    if (!listening && input.trim()) {
      if (voiceModeRef.current) {
        sendMessage();
      } else {
        const t = setTimeout(() => sendMessage(), 500);
        return () => clearTimeout(t);
      }
    }
  }, [listening]); // eslint-disable-line react-hooks/exhaustive-deps

  const enterVoiceMode = () => {
    setVoiceMode(true);
    setVoiceOn(true);
    window.speechSynthesis?.cancel();
    setTimeout(() => {
      if (!recognRef.current) return;
      try {
        setInput('');
        recognRef.current.start();
        setListening(true);
        setVoiceStatus('listening');
      } catch {}
    }, 300);
  };

  const exitVoiceMode = () => {
    setVoiceMode(false);
    setVoiceStatus('idle');
    window.speechSynthesis?.cancel();
    if (listening) { recognRef.current?.stop(); setListening(false); }
  };

  // ── Language Picker ────────────────────────────────────────────────────────
  if (!language) {
    return (
      <div className="page">
        <Navbar />
        <GlowingLines />
        <div className="page-content lang-pick-page">
          <div className="lang-pick-card glass">
            <div className="lang-pick-icon">🌐</div>
            <h2>Choose your language</h2>
            <p>Select the language you are most comfortable with. The AI will respond in that language throughout your session.</p>
            <div className="lang-pick-grid">
              {LANGUAGES.map(({ code, label, native, flag }) => (
                <button key={code} type="button"
                  className={`lang-pick-btn${selected === code ? ' selected' : ''}`}
                  onClick={() => setSelected(code)}
                >
                  <span className="lang-flag">{flag}</span>
                  <span className="lang-name">{native}</span>
                  <span className="lang-sublabel">{label}</span>
                </button>
              ))}
            </div>
            <button className="btn btn-glow lang-continue-btn" onClick={startChat}>
              Continue in {LANGUAGES.find(l => l.code === selected)?.native} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentLang = LANGUAGES.find(l => l.code === language);

  // ── Voice Mode UI ──────────────────────────────────────────────────────────
  if (voiceMode) {
    const lastBot  = [...messages].reverse().find(m => m.role === 'bot');
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    const statusLabel =
      loading                      ? 'Thinking…' :
      voiceStatus === 'speaking'   ? 'Speaking…' :
      listening                    ? 'Listening… tap to stop' :
                                     'Tap to speak';

    return (
      <div className="page">
        <Navbar />
        <GlowingLines />
        <div className="page-content voice-mode-page">
          <div className="voice-mode-card glass">

            <div className="voice-mode-top">
              <h2>🎙 Voice Conversation</h2>
              <span className="voice-lang-badge">{currentLang?.flag} {currentLang?.native}</span>
            </div>

            <div className="voice-exchange">
              {lastBot && (
                <div className="voice-msg bot">
                  <span className="voice-role">🤖 AI</span>
                  <p>{lastBot.text}</p>
                </div>
              )}
              {lastUser && (
                <div className="voice-msg user">
                  <span className="voice-role">You</span>
                  <p>{lastUser.text}</p>
                </div>
              )}
              {listening && input && (
                <div className="voice-msg interim">
                  <span className="voice-role">You (live)</span>
                  <p className="interim-text">{input}</p>
                </div>
              )}
            </div>

            <div className="voice-mic-area">
              <button
                type="button"
                className={`voice-big-mic${listening ? ' listening' : ''}${loading ? ' thinking' : ''}`}
                onClick={() => {
                  if (loading) return;
                  if (listening) {
                    recognRef.current?.stop();
                    setListening(false);
                    setVoiceStatus('idle');
                  } else {
                    setInput('');
                    try { recognRef.current?.start(); setListening(true); setVoiceStatus('listening'); } catch {}
                  }
                }}
                disabled={loading}
              >
                {loading ? '⏳' : listening ? '🔴' : '🎤'}
              </button>
              <p className="voice-status-label">{statusLabel}</p>
            </div>

            <button type="button" className="voice-exit-btn" onClick={exitVoiceMode}>
              → Back to text chat
            </button>

          </div>
        </div>
      </div>
    );
  }

  // ── Normal Chat UI ─────────────────────────────────────────────────────────
  return (
    <div className="page">
      <Navbar />
      <GlowingLines />
      <div className="page-content bot-page">
        <div className="bot-header glass">
          <h2>🤖 AI Companion</h2>
          <p>Your safe space to talk, vent, or explore thoughts anonymously</p>
          <div className="bot-header-controls">
            <button type="button" className="lang-change-btn"
              onClick={() => { window.speechSynthesis?.cancel(); setLanguage(null); setMessages([]); }}>
              {currentLang?.flag} {currentLang?.native} · Change
            </button>
            {!noSpeech && (
              <button type="button" className="voice-mode-entry-btn" onClick={enterVoiceMode}>
                🎙 Voice Mode
              </button>
            )}
            <button type="button"
              className={`voice-toggle-btn${voiceOn ? ' active' : ''}`}
              onClick={() => { if (voiceOn) window.speechSynthesis?.cancel(); setVoiceOn(v => !v); }}
              title={voiceOn ? 'Mute AI voice' : 'Enable AI voice'}
            >
              {voiceOn ? '🔊' : '🔇'} {voiceOn ? 'Voice On' : 'Voice Off'}
            </button>
          </div>
        </div>

        <div className="chat-container glass">
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.role}`}>
                <div className="bubble-content">
                  {msg.text}
                  {msg.role === 'bot' && (
                    <button className="tts-btn" type="button"
                      onClick={() => speakText(msg.text, currentLang?.locale ?? 'en-IN', null)}
                      title="Read aloud"
                    >🔊</button>
                  )}
                </div>
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
              className={`input-field${listening ? ' listening' : ''}`}
              placeholder={listening ? '🎤 Listening...' : PLACEHOLDERS[language]}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            {!noSpeech && (
              <button type="button"
                className={`btn mic-btn${listening ? ' recording' : ''}`}
                onClick={toggleMic}
                disabled={loading}
                title={listening ? 'Stop' : 'Speak your message'}
              >
                {listening ? '🔴' : '🎤'}
              </button>
            )}
            <button type="submit" className="btn btn-glow send-btn" disabled={loading || !input.trim()}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
