const mongoose = require('../config/db');

const clubSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { 
    type: String, 
    required: [true, 'Club name is required.'],
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, 'Club description is required.'],
    trim: true 
  },
  logo: { 
    type: String, 
    default: '' 
  },
  coordinator: { 
    type: String, 
    ref: 'User',
    required: [true, 'Club coordinator is required.']
  },
  members: [{ 
    type: String, 
    ref: 'User',
    default: [] 
  }],
  category: { 
    type: String, 
    required: [true, 'Club category is required.'],
    trim: true 
  }
}, {
  timestamps: true
});

// Category index for search filters
clubSchema.index({ category: 1 });

module.exports = mongoose.model('Club', clubSchema);
