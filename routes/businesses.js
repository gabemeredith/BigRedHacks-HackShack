// CommonJS
const express = require('express');
const router = express.Router();
const Business = require('../models/Business');

router.get('/near', async (req, res) => {
  try {
    const { lat, lng, r = 5000, category } = req.query;
    if (lat == null || lng == null) return res.status(400).json({ error: 'lat & lng required' });

    const query = {
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(r, 10),
        },
      },
    };
    if (category) query.category = category;

    const results = await Business.find(query).limit(30);
    res.json(results);
  } catch (e) {
    console.error('[NEAR] Error:', e);
    res.status(500).json({ error: 'failed to query nearby' });
  }
});

router.post('/create', async (req, res) => {
  try {
    const { name, category, address, lat, lng } = req.body;
    if (lat == null || lng == null) return res.status(400).json({ error: 'lat & lng required' });

    const doc = await Business.create({
      name,
      category,
      address,
      location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }, // [lng, lat]
    });
    res.status(201).json(doc);
  } catch (e) {
    console.error('[CREATE] Error:', e);
    res.status(500).json({ error: 'failed to create business' });
  }
});

module.exports = router; // IMPORTANT
