import React, { useEffect, useRef, useState } from 'react';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Location, LocationSearchProps } from '../types/grid.types';
import { isLocationInNigeria } from '../lib/zoneMapping';

// Google Maps Autocomplete component for Next.js
export const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  placeholder = "Search for your location in Nigeria...",
  className = ""
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // Initialize Google Maps services
  useEffect(() => {
    const initializeGoogleMaps = () => {
      // Check if Google Maps API is available
      if (typeof window === 'undefined' || !window.google?.maps?.places) {
        return false;
      }

      try {
        // Initialize services
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        
        // Create a dummy div for PlacesService
        const dummyDiv = document.createElement('div');
        placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
        
        // Create session token
        sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
        
        console.log('Google Maps Places API initialized successfully in LocationSearch');
        setError(null);
        return true;
      } catch (err) {
        console.error('Google Maps Places API initialization error:', err);
        setError('Failed to initialize Google Maps services. Please refresh the page.');
        return false;
      }
    };

    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Listen for the custom Google Maps ready event
    const handleGoogleMapsReady = () => {
      console.log('Received Google Maps ready event');
      initializeGoogleMaps();
    };

    window.addEventListener('googleMapsReady', handleGoogleMapsReady);

    // Try immediate initialization in case Google Maps is already loaded
    if (initializeGoogleMaps()) {
      return () => window.removeEventListener('googleMapsReady', handleGoogleMapsReady);
    }

    // If not available, set up polling as fallback
    console.log('Google Maps not ready, setting up polling fallback...');
    let attempts = 0;
    const maxAttempts = 30; // 3 seconds max
    
    const pollInterval = setInterval(() => {
      attempts++;
      
      if (initializeGoogleMaps()) {
        clearInterval(pollInterval);
        return;
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(pollInterval);
        setError('Google Maps API failed to load. Please check your API key configuration.');
        console.error('Google Maps API polling timeout after', attempts, 'attempts');
      }
    }, 100);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('googleMapsReady', handleGoogleMapsReady);
    };
  }, []);

  // Handle input change and fetch predictions
  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setError(null);

    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (!autocompleteService.current || !window.google || !window.google.maps || !window.google.maps.places) {
      setError('Location service not available. Please wait for Google Maps to load or refresh the page.');
      return;
    }

    setIsLoading(true);

    try {
      const request: google.maps.places.AutocompletionRequest = {
        input: value,
        sessionToken: sessionToken.current!,
        componentRestrictions: { country: 'ng' },
        types: ['geocode'],
      };

      autocompleteService.current.getPlacePredictions(
        request,
        (predictions, status) => {
          setIsLoading(false);
          
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
            setShowSuggestions(true);
          } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            setSuggestions([]);
            setShowSuggestions(false);
          } else {
            setError('Unable to fetch location suggestions');
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    } catch (err) {
      setIsLoading(false);
      setError('Location search failed');
      console.error('Location search error:', err);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = async (prediction: google.maps.places.AutocompletePrediction) => {
    if (!placesService.current) {
      setError('Location service not available');
      return;
    }

    setInputValue(prediction.description);
    setShowSuggestions(false);
    setIsLoading(true);
    setError(null);

    try {
      const request: google.maps.places.PlaceDetailsRequest = {
        placeId: prediction.place_id,
        fields: ['geometry', 'formatted_address', 'name'],
        sessionToken: sessionToken.current!,
      };

      placesService.current.getDetails(request, (place, status) => {
        setIsLoading(false);
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const location: Location = {
            lat: place.geometry!.location!.lat(),
            lng: place.geometry!.location!.lng(),
            address: place.formatted_address || prediction.description,
            placeId: prediction.place_id,
          };

          // Validate location is in Nigeria
          if (!isLocationInNigeria(location)) {
            setError('Please select a location within Nigeria');
            return;
          }

          onLocationSelect(location);
          
          // Generate new session token for next search
          sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
        } else {
          setError('Unable to get location details');
        }
      });
    } catch (err) {
      setIsLoading(false);
      setError('Failed to get location details');
      console.error('Place details error:', err);
    }
  };

  // Get current location
  const handleCurrentLocation = () => {
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
          address: 'Current Location',
        };

        // Validate location is in Nigeria
        if (!isLocationInNigeria(location)) {
          setError('Your current location appears to be outside Nigeria');
          setIsLoading(false);
          return;
        }

        // Reverse geocode to get address
        if (typeof window !== 'undefined' && window.google && window.google.maps) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: location.lat, lng: location.lng } },
            (results, status) => {
              setIsLoading(false);
              
              if (status === 'OK' && results && results[0]) {
                location.address = results[0].formatted_address;
                setInputValue(location.address);
              }
              
              onLocationSelect(location);
            }
          );
        } else {
          setIsLoading(false);
          onLocationSelect(location);
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
      }
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="block w-full pl-10 pr-16 py-3 border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                   bg-white text-gray-900 placeholder-gray-500
                   disabled:bg-gray-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        />
        
        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={isLoading}
          className="absolute inset-y-0 right-0 pr-3 flex items-center
                   text-gray-400 hover:text-primary-600 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
          title="Use current location"
        >
          <MapPinIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-12 top-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-full mt-1 w-full p-2 bg-red-50 border border-red-200 
                      rounded-md text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 
                      rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 
                       focus:outline-none border-b border-gray-100 last:border-b-0
                       transition-colors"
            >
              <div className="flex items-start">
                <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {suggestion.structured_formatting?.main_text || suggestion.description}
                  </p>
                  {suggestion.structured_formatting?.secondary_text && (
                    <p className="text-sm text-gray-500 truncate">
                      {suggestion.structured_formatting.secondary_text}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;