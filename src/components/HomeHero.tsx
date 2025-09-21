'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Display, Title, Body, BodyLarge, Overline } from '@/components/ui/typography';
import { VStack, HStack, Section, Container, Spacer } from '@/components/ui/layout';
import { Download, ArrowRight, MapPin, Users, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HomeHeroProps {
  /* Main Content */
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaSecondaryText?: string;
  
  /* Our Mission Section */
  missionTitle?: string;
  missionDescription?: string;
  missionPoints?: string[];
  
  /* App Download */
  appTitle?: string;
  appDescription?: string;
  appBadgeText?: string;
  
  /* Styling */
  className?: string;
  backgroundGradient?: boolean;
}

const FeaturePoint = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <HStack className="gap-3">
    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-primary-600" />
    </div>
    <Body className="text-text-secondary">{text}</Body>
  </HStack>
);

const AppDownloadBadge = ({ text, className }: { text: string; className?: string }) => (
  <div className={cn(
    'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-100 border border-accent-200',
    className
  )}>
    <Download className="w-4 h-4 text-accent-700" />
    <span className="text-sm font-medium text-accent-800">{text}</span>
  </div>
);

export default function HomeHero({
  headline = "Discover Your City Like Never Before",
  subheadline = "Find the best local spots, events, and experiences within your perfect radius. Connect with your community through location-based content.",
  ctaText = "Start Exploring",
  ctaSecondaryText = "See How It Works",
  
  missionTitle = "Our Mission",
  missionDescription = "We believe every neighborhood has hidden gems waiting to be discovered. Our platform connects you with local businesses, events, and content creators in your area.",
  missionPoints = [
    "Support local businesses and creators",
    "Discover authentic experiences nearby", 
    "Build stronger community connections"
  ],
  
  appTitle = "Get the App",
  appDescription = "Download our mobile app for the full experience",
  appBadgeText = "Coming Soon",
  
  className,
  backgroundGradient = true,
}: HomeHeroProps) {
  return (
    <Section className={cn(
      'relative overflow-hidden',
      backgroundGradient && 'bg-gradient-to-br from-primary-50 via-background to-accent-50',
      className
    )}>
      {/* Background Decoration */}
      {backgroundGradient && (
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      )}
      
      <Container className="relative z-10">
        <VStack className="gap-16 lg:gap-24">
          
          {/* Hero Section */}
          <VStack className="gap-8 text-center max-w-4xl mx-auto">
            <VStack className="gap-6">
              <Display className="font-extrabold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                {headline}
              </Display>
              
              <BodyLarge className="text-text-secondary max-w-2xl mx-auto">
                {subheadline}
              </BodyLarge>
            </VStack>
            
            {/* CTA Buttons */}
            <HStack className="gap-4 justify-center flex-wrap">
              <Button size="lg" className="gap-2">
                {ctaText}
                <ArrowRight className="w-4 h-4" />
              </Button>
              
              <Button variant="outline" size="lg">
                {ctaSecondaryText}
              </Button>
            </HStack>
            
            {/* Stats or Social Proof */}
            <HStack className="gap-8 justify-center text-center flex-wrap mt-8">
              <VStack className="gap-1">
                <Title className="text-primary-600">10K+</Title>
                <Body className="text-text-tertiary text-sm">Local Spots</Body>
              </VStack>
              <VStack className="gap-1">
                <Title className="text-primary-600">50K+</Title>
                <Body className="text-text-tertiary text-sm">Active Users</Body>
              </VStack>
              <VStack className="gap-1">
                <Title className="text-primary-600">4.8★</Title>
                <Body className="text-text-tertiary text-sm">User Rating</Body>
              </VStack>
            </HStack>
          </VStack>
          
          {/* Our Mission Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <VStack className="gap-6">
              <VStack className="gap-4">
                <Overline className="text-primary-600">{missionTitle}</Overline>
                <Title className="text-3xl">{missionTitle}</Title>
                <BodyLarge className="text-text-secondary">
                  {missionDescription}
                </BodyLarge>
              </VStack>
              
              <VStack className="gap-4 mt-6">
                {missionPoints.map((point, index) => (
                  <FeaturePoint 
                    key={index}
                    icon={index === 0 ? Star : index === 1 ? MapPin : Users}
                    text={point}
                  />
                ))}
              </VStack>
            </VStack>
            
            {/* Mission Visual */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                  <Title className="text-primary-700">Your Community</Title>
                  <Body className="text-primary-600 mt-2">Waiting to be explored</Body>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent-200 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-accent-700" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-700" />
              </div>
            </div>
          </div>
          
          {/* App Download Section */}
          <VStack className="gap-6 text-center bg-surface-elevated p-8 lg:p-12 rounded-2xl border border-border-light">
            <VStack className="gap-4">
              <AppDownloadBadge text={appBadgeText} className="mx-auto" />
              <Title className="text-2xl">{appTitle}</Title>
              <Body className="text-text-secondary max-w-md mx-auto">
                {appDescription}
              </Body>
            </VStack>
            
            {/* Mock App Store Buttons */}
            <HStack className="gap-4 justify-center flex-wrap mt-4">
              <div className="px-6 py-3 bg-secondary-900 text-white rounded-lg flex items-center gap-3 cursor-not-allowed opacity-60">
                <Download className="w-5 h-5" />
                <VStack className="gap-0 text-left">
                  <span className="text-xs opacity-80">Download on the</span>
                  <span className="text-sm font-semibold">App Store</span>
                </VStack>
              </div>
              
              <div className="px-6 py-3 bg-secondary-900 text-white rounded-lg flex items-center gap-3 cursor-not-allowed opacity-60">
                <Download className="w-5 h-5" />
                <VStack className="gap-0 text-left">
                  <span className="text-xs opacity-80">Get it on</span>
                  <span className="text-sm font-semibold">Google Play</span>
                </VStack>
              </div>
            </HStack>
          </VStack>
          
        </VStack>
      </Container>
    </Section>
  );
}
