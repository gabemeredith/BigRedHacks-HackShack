'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VStack } from '@/components/ui/layout';
import { Label, Body } from '@/components/ui/typography';

interface CoordinatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (lat: number, lng: number) => void;
  currentLat?: number;
  currentLng?: number;
}

export default function CoordinatesModal({
  open,
  onOpenChange,
  onSave,
  currentLat,
  currentLng
}: CoordinatesModalProps) {
  const [latitude, setLatitude] = useState(currentLat?.toString() || '');
  const [longitude, setLongitude] = useState(currentLng?.toString() || '');
  const [error, setError] = useState('');

  const handleSave = () => {
    setError('');
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng)) {
      setError('Please enter valid numbers for both latitude and longitude');
      return;
    }

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      setError('Longitude must be between -180 and 180');
      return;
    }

    onSave(lat, lng);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setError('');
    setLatitude(currentLat?.toString() || '');
    setLongitude(currentLng?.toString() || '');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Set Business Coordinates</DialogTitle>
        </DialogHeader>
        
        <VStack className="gap-4">
          <Body className="text-text-secondary text-sm">
            Since automatic geocoding is not available, please enter your business location coordinates manually.
            You can find these by searching for your address on Google Maps and copying the coordinates.
          </Body>

          {error && (
            <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
              <Body className="text-error-800 text-sm">{error}</Body>
            </div>
          )}

          <VStack className="gap-3">
            <VStack className="gap-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="40.7128"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
              <Body className="text-text-tertiary text-xs">
                Example: 40.7128 (between -90 and 90)
              </Body>
            </VStack>

            <VStack className="gap-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="-74.0060"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
              <Body className="text-text-tertiary text-xs">
                Example: -74.0060 (between -180 and 180)
              </Body>
            </VStack>
          </VStack>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save Coordinates
            </Button>
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
          </div>

          <Body className="text-text-tertiary text-xs">
            💡 Tip: Right-click on Google Maps and select "What's here?" to get coordinates
          </Body>
        </VStack>
      </DialogContent>
    </Dialog>
  );
}
