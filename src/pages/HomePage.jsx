import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, MapPin, Filter, Heart, Share2, Navigation, Star, TrendingUp, Video, Users } from 'lucide-react';
import UnifiedHeader from '../components/UnifiedHeader';
import { CATEGORIES } from '../constants/categories';
import { ITHACA_BUSINESSES } from '../constants/businessData';

const HomePage = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('feed');

  // Use shared business data
  const mockBusinesses = ITHACA_BUSINESSES;

  // Calculate distance between two coordinates (in miles)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filter businesses based on category
  const filteredBusinesses = mockBusinesses.filter(business => {
    // Category filter
    const matchesCategory = activeCategory === 'all' || business.category === activeCategory;
    return matchesCategory;
  });

  useEffect(() => {
    setBusinesses(filteredBusinesses);
  }, [activeCategory]);


  const categories = CATEGORIES;

  const VideoCard = ({ business }) => {
    // Calculate distance from user location (Ithaca Commons)
    const userLat = 42.4403;
    const userLng = -76.4963;
    const distance = calculateDistance(userLat, userLng, business.coordinates.lat, business.coordinates.lng);
    
    return (
      <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-2xl">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${business.thumbnail})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 hover:bg-white/30 transition-all duration-200">
            <Play className="w-12 h-12 text-white fill-white" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 h-80 flex flex-col justify-end">
          {/* Business Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm ml-1">{business.rating}</span>
              </div>
              <div className="flex items-center text-white/80 text-sm">
                <MapPin className="w-4 h-4" />
                <span className="ml-1">{distance.toFixed(1)} mi</span>
              </div>
            </div>
            
            <h3 className="text-white text-xl font-bold">{business.name}</h3>
            <p className="text-white/80 text-sm">{business.category}</p>
            <p className="text-white/70 text-xs">{business.address}</p>
            
            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-white text-black px-4 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <Navigation className="w-4 h-4" />
                Directions
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-semibold hover:bg-white/30 transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-screen overflow-auto">
      <UnifiedHeader currentPage="home" />

      {/* Hero Section with Fullscreen Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Fullscreen Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 -z-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-indigo-600/30"></div>
        
        {/* Floating Elements - Faster Animation */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse [animation-duration:1.5s]"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse [animation-duration:2s] [animation-delay:0.3s]"></div>
        <div className="absolute top-1/2 left-3/4 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20 animate-pulse [animation-duration:1.8s] [animation-delay:0.7s]"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-r from-green-400 to-teal-500 rounded-full blur-3xl opacity-15 animate-pulse [animation-duration:2.2s] [animation-delay:1s]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full blur-3xl opacity-18 animate-pulse [animation-duration:1.7s] [animation-delay:0.5s]"></div>

          {/* Hero Content */}
        <div className="relative z-10 w-full text-center text-white px-4">
          <div className="mb-8">
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                LocalLens
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl mb-4 font-light">
              Discover Local Businesses
            </p>
            <p className="text-lg sm:text-xl md:text-2xl mb-12 opacity-80 font-light">
              Through Authentic Short-Form Videos
            </p>
          </div>

        </div>

        {/* Enhanced Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce cursor-pointer hover:scale-110 transition-transform duration-200">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center hover:border-white/80 transition-colors duration-200">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Rest of the content with background */}
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* About Us Section */}
        <section className="relative py-20 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-y border-white/10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
                <Users className="w-6 h-6 text-purple-300" />
                <span className="text-purple-200 font-medium">Building Stronger Communities</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Connecting Communities Through 
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"> Video Stories</span>
              </h2>
              <p className="text-xl text-white/80 max-w-4xl mx-auto">
                LocalLens revolutionizes local business discovery by replacing static reviews with authentic, 
                engaging short-form videos that capture the real atmosphere and experiences of your neighborhood gems.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              {/* Mission Statement */}
              <div className="space-y-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <Heart className="w-6 h-6 text-pink-400" />
                    Our Mission
                  </h3>
                  <p className="text-white/80 text-lg leading-relaxed mb-6">
                    We believe every local business has a story worth sharing. By empowering communities to showcase 
                    their favorite spots through authentic video content, we're creating a platform where small businesses 
                    thrive and neighborhoods stay connected.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
                      <p className="text-white/70">
                        <strong className="text-white">Community-First:</strong> Keep money circulating locally and support neighborhood businesses
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-pink-400 mt-2"></div>
                      <p className="text-white/70">
                        <strong className="text-white">Authentic Discovery:</strong> Real videos from real people, no fake reviews
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2"></div>
                      <p className="text-white/70">
                        <strong className="text-white">Affordable Marketing:</strong> Free or low-cost promotion for small businesses
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Video className="w-6 h-6 text-purple-400" />
                  How LocalLens Works
                </h3>
                <div className="space-y-4">
                  {[
                    { 
                      step: "01", 
                      title: "Location-Based Discovery", 
                      desc: "Set your location and explore businesses within your customizable radius",
                      icon: MapPin
                    },
                    { 
                      step: "02", 
                      title: "Short-Form Video Content", 
                      desc: "30-60 second clips showcasing real atmosphere, offerings, and experiences",
                      icon: Video
                    },
                    { 
                      step: "03", 
                      title: "Community-Powered Reviews", 
                      desc: "Authentic content from both businesses and community members",
                      icon: Users
                    },
                    { 
                      step: "04", 
                      title: "Seamless Engagement", 
                      desc: "Quick actions for directions, saving favorites, and sharing discoveries",
                      icon: Share2
                    }
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                        {item.step}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <item.icon className="w-5 h-5 text-purple-300" />
                          <h4 className="text-white font-semibold">{item.title}</h4>
                        </div>
                        <p className="text-white/70 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Category Navigation */}
        <section className="sticky top-20 z-30 bg-white/10 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-3 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      if (category.id !== 'all') {
                        navigate(`/feed?category=${category.id}`);
                      }
                    }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                      activeCategory === category.id
                        ? 'bg-white text-purple-900 shadow-lg'
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    {typeof category.icon === 'string' ? (
                      <span className="text-lg">{category.icon}</span>
                    ) : (
                      <category.icon className="w-4 h-4" />
                    )}
                    {category.name}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    const newViewMode = viewMode === 'feed' ? 'map' : 'feed';
                    setViewMode(newViewMode);
                    if (newViewMode === 'map') {
                      navigate('/map');
                    } else {
                      navigate('/feed');
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-xl transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  {viewMode === 'feed' ? 'Map View' : 'Feed View'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="w-full py-12">
          {/* Featured Section */}
          <section className="mb-16 px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                Trending Near You
              </h2>
              <div className="flex items-center gap-2 text-purple-300">
                <Users className="w-5 h-5" />
                <span className="text-sm">Live from your community</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businesses.map((business) => (
                <VideoCard key={business._id} business={business} />
              ))}
            </div>
          </section>

          {/* Load More */}
          <div className="text-center">
            <button 
              onClick={() => navigate('/feed')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-200 transform hover:scale-105"
            >
              View All Videos
            </button>
          </div>
        </main>

        {/* CTA Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-10"></div>
            <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-10"></div>
          </div>
          
          <div className="relative w-full text-center px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Go Viral Locally?
            </h2>
            <p className="text-xl mb-12 text-white/80">
              Join thousands of businesses showcasing their story through video
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => navigate('/register')}
                className="bg-white text-purple-900 hover:bg-gray-100 px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-200 transform hover:scale-105"
              >
                List Your Business
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105"
              >
                Business Login
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;