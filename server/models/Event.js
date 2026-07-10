const mongoose = require('../config/db');

const eventSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  title: { 
    type: String, 
    required: [true, 'Event title is required.'],
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, 'Event description is required.'],
    trim: true 
  },
  category: { 
    type: String, 
    required: [true, 'Event category is required.'],
    trim: true 
  },
  venue: { 
    type: String, 
    required: [true, 'Event venue is required.'],
    trim: true 
  },
  date: { 
    type: String, 
    required: [true, 'Event date is required.'] // YYYY-MM-DD
  },
  time: { 
    type: String, 
    required: [true, 'Event time is required.'] // HH:MM
  },
  banner: { 
    type: String, 
    default: '' 
  },
  capacity: { 
    type: Number, 
    required: [true, 'Event capacity is required.'],
    min: [1, 'Capacity must be at least 1.']
  },
  registeredStudents: [{ 
    type: String, 
    ref: 'User',
    default: [] 
  }],
  organizer: { 
    type: String, 
    ref: 'User',
    required: [true, 'Event organizer is required.']
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  }
}, {
  timestamps: true
});

// Indexes for query optimization
eventSchema.index({ status: 1, date: 1 });
eventSchema.index({ organizer: 1 });

module.exports = mongoose.model('Event', eventSchema);
