require('dotenv').config();
const mongoose = require('mongoose');
const Business = require('../models/Business');
const Video = require('../models/Videos');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Business.deleteMany({});
  await Video.deleteMany({});

  const businesses = await Business.insertMany([
    {
      name: 'Neon Arcade',
      category: 'arcade',
      address: '123 College Ave',
      location: { type: 'Point', coordinates: [-76.483, 42.447] } // [lng, lat]
    },
    {
      name: 'Basement Comedy Night',
      category: 'comedy',
      address: '456 Aurora St',
      location: { type: 'Point', coordinates: [-76.49, 42.441] }
    }
  ]);

  const videos = await Video.insertMany([
    {
      business: businesses[0]._id,
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      caption: 'Friday free-play night!',
      tags: ['retro','pinball']
    },
    {
      business: businesses[1]._id,
      url: 'https://www.youtube.com/embed/ysz5S6PUM-U',
      caption: 'Open mic highlights',
      tags: ['comedy','open-mic']
    }
  ]);

  console.log('Seeded', businesses.length, 'businesses and', videos.length, 'videos');
  await mongoose.disconnect();
})();
