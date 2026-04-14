import { useState, useEffect } from 'react';

interface GeolocationState {
  lat: number | null;
  lon: number | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lon: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ lat: null, lon: null, loading: false, error: '위치 정보를 지원하지 않는 브라우저입니다.' });
      return;
    }

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
            ? '위치 권한이 거부되었습니다. 검색으로 지역을 선택해주세요.'
            : '현재 위치를 가져올 수 없습니다.';
        setState({ lat: null, lon: null, loading: false, error: message });
      },
    );
  }, []);

  return state;
}
