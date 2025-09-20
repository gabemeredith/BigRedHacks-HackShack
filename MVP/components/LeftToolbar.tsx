'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Search, MapPin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useLocationStore } from '@/lib/store/location';
import { useToast } from '@/components/ui/toast';
import { getCurrentPosition } from '@/lib/geo';
import SetLocationModal from './SetLocationModal';

// UI Configuration Constants - easily adjustable
const TOOLBAR_CONFIG = {
  // Geolocation settings
  geolocation: {
    enableHighAccuracy: true,
    timeout: 15000, // 15 seconds
    maximumAge: 300000, // 5 minutes
  },
  
  // Radius slider settings
  radius: {
    min: 0.5,
    max: 25,
    step: 0.5,
    default: 5,
    debounceMs: 500, // Debounce slider updates
  },
  
  // UI settings
  ui: {
    buttonSize: 12, // w-12 h-12 for geolocation button
    sliderHeight: 32, // h-32 for vertical slider
    toastDuration: 5000,
  }
} as const;

// Debounce hook for slider updates
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function LeftToolbar() {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [localRadiusMi, setLocalRadiusMi] = useState(TOOLBAR_CONFIG.radius.default);
  
  const { 
    userLocation, 
    radiusMi, 
    isLocationLoading, 
    locationError,
    setUserLocation, 
    setRadiusMi, 
    setLocationLoading, 
    setLocationError 
  } = useLocationStore();
  
  const { addToast } = useToast();

  // Sync local radius with store on mount
  useEffect(() => {
    setLocalRadiusMi(radiusMi);
  }, [radiusMi]);

  // Debounce radius updates to avoid frequent re-queries
  const debouncedRadius = useDebounce(localRadiusMi, TOOLBAR_CONFIG.radius.debounceMs);

  useEffect(() => {
    if (debouncedRadius !== radiusMi) {
      setRadiusMi(debouncedRadius);
    }
  }, [debouncedRadius, radiusMi, setRadiusMi]);

  // Listen for external location requests (from other components)
  useEffect(() => {
    const handleLocationRequest = () => {
      handleGetLocation();
    };

    window.addEventListener('requestLocation', handleLocationRequest);
    return () => window.removeEventListener('requestLocation', handleLocationRequest);
  }, []);

  const getGeolocationErrorMessage = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return {
          title: 'Location Access Denied',
          description: 'Please enable location permissions in your browser settings or set your location manually.',
          action: 'manual'
        };
      case error.POSITION_UNAVAILABLE:
        return {
          title: 'Location Unavailable',
          description: 'Your location could not be determined. Please try again or set it manually.',
          action: 'retry'
        };
      case error.TIMEOUT:
        return {
          title: 'Location Timeout',
          description: 'Location request timed out. Please try again or set it manually.',
          action: 'retry'
        };
      default:
        return {
          title: 'Location Error',
          description: 'An unknown error occurred while getting your location.',
          action: 'manual'
        };
    }
  };

  const handleGetLocation = async () => {
    try {
      setLocationLoading(true);
      setLocationError(null);
      
      const position = await getCurrentPosition({
        enableHighAccuracy: TOOLBAR_CONFIG.geolocation.enableHighAccuracy,
        timeout: TOOLBAR_CONFIG.geolocation.timeout,
        maximumAge: TOOLBAR_CONFIG.geolocation.maximumAge,
      });
      
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });

      addToast({
        type: 'success',
        title: 'Location Found',
        description: `Location set with ${Math.round(position.coords.accuracy)}m accuracy`,
        duration: TOOLBAR_CONFIG.ui.toastDuration,
      });
      
    } catch (error) {
      let errorMessage = 'Failed to get location';
      let shouldShowModal = false;
      
      if (error instanceof GeolocationPositionError) {
        const errorInfo = getGeolocationErrorMessage(error);
        errorMessage = errorInfo.description;
        shouldShowModal = errorInfo.action === 'manual';
        
        addToast({
          type: 'error',
          title: errorInfo.title,
          description: errorInfo.description,
          duration: TOOLBAR_CONFIG.ui.toastDuration,
        });
      } else {
        addToast({
          type: 'error',
          title: 'Location Error',
          description: errorMessage,
          duration: TOOLBAR_CONFIG.ui.toastDuration,
        });
      }
      
      setLocationError(errorMessage);
      
      // Show manual location modal for certain errors
      if (shouldShowModal) {
        setTimeout(() => setShowLocationModal(true), 1000);
      }
    } finally {
      setLocationLoading(false);
    }
  };

  const handleRadiusChange = useCallback((value: number[]) => {
    setLocalRadiusMi(value[0]);
  }, []);

  // Generate radius tick marks for visual reference
  const getRadiusTickMarks = () => {
    const ticks = [];
    for (let i = TOOLBAR_CONFIG.radius.min; i <= TOOLBAR_CONFIG.radius.max; i += 5) {
      ticks.push(i);
    }
    return ticks;
  };

  return (
    <>
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center space-y-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20">
        {/* Geolocation Button */}
        <div className="flex flex-col items-center space-y-2">
          <Button
            size="icon"
            variant="outline"
            onClick={handleGetLocation}
            disabled={isLocationLoading}
            className={`w-${TOOLBAR_CONFIG.ui.buttonSize} h-${TOOLBAR_CONFIG.ui.buttonSize} rounded-full transition-all duration-200 ${
              userLocation 
                ? 'bg-green-100 border-green-300 text-green-700 shadow-green-200/50' 
                : 'hover:bg-primary-50 hover:border-primary-300'
            }`}
            title={userLocation ? 'Update location' : 'Get current location'}
          >
            {isLocationLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </Button>
          
          {/* Manual location button - always visible */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowLocationModal(true)}
            className="text-xs text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-2 py-1 h-auto"
            title="Set location manually"
          >
            <MapPin className="w-3 h-3 mr-1" />
            Set manually
          </Button>
        </div>

        {/* Radius Slider */}
        <div className="flex flex-col items-center space-y-3" data-radius-slider>
          {/* Rotated "Radius" label */}
          <div className="relative">
            <span 
              className="text-xs font-medium text-gray-600 block transform -rotate-90 whitespace-nowrap"
              style={{ transformOrigin: 'center' }}
            >
              Radius
            </span>
          </div>
          
          <div className={`h-${TOOLBAR_CONFIG.ui.sliderHeight} flex items-center relative`}>
            {/* Tick marks */}
            <div className="absolute left-6 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400">
              {getRadiusTickMarks().map((tick) => (
                <span key={tick} className="text-[10px] leading-none">
                  {tick}
                </span>
              ))}
            </div>
            
            <Slider
              value={[localRadiusMi]}
              onValueChange={handleRadiusChange}
              max={TOOLBAR_CONFIG.radius.max}
              min={TOOLBAR_CONFIG.radius.min}
              step={TOOLBAR_CONFIG.radius.step}
              orientation="vertical"
              className="h-full"
            />
          </div>
          
          {/* Current radius display */}
          <div className="text-center">
            <span className="text-sm font-semibold text-gray-800">
              {localRadiusMi}mi
            </span>
            {localRadiusMi !== debouncedRadius && (
              <div className="w-1 h-1 bg-primary-500 rounded-full mx-auto mt-1 animate-pulse" />
            )}
          </div>
        </div>

        {/* Location Status Indicator */}
        <div className="flex flex-col items-center space-y-1">
          {userLocation ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600 font-medium">Located</span>
              {userLocation.accuracy && (
                <span className="text-[10px] text-gray-500">
                  ±{Math.round(userLocation.accuracy)}m
                </span>
              )}
            </>
          ) : locationError ? (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-xs text-red-600">Error</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-gray-300 rounded-full" />
              <span className="text-xs text-gray-500">No location</span>
            </>
          )}
        </div>

        {/* Quick Settings Button (for future expansion) */}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            // Future: open settings panel
            addToast({
              type: 'info',
              title: 'Settings',
              description: 'Advanced settings coming soon!',
              duration: 3000,
            });
          }}
          className="w-8 h-8 rounded-full opacity-60 hover:opacity-100 transition-opacity"
          title="Settings (coming soon)"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      <SetLocationModal 
        open={showLocationModal} 
        onOpenChange={setShowLocationModal} 
      />
    </>
  );
}