import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBusinessById, createReview } from '../api';
import VideoModal from '../components/VideoModal';
import UnifiedHeader from '../components/UnifiedHeader';

const BusinessProfilePage = () => {
  const { businessId } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  // Fetch business data
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const businessData = await getBusinessById(businessId);
        setBusiness(businessData);
        setError(null);
      } catch (err) {
        console.error('Error fetching business:', err);
        setError(err.message || 'Business not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchBusiness();
    }
  }, [businessId]);

  // Handle review form submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!reviewForm.comment.trim()) {
      setReviewError('Please enter a comment');
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError(null);
      
      const newReview = await createReview(businessId, reviewForm);
      
      // Update business data with new review
      setBusiness(prev => ({
        ...prev,
        reviews: [...(prev.reviews || []), newReview]
      }));
      
      // Reset form
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Get formatted hours
  const getFormattedHours = () => {
    if (!business?.hoursOfOperation) return null;
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return days.map((day, index) => ({
      day: dayNames[index],
      hours: business.hoursOfOperation[day] || 'Closed'
    }));
  };

  // Calculate average rating
  const averageRating = business?.reviews?.length > 0
    ? (business.reviews.reduce((sum, review) => sum + review.rating, 0) / business.reviews.length).toFixed(1)
    : 0;

  // Render star rating
  const renderStars = (rating, isClickable = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type={isClickable ? "button" : undefined}
        onClick={isClickable ? () => setReviewForm(prev => ({ ...prev, rating: index + 1 })) : undefined}
        className={`text-2xl ${isClickable ? 'cursor-pointer' : 'cursor-default'} ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        disabled={!isClickable}
      >
        ⭐
      </button>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading business details...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader currentPage="business" />
      {/* Header Section */}
      <section className="relative h-96 bg-gray-900 overflow-hidden pt-20">
        {business.coverImage && (
          <img 
            src={business.coverImage} 
            alt={business.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-8">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{business.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <span className="text-yellow-400 text-xl">⭐</span>
                <span className="ml-2 text-lg font-medium">
                  {averageRating > 0 ? averageRating : 'New'}
                </span>
                <span className="ml-2 text-gray-300">
                  ({business.reviews?.length || 0} reviews)
                </span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-lg">{business.category}</span>
              {business.priceLevel && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-lg">{business.priceLevel}</span>
                </>
              )}
            </div>
            
            {business.address && (
              <p className="text-lg text-gray-300 mb-6">
                {business.address.street}, {business.address.city}, {business.address.state} {business.address.zipCode}
              </p>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Get Directions
              </button>
              {business.contactInfo?.phoneNumber && (
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg font-medium transition-colors backdrop-blur-sm">
                  Call
                </button>
              )}
              {business.contactInfo?.website && (
                <a 
                  href={business.contactInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg font-medium transition-colors backdrop-blur-sm"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{business.description}</p>
            </section>

            {/* Video Gallery */}
            {business.videos && business.videos.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Videos</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {business.videos.map((video) => (
                    <div
                      key={video._id}
                      className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.caption || 'Business video'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Play Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-colors">
                        <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                      
                      {video.caption && (
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-xs bg-black bg-opacity-70 rounded px-2 py-1 truncate">
                            {video.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
              
              {/* Leave a Review Form */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex space-x-1">
                      {renderStars(reviewForm.rating, true)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Share your experience..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={4}
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {reviewForm.comment.length}/500 characters
                    </p>
                  </div>
                  
                  {reviewError && (
                    <p className="text-red-600 text-sm">{reviewError}</p>
                  )}
                  
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
              
              {/* Existing Reviews */}
              <div className="space-y-4">
                {business.reviews && business.reviews.length > 0 ? (
                  business.reviews.map((review) => (
                    <div key={review._id} className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No reviews yet. Be the first to leave a review!
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Right Column - Business Details */}
          <div className="space-y-8">
            
            {/* Hours of Operation */}
            {getFormattedHours() && (
              <section className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hours</h3>
                <div className="space-y-2">
                  {getFormattedHours().map(({ day, hours }) => (
                    <div key={day} className="flex justify-between">
                      <span className="text-gray-600">{day}</span>
                      <span className="font-medium text-gray-900">{hours}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Contact Info */}
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-3">
                {business.contactInfo?.phoneNumber && (
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700">{business.contactInfo.phoneNumber}</span>
                  </div>
                )}
                
                {business.contactInfo?.website && (
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                    </svg>
                    <a 
                      href={business.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                
                {business.address && (
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="text-gray-700">
                      <p>{business.address.street}</p>
                      <p>{business.address.city}, {business.address.state} {business.address.zipCode}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Amenities */}
            {business.amenities && business.amenities.length > 0 && (
              <section className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {business.amenities.map((amenity, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal 
          video={selectedVideo} 
          onClose={() => setSelectedVideo(null)} 
        />
      )}
    </div>
  );
};

export default BusinessProfilePage;
