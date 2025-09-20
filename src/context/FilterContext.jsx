import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

// Available categories that match our backend enum
export const AVAILABLE_CATEGORIES = [
  'Food & Drink',
  'Local Shopping',
  'Arts & Culture',
  'Nightlife & Events',
  'Services'
];

// Initial filter state
const initialState = {
  radius: 5,
  categories: [],
  openNow: false,
  priceLevel: [], // Array to allow multiple price levels
  searchQuery: '',
  location: {
    lat: 42.443962, // Ithaca, NY coordinates
    lng: -76.501884
  }
};

// Create the context
const FilterContext = createContext();

// FilterProvider component
export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState(initialState);

  // Update radius filter
  const updateRadius = (newRadius) => {
    setFilters(prev => ({
      ...prev,
      radius: newRadius
    }));
  };

  // Toggle category filter
  const toggleCategory = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(cat => cat !== category)
        : [...prev.categories, category]
    }));
  };

  // Toggle open now filter
  const toggleOpenNow = () => {
    setFilters(prev => ({
      ...prev,
      openNow: !prev.openNow
    }));
  };

  // Toggle price level filter
  const togglePriceLevel = (priceLevel) => {
    setFilters(prev => ({
      ...prev,
      priceLevel: prev.priceLevel.includes(priceLevel)
        ? prev.priceLevel.filter(level => level !== priceLevel)
        : [...prev.priceLevel, priceLevel]
    }));
  };

  // Update search query
  const updateSearchQuery = (query) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: query
    }));
  };

  // Update location
  const updateLocation = (lat, lng) => {
    setFilters(prev => ({
      ...prev,
      location: { lat, lng }
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters(initialState);
  };

  // Reset to initial state but keep location
  const resetFilters = () => {
    setFilters(prev => ({
      ...initialState,
      location: prev.location
    }));
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return filters.categories.length > 0 ||
           filters.priceLevel.length > 0 ||
           filters.openNow ||
           filters.searchQuery.trim() !== '' ||
           filters.radius !== initialState.radius;
  };

  // Get filter count for UI display
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.priceLevel.length > 0) count++;
    if (filters.openNow) count++;
    if (filters.searchQuery.trim() !== '') count++;
    if (filters.radius !== initialState.radius) count++;
    return count;
  };

  // Convert filters to query string for API calls
  const getQueryString = () => {
    const params = new URLSearchParams();
    
    if (filters.categories.length > 0) {
      filters.categories.forEach(category => {
        params.append('category', category);
      });
    }
    
    if (filters.priceLevel.length > 0) {
      filters.priceLevel.forEach(level => {
        params.append('priceLevel', level);
      });
    }
    
    if (filters.openNow) {
      params.append('openNow', 'true');
    }
    
    if (filters.searchQuery.trim() !== '') {
      params.append('search', filters.searchQuery);
    }
    
    if (filters.radius !== initialState.radius) {
      params.append('radius', filters.radius);
    }
    
    if (filters.location.lat !== initialState.location.lat || 
        filters.location.lng !== initialState.location.lng) {
      params.append('lat', filters.location.lat);
      params.append('lng', filters.location.lng);
    }
    
    return params.toString();
  };

  const value = {
    filters,
    updateRadius,
    toggleCategory,
    toggleOpenNow,
    togglePriceLevel,
    updateSearchQuery,
    updateLocation,
    clearFilters,
    resetFilters,
    hasActiveFilters,
    getActiveFilterCount,
    getQueryString
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

FilterProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Custom hook to use the filter context
export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

export default FilterContext;
