import { useQuery } from '@tanstack/react-query';
import { fetchWeatherData } from '../api/weatherApi';

export function useWeather(lat: number | null, lon: number | null) {
  return useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => fetchWeatherData(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 1000 * 60 * 5,
  });
}
