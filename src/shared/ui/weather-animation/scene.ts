import type { SceneState, WeatherKind } from './types';
import { createClouds } from './effects/clouds';
import { createFog } from './effects/fog';
import { createGroundDecor, createGroundscape } from './effects/groundscape';
import { createLightning } from './effects/lightning';
import { createRain } from './effects/rain';
import { createSkyBirds, createStars, createSunMotes } from './effects/sky';
import { createSnow } from './effects/snow';
import {
  isFogKind,
  isOvercastKind,
  isRainEffectKind,
  isSnowKind,
} from './profiles';

export function createScene(
  kind: WeatherKind,
  width: number,
  height: number,
  dpr: number,
  reducedMotion: boolean,
  now: number,
): SceneState {
  const usesClouds = [
    'partly-cloudy-day',
    'partly-cloudy-night',
    'cloudy-day',
    'cloudy-night',
  ].includes(kind) || isOvercastKind(kind) || isRainEffectKind(kind);
  const usesStars = kind === 'clear-night' || kind === 'partly-cloudy-night';
  const usesRain = isRainEffectKind(kind);
  const groundscape = createGroundscape(width, height);

  return {
    kind,
    width,
    height,
    dpr,
    reducedMotion,
    clouds: usesClouds ? createClouds(width, height, kind, reducedMotion) : [],
    rainDrops: usesRain ? createRain(width, height, reducedMotion, kind) : [],
    splashes: [],
    snowFlakes: isSnowKind(kind) ? createSnow(width, height, reducedMotion) : [],
    stars: usesStars ? createStars(width, height, reducedMotion) : [],
    skyBirds: createSkyBirds(width, height, kind, reducedMotion),
    sunMotes: kind === 'clear-day' ? createSunMotes(width, height, reducedMotion) : [],
    fogBlobs: isFogKind(kind) ? createFog(width, height, reducedMotion) : [],
    groundscape,
    groundDecor: createGroundDecor(width, height, groundscape),
    lightning: createLightning(now, reducedMotion),
  };
}
