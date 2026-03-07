const express = require('express');
const router = express.Router();

// Chatbot responses - moved from client-side to server
const chatbotResponses = {
  "why do i feel sad all the time?": "Feeling sad all the time can be caused by various factors such as stress, hormonal imbalances, unresolved trauma, or depression. It's important to identify the root cause. Consider speaking to a trusted friend, therapist, or counselor for support.",
  "why do i feel empty inside?": "Feeling empty inside may stem from emotional numbness, unresolved grief, depression, or disconnection from your emotions or purpose. It's important to explore these feelings with a therapist or trusted person.",
  "what are the signs of depression?": "Common signs include persistent sadness, loss of interest in activities, changes in sleep/appetite, fatigue, feelings of worthlessness, difficulty concentrating, and thoughts of death or suicide. If these persist for weeks, seek professional help.",
  "why do i cry for no reason?": "Crying 'for no reason' can result from built-up stress, hormonal changes, or subconscious emotional triggers. It's a natural release—but if it happens frequently, consider talking to a therapist.",
  "why do i feel tired even after sleeping?": "Chronic fatigue despite sleep could indicate poor sleep quality, depression, anxiety, or physical health issues like anemia. Track your habits and consult a healthcare provider.",
  "is it normal to feel hopeless?": "Occasional hopelessness is normal, but if it lingers, it may signal depression. Reach out to a mental health professional or support network.",
  "why do i feel like i'm not good enough?": "This often ties to low self-esteem, past criticism, or societal pressures. Practice self-compassion and challenge negative thoughts. Therapy can help rebuild self-worth.",
  "why do i overthink everything?": "Overthinking may stem from anxiety, fear of failure, or perfectionism. Techniques like mindfulness, journaling, or cognitive-behavioral strategies can help break the cycle.",
  "how do i stop feeling numb?": "Numbness can be a coping mechanism for overwhelm. Grounding exercises, creative expression, or therapy can help you reconnect with emotions safely.",
  "why do i feel like no one understands me?": "Feeling misunderstood may arise from communication gaps or loneliness. Opening up to empathetic listeners or joining supportive communities can foster connection.",
  "why do i feel lonely even around people?": "Loneliness in crowds often reflects a lack of meaningful connection. Focus on deepening relationships or engaging in activities that align with your values.",
  "how do i deal with loneliness?": "Combat loneliness by reaching out to loved ones, joining clubs/volunteer groups, or exploring hobbies. Therapy can also help address underlying social anxieties.",
  "how do i deal with anxiety?": "Practice deep breathing, grounding techniques (e.g., 5-4-3-2-1 method), or challenge anxious thoughts with logic. Therapy can also provide long-term tools.",
  "can i vent to you?": "Absolutely. I'm here to listen without judgment. Venting can help process emotions—feel free to share whatever's on your mind.",
  "will you judge me if i tell you something?": "No judgment here. This is a safe space to express yourself openly and honestly.",
  "can i talk to you about my problems?": "Of course. I'm available 24/7 to help you navigate challenges or just lend an ear.",
  "can you help me calm down?": "Try this: Inhale for 4 counts, hold for 4, exhale for 6. Repeat. Visualize a peaceful place—I'll guide you through it if you'd like.",
  "how do i get over a breakup?": "Allow yourself to grieve, lean on support systems, and focus on self-care. Time and new experiences will gradually ease the pain.",
  "how do i stop feeling lazy?": "'Laziness' is often fatigue or lack of motivation. Start with tiny tasks to build momentum, and reward progress.",
  "can you tell me a joke?": "Why don't skeletons fight each other? They don't have the *guts*! 😄",
  "what's the meaning of life?": "It's subjective! Philosophers say it's about happiness, love, or purpose—what feels meaningful to *you*?",
  "can we play a game?": "Sure! Let's play trivia: What has keys but can't open locks? (Answer: A piano!)",
  "how do i gain more confidence?": "Start with small challenges, celebrate wins, and replace self-doubt with affirmations like 'I am capable.'",
  "what should i do when i feel overwhelmed?": "Pause, take deep breaths, and break the situation into smaller tasks. Prioritize what's urgent and delegate or postpone the rest.",
  "how do i stop procrastinating?": "Procrastination links to fear of failure or overwhelm. Break tasks into steps and start with the easiest one.",
  "how do i become a better person?": "Reflect on values, practice empathy, and learn from mistakes. Growth is a lifelong journey—be patient with yourself.",
};

// Chat endpoint - finds best matching response
router.post('/', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const lowerMsg = message.toLowerCase().trim();

  // Exact match
  if (chatbotResponses[lowerMsg]) {
    return res.json({ response: chatbotResponses[lowerMsg] });
  }

  // Fuzzy match - find the best matching key
  let bestMatch = null;
  let bestScore = 0;

  for (const key of Object.keys(chatbotResponses)) {
    const words = key.split(' ');
    const matchCount = words.filter(w => lowerMsg.includes(w)).length;
    const score = matchCount / words.length;
    if (score > bestScore && score > 0.4) {
      bestScore = score;
      bestMatch = key;
    }
  }

  if (bestMatch) {
    return res.json({ response: chatbotResponses[bestMatch] });
  }

  res.json({
    response: "I hear you. While I may not have the perfect answer, know that your feelings are valid. Would you like to talk more about what's on your mind?"
  });
});

module.exports = router;
