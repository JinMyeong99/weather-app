import { GEOLOCATION_ERRORS } from './geolocationErrors';

export interface CurrentPositionCoords {
  lat: number;
  lon: number;
}

// 진행 중인 요청을 재사용해 중복 geolocation 호출을 방지한다.
// 성공한 좌표는 세션 내내 캐싱하고, 실패 시에는 null로 초기화해 재시도를 허용한다.
let cachedPromise: Promise<CurrentPositionCoords> | null = null;

export function getCurrentPositionOnce(): Promise<CurrentPositionCoords> {
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    return Promise.reject(new Error(GEOLOCATION_ERRORS.UNSUPPORTED));
  }

  if (cachedPromise) return cachedPromise;

  cachedPromise = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        cachedPromise = null; // 실패 시 초기화 → 재시도 가능
        const message =
          error.code === error.PERMISSION_DENIED
            ? GEOLOCATION_ERRORS.PERMISSION_DENIED
            : GEOLOCATION_ERRORS.UNAVAILABLE;

        reject(new Error(message));
      },
    );
  });

  return cachedPromise;
}
