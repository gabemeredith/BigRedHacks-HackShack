import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { icon } from 'leaflet';
import L from 'leaflet';
import axios from 'axios';
import { useFilters } from '../context/FilterContext';
import FilterSidebar from '../components/FilterSidebar';
import StoreCard from '../components/StoreCard';

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
  'Local Shopping': icon({
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

  // Fetch businesses based on current filters
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const queryString = getQueryString();
        const url = `/api/businesses${queryString ? `?${queryString}` : ''}`;
        
        console.log('Fetching businesses with filters:', url);
        
        const response = await axios.get(url);
        setBusinesses(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching businesses:', err);
        setError('Failed to load businesses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [filters, getQueryString]);

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
    <div className="flex h-screen bg-gray-50">
      {/* Filter Sidebar */}
      <FilterSidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />

      {/* Main Map Content */}
      <div className={`flex-1 relative transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
        
        {/* Map Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="text-sm font-medium">
                  {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
                </span>
              </button>
              
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-gray-900">Map View</h1>
                {loading && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {businesses.length} business{businesses.length !== 1 ? 'es' : ''} found
              </span>
              
              {error && (
                <div className="text-red-600 text-sm font-medium">
                  Error loading data
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="h-full pt-16">
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
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
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
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Business Details</h3>
                <button
                  onClick={closePopup}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                <StoreCard business={selectedBusiness} />
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading businesses...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
