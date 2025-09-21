const NodeGeocoder = require('node-geocoder');

const geocoder = NodeGeocoder({
  provider: 'openstreetmap', // free, no key for MVP
  // If you later switch to Mapbox/Google, add apiKey here.
});

module.exports = geocoder;
