import { useQuery } from '@tanstack/react-query';
import { fetchWeatherData } from '../api/weatherApi';

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
    staleTime: 1000 * 60 * 5,
  });
}
