const mongoose = require('mongoose')


const BusinessSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, index: true }, // e.g., 'arcade', 'comedy', 'thrift'
    address: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      // IMPORTANT: GeoJSON expects [longitude, latitude]
      coordinates: { type: [Number], required: true }
    }
  }, { timestamps: true });
  
  // Enables $near queries
  BusinessSchema.index({ location: '2dsphere' });
  
  module.exports = mongoose.model('Business', BusinessSchema);
