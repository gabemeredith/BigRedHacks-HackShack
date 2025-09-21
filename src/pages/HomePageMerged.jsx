import { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useFilters } from '../context/FilterContext';
import StoreCard from '../components/StoreCard';

import HomeHero from '@/components/HomeHero';
import PostTemplate from '@/components/PostTemplate';
import { Container, VStack, ResponsiveGrid, HStack, Section } from '@/components/ui/layout';
import { Title, Body, Headline, Display } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Star, Smartphone, ArrowRight, Play, Heart, MessageCircle, Share } from 'lucide-react';
import Link from 'next/link';

// import your location store and helpers
import { useLocationStore } from '@/lib/store/location';
import { categoryToString } from '@/lib/db';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HomePageMerged = () => {
  // existing filters and business logic
  const { filters, getQueryString, updateSearchQuery, toggleCategory } = useFilters();
  const [businesses, setBusinesses] = useState([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);
  const [errorBusinesses, setErrorBusinesses] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  // location‑based video logic
  const { requestLocation, userLocation, radiusMi } = useLocationStore();
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);

  // fetch businesses when filters change
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoadingBusinesses(true);
        const queryString = getQueryString();
        const url = `/api/businesses${queryString ? `?${queryString}` : ''}`;
        const response = await axios.get(url);
        setBusinesses(response.data);
        setErrorBusinesses(null);
      } catch (err) {
        console.error('Error fetching businesses:', err);
        setErrorBusinesses('Failed to load businesses. Please try again later.');
      } finally {
        setLoadingBusinesses(false);
      }
    };
    fetchBusinesses();
  }, [filters, getQueryString]);

  // prompt for location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // fetch videos whenever location or radius changes
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoadingVideos(true);
        let url = '/api/videos';
        if (userLocation) {
          url += `?lat=${userLocation.latitude}&lng=${userLocation.longitude}&radius=${radiusMi}`;
        }
        const response = await axios.get(url);
        setVideos(response.data.slice(0, 6));
      } catch (err) {
        console.error('Error fetching videos:', err);
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchVideos();
  }, [userLocation, radiusMi]);

  /* hero and section data from original design */
  const heroContent = {
    headline: 'Discover Your City',
    subcopy:
      'Find local businesses, events, and experiences within your perfect radius. Connect with authentic creators and discover hidden gems in your neighborhood.',
    ctaText: 'Start Exploring',
    ctaHref: '/reels',
    secondaryCtaText: 'Browse Categories',
    secondaryCtaHref: '/restaurants',
  };

  const whatItDoesContent = {
    headline: 'What LocalLens Does',
    description:
      "LocalLens connects you with real local businesses through authentic video content, helping you discover what's happening in your neighborhood.",
    features: [
      {
        icon: MapPin,
        title: 'Location-Based Discovery',
        description: 'Set your radius and discover businesses within walking distance or across town.',
      },
      {
        icon: Play,
        title: 'Video-First Content',
        description: 'Watch authentic videos from local business owners showcasing their products and services.',
      },
      {
        icon: Users,
        title: 'Community Driven',
        description: 'Real businesses, real people, real experiences shared by your local community.',
      },
    ],
  };

  const missionContent = {
    headline: 'Our Mission',
    description:
      'We believe every neighborhood has hidden gems waiting to be discovered. LocalLens bridges the gap between local businesses and their community, creating authentic connections through the power of video storytelling.',
    values: [
      'Support local businesses with authentic storytelling',
      'Build stronger communities through discovery',
      'Make local content accessible and engaging',
    ],
  };

  const appCtaContent = {
    title: 'Get the LocalLens App',
    subtitle: 'Coming Soon',
    description: 'Take LocalLens with you everywhere. Get notified when new content drops in your area.',
    ctaText: 'Notify Me',
    features: ['Real-time notifications', 'Offline favorites', 'Enhanced discovery'],
  };

  // helpers for business carousels
  const getBusinessesByCategory = (category) => businesses.filter((b) => b.category === category);
  const getFeaturedBusinesses = () =>
    businesses
      .filter(
        (b) =>
          b.videos?.length > 0 ||
          (b.reviews?.length > 0 &&
            b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length >= 4)
      )
      .slice(0, 6);

  // small components for loading/error/carousel
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
  const ErrorMessage = ({ message }) => (
    <div className="text-center py-12">
      <div className="text-red-600 text-lg font-medium mb-2">Oops! Something went wrong</div>
      <p className="text-gray-600">{message}</p>
      <button onClick={() => window.location.reload()} className="mt-4 btn-primary">
        Try Again
      </button>
    </div>
  );
  const BusinessCarousel = ({ title, businesses, autoplay = false }) => {
    if (!businesses || businesses.length === 0) return null;
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
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
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
      {/* --- Original hero (video + search) --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
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
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your Town&apos;s Top Spots,
            <br />
            <span className="text-primary-400">Live in Action</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Discover local businesses through immersive video experiences
          </p>
          <div className="max-w-2xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateSearchQuery(searchInput);
              }}
            >
              <div className="flex items-center bg-white bg-opacity-95 rounded-full p-2 shadow-2xl">
                <div className="flex-1 flex items-center px-4">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
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
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['Food & Drink', 'Local Shopping', 'Arts & Culture', 'Services'].map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
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
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* --- Added sections from your other design --- */}
      {/* Hero CTA section */}
      <Section className="pt-20 pb-10 bg-white">
        <HomeHero
          headline={heroContent.headline}
          subcopy={heroContent.subcopy}
          ctaText={heroContent.ctaText}
          ctaHref={heroContent.ctaHref}
          secondaryCtaText={heroContent.secondaryCtaText}
          secondaryCtaHref={heroContent.secondaryCtaHref}
          missionTitle={missionContent.headline}
          missionDescription={missionContent.description}
          showAppIndicator={true}
          appCtaText={appCtaContent.ctaText}
        />
      </Section>

      {/* What LocalLens Does */}
      <Section className="py-20 bg-surface">
        <Container>
          <VStack className="gap-16">
            <VStack className="gap-6 text-center max-w-3xl mx-auto">
              <Headline className="text-4xl">{whatItDoesContent.headline}</Headline>
              <Body className="text-xl text-text-secondary leading-relaxed">
                {whatItDoesContent.description}
              </Body>
            </VStack>
            <ResponsiveGrid className="gap-8">
              {whatItDoesContent.features.map((feature, index) => (
                <VStack key={index} className="gap-4 text-center p-6">
                  <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-primary-600" />
                  </div>
                    <Title className="text-xl">{feature.title}</Title>
                    <Body className="text-text-secondary leading-relaxed">{feature.description}</Body>
                </VStack>
              ))}
            </ResponsiveGrid>
          </VStack>
        </Container>
      </Section>

      {/* Sample Reels Strip */}
      <Section className="py-20">
        <Container>
          <VStack className="gap-12">
            <VStack className="gap-6 text-center">
              <Headline className="text-4xl">See What's Happening Locally</Headline>
              <Body className="text-xl text-text-secondary max-w-2xl mx-auto">
                {userLocation
                  ? `Real content from businesses within ${radiusMi} miles of your location`
                  : 'Discover authentic content from local businesses across different neighborhoods'}
              </Body>
            </VStack>

            {!userLocation && (
              <div className="p-8 bg-primary-50 border border-primary-200 rounded-2xl text-center">
                <MapPin className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <Title className="text-xl text-primary-800 mb-2">Enable Location for Personalized Content</Title>
                <Body className="text-primary-700 mb-6">
                  See what's happening in your specific area and discover businesses within your perfect radius.
                </Body>
                <Button
                  variant="outline"
                  className="bg-primary-100 border-primary-300 text-primary-800 hover:bg-primary-200"
                  onClick={() => {
                    window.dispatchEvent(new Event('requestLocation'));
                  }}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Enable Location
                </Button>
              </div>
            )}

            {loadingVideos ? (
              <div className="text-center py-12">
                <Body className="text-text-secondary">Loading local content...</Body>
              </div>
            ) : videos.length > 0 ? (
              <>
                <ResponsiveGrid className="gap-6">
                  {videos.map((video) => {
                    const likesCount = Math.floor(Math.random() * 200) + 20;
                    const commentsCount = Math.floor(Math.random() * 50) + 5;
                    const isLiked = Math.random() > 0.7;
                    return (
                      <PostTemplate
                        key={video.id}
                        mode="card"
                        cardVariant="compact"
                        title={video.title}
                        description={`From ${video.business.name}`}
                        thumbnail={video.thumbUrl || undefined}
                        mediaOverlay={
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                              <Play className="w-5 h-5 text-gray-900 ml-1" />
                            </div>
                          </div>
                        }
                        chips={[
                          {
                            text: categoryToString(video.business.category),
                            variant: 'accent',
                          },
                          ...(video.business.lat && video.business.lng && userLocation
                            ? [
                                {
                                  icon: MapPin,
                                  text: `${((lat1, lng1, lat2, lng2) => {
                                    const R = 3959;
                                    const dLat = ((lat2 - lat1) * Math.PI) / 180;
                                    const dLng = ((lng2 - lng1) * Math.PI) / 180;
                                    const a =
                                      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                      Math.cos((lat1 * Math.PI) / 180) *
                                        Math.cos((lat2 * Math.PI) / 180) *
                                        Math.sin(dLng / 2) *
                                        Math.sin(dLng / 2);
                                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                    return (R * c).toFixed(1);
                                  })(
                                    userLocation.latitude,
                                    userLocation.longitude,
                                    video.business.lat,
                                    video.business.lng,
                                  )} mi`,
                                  variant: 'success',
                                },
                              ]
                            : []),
                        ]}
                        creator={{
                          name: video.business.name,
                          subtitle: 'Business Owner',
                        }}
                        primaryActions={[
                          {
                            icon: Heart,
                            count: likesCount,
                            active: isLiked,
                            onClick: () => console.log('like', video.id),
                          },
                          {
                            icon: MessageCircle,
                            count: commentsCount,
                            onClick: () => console.log('comment', video.id),
                          },
                          {
                            icon: Share,
                            onClick: () => console.log('share', video.id),
                          },
                        ]}
                        onClick={() => console.log('view', video.id)}
                      />
                    );
                  })}
                </ResponsiveGrid>
                <div className="text-center mt-8">
                  <Link href="/reels">
                    <Button size="lg" className="gap-2">
                      <Play className="h-5 w-5" />
                      Watch All Reels
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Body className="text-text-secondary mb-6">
                  {userLocation
                    ? 'No content found in your area yet. Try increasing your search radius or check back later!'
                    : 'Loading content from local businesses...'}
                </Body>
                {userLocation && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const slider = document.querySelector('[data-radius-slider]');
                      if (slider) {
                        slider.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                  >
                    Increase Search Radius
                  </Button>
                )}
              </div>
            )}
            {userLocation && (
              <div className="mt-8 p-6 bg-success-50 border border-success-200 rounded-xl text-center">
                <HStack className="items-center justify-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-success-600" />
                  <Title className="text-success-800">Location Active</Title>
                </HStack>
                <Body className="text-success-700">
                  Showing content within {radiusMi} miles of your location
                  {userLocation.address && (
                    <span className="block text-sm mt-1 opacity-80">{userLocation.address}</span>
                  )}
                </Body>
              </div>
            )}
          </VStack>
        </Container>
      </Section>

      {/* Our Mission */}
      <Section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <Container>
          <VStack className="gap-12">
            <VStack className="gap-6 text-center max-w-4xl mx-auto">
              <Headline className="text-4xl">{missionContent.headline}</Headline>
              <Body className="text-xl text-text-secondary leading-relaxed">
                {missionContent.description}
              </Body>
            </VStack>
            <VStack className="gap-4 max-w-2xl mx-auto">
              {missionContent.values.map((value, index) => (
                <HStack key={index} className="items-center gap-4 p-4 bg-white/80 rounded-lg">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <Body className="text-text-primary">{value}</Body>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </Container>
      </Section>

      {/* App CTA */}
      <Section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <Container>
          <VStack className="gap-8 text-center text-white">
            <VStack className="gap-4">
              <HStack className="items-center justify-center gap-3">
                <Smartphone className="h-8 w-8" />
                <Display className="text-3xl">{appCtaContent.title}</Display>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {appCtaContent.subtitle}
                </span>
              </HStack>
              <Body className="text-xl text-white/90 max-w-2xl mx-auto">
                {appCtaContent.description}
              </Body>
            </VStack>
            <HStack className="gap-8 justify-center flex-wrap">
              {appCtaContent.features.map((feature, index) => (
                <HStack key={index} className="items-center gap-2">
                  <Star className="h-4 w-4 text-white/80" />
                  <Body className="text-white/90">{feature}</Body>
                </HStack>
              ))}
            </HStack>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 gap-2"
            >
              <Smartphone className="h-5 w-5" />
              {appCtaContent.ctaText}
            </Button>
          </VStack>
        </Container>
      </Section>

      {/* --- Original business carousels and CTA --- */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {loadingBusinesses ? (
          <LoadingSpinner />
        ) : errorBusinesses ? (
          <ErrorMessage message={errorBusinesses} />
        ) : (
          <>
            <BusinessCarousel
              title="Featured Near You"
              businesses={getFeaturedBusinesses()}
              autoplay={true}
            />
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
            {businesses.length > 0 && (
              <BusinessCarousel title="All Local Businesses" businesses={businesses} />
            )}
          </>
        )}
      </main>

      {/* Original CTA Section */}
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

export default HomePageMerged;