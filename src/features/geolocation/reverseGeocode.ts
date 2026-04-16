import { kakaoClient } from '../../shared/api/kakaoClient';
import { KakaoCoord2RegionCodeSchema } from '../../shared/api/kakaoLocalSchemas';

function formatRegionName(region: {
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
}): string {
  const { region_1depth_name, region_2depth_name, region_3depth_name } = region;

  if (region_2depth_name && region_3depth_name) {
    return `${region_3depth_name} (${region_2depth_name}, ${region_1depth_name})`;
  }

  if (region_2depth_name) {
    return `${region_2depth_name} (${region_1depth_name})`;
  }

  return region_1depth_name || '현재 위치';
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await kakaoClient.get<unknown>('/v2/local/geo/coord2regioncode.json', {
      params: { x: lon, y: lat, input_coord: 'WGS84' },
    });
    const result = KakaoCoord2RegionCodeSchema.safeParse(res.data);

    if (!result.success) {
      if (import.meta.env.DEV) {
        console.warn('[Zod] Kakao coord2regioncode 응답 검증 실패:', result.error.message);
      }
      return '현재 위치';
    }

    const region =
      result.data.documents.find((document) => document.region_type === 'H') ??
      result.data.documents[0];

    return region ? formatRegionName(region) : '현재 위치';
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Kakao] 현재 위치명 변환 실패:', error);
    }

    return '현재 위치';
  }
}
