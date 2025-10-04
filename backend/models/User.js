const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email',
    ],
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; 
    },
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, 
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['Patient', 'Donor', 'Admin'],
    default: 'Patient',
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: function () {
      return this.role === 'Donor';
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};


module.exports = mongoose.model('User', userSchema);
