const mongoose = require('../config/db');

const attendanceSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  student: { 
    type: String, 
    ref: 'User',
    required: [true, 'Student ID is required.']
  },
  event: { 
    type: String, 
    ref: 'Event',
    required: [true, 'Event ID is required.']
  },
  attendanceStatus: { 
    type: String, 
    enum: ['present', 'absent'], 
    default: 'present' 
  },
  checkInTime: { 
    type: String, 
    required: [true, 'Check-in time is required.'] // ISO string
  }
}, {
  timestamps: true
});

// Indexes for analytical lookups
attendanceSchema.index({ event: 1 });
attendanceSchema.index({ student: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
