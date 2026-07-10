const mongoose = require('../config/db');

const registrationSchema = new mongoose.Schema({
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
  registrationDate: { 
    type: String, 
    required: [true, 'Registration date is required.'] // YYYY-MM-DD
  },
  qrCode: { 
    type: String, 
    required: [true, 'QR code data is required.'] 
  },
  status: { 
    type: String, 
    enum: ['registered', 'cancelled'], 
    default: 'registered' 
  }
}, {
  timestamps: true
});

// Partial unique compound index: prevent duplicate active registrations per student-event pair
registrationSchema.index(
  { student: 1, event: 1 },
  { unique: true, partialFilterExpression: { status: 'registered' } }
);

module.exports = mongoose.model('Registration', registrationSchema);
