import React, { useState } from 'react';
import { 
  Heart, 
  Share2, 
  Bookmark, 
  MessageCircle, 
  Navigation, 
  Map, 
  Video,
  MoreHorizontal,
  Volume2,
  VolumeX 
} from 'lucide-react';

// Reusable Action Buttons Component - can be used on any page
const ActionButtons = ({ 
  position = 'fixed', // 'fixed', 'absolute', or 'relative'
  business = null,
  likes = 0,
  comments = 0,
  shares = 0,
  className = '',
  showSoundToggle = false,
  variant = 'vertical' // 'vertical' or 'horizontal'
}) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleLike = (e) => {
    e?.stopPropagation();
    setLiked(!liked);
  };

  const handleSave = (e) => {
    e?.stopPropagation();
    setSaved(!saved);
  };

  const handleShare = (e) => {
    e?.stopPropagation();
    // Implement share functionality
    if (navigator.share && business) {
      navigator.share({
        title: business.name,
        text: `Check out ${business.name} on LocalLens!`,
        url: window.location.href
      });
    }
  };

  const handleComment = (e) => {
    e?.stopPropagation();
    // Navigate to comments or open modal
    console.log('Open comments');
  };

  const handleNavigation = (e) => {
    e?.stopPropagation();
    if (business) {
      console.log(`Navigate to business: ${business._id}`);
      // navigate(`/business/${business._id}`);
    }
  };

  const handleMap = (e) => {
    e?.stopPropagation();
    console.log('Navigate to map');
    // navigate('/map');
  };

  const ButtonContainer = ({ children }) => {
    const baseClasses = `${position} z-30 ${className}`;
    const positionClasses = position === 'fixed' 
      ? 'right-4 bottom-20' 
      : position === 'absolute'
      ? 'right-4 bottom-4'
      : '';
    
    const layoutClasses = variant === 'vertical' 
      ? 'flex flex-col items-center gap-4' 
      : 'flex items-center gap-4';

    return (
      <div className={`${baseClasses} ${positionClasses} ${layoutClasses}`}>
        {children}
      </div>
    );
  };

  const ActionButton = ({ 
    onClick, 
    children, 
    count, 
    active = false, 
    activeColor = 'bg-red-500',
    hoverColor = 'hover:bg-white/30' 
  }) => (
    <button 
      onClick={onClick}
      className="group flex flex-col items-center gap-2 hover:scale-110 transition-all duration-200"
    >
      <div className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
        active ? activeColor : `bg-white/20 ${hoverColor}`
      }`}>
        {children}
      </div>
      {count !== undefined && (
        <span className="text-white text-sm font-medium">
          {typeof count === 'number' && count > 0 ? count.toLocaleString() : count}
        </span>
      )}
    </button>
  );

  return (
    <ButtonContainer>
      {/* Like Button */}
      <ActionButton 
        onClick={handleLike}
        count={likes + (liked ? 1 : 0)}
        active={liked}
        activeColor="bg-red-500"
      >
        <Heart className={`w-6 h-6 ${liked ? 'text-white fill-white' : 'text-white'}`} />
      </ActionButton>

      {/* Comment Button */}
      <ActionButton 
        onClick={handleComment}
        count={comments}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </ActionButton>

      {/* Share Button */}
      <ActionButton 
        onClick={handleShare}
        count={shares}
      >
        <Share2 className="w-6 h-6 text-white" />
      </ActionButton>

      {/* Save Button */}
      <ActionButton 
        onClick={handleSave}
        active={saved}
        activeColor="bg-yellow-500"
      >
        <Bookmark className={`w-6 h-6 ${saved ? 'text-white fill-white' : 'text-white'}`} />
      </ActionButton>

      {/* Navigation Button (if business provided) */}
      {business && (
        <ActionButton onClick={handleNavigation}>
          <Navigation className="w-6 h-6 text-white" />
        </ActionButton>
      )}

      {/* Map Button */}
      <ActionButton onClick={handleMap}>
        <Map className="w-6 h-6 text-white" />
      </ActionButton>

      {/* Sound Toggle (optional) */}
      {showSoundToggle && (
        <ActionButton 
          onClick={(e) => {
            e?.stopPropagation();
            setIsMuted(!isMuted);
          }}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-white" />
          ) : (
            <Volume2 className="w-6 h-6 text-white" />
          )}
        </ActionButton>
      )}

      {/* More Options */}
      <ActionButton onClick={(e) => e?.stopPropagation()}>
        <MoreHorizontal className="w-6 h-6 text-white" />
      </ActionButton>
    </ButtonContainer>
  );
};

// Example implementations for different pages

// HomePage with Action Buttons
const HomePageWithActions = () => {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 via-slate-900 to-indigo-900">
      {/* Your existing homepage content here */}
      <div className="relative min-h-screen">
        {/* Hero content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-6xl font-bold text-white text-center">
            Welcome to LocalLens
          </h1>
        </div>
        
        {/* Action buttons positioned on the right */}
        <ActionButtons 
          position="fixed"
          likes={1250}
          comments={89}
          shares={45}
          className="right-6 bottom-32"
        />
      </div>
    </div>
  );
};

// Feed Page with Action Buttons
const FeedPageWithActions = () => {
  const mockBusiness = {
    _id: '123',
    name: 'Downtown Coffee',
    category: 'Food & Drink'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 via-indigo-900 to-slate-900">
      {/* Your existing feed content */}
      <div className="relative">
        {/* Feed content here */}
        <div className="pt-20 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Your feed cards */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 relative">
              <h3 className="text-white text-xl font-bold mb-2">Sunny Side Cafe</h3>
              <p className="text-gray-300 mb-4">Amazing coffee and pastries in downtown!</p>
              
              {/* Action buttons for this specific business */}
              <ActionButtons 
                position="absolute"
                business={mockBusiness}
                likes={234}
                comments={18}
                shares={12}
                className="right-4 top-4"
                variant="horizontal" // Use horizontal layout for cards
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Map Page with Action Buttons
const MapPageWithActions = () => {
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const mockBusiness = {
    _id: '456',
    name: 'Art Gallery Downtown',
    category: 'Arts & Culture'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 via-purple-900 to-violet-900">
      {/* Map content */}
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg m-4">
          <div className="flex items-center justify-center h-full text-white text-2xl">
            Interactive Map View
          </div>
        </div>
        
        {/* Action buttons when a business is selected */}
        {selectedBusiness && (
          <ActionButtons 
            position="fixed"
            business={selectedBusiness}
            likes={456}
            comments={32}
            shares={28}
            className="right-6 bottom-6"
          />
        )}
        
        {/* Demo button to show action buttons */}
        <button 
          onClick={() => setSelectedBusiness(selectedBusiness ? null : mockBusiness)}
          className="fixed bottom-6 left-6 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl z-40"
        >
          {selectedBusiness ? 'Hide Actions' : 'Show Action Buttons'}
        </button>
      </div>
    </div>
  );
};

// Full-screen gradient examples
const GradientExamples = () => {
  return (
    <div className="space-y-8">
      {/* Example 1: Basic full-screen gradient */}
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
        <div className="flex items-center justify-center min-h-screen text-white">
          <h2 className="text-4xl font-bold">Full-Screen Gradient Example 1</h2>
        </div>
      </div>

      {/* Example 2: Complex multi-stop gradient */}
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 via-indigo-900 to-blue-900">
        <div className="flex items-center justify-center min-h-screen text-white">
          <h2 className="text-4xl font-bold">Complex Multi-Stop Gradient</h2>
        </div>
      </div>

      {/* Example 3: Radial gradient overlay */}
      <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-transparent"></div>
        <div className="relative flex items-center justify-center min-h-screen text-white">
          <h2 className="text-4xl font-bold">Radial Gradient Overlay</h2>
        </div>
      </div>
    </div>
  );
};

// Main component showing all examples
const ActionButtonsDemo = () => {
  const [currentView, setCurrentView] = useState('home');

  const views = {
    home: <HomePageWithActions />,
    feed: <FeedPageWithActions />,
    map: <MapPageWithActions />,
    gradients: <GradientExamples />
  };

  return (
    <div>
      {/* Navigation to switch between examples */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        {Object.keys(views).map((view) => (
          <button
            key={view}
            onClick={() => setCurrentView(view)}
            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
              currentView === view
                ? 'bg-white text-purple-900'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      {/* Current view */}
      {views[currentView]}
    </div>
  );
};

export default ActionButtons;