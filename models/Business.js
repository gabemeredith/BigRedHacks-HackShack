const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [200, 'Business name cannot exceed 200 characters']
  },
  category: { 
    type: String, 
    trim: true,
    enum: ['Food & Drink', 'Local Shopping', 'Arts & Culture', 'Health & Wellness', 'Automotive', 'Services', 'Entertainment', 'Other']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true }
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  hoursOfOperation: {
    monday: { type: String, default: 'Closed' },
    tuesday: { type: String, default: 'Closed' },
    wednesday: { type: String, default: 'Closed' },
    thursday: { type: String, default: 'Closed' },
    friday: { type: String, default: 'Closed' },
    saturday: { type: String, default: 'Closed' },
    sunday: { type: String, default: 'Closed' }
  },
  contactInfo: {
    phoneNumber: { type: String, trim: true },
    website: { type: String, trim: true },
    email: { type: String, trim: true }
  },
  amenities: [String],
  coverImage: { type: String },
  priceLevel: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      // Calculate average rating
      if (ret.reviews && ret.reviews.length > 0) {
        const totalRating = ret.reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        ret.averageRating = Math.round((totalRating / ret.reviews.length) * 10) / 10;
      } else {
        ret.averageRating = 0;
      }
      return ret;
    }
  }
});

// Indexes
BusinessSchema.index({ location: '2dsphere' }); // IMPORTANT for $near
BusinessSchema.index({ name: 'text', description: 'text' }); // Text search
BusinessSchema.index({ category: 1 });
BusinessSchema.index({ owner: 1 });
BusinessSchema.index({ createdAt: -1 });

// Virtual for formatted address
BusinessSchema.virtual('formattedAddress').get(function() {
  if (!this.address) return '';
  const { street, city, state, zipCode } = this.address;
  return [street, city, state, zipCode].filter(Boolean).join(', ');
});

// Virtual for average rating
BusinessSchema.virtual('averageRating').get(function() {
  if (!this.reviews || this.reviews.length === 0) return 0;
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((totalRating / this.reviews.length) * 10) / 10;
});

// Pre-save middleware
BusinessSchema.pre('save', function(next) {
  // Ensure coordinates are numbers
  if (this.location && this.location.coordinates) {
    this.location.coordinates = this.location.coordinates.map(coord => parseFloat(coord));
  }
  next();
});

module.exports = mongoose.model('Business', BusinessSchema);