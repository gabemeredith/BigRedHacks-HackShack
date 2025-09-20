// server.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors({ origin: ['http://localhost:4000'], credentials: true }));
app.use(express.json());
app.use(morgan('dev'));


// try {
//   app.use('/api/feed', require('./routes/feed'));           // ✅ feed router
//   app.use('/api/businesses', require('./routes/businesses')); // ✅ businesses router
// } catch (e) {
//   console.error('[SERVER] Router mount failed:', e);
//   process.exit(1); // force visible failure
// }

// 1) Connect to Mongo (Mongoose)
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log('Mongo connected');
  } catch (e) {
    console.error('Mongo error', e);
    process.exit(1);
  }
})();

// 2) Models (ensure your schemas export correctly)
const Business = require('./models/Business'); // should have a 2dsphere index on location
const Video = require('./models/Videos');      // schema should have { business: { type: ObjectId, ref: 'Business' } }

// 3) Health/test routes that your frontend can call
app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.get('/api/test', (_req, res) => res.json({ ok: true }));

// 4) Nearby businesses (returns all if no lat/lng)
app.get('/api/businesses/near', async (req, res, next) => {
  try {
    const { lat, lng, r = 5000, category } = req.query;

    // If no lat/lng -> list with optional category filter
    if (!lat || !lng) {
      const filter = {};
      if (category) filter.category = category;
      const all = await Business.find(filter).limit(50);
      return res.json(all);
    }

    const query = {
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(r, 10)
        }
      }
    };
    if (category) query.category = category;

    const results = await Business.find(query).limit(30);
    res.json(results);
  } catch (err) { next(err); }
});

// 5) Video feed (all or by nearby businesses)
app.get('/api/feed', async (req, res, next) => {
  try {
    const { lat, lng, r = 5000, category } = req.query;

    if (!lat || !lng) {
      const filter = {};
      if (category) filter.category = category;
      const allVideos = await Video.find(filter)
        .sort({ createdAt: -1 })
        .limit(50)
        .populate('business', 'name category location');
      return res.json(allVideos);
    }

    const businessQuery = {
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(r, 10)
        }
      }
    };
    if (category) businessQuery.category = category;

    const businesses = await Business.find(businessQuery).select('_id');
    const vids = await Video.find({ business: { $in: businesses.map(b => b._id) } })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('business', 'name category location');

    res.json(vids);
  } catch (err) { next(err); }
});

// 6) Create business / video
app.post('/api/businesses', async (req, res, next) => {
  try {
    const { name, category, address, lat, lng } = req.body;
    if (!name || lat == null || lng == null) return res.status(400).json({ error: 'name, lat, lng required' });

    const doc = await Business.create({
      name,
      category,
      address,
      location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }
    });
    res.status(201).json(doc);
  } catch (err) { next(err); }
});

app.post('/api/videos', async (req, res, next) => {
  try {
    const { businessId, url, caption, tags = [] } = req.body;
    if (!businessId || !url) return res.status(400).json({ error: 'businessId and url required' });

    const exists = await Business.findById(businessId);
    if (!exists) return res.status(404).json({ error: 'business not found' });

    const video = await Video.create({ business: businessId, url, caption, tags });
    res.status(201).json(video);
  } catch (err) { next(err); }
});

// Error handler
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'server_error', detail: err.message });
});

const PORT = process.env.PORT || 3000; // <-- use 3000 unless you update Vite proxy
app.listen(PORT, () => console.log('API on', PORT));
