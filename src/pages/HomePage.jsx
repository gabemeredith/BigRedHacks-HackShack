import { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useFilters } from '../context/FilterContext';
import StoreCard from '../components/StoreCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HomePage = () => {
  const { filters, getQueryString, updateSearchQuery, toggleCategory } = useFilters();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  // Fetch businesses data based on current filters
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

  // Filter businesses by category (for display purposes)
  const getBusinessesByCategory = (category) => {
    return businesses.filter(business => business.category === category);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateSearchQuery(searchInput);
  };

  // Handle category filter from hero section
  const handleCategoryFilter = (category) => {
    toggleCategory(category);
  };

  // Get featured businesses (those with videos or high ratings)
  const getFeaturedBusinesses = () => {
    return businesses
      .filter(business => 
        business.videos?.length > 0 || 
        (business.reviews?.length > 0 && 
         business.reviews.reduce((sum, review) => sum + review.rating, 0) / business.reviews.length >= 4)
      )
      .slice(0, 6);
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  // Error component
  const ErrorMessage = ({ message }) => (
    <div className="text-center py-12">
      <div className="text-red-600 text-lg font-medium mb-2">Oops! Something went wrong</div>
      <p className="text-gray-600">{message}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 btn-primary"
      >
        Try Again
      </button>
    </div>
  );

  // Carousel component
  const BusinessCarousel = ({ title, businesses, autoplay = false }) => {
    if (!businesses || businesses.length === 0) {
      return null;
    }

    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={autoplay ? { delay: 3000, disableOnInteraction: false } : false}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="business-carousel"
        >
          {businesses.map((business) => (
            <SwiperSlide key={business._id}>
              <StoreCard business={business} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video/Image */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=1200"
          >
            <source 
              src="https://player.vimeo.com/external/195913085.hd.mp4?s=7e643d7a9fc66fb82d4e31d8b1e3e6ab93f64d40&profile_id=119"
              type="video/mp4" 
            />
          </video>
          <div className="hero-overlay"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your Town's Top Spots,
            <br />
            <span className="text-primary-400">Live in Action</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Discover local businesses through immersive video experiences
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center bg-white bg-opacity-95 rounded-full p-2 shadow-2xl">
                <div className="flex-1 flex items-center px-4">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search for restaurants, shops, services..."
                    className="w-full py-3 text-gray-700 placeholder-gray-500 bg-transparent border-none focus:outline-none text-lg"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-medium transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Popular Categories */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['Food & Drink', 'Local Shopping', 'Arts & Culture', 'Services'].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 backdrop-blur-sm ${
                  filters.categories.includes(category)
                    ? 'bg-primary-600 text-white'
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            {/* Featured Businesses */}
            <BusinessCarousel 
              title="Featured Near You" 
              businesses={getFeaturedBusinesses()} 
              autoplay={true}
            />

            {/* Category Carousels */}
            <BusinessCarousel 
              title="Food & Drink" 
              businesses={getBusinessesByCategory('Food & Drink')} 
            />

            <BusinessCarousel 
              title="Local Shopping" 
              businesses={getBusinessesByCategory('Local Shopping')} 
            />

            <BusinessCarousel 
              title="Arts & Culture" 
              businesses={getBusinessesByCategory('Arts & Culture')} 
            />

            <BusinessCarousel 
              title="Nightlife & Events" 
              businesses={getBusinessesByCategory('Nightlife & Events')} 
            />

            <BusinessCarousel 
              title="Services" 
              businesses={getBusinessesByCategory('Services')} 
            />

            {/* All Businesses */}
            {businesses.length > 0 && (
              <BusinessCarousel 
                title="All Local Businesses" 
                businesses={businesses} 
              />
            )}
          </>
        )}
      </main>

      {/* Call to Action Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Explore Your Local Scene?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of locals discovering amazing businesses in their neighborhood
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors duration-200">
              Download App
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-medium transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
