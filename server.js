// db_password = ''



// server.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { });
    console.log('Mongo connected');
  } catch (e) {
    console.error('Mongo error', e);
    process.exit(1);
  }
})();

const Business = require('./models/Business');

app.get('/api/businesses/near', async (req, res) => {
  const { lat, lng, r = 5000, category } = req.query; // r in meters
  if (!lat || !lng) return res.status(400).json({ error: 'lat & lng required' });

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
});
const Video = require('./models/Videos');

app.get('/api/feed', async (req, res) => {
  const { lat, lng, r = 5000, category } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'lat & lng required' });

  // 1) Find nearby businesses (optionally filter by category)
  const bQuery = {
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: parseInt(r, 10)
      }
    }
  };
  if (category) bQuery.category = category;

  const businesses = await Business.find(bQuery).select('_id').limit(100);
  const businessIds = businesses.map(b => b._id);

  // 2) Pull recent videos for those businesses
  // http://localhost:4000/api/feed?lat=42.444&lng=-76.5&r=6000
  const vids = await Video.find({ business: { $in: businessIds } })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('business', 'name category location');

  res.json(vids);
});
// TODO: ADD AUTH0 Protection to this tmrw to qualify
app.post('/api/businesses', async (req, res) => {
    const { name, category, address, lat, lng } = req.body;
    if (!name || !lat || !lng) return res.status(400).json({ error: 'name, lat, lng required' });
  
    const doc = await Business.create({
      name,
      category,
      address,
      location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }
    });
    res.status(201).json(doc);
  });
app.post('/api/videos', async (req, res) => {
    const { businessId, url, caption, tags = [] } = req.body;
    if (!businessId || !url) return res.status(400).json({ error: 'businessId and url required' });
  
    const exists = await Business.findById(businessId);
    if (!exists) return res.status(404).json({ error: 'business not found' });
  
    const video = await Video.create({ business: businessId, url, caption, tags });
    res.status(201).json(video);
  });

app.get('/test', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('API on', PORT));


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri =
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

