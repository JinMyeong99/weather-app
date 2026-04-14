import { weatherClient } from '../../shared/api/weatherClient';

interface ReverseGeocodeResult {
  name: string;
  local_names?: Record<string, string>;
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const res = await weatherClient.get<ReverseGeocodeResult[]>('/geo/1.0/reverse', {
    params: { lat, lon, limit: 1 },
  });
  const result = res.data[0];
  if (!result) return '현재 위치';
  return result.local_names?.ko ?? result.name ?? '현재 위치';
}
