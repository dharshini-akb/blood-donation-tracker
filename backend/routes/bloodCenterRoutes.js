const express = require("express");
const router = express.Router();
const BloodCenter = require("../models/BloodCenter");
const { authenticate, requireRole } = require('../middleware/auth');

// GET all centers
router.get("/", async (req, res) => {
  try {
    const centers = await BloodCenter.find();
    res.json(centers); // 👈 send array
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new center
router.post("/", authenticate, requireRole('Admin'), async (req, res) => {
  try {
    const center = new BloodCenter(req.body);
    await center.save();
    res.status(201).json(center);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET centers by city (for nearby search)
router.get("/city/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const centers = await BloodCenter.find({ city: new RegExp(`^${city}$`, 'i') });
    res.json(centers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
