'use client';

import React from 'react';
import { useFeedWithLocation } from '@/lib/hooks/useFeed';
import PostTemplate from '@/components/PostTemplate';
import { Container, VStack, ResponsiveGrid } from '@/components/ui/layout';
import { Title, Body } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, AlertCircle, MapPin, Heart, MessageCircle, Share, Play } from 'lucide-react';
import { categoryToString } from '@/lib/db';

interface FeedExampleProps {
  category?: 'RESTAURANTS' | 'CLOTHING' | 'ART' | 'ENTERTAINMENT';
  limit?: number;
}

export default function FeedExample({ category, limit = 20 }: FeedExampleProps) {
  const {
    videos,
    loading,
    error,
    hasMore,
    totalInRadius,
    loadMore,
    refresh,
    isLoadingMore,
  } = useFeedWithLocation({
    category,
    limit,
  });

  const handlePostAction = (action: string, postId: string) => {
    console.log(`${action} on post ${postId}`);
  };

  if (loading && videos.length === 0) {
    return (
      <Container className="py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <Body className="ml-3 text-text-secondary">Loading feed...</Body>
        </div>
      </Container>
    );
  }

  if (error && videos.length === 0) {
    return (
      <Container className="py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <Title className="text-xl mb-2">Failed to Load Feed</Title>
          <Body className="text-text-secondary mb-6">{error}</Body>
          <Button onClick={refresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <VStack className="gap-8">
        {/* Feed Header */}
        <div className="flex items-center justify-between">
          <VStack className="gap-2">
            <Title className="text-2xl">
              {category ? `${categoryToString(category)} Feed` : 'All Videos'}
            </Title>
            {totalInRadius !== undefined && (
              <Body className="text-text-secondary">
                {totalInRadius} videos in your area
              </Body>
            )}
          </VStack>
          
          <Button onClick={refresh} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Videos Grid */}
        {videos.length > 0 ? (
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
                      }
                    ]}
                    creator={{
                      name: video.business.name,
                      subtitle: 'Business Owner'
                    }}
                    locationText={video.business.address || video.business.name}
                    locationIcon={MapPin}
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

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-8">
                <Button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  variant="outline"
                  size="lg"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading More...
                    </>
                  ) : (
                    'Load More Videos'
                  )}
                </Button>
              </div>
            )}

            {/* End of Feed */}
            {!hasMore && videos.length > 0 && (
              <div className="text-center py-8">
                <Body className="text-text-secondary">
                  You've reached the end of the feed!
                </Body>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Body className="text-text-secondary">
              {category 
                ? `No ${categoryToString(category).toLowerCase()} videos found in your area.`
                : 'No videos found in your area.'
              }
            </Body>
          </div>
        )}

        {/* Error State (with partial data) */}
        {error && videos.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <Body className="text-red-800 text-sm">
              Failed to load more videos: {error}
            </Body>
          </div>
        )}
      </VStack>
    </Container>
  );
}
