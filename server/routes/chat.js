const express = require('express');
const router = express.Router();

const GEMINI_MODEL = 'gemini-2.5-flash-lite';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function buildSystemPrompt(language) {
  return `You are a compassionate, non-judgmental AI mental health companion for AnonyTalk, an anonymous support platform primarily used in India. Your role is to listen, validate feelings, and offer supportive guidance.

Guidelines:
- Be warm, empathetic, and supportive — never clinical or dismissive
- Respond in ${language || 'English'} if the user writes in that language; otherwise respond in English
- For crisis situations (self-harm, suicide), always provide Indian helplines: iCall: 9152987821, Vandrevala Foundation: 1860-2662-345 (24/7), AASRA: 9820466627
- Do not diagnose or prescribe medication
- Keep responses concise (3-5 sentences) unless the user needs more
- Acknowledge cultural context relevant to India (family pressure, academic stress, arranged marriages, social stigma around mental health)
- Encourage professional help when appropriate
- Never share personal opinions on religion, politics, or social issues`;
}

// Hardcoded fallback responses
const chatbotResponses = new Map([
  // Depression
  ['feel sad', "I'm really sorry you're feeling this way. Sadness can feel overwhelming, but you don't have to face it alone. Can you tell me more about what's been going on?"],
  ['depressed', "Depression is real and it's hard. What you're feeling is valid. Many people go through this, and with support, things can get better. Would you like to talk about what's weighing on you?"],
  ['no motivation', "Losing motivation can be exhausting. Sometimes it's our mind's way of asking for rest or change. What does a typical day look like for you lately?"],
  ['empty inside', "Feeling empty is one of the hardest emotions to carry. I hear you. Would you like to talk about when this feeling started or what might be behind it?"],
  ['worthless', "You are not worthless — even if it feels that way right now. These feelings often come from pain, not truth. I'd love to understand what's been making you feel this way."],
  ['hopeless', "Feeling hopeless can make everything seem pointless, but these feelings can change. You reached out today, and that matters. What's been happening in your life recently?"],
  ['crying', "It's okay to cry — sometimes we need to let it out. You're safe here. What's been on your mind or heart?"],
  ['nothing matters', "When nothing feels like it matters, it's often a sign that something important to you has been lost or hurt. Can you share more about what's going on?"],

  // Anxiety
  ['anxious', "Anxiety can feel like your mind won't stop racing. Take a slow breath with me. Can you tell me what's making you feel anxious?"],
  ['anxiety', "I understand — anxiety can be really overwhelming. You're not alone in this. What's triggering these feelings right now?"],
  ['panic', "Panic attacks are terrifying but they do pass. Try breathing in for 4 counts, hold for 4, out for 4. Are you somewhere safe right now?"],
  ['panic attack', "You're going to be okay. Focus on 5 things you can see, 4 you can touch, 3 you can hear. Breathe slowly. I'm here with you."],
  ['worried', "Worry can take over our whole mind sometimes. What's been on your mind the most? Talking it through can help."],
  ['scared', "It's okay to feel scared. Fear is a signal, not a verdict. Can you tell me what's frightening you?"],
  ['overthinking', "Overthinking is exhausting — your mind keeps looping without finding answers. Let's slow it down together. What thought keeps coming back to you?"],
  ['stress', "Stress can build up silently until it's too much. You're right to acknowledge it. What's putting the most pressure on you right now?"],
  ['stressed', "It sounds like you're carrying a lot. Stress has a way of piling up. What's the biggest thing weighing on you today?"],

  // Crisis / Self-harm
  ['suicidal', "I'm really concerned about you right now, and I'm glad you're talking to me. Please reach out immediately: iCall: 9152987821 | Vandrevala Foundation: 1860-2662-345 (24/7) | AASRA: 9820466627. You matter, and people want to help you."],
  ['want to die', "I hear you, and I'm taking this seriously. Please contact iCall at 9152987821 or Vandrevala Foundation at 1860-2662-345 — they're available 24/7 and want to help. You don't have to face this alone."],
  ['end my life', "Please don't do this alone. Call AASRA at 9820466627 or iCall at 9152987821 right now. You are worth fighting for. Can you tell me if you're safe right now?"],
  ['hurt myself', "I'm worried about your safety. Please reach out to iCall (9152987821) or Vandrevala Foundation (1860-2662-345). Are you somewhere safe? Can you talk to someone near you?"],
  ['self harm', "I care about your safety. Please talk to someone right now — iCall: 9152987821, Vandrevala Foundation: 1860-2662-345 (24/7). I'm also here to listen — what's brought you to this point?"],
  ['kill myself', "Please reach out to a crisis line immediately: iCall: 9152987821 | AASRA: 9820466627 | Vandrevala: 1860-2662-345. I'm here with you. Are you safe right now?"],

  // Relationships
  ['breakup', "Breakups are genuinely painful — you're grieving someone who was part of your life. It's okay to feel devastated. How are you holding up?"],
  ['heartbroken', "Heartbreak is one of the most real kinds of pain. Give yourself permission to grieve. What happened, if you'd like to share?"],
  ['lonely', "Loneliness can feel incredibly isolating, even when people are around. You're not alone in feeling this way. What's been making you feel disconnected?"],
  ['alone', "Feeling alone is painful. I'm here and I'm listening. What's going on in your life right now?"],
  ['toxic relationship', "Recognizing toxicity takes courage. Your wellbeing matters. Can you tell me more about the situation? It helps to talk it through."],
  ['abusive', "No one deserves abuse. Your safety and wellbeing come first. Would you like to talk about your situation and explore your options?"],
  ['cheating', "Betrayal cuts deep. It's normal to feel a mix of hurt, anger, and confusion. What would help you most right now — to vent, to think through options, or just to be heard?"],
  ['divorce', "Divorce is a major life transition, and it's natural to feel grief, relief, anger, or all at once. How are you processing everything?"],
  ['fight with', "Conflict in relationships is stressful. What happened, and how are you feeling about it now?"],

  // Family & Indian context
  ['family pressure', "Family expectations in India can feel immense — especially around career, marriage, or lifestyle. You're not alone in feeling this weight. What's being expected of you?"],
  ['parents', "It can be hard when parents don't understand or agree with your choices. Family relationships are complex. What's the situation at home?"],
  ['arranged marriage', "Navigating arranged marriage expectations can feel overwhelming, especially if it conflicts with what you want. Can you share more about what you're going through?"],
  ['academic pressure', "Academic pressure in India is intense — boards, entrance exams, college, placements. It can feel like your entire worth is tied to marks. That's not true. What are you facing?"],
  ['exam', "Exam stress is real and valid. It's okay to feel overwhelmed. Let's talk about what you're facing — sometimes saying it out loud helps."],
  ['job', "Career pressure and job stress can take a real toll on mental health. What's going on with your work situation?"],
  ['career', "Career decisions carry so much weight, especially with family expectations. What's weighing on you about your career?"],

  // Identity
  ['identity', "Figuring out who you are is a profound and sometimes painful journey. What aspects of your identity are you exploring or struggling with?"],
  ['lgbtq', "You deserve to be seen and accepted for who you are. In India, navigating identity can be especially hard. I'm here to listen without judgment. How are you doing?"],
  ['coming out', "Coming out takes incredible courage, especially in a conservative environment. How are you feeling about it? Do you have support around you?"],
  ['gender', "Questions around gender identity are deeply personal. I'm here to listen and support, not judge. What's on your mind?"],

  // General wellbeing
  ['sleep', "Sleep problems often go hand in hand with stress, anxiety, or depression. How long has this been going on, and what does your mind do when you try to sleep?"],
  ['cant sleep', "Not being able to sleep makes everything harder. What's keeping you awake — racing thoughts, worry, or something else?"],
  ['tired', "Feeling tired all the time — especially emotionally — is a sign your mind and body need care. What's been draining you?"],
  ['exhausted', "Emotional exhaustion is real and serious. You deserve rest and support. What's been taking the most out of you?"],
  ['burnout', "Burnout sneaks up quietly and then hits all at once. You've been pushing through for too long. What does your daily life look like right now?"],
  ['no one understands', "Feeling misunderstood is deeply isolating. I want to understand — tell me more about what you're going through."],
  ['cant talk to anyone', "It takes courage to reach out even here. I'm glad you did. You can say anything — this is a safe, anonymous space."],
  ['help', "I'm here to help. What's going on? You can share as much or as little as you're comfortable with."],
  ['not okay', "Thank you for being honest. It's okay to not be okay. Can you tell me more about what you're feeling right now?"],

  // Positive / General chat
  ['thank you', "You're very welcome. Remember, reaching out is always a sign of strength. I'm here whenever you need to talk."],
  ['thanks', "Of course. Take care of yourself — you matter. Come back anytime you need to talk."],
  ['hello', "Hi there! I'm your AnonyTalk companion. This is a safe, anonymous space. How are you feeling today?"],
  ['hi', "Hello! I'm here to listen and support you. How are you doing today?"],
  ['how are you', "I'm here and ready to listen to you! More importantly — how are *you* doing?"],
]);

function getFallbackResponse(message) {
  const lower = message.toLowerCase();
  for (const [keyword, response] of chatbotResponses) {
    if (lower.includes(keyword)) return response;
  }
  return "I hear you, and I'm here to listen. Can you tell me more about what's on your mind? This is a safe, anonymous space — you can share freely.";
}

router.post('/', async (req, res) => {
  const { message, language = 'English' } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  if (!GEMINI_API_KEY) {
    const response = getFallbackResponse(message);
    return res.json({ response, source: 'fallback' });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const body = {
      system_instruction: {
        parts: [{ text: buildSystemPrompt(language) }]
      },
      contents: [
        { role: 'user', parts: [{ text: message }] }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300,
      }
    };

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.json().catch(() => ({}));
      console.error('Gemini API error:', err);
      return res.json({ response: getFallbackResponse(message), source: 'fallback' });
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.json({ response: getFallbackResponse(message), source: 'fallback' });
    }

    res.json({ response: text.trim(), source: 'gemini' });
  } catch (err) {
    console.error('Chat route error:', err);
    res.json({ response: getFallbackResponse(message), source: 'fallback' });
  }
});

module.exports = router;
