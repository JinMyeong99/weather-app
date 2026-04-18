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

    const fetchPosition = () => {
      setState({ lat: null, lon: null, loading: true, error: null });
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
    };

    fetchPosition();

    // 브라우저 설정에서 위치 권한을 '허용'으로 변경하면 새로고침 없이 재시도
    let permissionStatus: PermissionStatus | null = null;
    const handlePermissionChange = () => {
      if (permissionStatus?.state === 'granted') {
        fetchPosition();
      }
    };

    navigator.permissions
      ?.query({ name: 'geolocation' })
      .then((status) => {
        permissionStatus = status;
        status.addEventListener('change', handlePermissionChange);
      })
      .catch(() => {
        // Permissions API 미지원 브라우저는 조용히 무시
      });

    return () => {
      permissionStatus?.removeEventListener('change', handlePermissionChange);
    };
  }, [isSupported]);

  return state;
}
