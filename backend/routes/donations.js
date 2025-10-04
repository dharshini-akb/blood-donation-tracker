const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

// POST: Create donation schedule
router.post('/', async (req, res) => {
  try {
    const { centerId, centerName, donorName, donorEmail, date, time } = req.body;

    if (!centerId || !centerName || !donorName || !donorEmail || !date || !time) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const donation = new Donation({
      centerId,
      centerName,
      donorName,
      donorEmail,
      date,
      time
    });

    await donation.save();

    res.status(201).json({
      message: 'Donation scheduled successfully! You will receive a confirmation email shortly.',
      donation: {
        id: donation._id,
        centerName: donation.centerName,
        date: donation.date,
        time: donation.time,
        status: donation.status
      }
    });
  } catch (error) {
    console.error('Schedule donation error:', error);
    res.status(500).json({ message: 'Failed to schedule donation' });
  }
});

// GET: Get all donations (for admin)
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ message: 'Failed to fetch donations' });
  }
});

module.exports = router;
