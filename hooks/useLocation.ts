import { useState, useCallback, useEffect } from 'react';
import { Location, DiscoZone, UseLocationReturn } from '../types/grid.types';
import { getDiscoForLocation } from '../lib/zoneMapping';

const DEFAULT_LOCATION: Location = {
  lat: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LOCATION_LAT || '9.0765'),
  lng: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LOCATION_LNG || '7.3986'),
  address: 'Abuja, Nigeria'
};

export function useLocation(): UseLocationReturn {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [selectedLocation, setSelectedLocationState] = useState<Location | null>(DEFAULT_LOCATION);
  const [disco, setDisco] = useState<DiscoZone | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update DISCO when location changes
  const updateDisco = useCallback((location: Location | null) => {
    if (location) {
      const foundDisco = getDiscoForLocation(location);
      setDisco(foundDisco);
    } else {
      setDisco(null);
    }
  }, []);

  // Set selected location and update DISCO
  const setSelectedLocation = useCallback((location: Location) => {
    setSelectedLocationState(location);
    updateDisco(location);
    setError(null);
  }, [updateDisco]);

  // Get current location
  const getCurrentLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: 'Current Location'
        };

        setCurrentLocation(location);
        setSelectedLocation(location);
        setIsLoading(false);

        // Reverse geocode to get address if Google Maps is available
        if (typeof window !== 'undefined' && window.google && window.google.maps) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: location.lat, lng: location.lng } },
            (results, status) => {
              if (status === 'OK' && results && results[0]) {
                const updatedLocation = {
                  ...location,
                  address: results[0].formatted_address
                };
                setCurrentLocation(updatedLocation);
                setSelectedLocation(updatedLocation);
              }
            }
          );
        }
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied by user');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable');
            break;
          case error.TIMEOUT:
            setError('Location request timed out');
            break;
          default:
            setError('An unknown error occurred while retrieving location');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }, [setSelectedLocation]);

  // Initialize with default location on mount
  useEffect(() => {
    if (selectedLocation) {
      updateDisco(selectedLocation);
    }
  }, [selectedLocation, updateDisco]);

  // Auto-detect current location on mount if permission is granted
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((permission) => {
        if (permission.state === 'granted') {
          getCurrentLocation();
        }
      });
    }
  }, [getCurrentLocation]);

  return {
    currentLocation,
    selectedLocation,
    disco,
    setSelectedLocation,
    isLoading,
    error,
  };
}