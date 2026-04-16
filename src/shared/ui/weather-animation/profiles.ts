import type { RainProfile, WeatherKind } from './types';

export const RAIN_PROFILES: Record<'rain' | 'shower' | 'thunder', RainProfile> = {
  rain: {
    density: 1,
    length: [14, 30],
    speed: [520, 850],
    opacity: [0.22, 0.55],
    splashProbability: 0.22,
    maxSplashes: 42,
  },
  shower: {
    density: 1.55,
    length: [18, 38],
    speed: [680, 1040],
    opacity: [0.3, 0.68],
    splashProbability: 0.34,
    maxSplashes: 68,
  },
  thunder: {
    density: 1.25,
    length: [16, 34],
    speed: [600, 960],
    opacity: [0.26, 0.62],
    splashProbability: 0.28,
    maxSplashes: 56,
  },
};

export function getWeatherKind(icon: string): WeatherKind {
  const code = icon.slice(0, 2);
  const isNight = icon.endsWith('n');

  switch (code) {
    case '01':
      return isNight ? 'clear-night' : 'clear-day';
    case '02':
      return isNight ? 'partly-cloudy-night' : 'partly-cloudy-day';
    case '03':
      return isNight ? 'cloudy-night' : 'cloudy-day';
    case '04':
      return 'overcast';
    case '09':
      return 'shower';
    case '10':
      return 'rain';
    case '11':
      return 'thunder';
    case '13':
      return 'snow';
    case '50':
      return 'fog';
    default:
      return isNight ? 'clear-night' : 'clear-day';
  }
}
