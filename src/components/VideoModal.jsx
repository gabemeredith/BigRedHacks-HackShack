import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const VideoModal = ({ video, onClose }) => {
  const videoRef = useRef(null);
  const modalRef = useRef(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Auto-focus and play video when modal opens
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.focus();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Video autoplay failed:", error);
        });
      }
    }

    // Prevent background scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle click outside video to close
  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  if (!video) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-colors"
        aria-label="Close video"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Video Container */}
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center">
        <video
          ref={videoRef}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          controls
          autoPlay
          playsInline
          poster={video.thumbnailUrl}
        >
          <source src={video.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Video Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              {video.caption && (
                <h3 className="text-lg font-semibold mb-1">{video.caption}</h3>
              )}
              {video.business && (
                <p className="text-sm text-gray-300">
                  {video.business.name}
                </p>
              )}
            </div>
            
            {video.business && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                  // Navigate to business profile
                  window.location.href = `/business/${video.business._id}`;
                }}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                View Business
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Hints */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
        Press ESC to close
      </div>
    </div>
  );
};

VideoModal.propTypes = {
  video: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
    caption: PropTypes.string,
    business: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  }),
  onClose: PropTypes.func.isRequired
};

export default VideoModal;
