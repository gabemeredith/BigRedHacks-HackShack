const express = require('express');
const router = express.Router();
const {
  getAllVideos,
  getVideoById
} = require('../controllers/videoController');

// @route   GET /api/videos
// @desc    Get all videos with populated business info
// @access  Public
router.get('/', getAllVideos);

// @route   GET /api/videos/:id
// @desc    Get video by ID with populated business info
// @access  Public
router.get('/:id', getVideoById);

module.exports = router;
