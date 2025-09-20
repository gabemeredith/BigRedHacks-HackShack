'use client';

import { ExternalLink, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/layout';
import { Title, Body, Caption } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { BusinessWithVideos, categoryToString } from '@/lib/db';
import { useLocationStore } from '@/lib/store/location';
import { haversineDistance } from '@/lib/geo';

interface BusinessCardProps {
  business: BusinessWithVideos;
  className?: string;
}

const categoryColors: { [key: string]: string } = {
  restaurants: 'bg-red-100 text-red-800 border-red-200',
  clothing: 'bg-green-100 text-green-800 border-green-200',
  art: 'bg-purple-100 text-purple-800 border-purple-200',
  entertainment: 'bg-blue-100 text-blue-800 border-blue-200',
};

export default function BusinessCard({ business, className }: BusinessCardProps) {
  const { userLocation } = useLocationStore();

  // Calculate distance if user location is available
  const distance = userLocation && business.lat && business.lng
    ? haversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        business.lat,
        business.lng
      )
    : null;

  const getCategoryClass = (category: string) => {
    const lowerCategory = category.toLowerCase();
    return categoryColors[lowerCategory] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleWebsiteClick = () => {
    if (business.website) {
      window.open(business.website, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className={cn(
      "p-6 hover:shadow-lg transition-all duration-200 border border-border-light bg-surface group",
      className
    )}>
      <div className="flex flex-col gap-4 h-full">
        {/* Header with Category and Distance */}
        <div className="flex items-start justify-between gap-3">
          <div className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
            getCategoryClass(categoryToString(business.category))
          )}>
            {categoryToString(business.category)}
          </div>
          
          {distance !== null && (
            <div className="flex items-center gap-1 bg-success-50 border border-success-200 rounded-full px-2 py-1">
              <MapPin className="w-3 h-3 text-success-600" />
              <Caption className="text-success-700 font-medium">
                {distance.toFixed(1)} mi
              </Caption>
            </div>
          )}
        </div>

        {/* Business Name */}
        <div className="flex-1">
          <Title className="text-xl font-semibold leading-tight mb-2 group-hover:text-primary transition-colors">
            {business.name}
          </Title>
          
          {/* Address */}
          {business.address && (
            <div className="flex items-start gap-2 mb-3">
              <MapPin className="w-4 h-4 text-text-tertiary mt-0.5 flex-shrink-0" />
              <Body className="text-text-secondary text-sm leading-relaxed">
                {business.address}
              </Body>
            </div>
          )}

          {/* Video Count */}
          {business.videos.length > 0 && (
            <div className="mb-3">
              <Caption className="text-text-tertiary">
                {business.videos.length} video{business.videos.length !== 1 ? 's' : ''} available
              </Caption>
            </div>
          )}
        </div>

        {/* Website Button */}
        <div className="pt-2 border-t border-border-light">
          {business.website ? (
            <Button
              onClick={handleWebsiteClick}
              className="w-full justify-center gap-2 group/btn"
              variant="outline"
            >
              <span>Visit Website</span>
              <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
          ) : (
            <Button
              disabled
              variant="outline"
              className="w-full justify-center opacity-50 cursor-not-allowed"
            >
              No Website Available
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}