import type { RainProfile, WeatherKind } from './types';

type RainProfileKind = 'rain' | 'shower' | 'thunder';

export const RAIN_PROFILES: Record<RainProfileKind, RainProfile> = {
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
      return isNight ? 'overcast-night' : 'overcast-day';
    case '09':
      return isNight ? 'shower-night' : 'shower-day';
    case '10':
      return isNight ? 'rain-night' : 'rain-day';
    case '11':
      return isNight ? 'thunder-night' : 'thunder-day';
    case '13':
      return isNight ? 'snow-night' : 'snow-day';
    case '50':
      return isNight ? 'fog-night' : 'fog-day';
    default:
      return isNight ? 'clear-night' : 'clear-day';
  }
}

export function isNightKind(kind: WeatherKind) {
  return kind.endsWith('-night');
}

export function isOvercastKind(kind: WeatherKind) {
  return kind === 'overcast-day' || kind === 'overcast-night';
}

export function isRainKind(kind: WeatherKind) {
  return kind === 'rain-day' || kind === 'rain-night';
}

export function isShowerKind(kind: WeatherKind) {
  return kind === 'shower-day' || kind === 'shower-night';
}

export function isThunderKind(kind: WeatherKind) {
  return kind === 'thunder-day' || kind === 'thunder-night';
}

export function isRainEffectKind(kind: WeatherKind) {
  return isRainKind(kind) || isShowerKind(kind) || isThunderKind(kind);
}

export function isSnowKind(kind: WeatherKind) {
  return kind === 'snow-day' || kind === 'snow-night';
}

export function isFogKind(kind: WeatherKind) {
  return kind === 'fog-day' || kind === 'fog-night';
}

export function getRainProfileKind(kind: WeatherKind): RainProfileKind {
  if (isShowerKind(kind)) return 'shower';
  if (isThunderKind(kind)) return 'thunder';
  return 'rain';
}
