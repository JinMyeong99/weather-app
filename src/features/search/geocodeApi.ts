import { kakaoClient } from '../../shared/api/kakaoClient';
import { KakaoAddressSearchSchema } from '../../shared/api/kakaoLocalSchemas';
import type { District } from '../../shared/types';

function isNonEmptyString(value: string | undefined): value is string {
  return Boolean(value);
}

interface Coordinates {
  lat: number;
  lon: number;
}

async function geocodeQuery(query: string): Promise<Coordinates | null> {
  const res = await kakaoClient.get<unknown>('/v2/local/search/address.json', {
    params: { query, analyze_type: 'similar', size: 5 },
  });
  const result = KakaoAddressSearchSchema.safeParse(res.data);

  if (!result.success) {
    if (import.meta.env.DEV) {
      console.warn('[Zod] Kakao address search 응답 검증 실패:', result.error.message);
    }
    return null;
  }

  const document = result.data.documents[0];
  if (!document) return null;

  return {
    lat: Number(document.y),
    lon: Number(document.x),
  };
}

function getDistrictGeocodeCandidates(district: District): string[] {
  const fullAdministrativeName = [district.sido, district.sigungu, district.dong]
    .filter(Boolean)
    .join(' ');
  const cityAdministrativeName = [district.sigungu, district.dong]
    .filter(Boolean)
    .join(' ');

  return Array.from(new Set([
    fullAdministrativeName,
    cityAdministrativeName,
    district.dong,
    district.sigungu,
    district.sido,
  ].filter(isNonEmptyString)));
}

export async function geocodeDistrict(
  district: District,
): Promise<Coordinates | null> {
  const candidates = getDistrictGeocodeCandidates(district);

  try {
    for (const candidate of candidates) {
      const result = await geocodeQuery(candidate);
      if (result) {
        return result;
      }
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Kakao] 지역 좌표 변환 실패:', error);
    }
  }

  return null;
}
