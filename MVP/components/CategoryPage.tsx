'use client';

import { useState, useEffect } from 'react';
import { useLocationStore } from '@/lib/store/location';
import { BusinessWithVideos } from '@/lib/db';
import { Container, VStack, ResponsiveGrid } from '@/components/ui/layout';
import { Headline, Body, Title } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { LocateFixed, ArrowRight } from 'lucide-react';
import BusinessCard from './BusinessCard';

interface CategoryPageProps {
  category: 'RESTAURANTS' | 'CLOTHING' | 'ART' | 'ENTERTAINMENT';
  title: string;
  emoji: string;
  description: string;
}

export default function CategoryPage({ category, title, emoji, description }: CategoryPageProps) {
  const { userLocation, radiusMi } = useLocationStore();
  const [businesses, setBusinesses] = useState<BusinessWithVideos[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch businesses from API
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        let url = `/api/businesses?category=${category.toLowerCase()}`;
        
        // Add location parameters if user location is available
        if (userLocation) {
          url += `&lat=${userLocation.latitude}&lng=${userLocation.longitude}&radius=${radiusMi}`;
        }
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setBusinesses(data);
        }
      } catch (error) {
        console.error('Failed to fetch businesses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [category, userLocation, radiusMi]);

  // No need for client-side filtering since API handles location filtering

  const handleRadiusFocus = () => {
    // Scroll to left toolbar and briefly highlight the radius slider
    const leftToolbar = document.querySelector('[data-radius-slider]');
    if (leftToolbar) {
      leftToolbar.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Add a temporary highlight effect
      leftToolbar.classList.add('animate-pulse');
      setTimeout(() => {
        leftToolbar.classList.remove('animate-pulse');
      }, 2000);
    }
  };

  if (loading) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <Body className="text-text-secondary">Loading {title.toLowerCase()}...</Body>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <VStack className="gap-8">
        {/* Header */}
        <VStack className="gap-4">
          <Headline>{emoji} {title}</Headline>
          <Body className="text-text-secondary">
            {description}
            {userLocation && ` within ${radiusMi} miles`}
          </Body>
        </VStack>

        {/* Location Not Set State */}
        {!userLocation && (
          <div className="p-6 bg-primary-50 border border-primary-200 rounded-lg text-center">
            <Body className="text-primary-800 mb-4">
              📍 Enable location to see {title.toLowerCase()} in your area
            </Body>
            <Button
              variant="outline" 
              size="sm"
              onClick={handleRadiusFocus}
              className="bg-primary-100 border-primary-300 text-primary-800 hover:bg-primary-200"
            >
              <LocateFixed className="w-4 h-4 mr-2" />
              Set Location
            </Button>
          </div>
        )}

        {/* Change Radius Hint */}
        {userLocation && (
          <div className="p-4 bg-surface-elevated border border-border-light rounded-lg">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Title className="text-lg mb-1">
                  Found {businesses.length} {title.toLowerCase()}
                </Title>
                <Body className="text-text-secondary text-sm">
                  Searching within {radiusMi} miles of your location
                </Body>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRadiusFocus}
                className="flex-shrink-0"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Change Radius
              </Button>
            </div>
          </div>
        )}

        {/* Businesses Grid */}
        {userLocation && (
          <>
            {businesses.length > 0 ? (
              <ResponsiveGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </ResponsiveGrid>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">{emoji}</div>
                <Title className="text-xl mb-2">
                  No {title.toLowerCase()} found nearby
                </Title>
                <Body className="text-text-secondary mb-6">
                  Try increasing your search radius to find more options.
                </Body>
                <Button
                  variant="outline"
                  onClick={handleRadiusFocus}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Increase Radius to {radiusMi + 5} miles
                </Button>
              </div>
            )}
          </>
        )}

        {/* Business Count Summary */}
        {userLocation && businesses.length > 0 && (
          <div className="mt-8 p-4 bg-success-50 border border-success-200 rounded-lg text-center">
            <Body className="text-success-800">
              Showing {businesses.length} {title.toLowerCase()} 
              {businesses.length > 1 ? 's' : ''} within {radiusMi} miles.
              {businesses.some(b => b.videos.length > 0) && (
                <span className="block text-sm mt-1 opacity-80">
                  {businesses.filter(b => b.videos.length > 0).length} have videos available
                </span>
              )}
            </Body>
          </div>
        )}
      </VStack>
    </Container>
  );
}
