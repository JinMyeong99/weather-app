const LAST_WEATHER_ICON_KEY = 'weather-app:last-weather-icon';

function canUseLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getCachedWeatherIcon(): string | null {
  if (!canUseLocalStorage()) return null;

  try {
    return window.localStorage.getItem(LAST_WEATHER_ICON_KEY);
  } catch {
    return null;
  }
}

export function setCachedWeatherIcon(icon: string): void {
  if (!canUseLocalStorage()) return;

  try {
    window.localStorage.setItem(LAST_WEATHER_ICON_KEY, icon);
  } catch {
    // 테마 캐시는 UI 안정성 보조값이라 저장 실패를 사용자 흐름에 노출하지 않는다.
  }
}
