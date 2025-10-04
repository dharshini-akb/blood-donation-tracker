const mongoose = require('mongoose');

const voluntaryCampSchema = new mongoose.Schema({
  campName: {
    type: String,
    required: [true, 'Camp name is required'],
    trim: true,
    minlength: [3, 'Camp name must be at least 3 characters long']
  },
  organizerName: {
    type: String,
    required: [true, 'Organizer name is required'],
    trim: true,
    minlength: [2, 'Organizer name must be at least 2 characters long']
  },
  organizerEmail: {
    type: String,
    required: [true, 'Organizer email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  organizerPhone: {
    type: String,
    required: [true, 'Organizer phone is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Camp date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  expectedDonors: {
    type: Number,
    required: [true, 'Expected number of donors is required'],
    min: [10, 'Expected donors must be at least 10'],
    max: [1000, 'Expected donors cannot exceed 1000']
  },
  description: {
    type: String,
    required: [true, 'Camp description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters long']
  },
  requirements: {
    type: String,
    required: [true, 'Donor requirements are required'],
    trim: true
  },
  facilities: [{
    type: String,
    trim: true
  }],
  additionalInfo: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VoluntaryCamp', voluntaryCampSchema);
