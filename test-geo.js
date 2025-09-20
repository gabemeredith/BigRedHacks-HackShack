// node test-geo.js
require('dotenv').config();
const mongoose = require('mongoose');

// ----- Schema under test -----
const BusinessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, index: true }, // 'arcade', 'comedy', 'thrift'
  address: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    // IMPORTANT: [lng, lat]
    coordinates: { type: [Number], required: true }
  }
}, { timestamps: true });

BusinessSchema.index({ location: '2dsphere' });

const Business = mongoose.model('Business', BusinessSchema);

// ----- Test runner -----
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // 1) Clean slate
    await Business.deleteMany({});

    // 2) Insert a few docs around Ithaca (lng, lat!)
    const docs = await Business.insertMany([
      {
        name: 'Neon Arcade',
        category: 'arcade',
        address: 'Collegetown',
        location: { type: 'Point', coordinates: [-76.486, 42.442] }
      },
      {
        name: 'Basement Comedy',
        category: 'comedy',
        address: 'Downtown',
        location: { type: 'Point', coordinates: [-76.497, 42.439] }
      },
      {
        name: 'Timmy’s Thrift',
        category: 'thrift',
        address: 'Near campus',
        location: { type: 'Point', coordinates: [-76.478, 42.448] }
      },
    ]);
    console.log('Inserted:', docs.map(d => d.name));

    // 3) Ensure index is built (important for $near)
    await Business.init(); // waits for index build

    // 4) Plain $near query (within 5km of a point near Cornell)
    const userLng = -76.485; // <-- lng
    const userLat =  42.444; // <-- lat
    const near = await Business.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [userLng, userLat] },
          $maxDistance: 5000 // meters
        }
      }
    }).limit(10);

    console.log('\n$near results (sorted by distance):');
    near.forEach(b => console.log('-', b.name, b.location.coordinates));

    // 5) Same, but include computed distance (aggregation + $geoNear)
    const withDistance = await Business.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [userLng, userLat] },
          distanceField: 'distanceMeters',
          maxDistance: 5000,
          spherical: true
        }
      },
      { $project: { name: 1, category: 1, distanceMeters: 1, _id: 0 } }
    ]);

    console.log('\n$geoNear with distances:');
    withDistance.forEach(r =>
      console.log(`- ${r.name} (${r.category}) → ${(r.distanceMeters/1000).toFixed(2)} km`));

    await mongoose.disconnect();
    console.log('\n✅ GeoJSON + 2dsphere working');
  } catch (err) {
    console.error('❌ Test error:', err);
    process.exit(1);
  }
})();
