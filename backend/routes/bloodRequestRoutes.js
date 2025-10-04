const express = require("express");
const router = express.Router();
const BloodRequest = require("../models/BloodRequest");
const { authenticate, requireRole } = require('../middleware/auth');

// POST: Save blood request
router.post("/", async (req, res) => {
  try {
    const newRequest = new BloodRequest(req.body);
    await newRequest.save();
    res.status(201).json({ message: "Blood request saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save blood request", error: err.message });
  }
});

// GET: Get all blood requests (for admin)
router.get("/", authenticate, requireRole('Admin'), async (req, res) => {
  try {
    const requests = await BloodRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch blood requests", error: err.message });
  }
});

module.exports = router;
