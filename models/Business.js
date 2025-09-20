const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxLength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['Food & Drink', 'Local Shopping', 'Arts & Culture', 'Nightlife & Events', 'Services']
  },
  priceLevel: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$']
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    }
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    }
  },
  contactInfo: {
    phoneNumber: {
      type: String
    },
    website: {
      type: String
    }
  },
  hoursOfOperation: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  amenities: [String],
  coverImage: {
    type: String
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, { timestamps: true });

// Create 2dsphere index for geospatial queries
businessSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Business', businessSchema);
