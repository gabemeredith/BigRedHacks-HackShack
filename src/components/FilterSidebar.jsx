import { useState } from 'react';
import Slider from 'rc-slider';
import { useFilters, AVAILABLE_CATEGORIES } from '../context/FilterContext';
import PropTypes from 'prop-types';

const FilterSidebar = ({ isOpen = true, onToggle }) => {
  const {
    filters,
    updateRadius,
    toggleCategory,
    toggleOpenNow,
    togglePriceLevel,
    updateSearchQuery,
    resetFilters,
    hasActiveFilters,
    getActiveFilterCount
  } = useFilters();

  const [localSearchQuery, setLocalSearchQuery] = useState(filters.searchQuery);

  // Price level options
  const PRICE_LEVELS = ['$', '$$', '$$$', '$$$$'];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateSearchQuery(localSearchQuery);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    // Update context immediately for real-time search
    updateSearchQuery(value);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-20 left-4 z-50 bg-white rounded-full p-3 shadow-lg border"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${!isOpen ? 'lg:w-0 lg:overflow-hidden' : ''}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              {hasActiveFilters() && (
                <span className="bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </div>
            <button
              onClick={resetFilters}
              disabled={!hasActiveFilters()}
              className={`text-sm font-medium transition-colors ${
                hasActiveFilters() 
                  ? 'text-primary-600 hover:text-primary-700' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              Clear All
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Search */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                Search Businesses
              </label>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={handleSearchChange}
                  placeholder="Restaurant, shop, service..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <svg 
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </form>
            </div>

            {/* Radius Slider */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-900">
                Distance
              </label>
              <div className="px-2">
                <Slider
                  min={1}
                  max={25}
                  value={filters.radius}
                  onChange={updateRadius}
                  trackStyle={{ backgroundColor: '#2563eb' }}
                  handleStyle={{ 
                    borderColor: '#2563eb',
                    backgroundColor: '#2563eb'
                  }}
                  railStyle={{ backgroundColor: '#e5e7eb' }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1 mi</span>
                  <span className="font-medium text-gray-900">
                    Within {filters.radius} mile{filters.radius !== 1 ? 's' : ''}
                  </span>
                  <span>25 mi</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-900">
                Categories
              </label>
              <div className="space-y-3">
                {AVAILABLE_CATEGORIES.map((category) => (
                  <label key={category} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Level */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-900">
                Price Range
              </label>
              <div className="flex flex-wrap gap-2">
                {PRICE_LEVELS.map((level) => (
                  <button
                    key={level}
                    onClick={() => togglePriceLevel(level)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      filters.priceLevel.includes(level)
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Select multiple price ranges to see more options
              </p>
            </div>

            {/* Status Toggles */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-900">
                Status
              </label>
              
              {/* Open Now Toggle */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Open Now</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.openNow}
                    onChange={toggleOpenNow}
                    className="sr-only"
                  />
                  <div className={`block w-14 h-8 rounded-full transition-colors ${
                    filters.openNow ? 'bg-primary-600' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                      filters.openNow ? 'transform translate-x-6' : ''
                    }`}></div>
                  </div>
                </div>
              </label>
            </div>

            {/* Quick Filters */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-900">
                Quick Filters
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleCategory('Food & Drink')}
                  className={`px-3 py-2 text-xs font-medium rounded-full border transition-colors ${
                    filters.categories.includes('Food & Drink')
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  🍽️ Restaurants
                </button>
                <button
                  onClick={() => {
                    toggleCategory('Local Shopping');
                  }}
                  className={`px-3 py-2 text-xs font-medium rounded-full border transition-colors ${
                    filters.categories.includes('Local Shopping')
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  🛍️ Shopping
                </button>
                <button
                  onClick={() => {
                    toggleCategory('Nightlife & Events');
                    toggleOpenNow();
                  }}
                  className={`px-3 py-2 text-xs font-medium rounded-full border transition-colors ${
                    filters.categories.includes('Nightlife & Events') && filters.openNow
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  🌙 Tonight
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};

FilterSidebar.propTypes = {
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func
};

export default FilterSidebar;
