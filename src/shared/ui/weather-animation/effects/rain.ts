import { getRainProfileKind, RAIN_PROFILES } from '../profiles';
import type { RainDrop, RainProfile, SceneState, WeatherKind } from '../types';
import { getParticleCount, random } from '../utils';

function getRainProfile(kind: WeatherKind): RainProfile {
  return RAIN_PROFILES[getRainProfileKind(kind)];
}

export function createRain(width: number, height: number, reducedMotion: boolean, kind: WeatherKind): RainDrop[] {
  const profile = getRainProfile(kind);
  const count = getParticleCount(
    width,
    height,
    0.00013 * profile.density,
    Math.round(65 * profile.density),
    Math.round(190 * profile.density),
    reducedMotion,
  );

  return Array.from({ length: count }, () => ({
    x: random(-width * 0.1, width * 1.1),
    y: random(-height, height),
    length: random(profile.length[0], profile.length[1]),
    speed: random(profile.speed[0], profile.speed[1]) * (reducedMotion ? 0.55 : 1),
    opacity: random(profile.opacity[0], profile.opacity[1]),
  }));
}

function updateRain(scene: SceneState, dt: number) {
  const profile = getRainProfile(scene.kind);

  scene.rainDrops.forEach((drop) => {
    drop.y += drop.speed * dt;
    drop.x += drop.speed * 0.14 * dt;

    if (drop.y > scene.height + drop.length) {
      const splashProbability = scene.reducedMotion
        ? profile.splashProbability * 0.36
        : profile.splashProbability;
      const shouldSplash = scene.splashes.length < profile.maxSplashes && Math.random() < splashProbability;

      if (shouldSplash) {
        scene.splashes.push({
          x: drop.x,
          y: scene.height - random(4, 22),
          age: 0,
          ttl: random(0.22, 0.38),
          size: random(4, 10),
        });
      }

      drop.x = random(-scene.width * 0.1, scene.width);
      drop.y = random(-scene.height * 0.35, -20);
      drop.length = random(profile.length[0], profile.length[1]);
      drop.speed = random(profile.speed[0], profile.speed[1]) * (scene.reducedMotion ? 0.55 : 1);
      drop.opacity = random(profile.opacity[0], profile.opacity[1]);
    }

    if (drop.x > scene.width + 50) {
      drop.x = random(-scene.width * 0.15, 0);
    }
  });

  scene.splashes = scene.splashes
    .map((splash) => ({ ...splash, age: splash.age + dt }))
    .filter((splash) => splash.age < splash.ttl);
}

export function drawRain(ctx: CanvasRenderingContext2D, scene: SceneState, dt: number) {
  updateRain(scene, dt);

  ctx.lineCap = 'round';
  ctx.lineWidth = 1.4;

  scene.rainDrops.forEach((drop) => {
    ctx.strokeStyle = `rgba(219, 234, 254, ${drop.opacity})`;
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x + drop.length * 0.24, drop.y + drop.length);
    ctx.stroke();
  });

  scene.splashes.forEach((splash) => {
    const progress = splash.age / splash.ttl;
    const alpha = (1 - progress) * 0.28;
    const spread = splash.size * (0.7 + progress);

    ctx.strokeStyle = `rgba(219, 234, 254, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(splash.x - spread, splash.y);
    ctx.quadraticCurveTo(splash.x, splash.y - spread * 0.45, splash.x + spread, splash.y);
    ctx.stroke();
  });
}
