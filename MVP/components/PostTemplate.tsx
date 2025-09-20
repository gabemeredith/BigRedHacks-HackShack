'use client';

import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Title, Body, Caption } from '@/components/ui/typography';
import { VStack, HStack, Card } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Helper function to render icons safely
const renderIcon = (Icon: any, className?: string) => {
  if (!Icon) return null;
  
  // If it's a React component (function), render it
  if (typeof Icon === 'function') {
    const IconComponent = Icon as any;
    return <IconComponent className={className} />;
  }
  
  // If it's already a React element, return it
  if (React.isValidElement(Icon)) {
    return Icon;
  }
  
  // If it's a string (emoji), return it
  if (typeof Icon === 'string') {
    return <span>{Icon}</span>;
  }
  
  return null;
};

// Action button configuration
interface ActionConfig {
  icon: LucideIcon | ReactNode;
  label?: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

// Chip configuration (category, distance, etc.)
interface ChipConfig {
  icon?: LucideIcon | ReactNode;
  text: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  className?: string;
}

// Creator info configuration
interface CreatorConfig {
  name: string;
  avatar?: string;
  subtitle?: string;
  onClick?: () => void;
}

interface PostTemplateProps {
  /* Core Props */
  mode: 'card' | 'reel';
  
  /* Content */
  title: string;
  description?: string;
  
  /* Media */
  thumbnail?: string;
  mediaElement?: ReactNode; // Custom media component (video player, etc.)
  mediaOverlay?: ReactNode; // Custom overlay content
  
  /* Chips (category, distance, etc.) */
  chips?: ChipConfig[];
  
  /* Actions */
  primaryActions?: ActionConfig[]; // Like, comment, share
  secondaryActions?: ActionConfig[]; // Bookmark, menu, etc.
  
  /* Creator/Location Info */
  creator?: CreatorConfig;
  locationText?: string;
  locationIcon?: LucideIcon | ReactNode;
  
  /* Interactive */
  onClick?: () => void;
  
  /* Styling */
  className?: string;
  contentClassName?: string;
  
  /* Card-specific props */
  cardVariant?: 'default' | 'compact' | 'featured';
  
  /* Reel-specific props */
  reelOverlayPosition?: 'bottom' | 'top' | 'center';
  reelGradient?: boolean;
}

// Reusable Chip Component
const Chip = ({ icon: Icon, text, variant = 'default', className }: ChipConfig) => {
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'secondary':
        return 'bg-secondary-100 text-secondary-800 border-secondary-200';
      case 'accent':
        return 'bg-accent-100 text-accent-800 border-accent-200';
      case 'success':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'warning':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'error':
        return 'bg-error-100 text-error-800 border-error-200';
      default:
        return 'bg-surface text-text-secondary border-border-medium';
    }
  };


  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border',
      getVariantClasses(variant),
      className
    )}>
      {renderIcon(Icon, "w-3 h-3")}
      {text}
    </span>
  );
};

// Reusable Action Button
const ActionButton = ({ 
  icon: Icon, 
  label, 
  count, 
  active = false, 
  onClick, 
  className,
  mode
}: ActionConfig & { mode: 'card' | 'reel' }) => {
  const isReel = mode === 'reel';
  
  
  return (
    <Button
      variant="ghost"
      size={isReel ? 'icon' : 'sm'}
      onClick={onClick}
      className={cn(
        'gap-1 transition-colors',
        isReel ? (
          'flex-col h-auto p-2 text-white hover:bg-white/20'
        ) : (
          'h-8 px-2'
        ),
        active && (isReel ? 'text-red-500' : 'text-error-500 hover:text-error-600'),
        className
      )}
    >
      {renderIcon(Icon, cn(
        isReel ? 'w-6 h-6' : 'w-4 h-4',
        active && 'fill-current'
      ))}
      
      {(label || count !== undefined) && (
        <span className={cn(
          isReel ? 'text-xs mt-1' : 'text-xs',
        )}>
          {label || count}
        </span>
      )}
    </Button>
  );
};

// Creator Info Component
const CreatorInfo = ({ creator, mode }: { creator: CreatorConfig; mode: 'card' | 'reel' }) => {
  const isReel = mode === 'reel';
  
  return (
    <HStack 
      className={cn(
        'gap-2 cursor-pointer',
        isReel && 'text-white'
      )}
      onClick={creator.onClick}
    >
      {creator.avatar ? (
        <img 
          src={creator.avatar} 
          alt={creator.name}
          className={cn(
            'rounded-full object-cover',
            isReel ? 'w-8 h-8' : 'w-6 h-6'
          )}
        />
      ) : (
        <div className={cn(
          'rounded-full bg-secondary-200 flex items-center justify-center',
          isReel ? 'w-8 h-8' : 'w-6 h-6'
        )}>
          <span className={cn(
            'font-medium text-secondary-600',
            isReel ? 'text-sm' : 'text-xs'
          )}>
            {creator.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      
      <VStack className={cn('gap-0', isReel && 'flex-1')}>
        <Caption className={cn(
          isReel ? 'text-white font-medium' : 'text-text-secondary'
        )}>
          {creator.name}
        </Caption>
        {creator.subtitle && (
          <Caption className={cn(
            'text-xs',
            isReel ? 'text-white/80' : 'text-text-tertiary'
          )}>
            {creator.subtitle}
          </Caption>
        )}
      </VStack>
    </HStack>
  );
};

// Main PostTemplate Component
export default function PostTemplate({
  mode,
  title,
  description,
  thumbnail,
  mediaElement,
  mediaOverlay,
  chips = [],
  primaryActions = [],
  secondaryActions = [],
  creator,
  locationText,
  locationIcon: LocationIcon,
  onClick,
  className,
  contentClassName,
  cardVariant = 'default',
  reelOverlayPosition = 'bottom',
  reelGradient = true,
}: PostTemplateProps) {
  
  const isReel = mode === 'reel';
  const isCompact = cardVariant === 'compact';
  const isFeatured = cardVariant === 'featured';

  // Card Mode Rendering
  if (!isReel) {
    return (
      <Card className={cn(
        'group hover:shadow-md transition-all duration-base cursor-pointer overflow-hidden',
        isFeatured && 'border-primary-200 bg-primary-50/30',
        className
      )} onClick={onClick}>
        
        <VStack className="gap-0">
          {/* Media */}
          <div className={cn(
            'relative aspect-[4/3] bg-surface overflow-hidden',
            isCompact && 'aspect-video'
          )}>
            {mediaElement || (
              thumbnail ? (
                <img 
                  src={thumbnail} 
                  alt={title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-secondary-100 to-secondary-200 flex items-center justify-center">
                  <div className="text-center text-secondary-500">
                    <div className="text-2xl mb-2">📷</div>
                    <Caption>No preview</Caption>
                  </div>
                </div>
              )
            )}
            {mediaOverlay}
          </div>
          
          {/* Content */}
          <VStack className={cn('gap-3 p-4', contentClassName)}>
            
            {/* Chips */}
            {chips.length > 0 && (
              <HStack className="gap-2 flex-wrap">
                {chips.map((chip, index) => (
                  <Chip key={index} {...chip} />
                ))}
              </HStack>
            )}
            
            {/* Title */}
            <Title className={cn(
              'line-clamp-2 group-hover:text-primary-600 transition-colors',
              isCompact ? 'text-lg' : 'text-xl'
            )}>
              {title}
            </Title>
            
            {/* Description */}
            {description && !isCompact && (
              <Body className="text-text-secondary line-clamp-2">
                {description}
              </Body>
            )}
            
            {/* Creator */}
            {creator && (
              <CreatorInfo creator={creator} mode="card" />
            )}
            
            {/* Location */}
            {locationText && (
              <HStack className="gap-1">
                {renderIcon(LocationIcon, "w-3 h-3 text-text-tertiary")}
                <Caption className="text-text-tertiary">{locationText}</Caption>
              </HStack>
            )}
            
            {/* Actions */}
            {(primaryActions.length > 0 || secondaryActions.length > 0) && (
              <HStack className="justify-between items-center pt-2 border-t border-border-light">
                <HStack className="gap-1">
                  {primaryActions.map((action, index) => (
                    <ActionButton key={index} {...action} mode="card" />
                  ))}
                </HStack>
                
                <HStack className="gap-1">
                  {secondaryActions.map((action, index) => (
                    <ActionButton key={index} {...action} mode="card" />
                  ))}
                </HStack>
              </HStack>
            )}
            
          </VStack>
        </VStack>
      </Card>
    );
  }

  // Reel Mode Rendering
  return (
    <div className={cn(
      'relative w-full h-full bg-black overflow-hidden cursor-pointer',
      className
    )} onClick={onClick}>
      
      {/* Media Background */}
      <div className="absolute inset-0">
        {mediaElement || (
          thumbnail ? (
            <img 
              src={thumbnail} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white/70">
                <div className="text-4xl mb-2">🎬</div>
                <Caption>No media</Caption>
              </div>
            </div>
          )
        )}
      </div>
      
      {/* Gradient Overlay */}
      {reelGradient && (
        <div className={cn(
          'absolute inset-0',
          reelOverlayPosition === 'bottom' && 'bg-gradient-to-t from-black/80 via-black/20 to-transparent',
          reelOverlayPosition === 'top' && 'bg-gradient-to-b from-black/80 via-black/20 to-transparent',
          reelOverlayPosition === 'center' && 'bg-gradient-to-r from-black/60 via-transparent to-black/60'
        )} />
      )}
      
      {/* Custom Media Overlay */}
      {mediaOverlay}
      
      {/* Content Overlay */}
      <div className={cn(
        'absolute inset-0 flex z-10',
        reelOverlayPosition === 'bottom' && 'items-end',
        reelOverlayPosition === 'top' && 'items-start',
        reelOverlayPosition === 'center' && 'items-center'
      )}>
        
        <div className="flex w-full p-6">
          
          {/* Main Content */}
          <VStack className={cn('gap-4 flex-1 text-white', contentClassName)}>
            
            {/* Chips */}
            {chips.length > 0 && (
              <HStack className="gap-2 flex-wrap">
                {chips.map((chip, index) => (
                  <Chip 
                    key={index} 
                    {...chip} 
                    className={cn('bg-black/50 text-white border-white/20', chip.className)}
                  />
                ))}
              </HStack>
            )}
            
            {/* Creator */}
            {creator && (
              <CreatorInfo creator={creator} mode="reel" />
            )}
            
            {/* Title */}
            <Title className="text-2xl font-bold text-white leading-tight">
              {title}
            </Title>
            
            {/* Description */}
            {description && (
              <Body className="text-white/90 line-clamp-3">
                {description}
              </Body>
            )}
            
            {/* Location */}
            {locationText && (
              <HStack className="gap-2">
                {renderIcon(LocationIcon, "w-4 h-4 text-white/80")}
                <Caption className="text-white/80">{locationText}</Caption>
              </HStack>
            )}
            
          </VStack>
          
          {/* Action Buttons */}
          {primaryActions.length > 0 && (
            <VStack className="gap-4 ml-4">
              {primaryActions.map((action, index) => (
                <ActionButton key={index} {...action} mode="reel" />
              ))}
            </VStack>
          )}
          
        </div>
        
      </div>
      
      {/* Secondary Actions (if any) */}
      {secondaryActions.length > 0 && (
        <div className="absolute top-4 right-4 z-20">
          <HStack className="gap-2">
            {secondaryActions.map((action, index) => (
              <ActionButton key={index} {...action} mode="reel" />
            ))}
          </HStack>
        </div>
      )}
      
    </div>
  );
}

// Export types for easier usage
export type { PostTemplateProps, ActionConfig, ChipConfig, CreatorConfig };