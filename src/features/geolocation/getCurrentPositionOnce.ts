export interface CurrentPositionCoords {
  lat: number;
  lon: number;
}

export function getCurrentPositionOnce(): Promise<CurrentPositionCoords> {
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    return Promise.reject(new Error('위치 정보를 지원하지 않는 브라우저입니다.'));
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? '위치 권한이 거부되었습니다. 검색으로 지역을 선택해주세요.'
            : '현재 위치를 가져올 수 없습니다.';

        reject(new Error(message));
      },
    );
  });
}
