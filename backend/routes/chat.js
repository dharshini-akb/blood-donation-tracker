const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Use dynamic import for node-fetch (ESM)
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));

const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-pro';

// Static responses for blood donation chatbot
const getStaticResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! I'm here to help you with blood donation information. You can ask me about eligibility, benefits, blood groups, or any other donation-related questions.";
  }
  
  if (message.includes('eligibility') || message.includes('eligible') || message.includes('can i donate')) {
    return "To donate blood, you must be: 18-65 years old, weigh at least 50kg, be in good health, not have certain medical conditions, and not be pregnant or breastfeeding. You should also wait 56 days between donations.";
  }
  
  if (message.includes('benefits') || message.includes('good') || message.includes('help')) {
    return "Blood donation benefits include: reducing risk of heart disease, burning calories (up to 650 per donation), stimulating blood cell production, and most importantly, saving lives! One donation can save up to 3 lives.";
  }
  
  if (message.includes('blood group') || message.includes('blood type') || message.includes('compatibility')) {
    return "Blood group compatibility: O- can donate to all, O+ can donate to O+ and A+, A- can donate to A- and A+, A+ can donate to A+ and AB+, B- can donate to B- and B+, B+ can donate to B+ and AB+, AB- can donate to AB- and AB+, AB+ can only donate to AB+.";
  }
  
  if (message.includes('how often') || message.includes('frequency') || message.includes('when')) {
    return "You can donate blood every 56 days (about 8 weeks). Men can donate up to 6 times per year, women up to 4 times per year. Always wait the full 56 days between donations.";
  }
  
  if (message.includes('before donation') || message.includes('prepare') || message.includes('what to do')) {
    return "Before donating: eat a healthy meal, drink plenty of water, get good sleep, bring ID, avoid alcohol 24 hours before, and inform staff of any medications you're taking.";
  }
  
  if (message.includes('after donation') || message.includes('recovery') || message.includes('care')) {
    return "After donating: rest for 10-15 minutes, drink extra fluids, avoid heavy lifting for 24 hours, eat iron-rich foods, and contact us if you feel unwell. Your body replaces the blood within 4-8 weeks.";
  }
  
  if (message.includes('find') || message.includes('where') || message.includes('location') || message.includes('blood bank')) {
    return "You can find blood banks and donation centers through our Blood Center Directory feature. We also have information about upcoming blood donation camps in your area.";
  }
  
  if (message.includes('schedule') || message.includes('book') || message.includes('appointment')) {
    return "You can schedule a donation through our Blood Donation Schedule feature. This helps us plan better and ensures you get a convenient time slot.";
  }
  
  if (message.includes('fear') || message.includes('scared') || message.includes('nervous') || message.includes('pain')) {
    return "It's normal to feel nervous! The needle prick is brief and similar to a blood test. Our staff are trained professionals who will make you comfortable. The entire process takes about 10-15 minutes.";
  }
  
  if (message.includes('thank') || message.includes('thanks')) {
    return "You're welcome! Thank you for considering blood donation. Every donation makes a difference and helps save lives. Feel free to ask if you have more questions!";
  }
  
  // Default response
  return "I'm here to help with blood donation questions! You can ask about eligibility, benefits, blood groups, scheduling, preparation tips, or anything else related to blood donation. What would you like to know?";
};

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'messages array is required' });
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage.content || '';

    // Try OpenAI if configured
    if (AI_PROVIDER === 'openai' && OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here') {
      try {
        const payload = {
          model: OPENAI_MODEL,
          temperature: 0.6,
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant for a blood donation tracker. Answer clearly and accurately. If a medical question requires professional advice, recommend consulting a healthcare provider.'
            },
            ...messages.map(m => ({ role: m.role || 'user', content: String(m.content || '') }))
          ]
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data?.choices?.[0]?.message?.content || '';
          if (reply) {
            return res.json({ reply: String(reply).trim() });
          }
        }
      } catch (error) {
        console.log('OpenAI API failed, falling back:', error.message);
      }
    }

    // Try Gemini API first if available
    if (AI_PROVIDER === 'gemini' && GEMINI_API_KEY && GEMINI_API_KEY !== 'your-gemini-api-key-here') {
      try {
        // Build conversation for Gemini: prepend a system-style instruction, then all prior messages
        const systemInstruction =
          'You are a helpful AI assistant for a blood donation tracker. Answer clearly and accurately about: blood donation eligibility, frequency, benefits/risks, blood group compatibility, finding blood banks, scheduling donations, and general guidance. If a medical question requires a professional, advise consulting a doctor. Be concise and friendly.';

        const contents = [
          { role: 'user', parts: [{ text: systemInstruction }] },
          ...messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: String(m.content || '') }]
          }))
        ];

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.6,
              topK: 40,
              topP: 0.9,
              maxOutputTokens: 1024
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (content) {
            const reply = String(content).replace(/^\s+|\s+$/g, '');
            return res.json({ reply });
          }
        }
      } catch (error) {
        console.log('Gemini API failed, using static response:', error.message);
      }
    }

    // Fallback to static responses
    const reply = getStaticResponse(userMessage);
    return res.json({ reply });

  } catch (err) {
    console.error('Chat proxy error:', err);
    // Fallback to static response on any error
    const reply = getStaticResponse('help');
    return res.json({ reply });
  }
});

module.exports = router;

router.post('/stream', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).setHeader('Content-Type', 'text/plain');
      return res.end('');
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.flushHeaders && res.flushHeaders();

    if (AI_PROVIDER === 'openai' && OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here') {
      const payload = {
        model: OPENAI_MODEL,
        stream: true,
        temperature: 0.6,
        messages: [
          { role: 'system', content: 'You are an AI assistant for a blood donation tracker. Answer clearly and accurately. If a medical question requires professional advice, recommend consulting a healthcare provider.' },
          ...messages.map(m => ({ role: m.role || 'user', content: String(m.content || '') }))
        ]
      };
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok || !response.body) {
        res.status(500);
        return res.end('');
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        done = d;
        if (value) {
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const data = trimmed.replace(/^data:\s*/, '');
            if (data === '[DONE]') continue;
            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta?.content || '';
              if (delta) res.write(delta);
            } catch {}
          }
        }
      }
      return res.end();
    }

    if (GEMINI_API_KEY && AI_PROVIDER === 'gemini' && GEMINI_API_KEY !== 'your-gemini-api-key-here') {
      try {
        const systemInstruction = 'You are a helpful AI assistant for a blood donation tracker.';
        const contents = [
          { role: 'user', parts: [{ text: systemInstruction }] },
          ...messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: String(m.content || '') }] }))
        ];
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents, generationConfig: { temperature: 0.6, topK: 40, topP: 0.9, maxOutputTokens: 1024 } })
        });
        if (response.ok) {
          const data = await response.json();
          const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (content) res.write(String(content).trim());
          return res.end();
        }
      } catch {}
    }

    const reply = getStaticResponse(String(messages[messages.length - 1]?.content || ''));
    res.write(reply);
    return res.end();
  } catch (err) {
    res.status(500).end('');
  }
});


