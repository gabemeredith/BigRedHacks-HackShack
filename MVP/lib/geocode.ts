export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export interface GeocodeError {
  error: string;
  code?: string;
}

/**
 * Geocode an address using Google Maps Geocoding API
 * Can be easily swapped for Mapbox or other providers
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | GeocodeError> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return {
      error: 'Google Maps API key not configured',
      code: 'NO_API_KEY'
    };
  }

  if (!address.trim()) {
    return {
      error: 'Address is required',
      code: 'INVALID_INPUT'
    };
  }

  try {
    const encodedAddress = encodeURIComponent(address.trim());
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return {
        error: `Geocoding failed: ${data.status}`,
        code: data.status
      };
    }

    if (!data.results || data.results.length === 0) {
      return {
        error: 'No results found for this address',
        code: 'ZERO_RESULTS'
      };
    }

    const result = data.results[0];
    const location = result.geometry.location;

    return {
      latitude: location.lat,
      longitude: location.lng,
      formattedAddress: result.formatted_address
    };

  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      error: 'Failed to geocode address',
      code: 'NETWORK_ERROR'
    };
  }
}

/**
 * Reverse geocode coordinates to get address
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult | GeocodeError> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return {
      error: 'Google Maps API key not configured',
      code: 'NO_API_KEY'
    };
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return {
        error: `Reverse geocoding failed: ${data.status}`,
        code: data.status
      };
    }

    if (!data.results || data.results.length === 0) {
      return {
        error: 'No address found for these coordinates',
        code: 'ZERO_RESULTS'
      };
    }

    const result = data.results[0];

    return {
      latitude: lat,
      longitude: lng,
      formattedAddress: result.formatted_address
    };

  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      error: 'Failed to reverse geocode coordinates',
      code: 'NETWORK_ERROR'
    };
  }
}

/**
 * Validate coordinates
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180 &&
    !isNaN(lat) && !isNaN(lng)
  );
}
