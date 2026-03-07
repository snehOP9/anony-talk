const express = require('express');
const router = express.Router();

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
function geminiUrl() {
  return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
}

// Chatbot responses — India-aware mental health support
const chatbotResponses = {

  // ── Core emotional states ──────────────────────────────────────────────────
  "why do i feel sad all the time?": "Feeling sad constantly can stem from stress, unresolved grief, hormonal shifts, or depression. In India, pressure from family expectations or academic/career demands often adds to it. Try talking to someone you trust. If it persists beyond two weeks, please reach out to iCall (9152987821) or Vandrevala Foundation (1860-2662-345, 24/7 free).",
  "why do i feel empty inside?": "Feeling empty is more common than people admit — it can be emotional exhaustion, unmet needs, or early signs of depression. You don't have to explain it perfectly. Just know it's okay to feel this way, and speaking with a counsellor can help you understand it better.",
  "why do i cry for no reason?": "Crying without an obvious trigger is often built-up stress, emotional overload, or hormonal changes releasing tension. It's healthy. If it happens very frequently, consider talking to a mental health professional — it's nothing to be ashamed of.",
  "why do i feel tired even after sleeping?": "Feeling unrefreshed despite sleep can indicate poor sleep quality, depression, anxiety, thyroid issues, or anaemia — all common in India. Reduce late-night phone use, maintain consistent sleep timings, and consult a doctor if it continues.",
  "is it normal to feel hopeless?": "Yes, momentary hopelessness is human. But if it lingers for weeks, it may be a sign of depression. Please don't suffer silently — call iCall at 9152987821 or text the Vandrevala Foundation at 1860-2662-345 (free, 24/7).",
  "why do i feel numb?": "Emotional numbness is often your mind's way of protecting itself from too much pain. Grounding exercises (touch something cold, name 5 things you can see) can help you reconnect. Therapy is very effective for this.",
  "how do i stop feeling numb?": "Start small — step outside, listen to music you love, or call a friend. Numbness usually needs gentle nudging, not force. A therapist can guide you safely through it.",
  "why do i feel like no one understands me?": "Feeling misunderstood is very common, especially in Indian families where emotions are often not openly discussed. Writing in a journal, or finding communities (online or offline) of people with similar experiences, can help you feel less alone.",
  "why do i overthink everything?": "Overthinking is often rooted in anxiety or fear of making mistakes — amplified by exam pressure, job insecurity, or family expectations common in India. Mindfulness apps like Wysa or Headspace (free tiers), journaling, and CBT techniques can break the cycle.",

  // ── Anxiety & stress ──────────────────────────────────────────────────────
  "how do i deal with anxiety?": "Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. Box breathing (inhale 4s, hold 4s, exhale 4s, hold 4s) also helps immediately. For persistent anxiety, iCall (9152987821) offers free counselling.",
  "i have a lot of stress": "Stress is very real, especially with academic, job, and family pressures in India. Break your to-do list into small steps, take 10-minute breaks, and talk to someone. If stress affects your sleep or appetite, please consider speaking with a counsellor.",
  "i am stressed about exams": "Exam stress is one of the most common issues among Indian students. Try: short study sessions with breaks (Pomodoro), avoid comparing yourself to others, sleep 7–8 hours, and eat properly. If anxiety is severe, call Vandrevala Foundation at 1860-2662-345.",
  "how do i handle pressure from parents?": "Parental pressure is deeply common in India. Try having a calm, honest conversation about your limits and aspirations. If direct talk feels hard, write them a letter first. A counsellor can also help mediate or coach you on how to approach it.",
  "my family doesn't understand me": "Family communication gaps are very common in Indian households where emotions aren't always spoken about openly. Try expressing your feelings using 'I feel...' statements rather than 'You never...'. If it's causing significant distress, speaking to a counsellor at iCall (9152987821) can really help.",
  "i feel pressure to get married": "Social and family pressure around marriage is a major stressor in India. Your timeline is valid. It helps to set gentle boundaries with family, find supportive friends, and if needed, speak to a therapist who can help you navigate these conversations.",

  // ── Depression ────────────────────────────────────────────────────────────
  "what are the signs of depression?": "Key signs: persistent sadness or emptiness for 2+ weeks, loss of interest in things you used to enjoy, changes in sleep or appetite, fatigue, difficulty concentrating, feelings of worthlessness, or thoughts of self-harm. If you recognize these, please reach out — iCall: 9152987821, NIMHANS: 080-46110007.",
  "i think i have depression": "Thank you for recognising this — it takes courage. Depression is a real medical condition, not a weakness or 'attitude problem'. In India, NIMHANS (Bengaluru) and iCall offer support. A psychiatrist or psychologist can confirm and guide treatment. You deserve help.",
  "is depression real?": "Yes, absolutely. Depression is a recognised medical condition affecting millions in India. It's not laziness, weakness, or 'overthinking'. It involves real changes in brain chemistry and needs proper care — not just 'staying positive'.",
  "i feel worthless": "Feeling worthless is a symptom, not a truth. These feelings lie to you. You matter, and what you're going through is real. Please talk to someone — iCall is free: 9152987821. You don't have to feel this way alone.",

  // ── Relationships ────────────────────────────────────────────────────────
  "how do i get over a breakup?": "Breakups are genuinely painful — allow yourself to grieve without shame. Unfollow on social media if needed, lean on close friends, and avoid isolation. In India, where relationships are often secret or judged, the pain can feel extra lonely. You'll get through this.",
  "my boyfriend/girlfriend broke up with me": "That's really hard, and your pain is valid. Give yourself time to feel it — don't rush 'moving on'. Talk to a trusted friend or write your feelings out. If it's affecting your daily life, speaking to a counsellor helps a lot.",
  "i am in a toxic relationship": "Recognising toxicity is the first step — and a brave one. Toxic relationships can include constant criticism, control, guilt-tripping, or emotional manipulation. You deserve respect. Reach out to iCall (9152987821) if you need support leaving or processing the relationship.",
  "i feel lonely even around people?": "Feeling lonely in a crowd often means your connections are surface-level. This is very common in cities and college environments. Focus on one or two deeper friendships. Shared hobbies, support groups, or counselling can help build genuine connection.",
  "how do i deal with loneliness?": "Loneliness is painful but manageable. Try: volunteering, joining clubs or online communities around your interests, calling one person a day. If loneliness feels deep and persistent, a counsellor can help you explore its roots.",

  // ── Identity & self-worth ─────────────────────────────────────────────────
  "why do i feel like i'm not good enough?": "This feeling is extremely common in India's competitive environment — comparisons with relatives, toppers, or social media highlight reels fuel it. Remind yourself: your worth isn't your rank, salary, or marks. Consider CBT or counselling to rebuild a healthier self-view.",
  "i hate myself": "Those are painful words to carry. Self-hatred often comes from deep wounds — harsh criticism, repeated failures, or trauma. Please talk to someone. iCall (9152987821) has trained counsellors who listen without judgment. You are more than your worst thoughts about yourself.",
  "how do i gain more confidence?": "Confidence grows through action, not waiting. Start with one small win daily. Stop comparing — social media shows highlights, not reality. In India, 'log kya kahenge' culture damages confidence; focus on your own values and progress.",
  "i feel like a failure": "One failure — or even many — does not make you a failure. India's education and career system often ties self-worth to results, which is deeply unfair. Your effort, character, and growth matter far more. Talk to someone who can help you reframe this.",

  // ── Academic & career stress ──────────────────────────────────────────────
  "i failed my exam": "That stings, and it's okay to feel upset. But one exam does not define your future. Many successful people in India have failed boards, entrance tests, or interviews. Take a break, reassess, and make a plan. You're not alone in this.",
  "i didn't get into iit/neet": "Not getting into IIT or clearing NEET is devastating when you've worked so hard. But there are genuinely excellent paths forward — private engineering colleges, state universities, allied health courses, and more. Your life is not over. Please speak with a counsellor before making any big decisions.",
  "i am scared of the future": "Fear of the future is very common, especially in uncertain job markets or after big life transitions. It helps to focus on what you can control today, rather than imagining worst-case scenarios. A counsellor can teach you specific tools to manage this fear.",
  "i don't know what to do with my life": "Feeling lost about direction is extremely common among young Indians caught between family expectations and personal desires. Career counselling, self-exploration exercises, and talking to people in fields you're curious about can help clarify things gradually.",

  // ── Crisis & safety ───────────────────────────────────────────────────────
  "i want to die": "I hear you, and I'm glad you're talking. Please reach out right now — iCall: 9152987821, Vandrevala Foundation: 1860-2662-345 (free, 24/7), or go to the nearest government hospital emergency. You don't have to face this alone.",
  "i am thinking about suicide": "Please reach out immediately. You matter deeply. Call Vandrevala Foundation at 1860-2662-345 (free, 24 hours) or iCall at 9152987821. If you're in immediate danger, go to your nearest hospital. Talking to someone right now can make a real difference.",
  "i want to hurt myself": "I'm so sorry you're feeling this much pain. Please don't be alone right now — call iCall (9152987821) or Vandrevala Foundation (1860-2662-345, free 24/7). If you're in immediate danger, call 112 or go to the nearest hospital emergency.",
  "is there a helpline in india?": "Yes! Here are trusted Indian helplines:\n• iCall: 9152987821 (Mon–Sat, 8am–10pm) — free, confidential\n• Vandrevala Foundation: 1860-2662-345 — free, 24/7\n• NIMHANS: 080-46110007\n• Snehi: 044-24640050\n• iCall WhatsApp: available on their website (icallhelpline.org)",
  "where can i get help in india?": "Trusted support in India:\n• iCall: 9152987821 (free counselling)\n• Vandrevala Foundation: 1860-2662-345 (24/7 free)\n• NIMHANS Helpline: 080-46110007\n• The Minds Foundation, Mpower, Lissun — offer online therapy\n• Government hospitals have free psychiatry OPDs",

  // ── Physical & lifestyle ───────────────────────────────────────────────────
  "i can't sleep at night": "Insomnia is often linked to anxiety, stress, or irregular schedules. Tips: avoid screens 1 hour before bed, keep a fixed wake time, try the 4-7-8 breathing technique. Persistent insomnia (2+ weeks) deserves a doctor's attention.",
  "i don't feel like eating": "Loss of appetite can be a sign of stress, depression, or physical illness. Try small, frequent meals. If it's been more than a few days, please see a doctor. Your body needs fuel to cope with whatever you're going through.",
  "how do i meditate?": "Start simple — sit quietly for 5 minutes, focus only on your breath. When your mind wanders (it will!), gently return focus to breathing. Apps like Headspace, Calm, or the free 'Insight Timer' are great. Even 5 minutes daily gives real benefits.",
  "does yoga help with mental health?": "Yes! Yoga, pranayama (breathing exercises like anulom vilom), and meditation have strong evidence for reducing anxiety and depression. Even 15–20 minutes daily helps. Many free sessions are on YouTube in Hindi and English.",

  // ── Casual & supportive ────────────────────────────────────────────────────
  "can i vent to you?": "Absolutely. I'm here to listen without any judgment. Share whatever is on your mind — this is a safe, anonymous space.",
  "will you judge me if i tell you something?": "Never. This space exists so you can speak freely. Whatever you share stays here, and you will not be judged.",
  "can i talk to you about my problems?": "Of course. I'm here anytime. Tell me what's going on.",
  "can you help me calm down?": "Yes. Try this right now: breathe in slowly for 4 counts… hold for 4… breathe out for 6… hold for 2. Repeat 3–4 times. You'll feel your body slow down. Keep going — you're doing great.",
  "i feel better today": "That's genuinely wonderful to hear! Small improvements matter. Keep nurturing whatever helped you feel better today. 😊",
  "i'm having a bad day": "I'm sorry to hear that. Bad days are real and valid. You don't have to push through alone — want to talk about what happened?",
  "how do i stop feeling lazy?": "'Laziness' is often your body signalling burnout, low mood, or overwhelm. Start with the smallest possible task — even just making your bed. Celebrate that. Momentum builds from tiny actions.",
  "can you tell me a joke?": "Sure! Why did the scarecrow win an award? Because he was outstanding in his field! 😄 Hope that brought a small smile.",
  "how do i stop procrastinating?": "Break the task into the tiniest possible step and do only that first. Set a 10-minute timer — often starting is the hardest part. Remove distractions (put your phone in another room). Procrastination is usually about anxiety, not laziness.",
  "how do i become a better person?": "Reflect on your values, practise being more patient with yourself and others, apologise when you hurt someone, and keep learning. Growth is not linear — be patient with the process.",
  "what should i do when i feel overwhelmed?": "Stop, breathe, and name what you're feeling out loud ('I am overwhelmed'). Then write down everything on your mind. Pick ONE small thing to do next. The rest can wait. You don't have to solve everything today.",
  "what's the meaning of life?": "Philosophers, saints, and scientists have wrestled with this forever! Many Indian traditions suggest it's about dharma (duty), connection, and reducing suffering — yours and others'. What gives *your* days meaning?",
  "hello": "Hi there 👋 I'm your AnonyTalk companion. You can share anything — feelings, worries, or just have a conversation. What's on your mind?",
  "hi": "Hey! I'm here and listening. How are you feeling today?",
  "how are you?": "I'm here and fully focused on you. 😊 How are *you* doing? Tell me what's going on.",
};

function findFallbackResponse(message) {
  const lowerMsg = message.toLowerCase().trim();

  if (chatbotResponses[lowerMsg]) {
    return chatbotResponses[lowerMsg];
  }

  let bestMatch = null;
  let bestScore = 0;

  for (const key of Object.keys(chatbotResponses)) {
    const words = key.split(' ');
    const matchCount = words.filter((w) => lowerMsg.includes(w)).length;
    const score = matchCount / words.length;
    if (score > bestScore && score > 0.4) {
      bestScore = score;
      bestMatch = key;
    }
  }

  if (bestMatch) {
    return chatbotResponses[bestMatch];
  }

  return "I hear you. While I may not have the perfect answer, know that your feelings are valid. Would you like to talk more about what's on your mind?";
}

const SUPPORTED_LANGUAGES = ['English', 'Hindi', 'Marathi', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Gujarati', 'Punjabi', 'Malayalam'];

function buildSystemPrompt(language) {
  const base = 'You are a compassionate mental wellness companion on AnonyTalk, an anonymous platform used primarily by people in India. Respond in a warm, empathetic, non-judgmental tone. Be culturally sensitive to Indian contexts: family pressure, academic competition (JEE/NEET), arranged marriage stress, career anxiety, and the stigma around mental health in India. Keep responses concise (3–5 sentences). Never diagnose. When relevant, mention free Indian helplines: iCall (9152987821), Vandrevala Foundation (1860-2662-345, 24/7 free). If the user expresses suicidal thoughts or self-harm intent, immediately provide these helplines and urge them to seek help.';
  if (language && language !== 'English' && SUPPORTED_LANGUAGES.includes(language)) {
    return `${base} IMPORTANT: The user has selected ${language} as their preferred language. You MUST respond ENTIRELY in ${language}. Do not use English at all in your response.`;
  }
  return base;
}

// Chat endpoint - uses Gemini live generation with fallback support.
router.post('/', async (req, res) => {
  const { message, language = 'English' } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        response: findFallbackResponse(message),
        source: 'fallback',
      });
    }

    const systemPrompt = buildSystemPrompt(language);

    const apiRes = await fetch(geminiUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        },
      }),
    });

    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.error('Gemini API error:', errorText);
      return res.json({
        response: findFallbackResponse(message),
        source: 'fallback',
      });
    }

    const data = await apiRes.json();
    const response = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!response) {
      return res.json({
        response: findFallbackResponse(message),
        source: 'fallback',
      });
    }

    return res.json({ response, source: 'gemini' });
  } catch (error) {
    console.error('Chat route error:', error.message);
    return res.json({
      response: findFallbackResponse(message),
      source: 'fallback',
    });
  }
});

module.exports = router;
