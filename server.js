// server.js - Complete API Overhaul
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');

const app = express();

// Enhanced CORS configuration
app.use(cors({ 
  origin: ['http://localhost:4000', 'http://localhost:4001', 'http://localhost:4002', 'http://localhost:4003', 'http://localhost:4004', 'http://localhost:3000', 'http://localhost:5173'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Enhanced logging
app.use(morgan('[:date[iso]] :method :url :status :res[content-length] - :response-time ms'));

// Body parsing with increased limits
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Database connection with retry logic
const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      // Only use in-memory for local development
      if (process.env.NODE_ENV === 'development') {
        console.log('🚀 Starting in-memory MongoDB for development...');
        const mongod = await MongoMemoryServer.create();
        mongoURI = mongod.getUri();
        console.log('✅ In-memory MongoDB started at:', mongoURI);
      } else {
        throw new Error('MONGO_URI environment variable is required for production');
      }
    }
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('⚠️  Running without database. Some features will not work.');
  }
};

// Connect to database
connectDB();

// Import models
const Business = require('./models/Business');
const Video = require('./models/Videos');
const User = require('./models/User');
const Review = require('./models/Review');

// Import middleware
const authMiddleware = require('./middleware/authMiddleware');

// API Response Helper
const apiResponse = (res, status, success, data = null, message = null, error = null) => {
  const response = {
    success,
    timestamp: new Date().toISOString(),
    ...(data && { data }),
    ...(message && { message }),
    ...(error && { error })
  };
  return res.status(status).json(response);
};

// ==================== HEALTH & TEST ENDPOINTS ====================
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  apiResponse(res, 200, true, {
    status: 'healthy',
    database: dbStatus,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  apiResponse(res, 200, true, { message: 'API is working correctly' });
});

// ==================== AUTHENTICATION ENDPOINTS ====================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, businessName, businessCategory, businessAddress } = req.body;
    
    if (!name || !email || !password) {
      return apiResponse(res, 400, false, null, 'Name, email, and password are required');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return apiResponse(res, 400, false, null, 'User already exists with this email');
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      businessName,
      businessCategory,
      businessAddress,
      role: 'business_owner'
    });

    await user.save();

    // Generate token
    const token = require('./utils/generateToken')(user._id);

    apiResponse(res, 201, true, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        businessCategory: user.businessCategory
      },
      token
    }, 'User registered successfully');
  } catch (error) {
    console.error('Registration error:', error);
    apiResponse(res, 500, false, null, 'Registration failed', error.message);
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return apiResponse(res, 400, false, null, 'Email and password are required');
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return apiResponse(res, 401, false, null, 'Invalid credentials');
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return apiResponse(res, 401, false, null, 'Invalid credentials');
    }

    // Update last login
    await user.updateLastLogin();

    // Generate token
    const token = require('./utils/generateToken')(user._id);

    apiResponse(res, 200, true, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        businessCategory: user.businessCategory
      },
      token
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    apiResponse(res, 500, false, null, 'Login failed', error.message);
  }
});

// ==================== BUSINESS ENDPOINTS ====================
app.get('/api/businesses', async (req, res) => {
  try {
    const { category, lat, lng, radius = 5000 } = req.query;
    let query = {};

    // Category filter
    if (category) {
      query.category = category;
    }

    let businesses;
    if (lat && lng) {
      // Geographic search
      businesses = await Business.find({
        ...query,
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: parseInt(radius)
          }
        }
      }).populate('videos').populate('reviews').limit(50);
    } else {
      // All businesses
      businesses = await Business.find(query)
        .populate('videos')
        .populate('reviews')
        .limit(50);
    }

    apiResponse(res, 200, true, businesses, `Found ${businesses.length} businesses`);
  } catch (error) {
    console.error('Businesses fetch error:', error);
    apiResponse(res, 500, false, null, 'Failed to fetch businesses', error.message);
  }
});

app.get('/api/businesses/:id', async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('videos')
      .populate('reviews');

    if (!business) {
      return apiResponse(res, 404, false, null, 'Business not found');
    }

    apiResponse(res, 200, true, business, 'Business found');
  } catch (error) {
    console.error('Business fetch error:', error);
    if (error.name === 'CastError') {
      return apiResponse(res, 404, false, null, 'Invalid business ID');
    }
    apiResponse(res, 500, false, null, 'Failed to fetch business', error.message);
  }
});

app.post('/api/businesses', authMiddleware.protect, async (req, res) => {
  try {
    const { name, category, address, lat, lng, description, hoursOfOperation, contactInfo, amenities } = req.body;
    
    if (!name || !lat || !lng) {
      return apiResponse(res, 400, false, null, 'Name, latitude, and longitude are required');
    }

    const business = new Business({
      name,
      category,
      address,
      description,
      hoursOfOperation,
      contactInfo,
      amenities,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      },
      owner: req.user.id
    });

    await business.save();

    // Update user's business reference
    await User.findByIdAndUpdate(req.user.id, { business: business._id });

    apiResponse(res, 201, true, business, 'Business created successfully');
  } catch (error) {
    console.error('Business creation error:', error);
    apiResponse(res, 500, false, null, 'Failed to create business', error.message);
  }
});

// ==================== VIDEO ENDPOINTS ====================
app.get('/api/videos', async (req, res) => {
  try {
    const { lat, lng, radius = 5000, category } = req.query;
    
    let videos;
    if (lat && lng) {
      // Geographic search for videos
      const businesses = await Business.find({
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: parseInt(radius)
          }
        },
        ...(category && { category })
      }).select('_id');

      videos = await Video.find({ business: { $in: businesses.map(b => b._id) } })
        .populate('business', 'name category location')
        .sort({ createdAt: -1 })
        .limit(50);
    } else {
      // All videos
      videos = await Video.find({})
        .populate('business', 'name category location')
        .sort({ createdAt: -1 })
        .limit(50);
    }

    apiResponse(res, 200, true, videos, `Found ${videos.length} videos`);
  } catch (error) {
    console.error('Videos fetch error:', error);
    apiResponse(res, 500, false, null, 'Failed to fetch videos', error.message);
  }
});

app.post('/api/videos', authMiddleware.protect, async (req, res) => {
  try {
    const { businessId, url, caption, tags, title } = req.body;
    
    if (!businessId || !url) {
      return apiResponse(res, 400, false, null, 'Business ID and video URL are required');
    }

    // Verify business exists and user owns it
    const business = await Business.findById(businessId);
    if (!business) {
      return apiResponse(res, 404, false, null, 'Business not found');
    }

    if (business.owner.toString() !== req.user.id) {
      return apiResponse(res, 403, false, null, 'Not authorized to add videos to this business');
    }

    const video = new Video({
      business: businessId,
      url,
      caption,
      tags: tags || [],
      title
    });

    await video.save();

    // Add video to business
    business.videos.push(video._id);
    await business.save();

    // Populate and return
    const populatedVideo = await Video.findById(video._id)
      .populate('business', 'name category location');

    apiResponse(res, 201, true, populatedVideo, 'Video uploaded successfully');
  } catch (error) {
    console.error('Video upload error:', error);
    apiResponse(res, 500, false, null, 'Failed to upload video', error.message);
  }
});

// ==================== DASHBOARD ENDPOINTS ====================
app.get('/api/dashboard', authMiddleware.protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('business');
    const business = user.business;

    let dashboardData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        businessName: user.businessName
      },
      business: null,
      stats: {
        totalVideos: 0,
        totalReviews: 0,
        averageRating: 0
      }
    };

    if (business) {
      const videoCount = await Video.countDocuments({ business: business._id });
      const reviewCount = await Review.countDocuments({ business: business._id });
      const reviews = await Review.find({ business: business._id });
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;

      dashboardData.business = business;
      dashboardData.stats = {
        totalVideos: videoCount,
        totalReviews: reviewCount,
        averageRating: Math.round(averageRating * 10) / 10
      };
    }

    apiResponse(res, 200, true, dashboardData, 'Dashboard data retrieved');
  } catch (error) {
    console.error('Dashboard error:', error);
    apiResponse(res, 500, false, null, 'Failed to fetch dashboard data', error.message);
  }
});

app.get('/api/dashboard/videos', authMiddleware.protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('business');
    
    if (!user.business) {
      return apiResponse(res, 404, false, null, 'No business found for user');
    }

    const videos = await Video.find({ business: user.business._id })
      .sort({ createdAt: -1 });

    apiResponse(res, 200, true, videos, `Found ${videos.length} videos`);
  } catch (error) {
    console.error('Dashboard videos error:', error);
    apiResponse(res, 500, false, null, 'Failed to fetch videos', error.message);
  }
});

app.post('/api/dashboard/videos', authMiddleware.protect, async (req, res) => {
  try {
    const { url, caption, tags, title } = req.body;
    
    if (!url) {
      return apiResponse(res, 400, false, null, 'Video URL is required');
    }

    const user = await User.findById(req.user.id).populate('business');
    
    if (!user.business) {
      return apiResponse(res, 404, false, null, 'No business found for user');
    }

    const video = new Video({
      business: user.business._id,
      url,
      caption,
      tags: tags || [],
      title
    });

    await video.save();

    // Add video to business
    user.business.videos.push(video._id);
    await user.business.save();

    const populatedVideo = await Video.findById(video._id)
      .populate('business', 'name category location');

    apiResponse(res, 201, true, populatedVideo, 'Video uploaded successfully');
  } catch (error) {
    console.error('Dashboard video upload error:', error);
    apiResponse(res, 500, false, null, 'Failed to upload video', error.message);
  }
});

// ==================== REVIEW ENDPOINTS ====================
app.post('/api/businesses/:id/reviews', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const businessId = req.params.id;
    
    if (!rating || !comment) {
      return apiResponse(res, 400, false, null, 'Rating and comment are required');
    }

    if (rating < 1 || rating > 5) {
      return apiResponse(res, 400, false, null, 'Rating must be between 1 and 5');
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return apiResponse(res, 404, false, null, 'Business not found');
    }

    const review = new Review({
      rating,
      comment,
      business: businessId
    });

    await review.save();

    // Add review to business
    business.reviews.push(review._id);
    await business.save();

    const populatedReview = await Review.findById(review._id)
      .populate('business', 'name');

    apiResponse(res, 201, true, populatedReview, 'Review created successfully');
  } catch (error) {
    console.error('Review creation error:', error);
    apiResponse(res, 500, false, null, 'Failed to create review', error.message);
  }
});

// ==================== FEED ENDPOINT (Legacy Support) ====================
app.get('/api/feed', async (req, res) => {
  try {
    const { lat, lng, radius = 5000, category } = req.query;
    
    let videos;
    if (lat && lng) {
      // Geographic search
      const businesses = await Business.find({
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: parseInt(radius)
          }
        },
        ...(category && { category })
      }).select('_id');

      videos = await Video.find({ business: { $in: businesses.map(b => b._id) } })
        .populate('business', 'name category location')
        .sort({ createdAt: -1 })
        .limit(50);
    } else {
      // All videos
      videos = await Video.find({})
        .populate('business', 'name category location')
        .sort({ createdAt: -1 })
        .limit(50);
    }

    apiResponse(res, 200, true, videos, `Found ${videos.length} videos`);
  } catch (error) {
    console.error('Feed error:', error);
    apiResponse(res, 500, false, null, 'Failed to fetch feed', error.message);
  }
});

// ==================== SEED ENDPOINT ====================
app.post('/api/seed-videos', async (req, res) => {
  try {
    // Allow seeding in both development and production
    // In production, this will populate the persistent database

    // Your YouTube video links (excluding shorts, with new video at bottom)
    const newVideoLinks = [
      'https://www.youtube.com/watch?v=Qb4zV2oFYyE',
      'https://www.youtube.com/watch?v=Z6Dx-o3vfJY',
      'https://www.youtube.com/watch?v=SDMi6jeIwy4',
      'https://www.youtube.com/watch?v=G6BZjXiLg8g',
      'https://youtu.be/4qGXBlszbTY'  // New video at the very bottom
    ];

    // Clear existing videos
    await Video.deleteMany({});
    console.log('🧹 Cleared existing videos');

    // Create a sample business
    let business = await Business.findOne({ name: 'Local Business Hub' });
    if (!business) {
      business = new Business({
        name: 'Local Business Hub',
        description: 'A hub for local business videos',
        category: 'Food & Drink',
        owner: new mongoose.Types.ObjectId(),
        address: {
          street: '123 Main St',
          city: 'Ithaca',
          state: 'NY',
          zipCode: '14850'
        },
        location: {
          type: 'Point',
          coordinates: [-76.5019, 42.4430]
        },
        contactInfo: {
          phoneNumber: '(607) 123-4567'
        },
        hoursOfOperation: {
          monday: '9:00 AM - 5:00 PM',
          tuesday: '9:00 AM - 5:00 PM',
          wednesday: '9:00 AM - 5:00 PM',
          thursday: '9:00 AM - 5:00 PM',
          friday: '9:00 AM - 5:00 PM',
          saturday: '10:00 AM - 4:00 PM',
          sunday: 'Closed'
        },
        amenities: ['WiFi', 'Parking']
      });
      await business.save();
      console.log('✅ Created business:', business.name);
    }

    // Add videos
    const videos = [];
    for (let i = 0; i < newVideoLinks.length; i++) {
      const videoId = extractVideoId(newVideoLinks[i]);
      const video = new Video({
        url: newVideoLinks[i],
        title: `Video ${i + 1}`,
        caption: `Amazing local content ${i + 1}`,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        views: Math.floor(Math.random() * 10000) + 1000,
        likes: Math.floor(Math.random() * 500) + 50,
        business: business._id,
        tags: ['local', 'business', 'video']
      });
      
      const savedVideo = await video.save();
      videos.push(savedVideo);
      console.log(`✅ Added video ${i + 1}: ${newVideoLinks[i]}`);
    }

    // Update business with videos
    business.videos = videos.map(v => v._id);
    await business.save();

    apiResponse(res, 200, true, { 
      videosAdded: videos.length, 
      videos: videos.map(v => ({ id: v._id, url: v.url, title: v.title }))
    }, `Successfully seeded ${videos.length} videos`);

  } catch (error) {
    console.error('Seed error:', error);
    apiResponse(res, 500, false, null, 'Failed to seed videos', error.message);
  }
});

// Helper function to extract video ID from YouTube URL
function extractVideoId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : 'default';
}

// ==================== ERROR HANDLING ====================
// API 404 handler
app.use('/api', (req, res) => {
  console.log(`[API 404] ${req.method} ${req.url}`);
  apiResponse(res, 404, false, null, `API route not found: ${req.method} ${req.url}`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  apiResponse(res, 500, false, null, 'Internal server error', err.message);
});

// Serve React app for all non-API routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
});