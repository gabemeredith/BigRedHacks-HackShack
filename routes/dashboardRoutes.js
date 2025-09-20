const express = require('express');
const router = express.Router();
const {
  getDashboardData,
  updateBusinessProfile,
  uploadVideo,
  getBusinessVideos,
  deleteVideo,
  getBusinessAnalytics
} = require('../controllers/dashboardController');
const { protect, businessOwner } = require('../middleware/authMiddleware');

// All routes are protected and require business ownership
router.use(protect);
router.use(businessOwner);

// @route   GET /api/dashboard/profile
// @desc    Get dashboard data for business owner
// @access  Private (Business Owner)
router.route('/profile')
  .get(getDashboardData)
  .put(updateBusinessProfile);

// @route   GET/POST /api/dashboard/videos
// @desc    Get all videos or create new video for business
// @access  Private (Business Owner)
router.route('/videos')
  .get(getBusinessVideos)
  .post(uploadVideo);

// @route   DELETE /api/dashboard/videos/:videoId
// @desc    Delete a specific video
// @access  Private (Business Owner)
router.delete('/videos/:videoId', deleteVideo);

// @route   GET /api/dashboard/analytics
// @desc    Get business analytics and statistics
// @access  Private (Business Owner)
router.get('/analytics', getBusinessAnalytics);

module.exports = router;
