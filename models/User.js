const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['student', 'staff'],
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  matricNumber: {
    type: String,
    trim: true,
  },
  department: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
