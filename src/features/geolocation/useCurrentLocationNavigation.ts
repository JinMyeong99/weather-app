import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentPositionOnce } from './getCurrentPositionOnce';
import { reverseGeocode } from './reverseGeocode';
import { makeLocationId } from '../../shared/lib/locationId';

/**
 * "현재 위치로 이동" 버튼의 비동기 흐름을 캡슐화하는 훅.
 *
 * 위치 조회 → 주소 변환 → 상세 페이지 이동의 3단계 로직과
 * 로딩·에러 상태를 한 곳에서 관리한다.
 */
export function useCurrentLocationNavigation(weatherIcon: string) {
  const navigate = useNavigate();
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCurrentLocation = async () => {
    setError(null);
    setIsResolving(true);

    try {
      const position = await getCurrentPositionOnce();
      const locationName = await reverseGeocode(position.lat, position.lon);

      navigate(`/detail/${makeLocationId(position.lat, position.lon)}`, {
        state: { locationName, weatherIcon },
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsResolving(false);
    }
  };

  return { isResolving, error, handleCurrentLocation };
}
