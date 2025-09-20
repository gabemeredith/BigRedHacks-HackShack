import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
  accuracy?: number; // GPS accuracy in meters
}

interface LocationStore {
  userLocation: UserLocation | null;
  radiusMi: number;
  isLocationLoading: boolean;
  locationError: string | null;
  
  setUserLocation: (location: UserLocation | null) => void;
  setRadiusMi: (radius: number) => void;
  setLocationLoading: (loading: boolean) => void;
  setLocationError: (error: string | null) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      userLocation: null,
      radiusMi: 5, // Default 5 miles
      isLocationLoading: false,
      locationError: null,

      setUserLocation: (location) => set({ userLocation: location, locationError: null }),
      setRadiusMi: (radius) => set({ radiusMi: radius }),
      setLocationLoading: (loading) => set({ isLocationLoading: loading }),
      setLocationError: (error) => set({ locationError: error }),
      clearLocation: () => set({ 
        userLocation: null, 
        locationError: null 
      }),
    }),
    {
      name: 'location-storage',
      partialize: (state) => ({
        userLocation: state.userLocation,
        radiusMi: state.radiusMi,
      }),
    }
  )
);
