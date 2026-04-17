/**
 * 위·경도 좌표를 URL-safe 문자열로 인코딩/디코딩하는 유틸리티.
 *
 * 상세 페이지 경로 `/detail/:locationId`에서 좌표를 전달할 때 사용한다.
 * 인코딩 방식이 바뀌더라도 이 파일 하나만 수정하면 된다.
 */

export function makeLocationId(lat: number, lon: number): string {
  return btoa(`${lat},${lon}`);
}

export function parseLocationId(locationId: string): { lat: number; lon: number } | null {
  try {
    const decoded = atob(locationId);
    const [lat, lon] = decoded.split(',').map(Number);
    if (isNaN(lat) || isNaN(lon)) return null;
    return { lat, lon };
  } catch {
    return null;
  }
}
