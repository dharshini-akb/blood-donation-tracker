const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const Donation = require('../models/Donation');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/blood/availability/:bloodGroup
// @desc    Check blood availability by blood group
// @access  Public
router.get('/availability/:bloodGroup', async (req, res) => {
  try {
    const { bloodGroup } = req.params;
    
    // Validate blood group
    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({ message: 'Invalid blood group' });
    }

    const useMemory = req.app?.locals?.dbConnected === false;
    let enrichedDonors = [];
    if (useMemory) {
      const store = req.app.locals.memoryStore;
      const donors = store.users.filter(u => u.role === 'Donor' && u.bloodGroup === bloodGroup);
      enrichedDonors = donors.map(d => {
        const lastDate = d.lastDonation ? new Date(d.lastDonation) : null;
        const validUntil = lastDate ? new Date(lastDate.getTime() + 120 * 24 * 60 * 60 * 1000) : null;
        const eligible = !lastDate || (Date.now() - (lastDate?.getTime() || 0)) <= 120 * 24 * 60 * 60 * 1000;
        return { name: d.name, contact: d.email, lastDonation: lastDate, validUntil, eligible };
      });
    } else {
      const donors = await User.find({ bloodGroup, role: 'Donor' }).select('name email bloodGroup lastDonation');
      enrichedDonors = await Promise.all(donors.map(async (d) => {
        const lastDonationRecord = await Donation.findOne({ donorEmail: d.email }).sort({ date: -1 }).lean();
        const candidateDate = lastDonationRecord?.date || d.lastDonation || null;
        const lastDate = candidateDate ? new Date(candidateDate) : null;
        const validUntil = lastDate ? new Date(lastDate.getTime() + 120 * 24 * 60 * 60 * 1000) : null;
        const eligible = !lastDate || (Date.now() - (lastDate?.getTime() || 0)) <= 120 * 24 * 60 * 60 * 1000;
        return { name: d.name, contact: d.email, lastDonation: lastDate, validUntil, eligible };
      }));
    }

    const units = enrichedDonors.filter(d => d.eligible).length;
    const isAvailable = units > 0;

    res.json({
      bloodGroup,
      available: isAvailable,
      units,
      donors: enrichedDonors
    });

  } catch (error) {
    console.error('Blood availability check error:', error);
    res.status(500).json({ message: 'Server error while checking blood availability' });
  }
});

// @route   POST /api/blood/request
// @desc    Create a blood request
// @access  Private
router.post('/request', authenticate, requireRole('Patient'), [
  body('patientName').trim().notEmpty().withMessage('Patient name is required'),
  body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood group'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('contact').trim().notEmpty().withMessage('Contact information is required'),
  body('urgency').optional().isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid urgency level'),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { patientName, bloodGroup, location, contact, urgency, notes } = req.body;

    // Create blood request
    const bloodRequest = new BloodRequest({
      patientName,
      bloodGroup,
      location,
      contact,
      urgency: urgency || 'Medium',
      notes,
      requestedBy: req.user._id
    });

    await bloodRequest.save();

    res.status(201).json({
      message: 'Blood request created successfully',
      request: {
        id: bloodRequest._id,
        patientName: bloodRequest.patientName,
        bloodGroup: bloodRequest.bloodGroup,
        location: bloodRequest.location,
        contact: bloodRequest.contact,
        urgency: bloodRequest.urgency,
        status: bloodRequest.status,
        createdAt: bloodRequest.createdAt
      }
    });

  } catch (error) {
    console.error('Blood request creation error:', error);
    res.status(500).json({ message: 'Server error while creating blood request' });
  }
});

// @route   GET /api/blood/requests
// @desc    Get all blood requests (for admin/dashboard)
// @access  Private
router.get('/requests', authenticate, requireRole('Admin'), async (req, res) => {
  try {
    const requests = await BloodRequest.find()
      .populate('requestedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      requests: requests.map(req => ({
        id: req._id,
        patientName: req.patientName,
        bloodGroup: req.bloodGroup,
        location: req.location,
        contact: req.contact,
        urgency: req.urgency,
        status: req.status,
        requestedBy: req.requestedBy,
        createdAt: req.createdAt,
        updatedAt: req.updatedAt
      }))
    });

  } catch (error) {
    console.error('Blood requests fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching blood requests' });
  }
});

// @route   GET /api/blood/requests/my
// @desc    Get current user's blood requests
// @access  Private
router.get('/requests/my', authenticate, async (req, res) => {
  try {
    const requests = await BloodRequest.find({ requestedBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      requests: requests.map(req => ({
        id: req._id,
        patientName: req.patientName,
        bloodGroup: req.bloodGroup,
        location: req.location,
        contact: req.contact,
        urgency: req.urgency,
        status: req.status,
        createdAt: req.createdAt,
        updatedAt: req.updatedAt
      }))
    });

  } catch (error) {
    console.error('User blood requests fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching user blood requests' });
  }
});

// @route   PUT /api/blood/requests/:id/status
// @desc    Update blood request status
// @access  Private
router.put('/requests/:id/status', authenticate, [
  body('status').isIn(['Pending', 'In Progress', 'Fulfilled', 'Cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const useMemory = req.app?.locals?.dbConnected === false;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    if (useMemory) {
      const store = req.app.locals.memoryStore;
      const idx = store.bloodRequests.findIndex(r => r.id === id);
      if (idx === -1) return res.status(404).json({ message: 'Blood request not found' });
      if (req.role !== 'Admin') return res.status(403).json({ message: 'Not authorized to update this request' });
      store.bloodRequests[idx].status = status;
      store.bloodRequests[idx].updatedAt = new Date();
      req.app.locals.saveStore && req.app.locals.saveStore();
      return res.json({ message: 'Blood request status updated successfully', request: { id, status, updatedAt: store.bloodRequests[idx].updatedAt } });
    }

    const bloodRequest = await BloodRequest.findById(id);
    
    if (!bloodRequest) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    // Only allow the requester or admin to update status
    if (req.role !== 'Admin' && bloodRequest.requestedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    bloodRequest.status = status;
    await bloodRequest.save();

    res.json({
      message: 'Blood request status updated successfully',
      request: {
        id: bloodRequest._id,
        status: bloodRequest.status,
        updatedAt: bloodRequest.updatedAt
      }
    });

  } catch (error) {
    console.error('Blood request status update error:', error);
    res.status(500).json({ message: 'Server error while updating blood request status' });
  }
});

module.exports = router;

