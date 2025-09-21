const express = require('express');
const router = express.Router();
const { protect, businessOwner } = require('../middleware/authMiddleware');
const { 
  getDashboardData, 
  updateBusinessProfile, 
  uploadVideo, 
  getBusinessVideos, 
  deleteVideo, 
  getBusinessAnalytics 
} = require('../controllers/dashboardController');

// All dashboard routes are protected
router.use(protect);

// Test endpoint to verify route is working
router.get('/test', (req, res) => {
  res.json({ message: 'Dashboard API is working', user: req.user.email });
});

// Dashboard data routes (available to all authenticated users)
router.get('/', getDashboardData);
router.put('/profile', updateBusinessProfile);
router.get('/analytics', getBusinessAnalytics);

// Video operations (business created automatically if needed)
router.post('/videos', uploadVideo);
router.get('/videos', getBusinessVideos);
router.delete('/videos/:videoId', deleteVideo);

module.exports = router;
