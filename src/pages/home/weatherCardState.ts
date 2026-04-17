import type { WeatherData } from '../../shared/types';

/**
 * 홈 페이지 날씨 카드 섹션의 렌더 상태.
 *
 * JSX 내부의 중첩 삼항 연산자 대신 이 타입으로 상태를 명시적으로 표현해
 * 렌더 분기 로직과 JSX 구조를 분리한다.
 */
export type WeatherCardState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: WeatherData; lat: number; lon: number }
  | { status: 'idle' };

interface WeatherCardStateParams {
  isWeatherLoading: boolean;
  isNotFound: boolean;
  geoError: string | null;
  isSelected: boolean;
  isError: boolean;
  data: WeatherData | undefined;
  lat: number | null;
  lon: number | null;
}

export function getWeatherCardState({
  isWeatherLoading,
  isNotFound,
  geoError,
  isSelected,
  isError,
  data,
  lat,
  lon,
}: WeatherCardStateParams): WeatherCardState {
  if (isWeatherLoading) return { status: 'loading' };
  if (isNotFound || isError) return { status: 'error', message: '해당 장소의 정보가 제공되지 않습니다.' };
  if (geoError && !isSelected) return { status: 'error', message: geoError };
  if (data && lat !== null && lon !== null) return { status: 'success', data, lat, lon };
  return { status: 'idle' };
}
