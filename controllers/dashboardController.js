const Business = require('../models/Business');
const Video = require('../models/Video');
const Review = require('../models/Review');

// @desc    Get dashboard data for business owner
// @route   GET /api/dashboard/profile
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    if (!req.user.business) {
      return res.status(400).json({ message: 'No business associated with this account' });
    }

    const business = await Business.findById(req.user.business._id)
      .populate('videos')
      .populate('reviews');

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Calculate business statistics
    const stats = {
      totalVideos: business.videos ? business.videos.length : 0,
      totalReviews: business.reviews ? business.reviews.length : 0,
      averageRating: business.reviews && business.reviews.length > 0
        ? (business.reviews.reduce((sum, review) => sum + review.rating, 0) / business.reviews.length).toFixed(1)
        : 0,
      recentReviews: business.reviews ? business.reviews.slice(-5).reverse() : []
    };

    res.json({
      success: true,
      data: {
        business,
        stats
      }
    });

  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
};

// @desc    Update business profile
// @route   PUT /api/dashboard/profile
// @access  Private
const updateBusinessProfile = async (req, res) => {
  try {
    if (!req.user.business) {
      return res.status(400).json({ message: 'No business associated with this account' });
    }

    const business = await Business.findById(req.user.business._id);

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const {
      name,
      description,
      category,
      priceLevel,
      address,
      contactInfo,
      hoursOfOperation,
      amenities,
      coverImage
    } = req.body;

    // Update fields if provided
    if (name) business.name = name;
    if (description) business.description = description;
    if (category) business.category = category;
    if (priceLevel) business.priceLevel = priceLevel;
    if (address) business.address = { ...business.address, ...address };
    if (contactInfo) business.contactInfo = { ...business.contactInfo, ...contactInfo };
    if (hoursOfOperation) business.hoursOfOperation = { ...business.hoursOfOperation, ...hoursOfOperation };
    if (amenities) business.amenities = amenities;
    if (coverImage) business.coverImage = coverImage;

    const updatedBusiness = await business.save();

    res.json({
      success: true,
      data: updatedBusiness
    });

  } catch (error) {
    console.error('Update business profile error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    res.status(500).json({ message: 'Server error updating business profile' });
  }
};

// @desc    Upload/Create a new video
// @route   POST /api/dashboard/videos
// @access  Private
const uploadVideo = async (req, res) => {
  try {
    if (!req.user.business) {
      return res.status(400).json({ message: 'No business associated with this account' });
    }

    const { url, thumbnailUrl, caption } = req.body;

    if (!url || !thumbnailUrl) {
      return res.status(400).json({ message: 'Video URL and thumbnail URL are required' });
    }

    // Create new video
    const video = await Video.create({
      url,
      thumbnailUrl,
      caption: caption || '',
      business: req.user.business._id
    });

    // Add video to business videos array
    const business = await Business.findById(req.user.business._id);
    business.videos.push(video._id);
    await business.save();

    // Populate business info for response
    const populatedVideo = await Video.findById(video._id).populate('business', 'name');

    res.status(201).json({
      success: true,
      data: populatedVideo
    });

  } catch (error) {
    console.error('Upload video error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    res.status(500).json({ message: 'Server error uploading video' });
  }
};

// @desc    Get all videos for business
// @route   GET /api/dashboard/videos
// @access  Private
const getBusinessVideos = async (req, res) => {
  try {
    if (!req.user.business) {
      return res.status(400).json({ message: 'No business associated with this account' });
    }

    const videos = await Video.find({ business: req.user.business._id })
      .populate('business', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: videos
    });

  } catch (error) {
    console.error('Get business videos error:', error);
    res.status(500).json({ message: 'Server error fetching videos' });
  }
};

// @desc    Delete a video
// @route   DELETE /api/dashboard/videos/:videoId
// @access  Private
const deleteVideo = async (req, res) => {
  try {
    if (!req.user.business) {
      return res.status(400).json({ message: 'No business associated with this account' });
    }

    const video = await Video.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if video belongs to user's business
    if (video.business.toString() !== req.user.business._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this video' });
    }

    // Remove video from business videos array
    const business = await Business.findById(req.user.business._id);
    business.videos = business.videos.filter(videoId => videoId.toString() !== req.params.videoId);
    await business.save();

    // Delete the video
    await Video.findByIdAndDelete(req.params.videoId);

    res.json({
      success: true,
      message: 'Video deleted successfully'
    });

  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Server error deleting video' });
  }
};

// @desc    Get business analytics/statistics
// @route   GET /api/dashboard/analytics
// @access  Private
const getBusinessAnalytics = async (req, res) => {
  try {
    if (!req.user.business) {
      return res.status(400).json({ message: 'No business associated with this account' });
    }

    const business = await Business.findById(req.user.business._id)
      .populate('reviews')
      .populate('videos');

    // Calculate detailed analytics
    const analytics = {
      overview: {
        totalVideos: business.videos.length,
        totalReviews: business.reviews.length,
        averageRating: business.reviews.length > 0
          ? (business.reviews.reduce((sum, review) => sum + review.rating, 0) / business.reviews.length).toFixed(1)
          : 0,
      },
      ratings: {
        1: business.reviews.filter(r => r.rating === 1).length,
        2: business.reviews.filter(r => r.rating === 2).length,
        3: business.reviews.filter(r => r.rating === 3).length,
        4: business.reviews.filter(r => r.rating === 4).length,
        5: business.reviews.filter(r => r.rating === 5).length,
      },
      recentActivity: {
        recentReviews: business.reviews
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10),
        recentVideos: business.videos
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
      }
    };

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
};

module.exports = {
  getDashboardData,
  updateBusinessProfile,
  uploadVideo,
  getBusinessVideos,
  deleteVideo,
  getBusinessAnalytics
};
