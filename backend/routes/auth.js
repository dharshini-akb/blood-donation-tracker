// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const generateToken = (userId, email, role) => {
  return jwt.sign({ id: userId, email, role }, JWT_SECRET, { expiresIn: '7d' });
};


router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, bloodGroup, lastDonation } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['Patient', 'Donor', 'Admin'].includes(role)) {
      return res.status(400).json({ message: 'Role must be Patient, Donor, or Admin' });
    }

    if (role === 'Donor' && !bloodGroup) {
      return res.status(400).json({ message: 'Blood group is required for donors' });
    }

    const useMemory = req.app?.locals?.dbConnected === false;

    if (useMemory) {
      const store = req.app.locals.memoryStore;
      const exists = store.users.find(u => u.email === email);
      if (exists) return res.status(400).json({ message: 'Email already registered' });
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      const id = Date.now().toString();
      const newUser = { id, name, email, password: hashed, role, bloodGroup: role === 'Donor' ? bloodGroup : null, lastDonation: lastDonation ? new Date(lastDonation) : null, createdAt: new Date() };
      store.users.push(newUser);
      req.app.locals.saveStore && req.app.locals.saveStore();
      const token = generateToken(id, email, role);
      return res.status(201).json({ user: { id, name, email, role, bloodGroup: newUser.bloodGroup }, token });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const newUser = new User({ name, email, password, role, ...(role === 'Donor' && { bloodGroup }), ...(lastDonation && { lastDonation }) });
    await newUser.save();
    const token = generateToken(newUser._id, newUser.email, newUser.role);
    res.status(201).json({ user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, bloodGroup: newUser.bloodGroup || null }, token });
  } catch (error) {
    console.error('Registration Error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ---------- Login ----------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const useMemory = req.app?.locals?.dbConnected === false;
    if (useMemory) {
      const store = req.app.locals.memoryStore;
      const user = store.users.find(u => u.email === email);
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      const token = generateToken(user.id, user.email, user.role);
      return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, bloodGroup: user.bloodGroup || null }, token });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = generateToken(user._id, user.email, user.role);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, bloodGroup: user.bloodGroup || null }, token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ---------- Get Current User ----------
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const useMemory = req.app?.locals?.dbConnected === false;
    if (useMemory) {
      const store = req.app.locals.memoryStore;
      const user = store.users.find(u => u.id === decoded.id);
      if (!user) return res.status(401).json({ message: 'User not found' });
      return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, bloodGroup: user.bloodGroup || null } });
    }
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, bloodGroup: user.bloodGroup || null } });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// ---------- Google OAuth Routes ----------
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      const token = generateToken(req.user._id, req.user.email, req.user.role);
      const userInfo = encodeURIComponent(
        JSON.stringify({
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          bloodGroup: req.user.bloodGroup || null,
        })
      );

      res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}&user=${userInfo}`);
    } catch (error) {
      console.error('Google OAuth Error:', error);
      res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
    }
  }
);

module.exports = router;
