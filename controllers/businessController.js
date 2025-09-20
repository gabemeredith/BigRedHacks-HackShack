const Business = require('../models/Business');
const Review = require('../models/Review');

// @desc    Get all businesses
// @route   GET /api/businesses
// @access  Public
const getAllBusinesses = async (req, res) => {
  try {
    let query = {};
    
    // Filter by category if provided in query
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    const businesses = await Business.find(query)
      .populate('videos')
      .populate('reviews');
    
    res.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ 
      message: 'Server error while fetching businesses',
      error: error.message 
    });
  }
};

// @desc    Get business by ID
// @route   GET /api/businesses/:id
// @access  Public
const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('videos')
      .populate('reviews');
    
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    
    res.json(business);
  } catch (error) {
    console.error('Error fetching business by ID:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Business not found' });
    }
    
    res.status(500).json({ 
      message: 'Server error while fetching business',
      error: error.message 
    });
  }
};

// @desc    Create review for business
// @route   POST /api/businesses/:id/reviews
// @access  Public
const createReviewForBusiness = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const businessId = req.params.id;
    
    // Validate required fields
    if (!rating) {
      return res.status(400).json({ message: 'Rating is required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    // Find the business
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    
    // Create new review
    const newReview = new Review({
      rating,
      comment,
      business: businessId
    });
    
    // Save the review
    const savedReview = await newReview.save();
    
    // Add review ID to business reviews array
    business.reviews.push(savedReview._id);
    await business.save();
    
    // Populate the review with business info before returning
    const populatedReview = await Review.findById(savedReview._id)
      .populate('business', 'name');
    
    res.status(201).json(populatedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error',
        errors: messages 
      });
    }
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Business not found' });
    }
    
    res.status(500).json({ 
      message: 'Server error while creating review',
      error: error.message 
    });
  }
};

module.exports = {
  getAllBusinesses,
  getBusinessById,
  createReviewForBusiness
};
