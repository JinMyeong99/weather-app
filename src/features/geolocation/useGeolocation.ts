import { useState, useEffect } from 'react';
import { GEOLOCATION_ERRORS } from './geolocationErrors';

interface GeolocationState {
  lat: number | null;
  lon: number | null;
  loading: boolean;
  error: string | null;
}

const GEOLOCATION_UNSUPPORTED_STATE: GeolocationState = {
  lat: null,
  lon: null,
  loading: false,
  error: GEOLOCATION_ERRORS.UNSUPPORTED,
};

export function useGeolocation(): GeolocationState {
  const isSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator;
  const [state, setState] = useState<GeolocationState>(() =>
    isSupported
      ? { lat: null, lon: null, loading: true, error: null }
      : GEOLOCATION_UNSUPPORTED_STATE,
  );

  useEffect(() => {
    if (!isSupported) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (err) => {
        const message =
          err.code === err.PERMISSION_DENIED
            ? GEOLOCATION_ERRORS.PERMISSION_DENIED
            : GEOLOCATION_ERRORS.UNAVAILABLE;
        setState({ lat: null, lon: null, loading: false, error: message });
      },
    );
  }, [isSupported]);

  return state;
}
