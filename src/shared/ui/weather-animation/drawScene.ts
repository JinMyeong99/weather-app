import type { SceneState } from './types';
import { drawClouds } from './effects/clouds';
import { drawFog } from './effects/fog';
import { drawGroundscape } from './effects/groundscape';
import { drawLightning } from './effects/lightning';
import { drawRain } from './effects/rain';
import { drawMoon, drawSkyBirds, drawStars, drawSunbeamWash, drawSunlight, drawSunMotes, drawLightStreaks, getMoonMetrics } from './effects/sky';
import { drawSnow } from './effects/snow';

export function drawScene(ctx: CanvasRenderingContext2D, scene: SceneState, time: number, dt: number) {
  ctx.clearRect(0, 0, scene.width, scene.height);

  switch (scene.kind) {
    case 'clear-day':
      drawSunlight(ctx, scene.width, scene.height, time, scene.reducedMotion, 1);
      drawSunbeamWash(ctx, scene.width, scene.height, time, scene.reducedMotion);
      drawLightStreaks(ctx, scene.width, scene.height, time, scene.reducedMotion);
      drawSkyBirds(ctx, scene, time, dt);
      drawSunMotes(ctx, scene, time, dt);
      drawGroundscape(ctx, scene, time);
      break;
    case 'clear-night':
      drawStars(ctx, scene.stars, time, getMoonMetrics(scene.width, scene.height));
      drawMoon(ctx, scene.width, scene.height);
      drawGroundscape(ctx, scene, time);
      break;
    case 'partly-cloudy-day':
      drawSunlight(ctx, scene.width, scene.height, time, scene.reducedMotion, 0.58);
      drawSkyBirds(ctx, scene, time, dt);
      drawClouds(ctx, scene, dt);
      drawGroundscape(ctx, scene, time);
      break;
    case 'partly-cloudy-night':
      drawStars(ctx, scene.stars, time, getMoonMetrics(scene.width, scene.height));
      drawMoon(ctx, scene.width, scene.height);
      drawClouds(ctx, scene, dt);
      drawGroundscape(ctx, scene, time);
      break;
    case 'cloudy-day':
      drawSunlight(ctx, scene.width, scene.height, time, scene.reducedMotion, 0.22);
      drawSkyBirds(ctx, scene, time, dt);
      drawClouds(ctx, scene, dt);
      drawGroundscape(ctx, scene, time);
      break;
    case 'cloudy-night':
      drawClouds(ctx, scene, dt);
      drawGroundscape(ctx, scene, time);
      break;
    case 'overcast-day':
    case 'overcast-night':
      drawClouds(ctx, scene, dt);
      drawGroundscape(ctx, scene, time);
      break;
    case 'rain-day':
    case 'rain-night':
      drawClouds(ctx, scene, dt);
      drawGroundscape(ctx, scene, time);
      drawRain(ctx, scene, dt);
      break;
    case 'shower-day':
    case 'shower-night':
      drawClouds(ctx, scene, dt);
      drawGroundscape(ctx, scene, time);
      drawRain(ctx, scene, dt);
      break;
    case 'thunder-day':
    case 'thunder-night':
      drawClouds(ctx, scene, dt);
      drawGroundscape(ctx, scene, time);
      drawRain(ctx, scene, dt);
      drawLightning(ctx, scene, time);
      break;
    case 'snow-day':
    case 'snow-night':
      drawGroundscape(ctx, scene, time);
      drawSnow(ctx, scene, time, dt);
      break;
    case 'fog-day':
    case 'fog-night':
      drawGroundscape(ctx, scene, time);
      drawFog(ctx, scene, time, dt);
      break;
  }
}
