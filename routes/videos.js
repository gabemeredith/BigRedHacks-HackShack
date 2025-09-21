const express = require('express');
const router = express.Router();
const { getAllVideos, getVideoById } = require('../controllers/videoController');

// Public routes for videos
router.get('/', getAllVideos);
router.get('/:id', getVideoById);

module.exports = router;
