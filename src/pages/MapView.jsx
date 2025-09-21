import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { icon } from 'leaflet';
import L from 'leaflet';
import axios from 'axios';
import { useFilters } from '../context/FilterContext';
import FilterSidebar from '../components/FilterSidebar';
import StoreCard from '../components/StoreCard';
import { Search, Filter, MapPin, Video, Heart, Share2, Navigation, Star, Menu, X, Home, Map, Play, Grid3X3 } from 'lucide-react';
import AnimatedBackground from '../components/animatedbg';
import UnifiedHeader from '../components/UnifiedHeader';
import { CATEGORIES } from '../constants/categories';
import { ITHACA_BUSINESSES } from '../constants/businessData';

// Fix for default markers in react-leaflet
const defaultIcon = icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom marker icons for different categories
const categoryIcons = {
  'Food & Drink': icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRjY1MDAiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbGw9IndoaXRlIj4KPHA+8J+NvzwvcD4KPC9zdmc+Cjwvc3ZnPg==',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }),
  'Shopping': icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMxMEI5ODEiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbGw9IndoaXRlIj4KPHA+8J+dkzwvcD4KPC9zdmc+Cjwvc3ZnPg==',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }),
  'Arts & Culture': icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiM4QjVDRjYiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbGw9IndoaXRlIj4KPHA+8J+OrTwvcD4KPC9zdmc+Cjwvc3ZnPg==',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }),
  'Nightlife & Events': icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRjQyOTEiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbGw9IndoaXRlIj4KPHA+8J+ORjwvcD4KPC9zdmc+Cjwvc3ZnPg==',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }),
  'Services': icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMwMzg0RDciLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbGw9IndoaXRlIj4KPHA+8J+fkTwvcD4KPC9zdmc+Cjwvc3ZnPg==',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }),
  'Hardware & Home': icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMwMzg0RDciLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbGw9IndoaXRlIj4KPHA+8J+fkTwvcD4KPC9zdmc+Cjwvc3ZnPg==',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }),
  'Food & Shopping': icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRjY1MDAiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbGw9IndoaXRlIj4KPHA+8J+dkzwvcD4KPC9zdmc+Cjwvc3ZnPg==',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })
};


// Component to handle map events and updates
const MapController = ({ businesses, center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (businesses.length > 0) {
      // Fit map to show all businesses
      const group = L.featureGroup(
        businesses.map(business => 
          L.marker([
            business.coordinates.coordinates[1], 
            business.coordinates.coordinates[0]
          ])
        )
      );
      
      if (group.getBounds().isValid()) {
        map.fitBounds(group.getBounds(), { padding: [20, 20] });
      }
    } else {
      // No businesses, center on default location
      map.setView(center, 13);
    }
  }, [businesses, map, center]);

  return null;
};

const MapView = () => {
  const { filters, getQueryString } = useFilters();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  // Default center (Ithaca, NY)
  const defaultCenter = [42.443962, -76.501884];

  // Use shared business data (convert coordinates format for map compatibility)
  const ithacaBusinesses = ITHACA_BUSINESSES.map(business => ({
    ...business,
    coordinates: { 
      coordinates: [business.coordinates.lng, business.coordinates.lat] // MapView expects [lng, lat]
    },
    reviews: [{ rating: business.rating }]
  }));

  // Set businesses data
  useEffect(() => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setBusinesses(ithacaBusinesses);
      setLoading(false);
    }, 500);
  }, []);

  // Get marker icon based on category
  const getMarkerIcon = (category) => {
    return categoryIcons[category] || defaultIcon;
  };

  // Handle marker click
  const handleMarkerClick = (business) => {
    setSelectedBusiness(business);
  };

  // Close popup
  const closePopup = () => {
    setSelectedBusiness(null);
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground variant="feed" intensity="medium" />
      
      {/* Unified Header */}
      <UnifiedHeader currentPage="map" />
      
      {/* Main Content */}
      <div className="pt-20 relative z-10">
        <div className="flex h-[calc(100vh-5rem)]">
          {/* Filter Sidebar */}
          <div className={`transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
            <div className="w-80 h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-r border-white/10">
              <FilterSidebar 
                isOpen={sidebarOpen} 
                onToggle={() => setSidebarOpen(!sidebarOpen)} 
              />
            </div>
          </div>

          {/* Main Map Content */}
          <div className="flex-1 relative">
            
            {/* Map Header Controls */}
            <div className="absolute top-4 left-4 right-4 z-20 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="flex items-center space-x-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-200"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
                    </span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold text-white">Map View</h1>
                    {loading && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-violet-400"></div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <span className="text-sm text-white/90 font-medium">
                      {businesses.length} business{businesses.length !== 1 ? 'es' : ''} found
                    </span>
                  </div>
                  
                  {error && (
                    <div className="bg-red-500/20 text-red-300 px-4 py-2 rounded-xl text-sm font-medium">
                      Error loading data
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="h-full rounded-2xl overflow-hidden border border-white/10">
              <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <MapController businesses={businesses} center={defaultCenter} />
                
                {/* Business Markers */}
                {businesses.map((business) => (
                  <Marker
                    key={business._id}
                    position={[
                      business.coordinates.coordinates[1], // latitude
                      business.coordinates.coordinates[0]  // longitude
                    ]}
                    icon={getMarkerIcon(business.category)}
                    eventHandlers={{
                      click: () => handleMarkerClick(business)
                    }}
                  >
                    <Popup
                      closeButton={true}
                      className="business-popup"
                      maxWidth={300}
                    >
                      <div className="p-2">
                        <div className="mb-3">
                          <h3 className="font-bold text-lg text-gray-900 mb-1">
                            {business.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {business.category} • {business.priceLevel}
                          </p>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {business.description}
                          </p>
                        </div>
                        
                        {business.coverImage && (
                          <img 
                            src={business.coverImage} 
                            alt={business.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-yellow-400 text-sm">⭐</span>
                            <span className="ml-1 text-sm font-medium text-gray-700">
                              {business.reviews && business.reviews.length > 0
                                ? (business.reviews.reduce((sum, review) => sum + review.rating, 0) / business.reviews.length).toFixed(1)
                                : 'New'
                              }
                            </span>
                            <span className="ml-2 text-sm text-gray-500">
                              ({business.reviews ? business.reviews.length : 0} reviews)
                            </span>
                          </div>
                          
                          <button 
                            onClick={() => setSelectedBusiness(business)}
                            className="text-violet-600 hover:text-violet-700 text-sm font-medium"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Business Detail Modal */}
            {selectedBusiness && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-white/10">
                  <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h3 className="text-lg font-bold text-white">Business Details</h3>
                    <button
                      onClick={closePopup}
                      className="text-white/60 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="overflow-y-auto max-h-[calc(90vh-120px)] text-white">
                    <StoreCard business={selectedBusiness} />
                  </div>
                </div>
              </div>
            )}

            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-30 rounded-2xl">
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50">
                      <Map className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl animate-pulse opacity-50"></div>
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-white">Loading Map...</h2>
                  <p className="text-gray-400">Finding local businesses near you</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;