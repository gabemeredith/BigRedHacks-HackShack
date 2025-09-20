const express = require('express');
const router = express.Router();
const {
  getAllBusinesses,
  getBusinessById,
  createReviewForBusiness
} = require('../controllers/businessController');

// @route   GET /api/businesses
// @desc    Get all businesses (with optional category filter)
// @access  Public
router.get('/', getAllBusinesses);

// @route   GET /api/businesses/:id
// @desc    Get business by ID with populated videos and reviews
// @access  Public
router.get('/:id', getBusinessById);

// @route   POST /api/businesses/:id/reviews
// @desc    Create a new review for a business
// @access  Public
router.post('/:id/reviews', createReviewForBusiness);

module.exports = router;
