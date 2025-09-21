import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import useInView from '../hooks/useInView';

const VideoReelItem = ({ video }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { threshold: 0.5 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Handle video playback based on intersection
  useEffect(() => {
    if (!videoRef.current) return;

    if (isInView) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.log("Video autoplay failed:", error);
            setIsPlaying(false);
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isInView]);

  // Handle video end - loop the video
  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  // Toggle mute
  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Toggle play/pause
  const togglePlayPause = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen flex items-center justify-center bg-black relative"
      style={{ scrollSnapAlign: 'start' }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="max-w-full max-h-full object-contain"
        muted={isMuted}
        loop
        playsInline
        poster={video.thumbnailUrl}
        onEnded={handleVideoEnd}
        onLoadedData={() => {
          // Ensure video is ready for playback
          if (isInView && videoRef.current) {
            videoRef.current.play().catch(console.error);
          }
        }}
      >
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video Controls Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Center Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-40 transition-colors"
        >
          <div className="w-16 h-16 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
            {isPlaying ? (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </div>
        </button>

        {/* Top Right Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-3">
          {/* Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            className="w-12 h-12 bg-black bg-opacity-70 rounded-full flex items-center justify-center text-white hover:bg-opacity-90 transition-colors"
          >
            {isMuted ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Business Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 text-white">
        <div className="flex items-end justify-between">
          
          {/* Business Info */}
          <div className="flex-1">
            {video.business && (
              <Link 
                to={`/business/${video.business._id}`}
                className="block hover:text-primary-400 transition-colors mb-2"
              >
                <h3 className="text-xl font-bold mb-1">
                  {video.business.name}
                </h3>
                <p className="text-sm text-gray-300">
                  {video.business.category}
                </p>
              </Link>
            )}
            
            {video.caption && (
              <p className="text-base text-gray-200 mb-3 max-w-md">
                {video.caption}
              </p>
            )}
            
            {/* Business Actions */}
            {video.business && (
              <div className="flex space-x-3">
                <Link 
                  to={`/business/${video.business._id}`}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-sm font-medium transition-colors"
                >
                  View Business
                </Link>
                <button className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full text-sm font-medium transition-colors backdrop-blur-sm">
                  Share
                </button>
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex flex-col items-center space-y-4 ml-6">
            
            {/* Like Button */}
            <button className="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Comment Button */}
            <button className="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>

            {/* Share Button */}
            <button className="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {!isPlaying && isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

VideoReelItem.propTypes = {
  video: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
    caption: PropTypes.string,
    business: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string
    })
  }).isRequired
};

export default VideoReelItem;
