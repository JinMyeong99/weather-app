import { weatherClient } from '../../shared/api/weatherClient';
import type { District } from '../../shared/types';

interface GeocodingResult {
  lat: number;
  lon: number;
  name: string;
}

async function geocodeQuery(query: string): Promise<GeocodingResult | null> {
  const res = await weatherClient.get<GeocodingResult[]>('/geo/1.0/direct', {
    params: { q: `${query},KR`, limit: 1 },
  });
  return res.data[0] ?? null;
}

function getDistrictGeocodeCandidates(district: District): string[] {
  const fullAdministrativeName = [district.dong, district.sigungu, district.sido]
    .filter(Boolean)
    .join(', ');
  const cityAdministrativeName = [district.sigungu, district.sido]
    .filter(Boolean)
    .join(', ');

  return Array.from(new Set([
    fullAdministrativeName,
    cityAdministrativeName,
    district.sido,
  ].filter(Boolean)));
}

export async function geocodeDistrict(
  district: District,
): Promise<{ lat: number; lon: number } | null> {
  const candidates = getDistrictGeocodeCandidates(district);

  for (const candidate of candidates) {
    const result = await geocodeQuery(candidate);
    if (result) {
      return { lat: result.lat, lon: result.lon };
    }
  }

  return null;
}
