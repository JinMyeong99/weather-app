import { useQuery } from '@tanstack/react-query';
import { fetchWeatherData } from '../api/weatherApi';

/** 날씨 데이터 캐시 유효 시간 (5분). 같은 좌표 재접속 시 API를 다시 호출하지 않는다. */
const WEATHER_STALE_TIME_MS = 5 * 60 * 1000;

export function useWeather(lat: number | null, lon: number | null) {
  return useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: ({ signal }) => {
      if (lat === null || lon === null) {
        throw new Error('날씨 조회에 필요한 좌표가 없습니다.');
      }

      return fetchWeatherData(lat, lon, signal);
    },
    enabled: lat !== null && lon !== null,
    staleTime: WEATHER_STALE_TIME_MS,
  });
}
