import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import VideoReelItem from '../components/VideoReelItem';

const TheReelPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/videos');
        setVideos(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Loading screen
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading The Reel...</p>
        </div>
      </div>
    );
  }

  // Error screen
  if (error || videos.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-4">📱</div>
          <h1 className="text-2xl font-bold mb-2">No Videos Available</h1>
          <p className="text-gray-400 mb-6">
            {error || "There are no videos to display right now. Check back later!"}
          </p>
          <Link 
            to="/" 
            className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            Explore Businesses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Navigation Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white hover:text-primary-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </Link>
          
          <h1 className="text-xl font-bold text-white">The Reel</h1>
          
          <Link 
            to="/map" 
            className="flex items-center space-x-2 text-white hover:text-primary-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="font-medium">Map</span>
          </Link>
        </div>
      </div>

      {/* Video Feed Container */}
      <div 
        className="h-screen w-screen overflow-y-scroll overflow-x-hidden"
        style={{ 
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth'
        }}
      >
        {videos.map((video) => (
          <VideoReelItem key={video._id} video={video} />
        ))}
      </div>

      {/* Navigation Hints */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <span>Swipe up/down to browse</span>
          <span>•</span>
          <span>Tap to pause/play</span>
        </div>
      </div>

      {/* Side Navigation Indicator */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
        <div className="flex flex-col space-y-2">
          {videos.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 bg-white bg-opacity-50 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TheReelPage;
