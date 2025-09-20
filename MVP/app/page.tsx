'use client';

import { useEffect, useState } from 'react';
import { useLocationStore } from '@/lib/store/location';
import HomeHero from '@/components/HomeHero';
import PostTemplate from '@/components/PostTemplate';
import { Container, VStack, ResponsiveGrid, HStack, Section } from '@/components/ui/layout';
import { Title, Body, Headline, Display } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { VideoWithBusiness, categoryToString } from '@/lib/db';
import { MapPin, Users, Star, Smartphone, ArrowRight, Play, Heart, MessageCircle, Share } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { userLocation, radiusMi } = useLocationStore();
  const [videos, setVideos] = useState<VideoWithBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (userLocation) {
          // Fetch location-based videos
          const response = await fetch(`/api/videos?lat=${userLocation.latitude}&lng=${userLocation.longitude}&radius=${radiusMi}`);
          const data = await response.json();
          setVideos(data.slice(0, 6)); // Limit for homepage
        } else {
          // Fetch all videos when no location
          const response = await fetch('/api/videos');
          const data = await response.json();
          setVideos(data.slice(0, 6)); // Limit to 6 for home page
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [userLocation, radiusMi]);

  const handlePostAction = (action: string, postId: string) => {
    console.log(`${action} on post ${postId}`);
  };

  // Homepage content - all editable via props
  const heroContent = {
    headline: "Discover Your City",
    subcopy: "Find local businesses, events, and experiences within your perfect radius. Connect with authentic creators and discover hidden gems in your neighborhood.",
    ctaText: "Start Exploring",
    ctaHref: "/reels",
    secondaryCtaText: "Browse Categories",
    secondaryCtaHref: "/restaurants"
  };

  const whatItDoesContent = {
    headline: "What LocalLens Does",
    description: "LocalLens connects you with real local businesses through authentic video content, helping you discover what's happening in your neighborhood.",
    features: [
      {
        icon: MapPin,
        title: "Location-Based Discovery",
        description: "Set your radius and discover businesses within walking distance or across town."
      },
      {
        icon: Play,
        title: "Video-First Content",
        description: "Watch authentic videos from local business owners showcasing their products and services."
      },
      {
        icon: Users,
        title: "Community Driven",
        description: "Real businesses, real people, real experiences shared by your local community."
      }
    ]
  };

  const missionContent = {
    headline: "Our Mission",
    description: "We believe every neighborhood has hidden gems waiting to be discovered. LocalLens bridges the gap between local businesses and their community, creating authentic connections through the power of video storytelling.",
    values: [
      "Support local businesses with authentic storytelling",
      "Build stronger communities through discovery",
      "Make local content accessible and engaging"
    ]
  };

  const appCtaContent = {
    title: "Get the LocalLens App",
    subtitle: "Coming Soon",
    description: "Take LocalLens with you everywhere. Get notified when new content drops in your area.",
    ctaText: "Notify Me",
    features: ["Real-time notifications", "Offline favorites", "Enhanced discovery"]
  };

  return (
    <VStack className="gap-0">
      {/* Hero Section */}
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
      
      {/* What LocalLens Does Section */}
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
                  <Body className="text-text-secondary leading-relaxed">
                    {feature.description}
                  </Body>
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
                  : "Discover authentic content from local businesses across different neighborhoods"
                }
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
            
            {loading ? (
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
                            variant: 'accent'
                          },
                          ...(video.business.lat && video.business.lng && userLocation ? [{
                            icon: MapPin,
                            text: `${((lat1: number, lng1: number, lat2: number, lng2: number) => {
                              const R = 3959;
                              const dLat = (lat2 - lat1) * Math.PI / 180;
                              const dLng = (lng2 - lng1) * Math.PI / 180;
                              const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
                              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                              return (R * c).toFixed(1);
                            })(userLocation.latitude, userLocation.longitude, video.business.lat, video.business.lng)} mi`,
                            variant: 'success'
                          }] : [])
                        ]}
                        creator={{
                          name: video.business.name,
                          subtitle: 'Business Owner'
                        }}
                        primaryActions={[
                          {
                            icon: Heart,
                            count: likesCount,
                            active: isLiked,
                            onClick: () => handlePostAction('like', video.id)
                          },
                          {
                            icon: MessageCircle,
                            count: commentsCount,
                            onClick: () => handlePostAction('comment', video.id)
                          },
                          {
                            icon: Share,
                            onClick: () => handlePostAction('share', video.id)
                          }
                        ]}
                        onClick={() => handlePostAction('view', video.id)}
                      />
                    );
                  })}
                </ResponsiveGrid>
                
                <div className="text-center">
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
                    ? "No content found in your area yet. Try increasing your search radius or check back later!"
                    : "Loading content from local businesses..."
                  }
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

      {/* Our Mission Section */}
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

      {/* Download App CTA Section */}
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
    </VStack>
  );
}