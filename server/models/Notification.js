const mongoose = require('../config/db');

const notificationSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  user: { 
    type: String, 
    ref: 'User',
    required: [true, 'User ID is required.']
  },
  title: { 
    type: String, 
    required: [true, 'Notification title is required.'],
    trim: true 
  },
  message: { 
    type: String, 
    required: [true, 'Notification message is required.'],
    trim: true 
  },
  type: { 
    type: String, 
    enum: ['info', 'success', 'warning', 'reminder'], 
    default: 'info' 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

notificationSchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
