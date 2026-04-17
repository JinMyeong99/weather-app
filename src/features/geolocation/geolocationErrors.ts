/** Geolocation API 에러 메시지 상수. useGeolocation과 getCurrentPositionOnce에서 공유한다. */
export const GEOLOCATION_ERRORS = {
  PERMISSION_DENIED: '위치 권한이 거부되었습니다. 검색으로 지역을 선택해주세요.',
  UNAVAILABLE: '현재 위치를 가져올 수 없습니다.',
  UNSUPPORTED: '위치 정보를 지원하지 않는 브라우저입니다.',
} as const;
