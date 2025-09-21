import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const StoreCard = ({ business }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  // Calculate average rating from reviews
  const averageRating = business.reviews && business.reviews.length > 0
    ? (business.reviews.reduce((sum, review) => sum + review.rating, 0) / business.reviews.length).toFixed(1)
    : 0;

  // Handle video playback on hover
  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Video play failed:", error);
          });
        }
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered]);

  return (
    <Link to={`/business/${business._id}`}>
      <article 
        className="card group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      {/* Media Section */}
      <figure className="relative h-48 bg-gray-200 overflow-hidden">
        {business.videos && business.videos.length > 0 ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover transition-opacity duration-300"
            muted
            loop
            playsInline
            poster={business.videos[0].thumbnailUrl}
          >
            <source src={business.videos[0].url} type="video/mp4" />
            {/* Fallback to cover image if video fails */}
            <img 
              src={business.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'} 
              alt={business.name}
              className="w-full h-full object-cover"
            />
          </video>
        ) : (
          <img 
            src={business.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'} 
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        )}
        
        {/* Overlay with category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-white bg-opacity-90 text-xs font-medium text-gray-800 rounded-full">
            {business.category}
          </span>
        </div>
        
        {/* Price level badge */}
        {business.priceLevel && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs font-medium rounded-full">
              {business.priceLevel}
            </span>
          </div>
        )}
      </figure>

      {/* Content Section */}
      <div className="p-4">
        {/* Business Name */}
        <h2 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
          {business.name}
        </h2>

        {/* Rating and Reviews */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="ml-1 text-sm font-medium text-gray-700">
              {averageRating > 0 ? averageRating : 'New'}
            </span>
          </div>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-600">
            {business.reviews ? business.reviews.length : 0} review{business.reviews?.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Category and Price */}
        <p className="text-sm text-gray-600 mb-2">
          {business.category}
          {business.priceLevel && (
            <>
              <span className="mx-2">•</span>
              {business.priceLevel}
            </>
          )}
        </p>

        {/* Distance */}
        <p className="text-sm text-gray-500">
          0.5 mi away
        </p>

        {/* Description Preview */}
        {business.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {business.description}
          </p>
        )}

        {/* Amenities Preview */}
        {business.amenities && business.amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {business.amenities.slice(0, 3).map((amenity, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {business.amenities.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
                +{business.amenities.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </article>
    </Link>
  );
};

StoreCard.propTypes = {
  business: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string.isRequired,
    priceLevel: PropTypes.string,
    coverImage: PropTypes.string,
    amenities: PropTypes.arrayOf(PropTypes.string),
    videos: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
      url: PropTypes.string,
      thumbnailUrl: PropTypes.string,
      caption: PropTypes.string
    })),
    reviews: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
      rating: PropTypes.number,
      comment: PropTypes.string
    }))
  }).isRequired
};

export default StoreCard;
