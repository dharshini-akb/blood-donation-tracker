const express = require('express');
const { body, validationResult } = require('express-validator');
const VoluntaryCamp = require('../models/VoluntaryCamp');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/voluntary-camp/register
// @desc    Register a new voluntary blood camp
// @access  Public
router.post('/register', [
  body('campName').trim().isLength({ min: 3 }).withMessage('Camp name must be at least 3 characters long'),
  body('organizerName').trim().isLength({ min: 2 }).withMessage('Organizer name must be at least 2 characters long'),
  body('organizerEmail').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('organizerPhone').notEmpty().withMessage('Phone number is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('date').isISO8601().withMessage('Please provide a valid date'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('endTime').notEmpty().withMessage('End time is required'),
  body('expectedDonors').isInt({ min: 10, max: 1000 }).withMessage('Expected donors must be between 10 and 1000'),
  body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters long'),
  body('requirements').trim().notEmpty().withMessage('Donor requirements are required')
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

    const {
      campName,
      organizerName,
      organizerEmail,
      organizerPhone,
      city,
      address,
      date,
      startTime,
      endTime,
      expectedDonors,
      description,
      requirements,
      facilities,
      additionalInfo
    } = req.body;

    // Create new voluntary camp
    const useMemory = req.app?.locals?.dbConnected === false;
    if (useMemory) {
      const store = req.app.locals.memoryStore;
      const voluntaryCamp = {
        id: Date.now().toString(),
        campName,
        organizerName,
        organizerEmail,
        organizerPhone,
        city,
        address,
        date,
        startTime,
        endTime,
        expectedDonors,
        description,
        requirements,
        facilities: facilities || [],
        additionalInfo: additionalInfo || '',
        status: 'pending',
        createdAt: new Date()
      };
      store.voluntaryCamps.push(voluntaryCamp);
      req.app.locals.saveStore && req.app.locals.saveStore();
      return res.status(201).json({ message: 'Voluntary blood camp registered successfully! We will review your application and contact you within 2-3 business days.', camp: { id: voluntaryCamp.id, campName: voluntaryCamp.campName, status: voluntaryCamp.status } });
    }

    const voluntaryCamp = new VoluntaryCamp({
      campName,
      organizerName,
      organizerEmail,
      organizerPhone,
      city,
      address,
      date,
      startTime,
      endTime,
      expectedDonors,
      description,
      requirements,
      facilities: facilities || [],
      additionalInfo: additionalInfo || ''
    });

    await voluntaryCamp.save();

    res.status(201).json({
      message: 'Voluntary blood camp registered successfully! We will review your application and contact you within 2-3 business days.',
      camp: {
        id: voluntaryCamp._id,
        campName: voluntaryCamp.campName,
        status: voluntaryCamp.status
      }
    });

  } catch (error) {
    console.error('Voluntary camp registration error:', error);
    res.status(500).json({ message: 'Server error during camp registration' });
  }
});

// @route   GET /api/voluntary-camp/all
// @desc    Get all voluntary camps (for admin)
// @access  Private
router.get('/all', authenticate, requireRole('Admin'), async (req, res) => {
  try {
    const useMemory = req.app?.locals?.dbConnected === false;
    if (useMemory) {
      const store = req.app.locals.memoryStore;
      return res.json({ camps: store.voluntaryCamps });
    }
    const camps = await VoluntaryCamp.find().sort({ createdAt: -1 });
    res.json({ camps });
  } catch (error) {
    console.error('Error fetching voluntary camps:', error);
    res.status(500).json({ message: 'Server error while fetching camps' });
  }
});

// @route   GET /api/voluntary-camp/pending
// @desc    Get pending voluntary camps (for admin)
// @access  Private
router.get('/pending', authenticate, requireRole('Admin'), async (req, res) => {
  try {
    const useMemory = req.app?.locals?.dbConnected === false;
    if (useMemory) {
      const store = req.app.locals.memoryStore;
      const camps = store.voluntaryCamps.filter(c => c.status === 'pending');
      return res.json({ camps });
    }
    const camps = await VoluntaryCamp.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json({ camps });
  } catch (error) {
    console.error('Error fetching pending camps:', error);
    res.status(500).json({ message: 'Server error while fetching pending camps' });
  }
});

// @route   PUT /api/voluntary-camp/:id/status
// @desc    Update camp status (for admin)
// @access  Private
router.put('/:id/status', authenticate, requireRole('Admin'), [
  body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const useMemory = req.app?.locals?.dbConnected === false;
    const { status } = req.body;

    if (useMemory) {
      const store = req.app.locals.memoryStore;
      const idx = store.voluntaryCamps.findIndex(c => c.id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Camp not found' });
      store.voluntaryCamps[idx].status = status;
      store.voluntaryCamps[idx].updatedAt = new Date();
      req.app.locals.saveStore && req.app.locals.saveStore();
      return res.json({
        message: 'Camp status updated successfully',
        camp: { id: store.voluntaryCamps[idx].id, campName: store.voluntaryCamps[idx].campName, status: store.voluntaryCamps[idx].status }
      });
    }

    const camp = await VoluntaryCamp.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }

    res.json({
      message: 'Camp status updated successfully',
      camp: {
        id: camp._id,
        campName: camp.campName,
        status: camp.status
      }
    });

  } catch (error) {
    console.error('Error updating camp status:', error);
    res.status(500).json({ message: 'Server error while updating camp status' });
  }
});

module.exports = router;
