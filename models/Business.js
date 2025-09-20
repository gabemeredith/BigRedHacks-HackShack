const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  address: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  }
}, { timestamps: true });

BusinessSchema.index({ location: '2dsphere' }); // IMPORTANT for $near

module.exports = mongoose.model('Business', BusinessSchema);
