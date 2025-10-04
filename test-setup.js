// Test script to verify Gemini API and MongoDB connections
const mongoose = require('mongoose');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));
require('dotenv').config();

async function testSetup() {
  console.log('🧪 Testing Blood Donation Tracker Setup...\n');

  // Test MongoDB connection
  console.log('1. Testing MongoDB connection...');
  try {
    const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blood-donation-tracker';
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully\n');
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
    return;
  }

  // Test Gemini API
  console.log('2. Testing Gemini API...');
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.log('❌ GEMINI_API_KEY not found in .env file');
      return;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: 'Hello! Can you help me with blood donation information?' }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log('✅ Gemini API working!');
      console.log('🤖 AI Response:', reply?.substring(0, 100) + '...\n');
    } else {
      console.log('❌ Gemini API error:', await response.text());
    }
  } catch (error) {
    console.log('❌ Gemini API test failed:', error.message);
  }

  // Test database models
  console.log('3. Testing database models...');
  try {
    const Donation = require('./models/Donation');
    const BloodRequest = require('./models/BloodRequest');
    const VoluntaryCamp = require('./models/VoluntaryCamp');
    
    console.log('✅ All models loaded successfully\n');
  } catch (error) {
    console.log('❌ Model loading failed:', error.message);
  }

  console.log('🎉 Setup test completed!');
  console.log('\nNext steps:');
  console.log('1. Run: npm start (in backend directory)');
  console.log('2. Run: npm start (in frontend directory)');
  console.log('3. Open: http://localhost:3000');
  console.log('4. Test chat and schedule donation features');

  process.exit(0);
}

testSetup();
