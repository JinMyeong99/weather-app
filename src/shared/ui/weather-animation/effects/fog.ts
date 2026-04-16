import type { FogBlob, SceneState } from '../types';
import { getParticleCount, random } from '../utils';

export function createFog(width: number, height: number, reducedMotion: boolean): FogBlob[] {
  const count = getParticleCount(width, height, 0.000012, 7, 16, reducedMotion);

  return Array.from({ length: count }, () => ({
    x: random(-width * 0.35, width),
    y: random(height * 0.28, height * 0.78),
    width: random(width * 0.32, width * 0.78),
    height: random(28, 74),
    speed: random(3, 10) * (reducedMotion ? 0.25 : 1),
    alpha: random(0.06, 0.15),
    phase: random(0, Math.PI * 2),
  }));
}

function updateFog(scene: SceneState, time: number, dt: number) {
  scene.fogBlobs.forEach((blob) => {
    blob.x += blob.speed * dt;
    blob.y += Math.sin(time * 0.2 + blob.phase) * 2 * dt;

    if (blob.x - blob.width > scene.width + 60) {
      blob.x = -blob.width - random(20, scene.width * 0.2);
      blob.y = random(scene.height * 0.28, scene.height * 0.78);
    }
  });
}

export function drawFog(ctx: CanvasRenderingContext2D, scene: SceneState, time: number, dt: number) {
  updateFog(scene, time, dt);

  scene.fogBlobs.forEach((blob) => {
    const alpha = blob.alpha * (0.85 + Math.sin(time * 0.35 + blob.phase) * 0.15);
    const gradient = ctx.createRadialGradient(
      blob.x,
      blob.y,
      blob.height * 0.1,
      blob.x,
      blob.y,
      blob.width * 0.58,
    );

    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(blob.x, blob.y, blob.width * 0.55, blob.height * 0.72, 0, 0, Math.PI * 2);
    ctx.fill();
  });
}
