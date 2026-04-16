import type { SceneState, SkyBird, Star, SunMote, WeatherKind } from '../types';
import { clamp, getParticleCount, random } from '../utils';

export function createStars(width: number, height: number, reducedMotion: boolean): Star[] {
  const count = getParticleCount(width, height, 0.00008, 38, 120, reducedMotion);

  return Array.from({ length: count }, () => ({
    x: random(0, width),
    y: random(0, height * 0.62),
    size: random(0.8, 2.2),
    phase: random(0, Math.PI * 2),
    speed: random(0.7, 1.8) * (reducedMotion ? 0.35 : 1),
    alpha: random(0.35, 0.9),
  }));
}

function usesSkyBirds(kind: WeatherKind) {
  return kind === 'clear-day' || kind === 'partly-cloudy-day' || kind === 'cloudy-day';
}

function getSkyBirdScaleRange(width: number): [number, number] {
  return width < 640 ? [0.38, 0.62] : [0.5, 0.86];
}

export function createSkyBirds(width: number, height: number, kind: WeatherKind, reducedMotion: boolean): SkyBird[] {
  if (!usesSkyBirds(kind)) return [];

  const isMobile = width < 640;
  const profile =
    kind === 'clear-day'
      ? { density: 0.000006, min: isMobile ? 3 : 5, max: isMobile ? 6 : 9 }
      : kind === 'partly-cloudy-day'
        ? { density: 0.000004, min: isMobile ? 2 : 3, max: isMobile ? 4 : 6 }
        : { density: 0.000003, min: isMobile ? 1 : 2, max: isMobile ? 3 : 5 };
  const count = getParticleCount(width, height, profile.density, profile.min, profile.max, reducedMotion);
  const [minScale, maxScale] = getSkyBirdScaleRange(width);

  return Array.from({ length: count }, () => ({
    x: random(-width * 0.18, width * 1.05),
    y: random(height * 0.16, height * 0.46),
    scale: random(minScale, maxScale),
    speed: random(8, 20) * (reducedMotion ? 0.28 : 1),
    phase: random(0, Math.PI * 2),
    alpha: random(0.12, 0.22),
    wingOffset: random(0.18, 0.5),
  }));
}

export function createSunMotes(width: number, height: number, reducedMotion: boolean): SunMote[] {
  const count = getParticleCount(width, height, 0.000025, 22, 42, reducedMotion);

  return Array.from({ length: count }, (_, index) => ({
    x: random(width * 0.12, width * 1.02),
    y: random(-height * 0.06, height * 0.82),
    size: random(0.6, 1.7),
    speed: random(4, 14) * (reducedMotion ? 0.32 : 1),
    drift: random(4, 14),
    phase: random(0, Math.PI * 2),
    alpha: random(0.06, 0.18),
    warm: index % 4 === 0,
  }));
}

export function drawSunlight(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  reducedMotion: boolean,
  strength = 1,
) {
  const radius = clamp(Math.max(width, height) * 0.42, 260, 620);
  const x = width * 0.92;
  const y = -height * 0.08;
  const pulse = reducedMotion ? 0.5 : (Math.sin(time * 0.55) + 1) * 0.5;
  const glowScale = 0.92 + pulse * 0.08;
  const glowAlpha = (0.12 + pulse * 0.05) * strength;

  ctx.save();
  const glow = ctx.createRadialGradient(x, y, radius * 0.08, x, y, radius * glowScale);
  glow.addColorStop(0, `rgba(255, 245, 190, ${glowAlpha})`);
  glow.addColorStop(0.34, `rgba(255, 230, 150, ${glowAlpha * 0.58})`);
  glow.addColorStop(0.68, `rgba(255, 255, 255, ${glowAlpha * 0.18})`);
  glow.addColorStop(1, 'rgba(255, 223, 128, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, radius * glowScale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawSunbeamWash(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  reducedMotion: boolean,
) {
  const sourceX = width * 1.04;
  const sourceY = -height * 0.1;
  const reach = Math.max(width, height);

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  for (let i = 0; i < 2; i += 1) {
    const baseAngle = i === 0 ? 2.32 : 2.5;
    const angleDrift = reducedMotion ? 0 : Math.sin(time * (0.08 + i * 0.035) + i * 1.4) * 0.035;
    const centerAngle = baseAngle + angleDrift;
    const nearWidth = i === 0 ? 0.055 : 0.068;
    const farWidth = i === 0 ? 0.3 : 0.24;
    const nearDistance = reach * (0.1 + i * 0.04);
    const farDistance = reach * (1.02 + i * 0.08);
    const controlDistance = reach * (0.52 + i * 0.08);
    const alpha = reducedMotion ? 0.028 : 0.042 + Math.sin(time * (0.1 + i * 0.03) + i) * 0.01;
    const nearA = centerAngle - nearWidth;
    const nearB = centerAngle + nearWidth;
    const farA = centerAngle - farWidth;
    const farB = centerAngle + farWidth;
    const nearAX = sourceX + Math.cos(nearA) * nearDistance;
    const nearAY = sourceY + Math.sin(nearA) * nearDistance;
    const nearBX = sourceX + Math.cos(nearB) * nearDistance;
    const nearBY = sourceY + Math.sin(nearB) * nearDistance;
    const farAX = sourceX + Math.cos(farA) * farDistance;
    const farAY = sourceY + Math.sin(farA) * farDistance;
    const farBX = sourceX + Math.cos(farB) * farDistance;
    const farBY = sourceY + Math.sin(farB) * farDistance;
    const controlAX = sourceX + Math.cos(centerAngle - farWidth * 0.64) * controlDistance;
    const controlAY = sourceY + Math.sin(centerAngle - farWidth * 0.64) * controlDistance;
    const controlBX = sourceX + Math.cos(centerAngle + farWidth * 0.64) * controlDistance;
    const controlBY = sourceY + Math.sin(centerAngle + farWidth * 0.64) * controlDistance;
    const midX = sourceX + Math.cos(centerAngle) * farDistance * 0.72;
    const midY = sourceY + Math.sin(centerAngle) * farDistance * 0.72;
    const gradient = ctx.createLinearGradient(sourceX, sourceY, midX, midY);

    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(0.2, `rgba(255, 255, 255, ${alpha * 0.32})`);
    gradient.addColorStop(0.52, `rgba(255, 248, 220, ${alpha})`);
    gradient.addColorStop(0.84, `rgba(255, 255, 255, ${alpha * 0.2})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(nearAX, nearAY);
    ctx.bezierCurveTo(
      controlAX,
      controlAY,
      sourceX + Math.cos(farA) * farDistance * 0.82,
      sourceY + Math.sin(farA) * farDistance * 0.82,
      farAX,
      farAY,
    );
    ctx.quadraticCurveTo(midX, midY, farBX, farBY);
    ctx.bezierCurveTo(
      sourceX + Math.cos(farB) * farDistance * 0.82,
      sourceY + Math.sin(farB) * farDistance * 0.82,
      controlBX,
      controlBY,
      nearBX,
      nearBY,
    );
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

export function drawLightStreaks(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, reducedMotion: boolean) {
  const sourceX = width * 1.04;
  const sourceY = -height * 0.1;
  const length = Math.max(width, height) * 0.78;
  const drift = reducedMotion ? 0 : Math.sin(time * 0.22) * 18;

  ctx.save();
  ctx.lineWidth = clamp(width * 0.002, 1.1, 2.6);
  ctx.lineCap = 'round';

  for (let i = 0; i < 3; i += 1) {
    const angle = 2.38 + (i - 1) * 0.08;
    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);
    const startDistance = Math.max(width, height) * (0.06 + i * 0.05) + drift;
    const startX = sourceX + dirX * startDistance;
    const startY = sourceY + dirY * startDistance;
    const endX = startX + dirX * length;
    const endY = startY + dirY * length;
    const shimmer = reducedMotion ? 1 : 0.72 + Math.sin(time * 0.82 + i * 1.7) * 0.28;
    const alpha = (reducedMotion ? 0.045 : 0.095) * shimmer;
    const highlightAlpha = reducedMotion ? alpha : alpha * (0.85 + Math.sin(time * 1.05 + i * 2.1) * 0.15);
    const gradient = ctx.createLinearGradient(startX, startY, endX, endY);

    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.7})`);
    gradient.addColorStop(0.16, `rgba(255, 255, 255, ${alpha})`);
    gradient.addColorStop(0.34, `rgba(255, 255, 255, ${highlightAlpha})`);
    gradient.addColorStop(0.72, `rgba(255, 255, 255, ${alpha * 0.18})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.strokeStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    if (!reducedMotion) {
      const glintProgress = 0.22 + i * 0.18 + Math.sin(time * 0.42 + i * 1.3) * 0.035;
      const glintLength = length * 0.07;
      const glintStartX = startX + dirX * length * glintProgress;
      const glintStartY = startY + dirY * length * glintProgress;
      const glintEndX = glintStartX + dirX * glintLength;
      const glintEndY = glintStartY + dirY * glintLength;
      const glintAlpha = 0.085 + Math.sin(time * 1.6 + i * 2.4) * 0.024;

      ctx.lineWidth = clamp(width * 0.0024, 1.4, 3);
      ctx.strokeStyle = `rgba(255, 255, 255, ${glintAlpha})`;
      ctx.beginPath();
      ctx.moveTo(glintStartX, glintStartY);
      ctx.lineTo(glintEndX, glintEndY);
      ctx.stroke();
      ctx.lineWidth = clamp(width * 0.002, 1.1, 2.6);
    }
  }

  ctx.restore();
}

function updateSunMotes(scene: SceneState, time: number, dt: number) {
  scene.sunMotes.forEach((mote) => {
    mote.x -= mote.speed * 0.18 * dt;
    mote.y += mote.speed * dt;
    mote.x += Math.sin(time * 0.32 + mote.phase) * mote.drift * dt;

    if (mote.y > scene.height + 18 || mote.x < -18) {
      mote.x = random(scene.width * 0.42, scene.width * 1.05);
      mote.y = random(-scene.height * 0.12, scene.height * 0.24);
      mote.size = random(0.6, 1.7);
      mote.speed = random(4, 14) * (scene.reducedMotion ? 0.32 : 1);
      mote.alpha = random(0.06, 0.18);
    }
  });
}

export function drawSunMotes(ctx: CanvasRenderingContext2D, scene: SceneState, time: number, dt: number) {
  updateSunMotes(scene, time, dt);

  scene.sunMotes.forEach((mote) => {
    const twinkle = scene.reducedMotion ? 0.55 : (Math.sin(time * 0.9 + mote.phase) + 1) * 0.5;
    const alpha = mote.alpha * (0.55 + twinkle * 0.45);
    const color = mote.warm ? `255, 244, 214` : `255, 255, 255`;

    ctx.fillStyle = `rgba(${color}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
    ctx.fill();

    if (mote.size > 1.25) {
      ctx.strokeStyle = `rgba(${color}, ${alpha * 0.32})`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.arc(mote.x, mote.y, mote.size * 2.2, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
}

function updateSkyBirds(scene: SceneState, dt: number) {
  const [minScale, maxScale] = getSkyBirdScaleRange(scene.width);

  scene.skyBirds.forEach((bird) => {
    bird.x += bird.speed * dt;

    if (bird.x > scene.width + 36 * bird.scale) {
      bird.x = random(-scene.width * 0.18, -24);
      bird.y = random(scene.height * 0.16, scene.height * 0.46);
      bird.scale = random(minScale, maxScale);
      bird.speed = random(8, 20) * (scene.reducedMotion ? 0.28 : 1);
      bird.phase = random(0, Math.PI * 2);
      bird.alpha = random(0.12, 0.22);
      bird.wingOffset = random(0.18, 0.5);
    }
  });
}

export function drawSkyBirds(ctx: CanvasRenderingContext2D, scene: SceneState, time: number, dt: number) {
  if (scene.skyBirds.length === 0) return;

  updateSkyBirds(scene, dt);

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  scene.skyBirds.forEach((bird) => {
    const idleLift = Math.sin(time * 0.35 + bird.phase) * bird.scale * 1.2;
    const flap = scene.reducedMotion ? 0 : Math.sin(time * 1.7 + bird.phase) * bird.wingOffset;
    const bodyY = bird.y + idleLift;
    const halfWidth = 5.8 * bird.scale;
    const wingHeight = (1.35 + flap) * bird.scale;
    const centerGap = 0.8 * bird.scale;
    const alpha = scene.kind === 'cloudy-day' ? bird.alpha * 0.78 : bird.alpha;

    ctx.strokeStyle = `rgba(30, 41, 59, ${alpha})`;
    ctx.lineWidth = clamp(0.95 * bird.scale, 0.65, 1.25);
    ctx.beginPath();
    ctx.moveTo(bird.x - halfWidth, bodyY);
    ctx.quadraticCurveTo(
      bird.x - halfWidth * 0.48,
      bodyY - wingHeight,
      bird.x - centerGap,
      bodyY - wingHeight * 0.12,
    );
    ctx.moveTo(bird.x + centerGap, bodyY - wingHeight * 0.12);
    ctx.quadraticCurveTo(bird.x + halfWidth * 0.48, bodyY - wingHeight, bird.x + halfWidth, bodyY);
    ctx.stroke();
  });

  ctx.restore();
}

export function getMoonMetrics(width: number, height: number) {
  const radius = clamp(Math.min(width, height) * 0.045, 24, 48);
  const x = width * 0.74;
  const y = height * 0.17;

  return { x, y, radius };
}

export function drawMoon(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const { x, y, radius } = getMoonMetrics(width, height);

  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.8);
  glow.addColorStop(0, 'rgba(238, 242, 255, 0.18)');
  glow.addColorStop(1, 'rgba(238, 242, 255, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, radius * 2.8, 0, Math.PI * 2);
  ctx.fill();

  const surface = ctx.createRadialGradient(x - radius * 0.32, y - radius * 0.34, 0, x, y, radius);
  surface.addColorStop(0, 'rgba(255, 255, 255, 0.82)');
  surface.addColorStop(0.58, 'rgba(226, 232, 240, 0.72)');
  surface.addColorStop(1, 'rgba(203, 213, 225, 0.52)');
  ctx.fillStyle = surface;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = clamp(radius * 0.04, 1, 2);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

export function drawStars(
  ctx: CanvasRenderingContext2D,
  stars: Star[],
  time: number,
  exclusion?: { x: number; y: number; radius: number },
) {
  stars.forEach((star) => {
    if (exclusion) {
      const dx = star.x - exclusion.x;
      const dy = star.y - exclusion.y;
      const minDistance = exclusion.radius * 1.1 + star.size * 2.4;

      if (dx * dx + dy * dy < minDistance * minDistance) return;
    }

    const twinkle = (Math.sin(time * star.speed + star.phase) + 1) * 0.5;
    const alpha = star.alpha * (0.35 + twinkle * 0.65);

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();

    if (star.size > 1.7) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.45})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(star.x - star.size * 2.2, star.y);
      ctx.lineTo(star.x + star.size * 2.2, star.y);
      ctx.moveTo(star.x, star.y - star.size * 2.2);
      ctx.lineTo(star.x, star.y + star.size * 2.2);
      ctx.stroke();
    }
  });
}
