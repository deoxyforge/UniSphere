const mongoose = require('../config/db');

const userSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { 
    type: String, 
    required: [true, 'Name is required.'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required.'], 
    unique: true, 
    trim: true, 
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address.']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required.'],
    minlength: [8, 'Password must be at least 8 characters long.']
  },
  role: { 
    type: String, 
    enum: ['Student', 'Faculty', 'Admin'], 
    default: 'Student' 
  },
  department: { 
    type: String, 
    default: '',
    trim: true 
  },
  profileImage: { 
    type: String, 
    default: '' 
  },
  biography: {
    type: String,
    default: '',
    trim: true
  },
  skills: {
    type: [String],
    default: []
  },
  interests: { 
    type: [String], 
    default: [] 
  },
  joinedClubs: [{ 
    type: String, 
    ref: 'Club',
    default: [] 
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
