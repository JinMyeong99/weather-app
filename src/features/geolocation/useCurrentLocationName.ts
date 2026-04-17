import { useQuery } from '@tanstack/react-query';
import { reverseGeocode } from './reverseGeocode';

/**
 * geolocation 좌표를 한국어 행정구역명으로 변환하는 훅.
 *
 * "어떻게 주소를 얻는지" 구현 세부사항을 캡슐화해
 * 페이지 컴포넌트는 결과값만 받는다.
 *
 * @param enabled false이면 쿼리를 실행하지 않는다 (예: 검색으로 위치 선택 중일 때)
 */
export function useCurrentLocationName(
  lat: number | null,
  lon: number | null,
  enabled: boolean,
): string | undefined {
  const { data } = useQuery({
    queryKey: ['reverseGeocode', lat, lon],
    queryFn: () => {
      if (lat === null || lon === null) {
        throw new Error('위치명 조회에 필요한 좌표가 없습니다.');
      }
      return reverseGeocode(lat, lon);
    },
    enabled: lat !== null && lon !== null && enabled,
    staleTime: Infinity,
  });
  return data;
}
