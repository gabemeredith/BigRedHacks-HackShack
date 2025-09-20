'use client';

import React, { useState } from 'react';
import { isDemoModeClient, DEMO_CONFIG } from '@/lib/demo';
import { AlertTriangle, X, Eye, Users, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { HStack, VStack } from './ui/layout';
import { Body, Caption } from './ui/typography';
import { cn } from '@/lib/utils';

interface DemoBannerProps {
  className?: string;
  position?: 'top' | 'bottom';
  dismissible?: boolean;
}

export default function DemoBanner({ 
  className, 
  position = 'top',
  dismissible = true 
}: DemoBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const isDemo = isDemoModeClient();

  // Don't render if not in demo mode or if dismissed
  if (!isDemo || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <div className={cn(
      'w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg z-50',
      position === 'top' ? 'border-b border-amber-600' : 'border-t border-amber-600',
      className
    )}>
      <div className="container mx-auto px-4 py-3">
        <HStack className="items-center justify-between gap-4">
          
          {/* Icon and Message */}
          <HStack className="items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-100" />
            </div>
            
            <VStack className="gap-1 flex-1">
              <HStack className="items-center gap-2">
                <Body className="font-semibold text-white">
                  {DEMO_CONFIG.bannerMessage}
                </Body>
                <div className="hidden sm:flex items-center gap-4 text-amber-100">
                  <HStack className="items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <Caption className="text-xs">Evaluation Mode</Caption>
                  </HStack>
                  <HStack className="items-center gap-1">
                    <Users className="h-3 w-3" />
                    <Caption className="text-xs">Judges Access</Caption>
                  </HStack>
                  <HStack className="items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <Caption className="text-xs">No Auth Required</Caption>
                  </HStack>
                </div>
              </HStack>
              
              <Caption className="text-amber-100 text-xs hidden sm:block">
                {DEMO_CONFIG.bannerSubtext} • All features unlocked • Database can be reset with `pnpm db:reset`
              </Caption>
            </VStack>
          </HStack>
          
          {/* Quick Actions */}
          <HStack className="items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.dispatchEvent(new Event('requestLocation'))}
              className="text-white hover:bg-white/20 border border-white/30 text-xs px-2 py-1 h-auto"
            >
              Set Location
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('/dashboard', '_blank')}
              className="text-white hover:bg-white/20 border border-white/30 text-xs px-2 py-1 h-auto"
            >
              Dashboard
            </Button>
            
            {dismissible && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="text-white hover:bg-white/20 w-6 h-6"
                title="Dismiss banner"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </HStack>
          
        </HStack>
      </div>
    </div>
  );
}
