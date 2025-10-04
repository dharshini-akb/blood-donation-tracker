const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const { authenticate, requireRole } = require('../middleware/auth');


router.get('/', authenticate, async (req, res) => {
  try {
    const { role, status, bloodGroup } = req.query;
    let query = {};

  
    if (req.user.role === 'Patient') {
      query.patient = req.user._id || req.user.id;
    }
   
    else if (req.user.role === 'Donor') {
     
      const user = await User.findById(req.user._id || req.user.id);
      if (user && user.bloodGroup) {
        query.bloodGroup = user.bloodGroup;
        query.status = 'pending'; 
      }
    }

    
    if (status) query.status = status;
    if (bloodGroup) query.bloodGroup = bloodGroup;

    const schedules = await Schedule.find(query)
      .populate('patient', 'name email contactPhone')
      .populate('donor', 'name email contactPhone')
      .sort({ scheduledDate: 1 });

    res.json(schedules);
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/', authenticate, requireRole('Patient'), async (req, res) => {
  try {
   

    const {
      bloodGroup,
      scheduledDate,
      scheduledTime,
      location,
      notes,
      urgency,
      contactPhone
    } = req.body;

   
    if (!bloodGroup || !scheduledDate || !scheduledTime || !location || !contactPhone) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

   
    const scheduleDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    if (scheduleDateTime <= new Date()) {
      return res.status(400).json({ message: 'Scheduled date must be in the future' });
    }

    const newSchedule = new Schedule({
      patient: (req.user._id || req.user.id),
      bloodGroup,
      scheduledDate,
      scheduledTime,
      location,
      notes,
      urgency: urgency || 'medium',
      contactPhone
    });

    await newSchedule.save();
    await newSchedule.populate('patient', 'name email');

    res.status(201).json(newSchedule);
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    
    if (req.user.role === 'Patient' && schedule.patient.toString() !== String(req.user._id || req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update this schedule' });
    }

    if (req.user.role === 'Donor' && schedule.donor && schedule.donor.toString() !== String(req.user._id || req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update this schedule' });
    }

    if (req.user.role === 'Donor' && status === 'confirmed') {
      
      schedule.donor = (req.user._id || req.user.id);
      schedule.status = 'confirmed';
      if (notes) schedule.notes = notes;
    } else if (req.user.role === 'Patient' && status === 'cancelled') {
     
      schedule.status = 'cancelled';
      if (notes) schedule.notes = notes;
    } else if (status === 'completed') {
     
      schedule.status = 'completed';
      if (notes) schedule.notes = notes;
    } else {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    await schedule.save();
    await schedule.populate('patient', 'name email');
    await schedule.populate('donor', 'name email');

    res.json(schedule);
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get schedule by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findById(id)
      .populate('patient', 'name email contactPhone')
      .populate('donor', 'name email contactPhone');

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Check permissions
    if (req.user.role === 'Patient' && schedule.patient._id.toString() !== String(req.user._id || req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to view this schedule' });
    }

    if (req.user.role === 'Donor' && schedule.donor && schedule.donor._id.toString() !== String(req.user._id || req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to view this schedule' });
    }

    res.json(schedule);
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete schedule (Patient only)
router.delete('/:id', authenticate, requireRole('Patient'), async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Only patient can delete their own schedule
    if (schedule.patient.toString() !== String(req.user._id || req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to delete this schedule' });
    }

    await Schedule.findByIdAndDelete(id);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

