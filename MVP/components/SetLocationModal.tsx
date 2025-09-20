'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label, Body } from '@/components/ui/typography';
import { MapPin, Search, X } from 'lucide-react';
import { useLocationStore } from '@/lib/store/location';
import { useToast } from '@/components/ui/toast';
import { geocodeAddress } from '@/lib/geocode';

interface SetLocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PlacePrediction {
  description: string;
  place_id: string;
}

export default function SetLocationModal({ open, onOpenChange }: SetLocationModalProps) {
  const [address, setAddress] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setUserLocation } = useLocationStore();
  const { addToast } = useToast();

  // Check if Google Maps API is available
  const hasGoogleMaps = typeof window !== 'undefined' && window.google && window.google.maps;

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Fetch address predictions from Google Places API
  const fetchPredictions = async (input: string) => {
    if (!input.trim() || input.length < 3) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    try {
      const response = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(input)}`);
      if (response.ok) {
        const data = await response.json();
        setPredictions(data.predictions || []);
        setShowPredictions(true);
      } else {
        // Fallback to simple input if API fails
        setShowPredictions(false);
      }
    } catch (error) {
      console.warn('Places autocomplete failed, falling back to simple input');
      setShowPredictions(false);
    }
  };

  // Debounce address input
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        fetchPredictions(address);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [address]);

  const handleSetLocation = async (addressToUse: string = address) => {
    if (!addressToUse.trim()) {
      addToast({
        type: 'warning',
        title: 'Address Required',
        description: 'Please enter an address to set your location.',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Try to geocode the address
      const result = await geocodeAddress(addressToUse.trim());
      
      if (result.data) {
        setUserLocation({
          latitude: result.data.latitude,
          longitude: result.data.longitude,
          address: result.data.address || addressToUse.trim()
        });
        
        addToast({
          type: 'success',
          title: 'Location Set',
          description: `Your location has been set to ${result.data.address || addressToUse.trim()}`,
        });
        
        setAddress('');
        setPredictions([]);
        setShowPredictions(false);
        onOpenChange(false);
      } else {
        // Geocoding failed but still allow manual input
        addToast({
          type: 'warning',
          title: 'Geocoding Failed',
          description: result.error?.message || 'Could not find exact coordinates. You can still use the address.',
        });
        
        // Set location with a default coordinate (e.g., center of US) and the address
        setUserLocation({
          latitude: 39.8283, // Center of US
          longitude: -98.5795,
          address: addressToUse.trim()
        });
        
        setAddress('');
        setPredictions([]);
        setShowPredictions(false);
        onOpenChange(false);
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Location Error',
        description: 'Failed to set location. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredictionSelect = (prediction: PlacePrediction) => {
    setAddress(prediction.description);
    setShowPredictions(false);
    setPredictions([]);
    handleSetLocation(prediction.description);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (predictions.length > 0 && showPredictions) {
        handlePredictionSelect(predictions[0]);
      } else {
        handleSetLocation();
      }
    } else if (e.key === 'Escape') {
      setShowPredictions(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Set Your Location
          </DialogTitle>
          <DialogDescription>
            Enter your address to set your location for finding nearby businesses.
            {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 
              ' Start typing for address suggestions.' : 
              ' We\'ll do our best to find the location.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Label htmlFor="address">Address</Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={inputRef}
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={() => {
                  if (predictions.length > 0) setShowPredictions(true);
                }}
                placeholder="123 Main St, City, State"
                className="pl-10 pr-10"
                disabled={isLoading}
              />
              {address && (
                <button
                  onClick={() => {
                    setAddress('');
                    setPredictions([]);
                    setShowPredictions(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Address Predictions Dropdown */}
            {showPredictions && predictions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {predictions.map((prediction, index) => (
                  <button
                    key={prediction.place_id}
                    onClick={() => handlePredictionSelect(prediction)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                  >
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-900">{prediction.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Body className="text-blue-800 text-sm">
                💡 For better address suggestions, add your Google Maps API key to enable Places Autocomplete.
              </Body>
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => handleSetLocation()} 
              disabled={isLoading || !address.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Setting Location...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 mr-2" />
                  Set Location
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
