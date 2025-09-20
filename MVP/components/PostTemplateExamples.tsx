'use client';

import React from 'react';
import PostTemplate from './PostTemplate';
import { Container, VStack, ResponsiveGrid, HStack } from '@/components/ui/layout';
import { Title, Body, Headline } from '@/components/ui/typography';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, MapPin, Play, Star } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

const PostTemplateExamples = () => {
  // Mock data for examples
  const mockData = {
    title: "Artisan Coffee Roasting Process",
    description: "Watch our master roaster craft the perfect blend using beans sourced directly from Colombian farmers. Each batch is carefully monitored for optimal flavor development.",
    thumbnail: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  };

  const handleAction = (action: string) => {
    console.log(`Action: ${action}`);
  };

  return (
    <Container className="py-16">
      <VStack className="gap-16">
        
        {/* Header */}
        <VStack className="gap-4 text-center">
          <Headline className="text-4xl">PostTemplate Examples</Headline>
          <Body className="text-xl text-text-secondary max-w-2xl mx-auto">
            Demonstrating the flexible PostTemplate component in both card and reel modes
            with customizable icons, text, and actions.
          </Body>
        </VStack>
        
        {/* Card Mode Examples */}
        <VStack className="gap-8">
          <Title className="text-2xl">Card Mode Variants</Title>
          
          <ResponsiveGrid className="gap-6">
            
            {/* Default Card */}
            <PostTemplate
              mode="card"
              cardVariant="default"
              title={mockData.title}
              description={mockData.description}
              thumbnail={mockData.thumbnail}
              mediaOverlay={
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-gray-900 ml-1" />
                  </div>
                </div>
              }
              chips={[
                {
                  text: "Coffee Shop",
                  variant: "accent",
                  icon: Star
                },
                {
                  text: "2.3 mi away",
                  variant: "success",
                  icon: MapPin
                }
              ]}
              creator={{
                name: "Gimme! Coffee",
                subtitle: "Local Roaster",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
              }}
              primaryActions={[
                {
                  icon: Heart,
                  count: 156,
                  active: true,
                  onClick: () => handleAction('like')
                },
                {
                  icon: MessageCircle,
                  count: 23,
                  onClick: () => handleAction('comment')
                },
                {
                  icon: Share,
                  onClick: () => handleAction('share')
                }
              ]}
              secondaryActions={[
                {
                  icon: Bookmark,
                  onClick: () => handleAction('bookmark')
                }
              ]}
              onClick={() => handleAction('view')}
            />
            
            {/* Compact Card */}
            <PostTemplate
              mode="card"
              cardVariant="compact"
              title="Quick Espresso Tutorial"
              description="Perfect shot in 30 seconds"
              thumbnail="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80"
              chips={[
                {
                  text: "Tutorial",
                  variant: "primary"
                }
              ]}
              creator={{
                name: "CoffeeExpert",
                subtitle: "Barista"
              }}
              primaryActions={[
                {
                  icon: Heart,
                  count: 89,
                  onClick: () => handleAction('like')
                },
                {
                  icon: MessageCircle,
                  count: 12,
                  onClick: () => handleAction('comment')
                }
              ]}
            />
            
            {/* Featured Card */}
            <PostTemplate
              mode="card"
              cardVariant="featured"
              title="Award-Winning Blend"
              description="Our signature roast just won the Regional Coffee Championship! Try it now."
              thumbnail="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80"
              chips={[
                {
                  text: "Featured",
                  variant: "warning",
                  icon: Star
                },
                {
                  text: "Limited Edition",
                  variant: "error"
                }
              ]}
              creator={{
                name: "AwardCoffee Co.",
                subtitle: "Championship Winner"
              }}
              locationText="Downtown Coffee District"
              locationIcon={MapPin}
              primaryActions={[
                {
                  icon: Heart,
                  count: 234,
                  active: true,
                  onClick: () => handleAction('like')
                },
                {
                  icon: MessageCircle,
                  count: 45,
                  onClick: () => handleAction('comment')
                },
                {
                  icon: Share,
                  count: 67,
                  onClick: () => handleAction('share')
                }
              ]}
            />
            
          </ResponsiveGrid>
        </VStack>
        
        {/* Reel Mode Examples */}
        <VStack className="gap-8">
          <Title className="text-2xl">Reel Mode Examples</Title>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Bottom Overlay Reel */}
            <div className="aspect-[9/16] max-h-[600px]">
              <PostTemplate
                mode="reel"
                reelOverlayPosition="bottom"
                reelGradient={true}
                title="Behind the Scenes"
                description="Watch our roasting process from bean to cup. Every step matters in creating the perfect flavor profile."
                thumbnail="https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=800&q=80"
                mediaElement={
                  <VideoPlayer
                    src={mockData.videoUrl}
                    poster={mockData.thumbnail}
                    autoPlay={false}
                    muted={true}
                    className="w-full h-full"
                  />
                }
                chips={[
                  {
                    text: "Coffee Process",
                    variant: "accent"
                  },
                  {
                    text: "Behind the Scenes",
                    variant: "secondary"
                  }
                ]}
                creator={{
                  name: "Gimme! Coffee",
                  subtitle: "Master Roaster",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                }}
                locationText="Ithaca, NY"
                locationIcon={MapPin}
                primaryActions={[
                  {
                    icon: Heart,
                    label: "324",
                    active: true,
                    onClick: () => handleAction('like')
                  },
                  {
                    icon: MessageCircle,
                    label: "56",
                    onClick: () => handleAction('comment')
                  },
                  {
                    icon: Share,
                    label: "Share",
                    onClick: () => handleAction('share')
                  }
                ]}
                secondaryActions={[
                  {
                    icon: MoreHorizontal,
                    onClick: () => handleAction('menu')
                  }
                ]}
                onClick={() => handleAction('view')}
              />
            </div>
            
            {/* Center Overlay Reel */}
            <div className="aspect-[9/16] max-h-[600px]">
              <PostTemplate
                mode="reel"
                reelOverlayPosition="center"
                reelGradient={true}
                title="Latte Art Masterclass"
                description="Learn to create stunning latte art with professional techniques and tips from our expert baristas."
                thumbnail="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80"
                chips={[
                  {
                    text: "Tutorial",
                    variant: "primary"
                  },
                  {
                    text: "Latte Art",
                    variant: "accent"
                  }
                ]}
                creator={{
                  name: "LatteArtist",
                  subtitle: "Professional Barista",
                  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b742?w=100&q=80"
                }}
                locationText="Art Café Studio"
                locationIcon={MapPin}
                primaryActions={[
                  {
                    icon: Heart,
                    label: "892",
                    onClick: () => handleAction('like')
                  },
                  {
                    icon: MessageCircle,
                    label: "134",
                    onClick: () => handleAction('comment')
                  },
                  {
                    icon: Share,
                    label: "287",
                    onClick: () => handleAction('share')
                  }
                ]}
                onClick={() => handleAction('view')}
              />
            </div>
            
          </div>
        </VStack>
        
        {/* Customization Examples */}
        <VStack className="gap-8">
          <Title className="text-2xl">Customization Examples</Title>
          
          <ResponsiveGrid className="gap-6">
            
            {/* Custom Icons and Text */}
            <PostTemplate
              mode="card"
              cardVariant="default"
              title="Custom Action Example"
              description="This card demonstrates custom icons and text for all interactive elements."
              thumbnail="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80"
              chips={[
                {
                  icon: "🔥",
                  text: "Hot Topic",
                  variant: "error"
                },
                {
                  icon: "⭐",
                  text: "Premium",
                  variant: "warning"
                }
              ]}
              creator={{
                name: "CustomCreator",
                subtitle: "Content Designer"
              }}
              locationText="Custom Location"
              locationIcon="📍"
              primaryActions={[
                {
                  icon: "👍",
                  label: "Approve",
                  count: 42,
                  onClick: () => handleAction('approve')
                },
                {
                  icon: "💬",
                  label: "Discuss",
                  count: 8,
                  onClick: () => handleAction('discuss')
                },
                {
                  icon: "🔗",
                  label: "Link",
                  onClick: () => handleAction('link')
                }
              ]}
              secondaryActions={[
                {
                  icon: "⚙️",
                  onClick: () => handleAction('settings')
                }
              ]}
            />
            
            {/* No Actions Card */}
            <PostTemplate
              mode="card"
              cardVariant="compact"
              title="Simple Display Card"
              description="A clean card with just content and no interactive elements."
              thumbnail="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80"
              chips={[
                {
                  text: "Read Only",
                  variant: "secondary"
                }
              ]}
              creator={{
                name: "SimpleContent",
                subtitle: "Display Only"
              }}
            />
            
          </ResponsiveGrid>
        </VStack>
        
      </VStack>
    </Container>
  );
};

export default PostTemplateExamples;
