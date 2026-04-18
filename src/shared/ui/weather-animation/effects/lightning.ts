import type { LightningState, SceneState } from '../types';
import { isThunderKind } from '../profiles';
import { clamp, random } from '../utils';

export function createLightning(now: number, reducedMotion: boolean): LightningState {
  return {
    activeUntil: 0,
    flashUntil: 0,
    nextAt: now + random(reducedMotion ? 7 : 2.5, reducedMotion ? 14 : 6.5),
    path: [],
  };
}

function createLightningPath(width: number, height: number) {
  const path: Array<{ x: number; y: number }> = [];
  let x = random(width * 0.2, width * 0.8);
  let y = -10;
  const endY = random(height * 0.36, height * 0.68);

  path.push({ x, y });

  while (y < endY) {
    x = clamp(x + random(-52, 52), width * 0.08, width * 0.92);
    y += random(28, 58);
    path.push({ x, y });
  }

  return path;
}

function updateLightning(scene: SceneState, time: number) {
  if (!isThunderKind(scene.kind) || time < scene.lightning.nextAt) return;

  scene.lightning = {
    activeUntil: time + (scene.reducedMotion ? 0.08 : 0.16),
    flashUntil: time + (scene.reducedMotion ? 0.025 : 0.07),
    nextAt: time + random(scene.reducedMotion ? 8 : 3, scene.reducedMotion ? 15 : 7),
    path: createLightningPath(scene.width, scene.height),
  };
}

export function drawLightning(ctx: CanvasRenderingContext2D, scene: SceneState, time: number) {
  updateLightning(scene, time);

  if (time >= scene.lightning.activeUntil || scene.lightning.path.length < 2) return;

  if (time < scene.lightning.flashUntil && !scene.reducedMotion) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.fillRect(0, 0, scene.width, scene.height);
  }

  ctx.save();
  ctx.shadowColor = 'rgba(253, 224, 71, 0.95)';
  ctx.shadowBlur = 18;
  ctx.strokeStyle = 'rgba(255, 255, 240, 0.95)';
  ctx.lineWidth = 2.8;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  scene.lightning.path.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(147, 197, 253, 0.55)';
  ctx.lineWidth = 5.5;
  ctx.stroke();
  ctx.restore();
}
