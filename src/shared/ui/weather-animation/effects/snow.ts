import type { SceneState, SnowFlake } from '../types';
import { clamp, getParticleCount, random } from '../utils';

export function createSnow(width: number, height: number, reducedMotion: boolean): SnowFlake[] {
  const count = getParticleCount(width, height, 0.00007, 38, 120, reducedMotion);

  return Array.from({ length: count }, () => ({
    x: random(0, width),
    y: random(-height, height),
    size: random(2.5, 6),
    speed: random(24, 72) * (reducedMotion ? 0.45 : 1),
    drift: random(0.6, 1.6),
    phase: random(0, Math.PI * 2),
    rotation: random(0, Math.PI * 2),
    spin: random(-0.7, 0.7) * (reducedMotion ? 0.35 : 1),
    opacity: random(0.42, 0.85),
  }));
}

function updateSnow(scene: SceneState, time: number, dt: number) {
  scene.snowFlakes.forEach((flake) => {
    flake.y += flake.speed * dt;
    flake.x += Math.sin(time * flake.drift + flake.phase) * 14 * dt;
    flake.rotation += flake.spin * dt;

    if (flake.y > scene.height + 16) {
      flake.y = random(-80, -12);
      flake.x = random(0, scene.width);
    }

    if (flake.x < -20) flake.x = scene.width + 20;
    if (flake.x > scene.width + 20) flake.x = -20;
  });
}

export function drawSnow(ctx: CanvasRenderingContext2D, scene: SceneState, time: number, dt: number) {
  updateSnow(scene, time, dt);

  ctx.lineCap = 'round';

  scene.snowFlakes.forEach((flake) => {
    ctx.save();
    ctx.translate(flake.x, flake.y);
    ctx.rotate(flake.rotation);

    if (flake.size < 3.6) {
      ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity * 0.9})`;
      ctx.beginPath();
      ctx.arc(0, 0, flake.size * 0.42, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = `rgba(255, 255, 255, ${flake.opacity})`;
      ctx.lineWidth = clamp(flake.size * 0.18, 0.8, 1.3);

      if (flake.size < 4.8) {
        for (let i = 0; i < 3; i += 1) {
          ctx.rotate(Math.PI / 3);
          ctx.beginPath();
          ctx.moveTo(0, -flake.size * 0.75);
          ctx.lineTo(0, flake.size * 0.75);
          ctx.stroke();
        }
      } else {
        for (let i = 0; i < 6; i += 1) {
          ctx.rotate(Math.PI / 3);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, flake.size * 1.7);
          ctx.stroke();
        }
      }
    }

    ctx.restore();
  });
}
