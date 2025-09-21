const Video = require('../models/Videos');

// @desc    Get all videos with populated business info
// @route   GET /api/videos
// @access  Public
const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate('business', 'name _id category priceLevel address coordinates')
      .sort({ createdAt: -1 }); // Most recent first
    
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ 
      message: 'Server error while fetching videos',
      error: error.message 
    });
  }
};

// @desc    Get video by ID
// @route   GET /api/videos/:id
// @access  Public
const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('business');
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    res.json(video);
  } catch (error) {
    console.error('Error fetching video by ID:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    res.status(500).json({ 
      message: 'Server error while fetching video',
      error: error.message 
    });
  }
};

module.exports = {
  getAllVideos,
  getVideoById
};
