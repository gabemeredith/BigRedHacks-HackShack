
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Video, Star, Menu, X, Home, Map, Play, Grid3X3, Compass } from 'lucide-react';
import UnifiedHeader from '../components/UnifiedHeader';
import { CATEGORIES } from '../constants/categories';
import { ITHACA_BUSINESSES } from '../constants/businessData';

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


// Mock Business Feed Component
const BusinessFeed = ({ items = [] }) => {
  const navigate = useNavigate();
  
  const mockItems = items.length > 0 ? items : [
    {
      _id: '1',
      name: 'Moosewood Restaurant',
      category: 'Food & Drink',
      description: 'Iconic vegetarian restaurant serving fresh, locally-sourced cuisine since 1973',
      address: '215 N Cayuga St, Ithaca, NY 14850',
      phone: '(607) 273-9610',
      videoUrl: 'https://example.com/video1',
      thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
      rating: 4.7,
      coordinates: { lat: 42.4406, lng: -76.4966 }
    },
    {
      _id: '2',
      name: 'Ithaca Bakery',
      category: 'Food & Drink',
      description: 'Local bakery and cafe serving fresh bread, pastries, and coffee since 1930',
      address: '400 N Meadow St, Ithaca, NY 14850',
      phone: '(607) 273-7110',
      videoUrl: 'https://example.com/video2',
      thumbnail: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=300&fit=crop',
      rating: 4.5,
      coordinates: { lat: 42.4412, lng: -76.4958 }
    },
    {
      _id: '3',
      name: 'Collegetown Bagels',
      category: 'Food & Drink',
      description: 'Popular bagel shop and deli serving fresh bagels, sandwiches, and coffee',
      address: '415 College Ave, Ithaca, NY 14850',
      phone: '(607) 273-1955',
      videoUrl: 'https://example.com/video3',
      thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
      rating: 4.6,
      coordinates: { lat: 42.4444, lng: -76.4856 }
    },
    {
      _id: '4',
      name: 'Gimme Coffee',
      category: 'Food & Drink',
      description: 'Artisanal coffee roaster and cafe with multiple locations in Ithaca',
      address: '171 E State St, Ithaca, NY 14850',
      phone: '(607) 256-7468',
      videoUrl: 'https://example.com/video4',
      thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
      rating: 4.8,
      coordinates: { lat: 42.4401, lng: -76.4961 }
    },
    {
      _id: '5',
      name: 'Viva Taqueria',
      category: 'Food & Drink',
      description: 'Authentic Mexican restaurant serving fresh tacos, burritos, and traditional dishes',
      address: '115 E State St, Ithaca, NY 14850',
      phone: '(607) 256-7777',
      videoUrl: 'https://example.com/video5',
      thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      rating: 4.4,
      coordinates: { lat: 42.4402, lng: -76.4960 }
    },
    {
      _id: '6',
      name: 'Buffalo Street Books',
      category: 'Shopping',
      description: 'Independent bookstore featuring local authors, events, and community programs',
      address: '215 N Cayuga St, Ithaca, NY 14850',
      phone: '(607) 273-8244',
      videoUrl: 'https://example.com/video6',
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      rating: 4.7,
      coordinates: { lat: 42.4405, lng: -76.4965 }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {mockItems.map((item) => (
        <div key={item._id} className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-violet-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/10">
          {/* Video Preview */}
          <div className="relative aspect-video">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${item.thumbnail})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={() => navigate('/reel')}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-6 hover:bg-white/30 transition-all duration-200 hover:scale-110"
                >
                  <Play className="w-8 h-8 text-white fill-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white text-lg font-bold mb-1">{item.name}</h3>
                <p className="text-gray-400 text-sm">{item.category}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm ml-1 text-white">{item.rating}</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span className="ml-1">{calculateDistance(42.4403, -76.4963, item.coordinates.lat, item.coordinates.lng).toFixed(1)} mi</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};

// Filter Sidebar Component
const FilterSideBar = ({
  category,
  onCategoryChange,
  radius,
  onRadiusChange,
  position,
  onUseMyLocation,
  onClearLocation
}) => {

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 h-fit">
      <h2 className="text-white text-xl font-bold mb-6">Filters</h2>
      
      {/* Location */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3">Location</h3>
        <div className="space-y-2">
          <button
            onClick={onUseMyLocation}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105"
          >
            📍 Use My Location
          </button>
          {position && (
            <button
              onClick={onClearLocation}
              className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
            >
              Clear Location
            </button>
          )}
        </div>
      </div>

      {/* Radius */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3">
          Radius: {radius} miles
        </h3>
        <input
          type="range"
          min="1"
          max="25"
          step="1"
          value={radius}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
          className="w-full accent-violet-600"
        />
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id === 'all' ? '' : cat.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                (category === '' && cat.id === 'all') || category === cat.id
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default function FeedPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // filters
  const [category, setCategory] = useState('');
  const [radius, setRadius] = useState(5); // 5 miles
  const [pos, setPos] = useState(null);

  // modal
  const [activeVideo, setActiveVideo] = useState(null);

  // get browser location once (optional)
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      p => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setPos(null),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  const params = useMemo(() => {
    const p = {};
    if (pos?.lat != null && pos?.lng != null) { p.lat = pos.lat; p.lng = pos.lng; }
    if (radius) p.r = radius;
    if (category) p.category = category;
    return p;
  }, [pos, radius, category]);


  // Use shared business data
  const ithacaBusinesses = ITHACA_BUSINESSES;

  // Filter businesses based on category and radius
  const filteredBusinesses = useMemo(() => {
    return ithacaBusinesses.filter(business => {
      // Category filter
      const matchesCategory = category === '' || business.category === category;

      // Radius filter (assuming user is at Ithaca Commons: 42.4403, -76.4963)
      const userLat = 42.4403;
      const userLng = -76.4963;
      const distance = calculateDistance(userLat, userLng, business.coordinates.lat, business.coordinates.lng);
      const matchesRadius = distance <= radius; // radius is already in miles

      return matchesCategory && matchesRadius;
    });
  }, [category, radius]);

  const load = useCallback(async () => {
    setLoading(true); 
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setItems(filteredBusinesses);
    } catch (e) {
      console.error(e);
      setError('Failed to load feed');
    } finally {
      setLoading(false);
    }
  }, [filteredBusinesses]);

  useEffect(() => { load(); }, [load]);

  // Debug logging
  console.log('FeedPage render:', { loading, error, itemsLength: items.length, filteredBusinessesLength: filteredBusinesses.length });

  return (
    <div className="w-full h-screen overflow-auto bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <UnifiedHeader currentPage="feed" />
      
      <div className="w-full py-6 pt-24 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-3 px-4">
          <FilterSideBar
            category={category}
            onCategoryChange={setCategory}
            radius={radius}
            onRadiusChange={setRadius}
            position={pos}
            onUseMyLocation={() => {
              if (!navigator.geolocation) return;
              navigator.geolocation.getCurrentPosition(
                p => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
                () => setPos(null)
              );
            }}
            onClearLocation={() => setPos(null)}
          />
        </aside>

        {/* Main feed */}
        <main className="lg:col-span-9 px-4">
          <header className="flex items-center gap-3 mb-6">
            <h1 className="text-3xl font-bold text-white">What's happening nearby</h1>
            {loading ? (
              <div className="flex items-center gap-2 text-violet-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet-400"></div>
                <span className="text-sm">Loading...</span>
              </div>
            ) : error ? (
              <span className="text-sm text-red-400">{error}</span>
            ) : (
              <span className="text-sm text-gray-400">Showing local discoveries</span>
            )}
          </header>

          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-slate-800/50 rounded-2xl overflow-hidden border border-white/10">
                  <div className="aspect-video bg-slate-700/50 animate-pulse"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-slate-700/50 rounded animate-pulse"></div>
                    <div className="h-4 bg-slate-700/50 rounded animate-pulse w-2/3"></div>
                    <div className="flex gap-2">
                      <div className="h-10 bg-slate-700/50 rounded-xl flex-1 animate-pulse"></div>
                      <div className="h-10 bg-slate-700/50 rounded-xl w-16 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <BusinessFeed items={items} />
          )}

          {!loading && !error && items.length === 0 && (
            <div className="text-center py-12">
              <div className="text-white/60 text-lg mb-4">No businesses found</div>
              <div className="text-white/40 text-sm">Try adjusting your filters or search terms</div>
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-12">
              <div className="text-red-400 text-lg mb-4">Error loading feed</div>
              <div className="text-white/60 text-sm">{error}</div>
              <button 
                onClick={() => load()}
                className="mt-4 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-xl transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}