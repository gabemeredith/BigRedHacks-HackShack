// CommonJS
const express = require('express');
const router = express.Router();
const Business = require('../models/Business');

router.get('/', async (req, res) => {
  try {
    const { lat, lng, r = 5000, category } = req.query;
    if (lat == null || lng == null) {
        // no coords → fallback list
        const q = category ? { category } : {};
        const items = await Business.find(q).sort({ createdAt: -1 }).limit(30).lean();
        return res.json(items);
      }
    const query = {
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(r, 10),
        },
      },
    };
    if (category) query.category = category;

    const items = await Business.find(query).limit(30).lean();
    res.json(items);
  } catch (e) {
    console.error('[FEED] Error:', e);
    res.status(500).json({ error: 'failed to build feed' });
  }
});

module.exports = router; // IMPORTANT
