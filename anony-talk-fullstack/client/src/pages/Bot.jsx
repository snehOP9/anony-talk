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

const WELCOME_MESSAGES = { /* ...per-language welcome strings... */ };
const PLACEHOLDERS = { /* ...per-language placeholder strings... */ };

export default function Bot() {
  const [language, setLanguage]       = useState(null);
  const [selected, setSelected]       = useState('English');
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [voiceOn, setVoiceOn]         = useState(false);
  const [voiceMode, setVoiceMode]     = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('idle');
  const [listening, setListening]     = useState(false);
  const [noSpeech, setNoSpeech]       = useState(false);
  // ... (hooks, SpeechRecognition setup, sendMessage, voice mode logic)
}