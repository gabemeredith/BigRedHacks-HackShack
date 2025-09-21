import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Video, Heart, Share2, Navigation, Star, Menu, X, Home, Map, Play, Grid3X3, Compass, MessageCircle, Bookmark, Volume2, VolumeX, MoreHorizontal } from 'lucide-react';
import UnifiedHeader from '../components/UnifiedHeader';


// Individual Video Reel Item Component
const VideoReelItem = ({ video, isActive, onVideoClick }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const mockVideo = video || {
    _id: '1',
    business: {
      name: 'Moosewood Restaurant',
      category: 'Food & Drink',
      location: 'Ithaca, NY'
    },
    thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=600&fit=crop',
    caption: 'Fresh vegetarian cuisine made with locally-sourced ingredients! Experience the taste that made us famous since 1973 🌱',
    createdAt: new Date()
  };

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
    onVideoClick?.(mockVideo);
  };

  return (
    <div className="relative h-screen w-full bg-black flex items-center justify-center">
      {/* Video Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${mockVideo.thumbnail})` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Video Overlay */}
      <button 
        onClick={handleVideoClick}
        className="absolute inset-0 z-10 flex items-center justify-center group"
      >
        {!isPlaying && (
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-8 group-hover:bg-white/30 transition-all duration-200 group-hover:scale-110">
            <Play className="w-16 h-16 text-white fill-white" />
          </div>
        )}
      </button>

      {/* Business Info Overlay - Bottom Left */}
      <div className="absolute bottom-20 left-4 right-20 z-20 text-white">
        <div className="mb-4">
          <button 
            onClick={() => navigate(`/business/${mockVideo.business.name}`)}
            className="flex items-center gap-3 mb-3 hover:bg-white/10 rounded-xl p-2 -m-2 transition-colors"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-xl">
                {mockVideo.business.category === 'Food & Drink' ? '☕' : '🏪'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg">{mockVideo.business.name}</h3>
              <p className="text-white/80 text-sm">{mockVideo.business.category}</p>
            </div>
          </button>
        </div>

        <p className="text-white text-base leading-relaxed mb-4 line-clamp-3">
          {mockVideo.caption}
        </p>

        <div className="flex items-center gap-4 text-white/80 text-sm">
          <div className="flex items-center gap-1">
            <Video className="w-4 h-4" />
            <span>{mockVideo.views.toLocaleString()} views</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{mockVideo.business.location}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/business/${mockVideo.business.name}`);
            }}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Visit
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate('/map');
            }}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center gap-2"
          >
            <Map className="w-4 h-4" />
            Map
          </button>
        </div>
      </div>

      {/* Interaction Panel - Right Side */}
      <div className="absolute right-4 bottom-20 z-20 flex flex-col items-center gap-6">
        {/* Like Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-200"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            liked ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'
          }`}>
            <Heart className={`w-7 h-7 ${liked ? 'text-white fill-white' : 'text-white'}`} />
          </div>
          <span className="text-white text-sm font-medium">
            {(mockVideo.likes + (liked ? 1 : 0)).toLocaleString()}
          </span>
        </button>

        {/* Comment Button */}
        <button 
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-200"
        >
          <div className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all duration-200">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <span className="text-white text-sm font-medium">{mockVideo.comments}</span>
        </button>

        {/* Share Button */}
        <button 
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-200"
        >
          <div className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all duration-200">
            <Share2 className="w-7 h-7 text-white" />
          </div>
          <span className="text-white text-sm font-medium">{mockVideo.shares}</span>
        </button>

        {/* Save Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setSaved(!saved);
          }}
          className="flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-200"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            saved ? 'bg-yellow-500' : 'bg-white/20 hover:bg-white/30'
          }`}>
            <Bookmark className={`w-7 h-7 ${saved ? 'text-white fill-white' : 'text-white'}`} />
          </div>
        </button>

        {/* More Options */}
        <button 
          onClick={(e) => e.stopPropagation()}
          className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <MoreHorizontal className="w-7 h-7 text-white" />
        </button>

        {/* Sound Toggle */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          {isMuted ? (
            <VolumeX className="w-7 h-7 text-white" />
          ) : (
            <Volume2 className="w-7 h-7 text-white" />
          )}
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="w-full bg-white/20 rounded-full h-1">
          <div className="bg-white h-1 rounded-full w-1/3 transition-all duration-1000"></div>
        </div>
      </div>
    </div>
  );
};

const ReelPage = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Mock video data
  const mockVideos = [
    {
      _id: '1',
      business: {
        name: 'Sunrise Coffee Co.',
        category: 'Food & Drink',
        location: 'Downtown Ithaca'
      },
      thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=600&fit=crop',
      caption: 'Fresh roasted coffee beans every morning! Our signature blend is locally sourced and perfectly crafted ☕',
      likes: 324,
      comments: 28,
      shares: 15,
      views: 2100
    },
    {
      _id: '2',
      business: {
        name: 'Artisan Pottery Studio',
        category: 'Arts & Culture',
        location: 'Arts District'
      },
      thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
      caption: 'Watch me create this beautiful ceramic vase from scratch! Join our weekend pottery classes 🏺',
      likes: 189,
      comments: 15,
      shares: 8,
      views: 1450
    },
    {
      _id: '3',
      business: {
        name: 'Night Owl Lounge',
        category: 'Nightlife & Events',
        location: 'Entertainment District'
      },
      thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=600&fit=crop',
      caption: 'Live jazz every Friday night! Come for the music, stay for the craft cocktails 🎷',
      likes: 467,
      comments: 52,
      shares: 23,
      views: 3200
    }
  ];


  // Initialize with mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      setVideos(mockVideos);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle scroll for video navigation
  useEffect(() => {
    const handleScroll = (e) => {
      const delta = e.deltaY;
      if (delta > 0 && currentVideoIndex < videos.length - 1) {
        setCurrentVideoIndex(prev => prev + 1);
      } else if (delta < 0 && currentVideoIndex > 0) {
        setCurrentVideoIndex(prev => prev - 1);
      }
    };

    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, [currentVideoIndex, videos.length]);

  // Loading screen
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50">
              <Video className="w-10 h-10 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl animate-pulse opacity-50"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Loading Reels...</h2>
          <p className="text-gray-400">Discovering amazing local content</p>
        </div>
      </div>
    );
  }

  // Error or no videos screen
  if (error || videos.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="text-center max-w-md px-4">
          <div className="text-8xl mb-6">🎬</div>
          <h1 className="text-3xl font-bold mb-4">No Videos Available</h1>
          <p className="text-gray-400 mb-8 text-lg leading-relaxed">
            {error || "Local businesses haven't uploaded videos yet. Check back soon for amazing content!"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 hover:scale-105"
            >
              Explore Businesses
            </button>
            <button 
              onClick={() => navigate('/feed')}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 hover:scale-105"
            >
              View Feed
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black overflow-hidden">
      <UnifiedHeader currentPage="reel" />
      
      {/* Video Container */}
      <div className="relative">
        {videos.map((video, index) => (
          <div
            key={video._id}
            className={`transition-transform duration-500 ${
              index === currentVideoIndex ? 'translate-y-0' : 
              index < currentVideoIndex ? '-translate-y-full' : 'translate-y-full'
            }`}
            style={{
              position: index === currentVideoIndex ? 'relative' : 'absolute',
              top: index === currentVideoIndex ? 0 : '100%',
              width: '100%'
            }}
          >
            <VideoReelItem
              video={video}
              isActive={index === currentVideoIndex}
              onVideoClick={(video) => console.log('Video clicked:', video)}
            />
          </div>
        ))}
      </div>

      {/* Navigation Indicators */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
        <div className="flex flex-col gap-3">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideoIndex(index)}
              className={`w-2 h-8 rounded-full transition-all duration-200 ${
                index === currentVideoIndex 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-black/50 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm">
        <div className="flex items-center gap-4">
          <span>Scroll or swipe to browse videos</span>
          <span className="text-white/60">•</span>
          <span>Tap video to play/pause</span>
        </div>
      </div>
    </div>
  );
};

export default ReelPage;