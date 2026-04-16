import type { Cloud, SceneState, WeatherKind } from '../types';
import { getParticleCount, random } from '../utils';

function getCloudYRange(kind: WeatherKind, height: number): [number, number] {
  if (kind === 'partly-cloudy-day' || kind === 'partly-cloudy-night') {
    return [height * 0.07, height * 0.3];
  }

  if (kind === 'cloudy-day' || kind === 'cloudy-night') {
    return [height * 0.04, height * 0.42];
  }

  if (kind === 'overcast') {
    return [height * 0.02, height * 0.56];
  }

  if (kind === 'rain' || kind === 'shower') {
    return [height * 0.02, height * 0.3];
  }

  if (kind === 'thunder') {
    return [height * 0.02, height * 0.44];
  }

  return [height * 0.04, height * 0.52];
}

function getCloudLaneCount(kind: WeatherKind) {
  if (kind === 'partly-cloudy-day' || kind === 'partly-cloudy-night' || kind === 'rain' || kind === 'shower') {
    return 2;
  }

  return 3;
}

function getCloudDistributedPosition(
  index: number,
  count: number,
  width: number,
  height: number,
  kind: WeatherKind,
) {
  const [minY, maxY] = getCloudYRange(kind, height);
  const safeCount = Math.max(1, count);
  const cloudBandWidth = width * 1.5;
  const bandStartX = -width * 0.32;
  const columnWidth = cloudBandWidth / safeCount;
  const columnIndex = ((index % safeCount) + safeCount) % safeCount;
  const laneCount = getCloudLaneCount(kind);
  const laneIndex = ((index % laneCount) + laneCount) % laneCount;
  const laneHeight = (maxY - minY) / laneCount;
  const xJitterMin = kind === 'overcast' ? 0.05 : 0.16;
  const xJitterMax = kind === 'overcast' ? 0.95 : 0.84;
  const yJitterMin = kind === 'overcast' ? 0.08 : 0.18;
  const yJitterMax = kind === 'overcast' ? 0.92 : 0.82;

  return {
    x: bandStartX + columnWidth * columnIndex + random(columnWidth * xJitterMin, columnWidth * xJitterMax),
    y: minY + laneHeight * laneIndex + random(laneHeight * yJitterMin, laneHeight * yJitterMax),
  };
}

function areCloudsTooClose(candidate: Cloud, clouds: Cloud[], kind: WeatherKind) {
  const isOvercast = kind === 'overcast';
  const xFactor = isOvercast ? 0.36 : 0.48;
  const yFactor = isOvercast ? 0.42 : 0.58;

  return clouds.some((cloud) => {
    const averageWidth = ((170 * candidate.scale) + (170 * cloud.scale)) * 0.5;
    const averageHeight = ((58 * candidate.scale) + (58 * cloud.scale)) * 0.5;

    return Math.abs(candidate.x - cloud.x) < averageWidth * xFactor
      && Math.abs(candidate.y - cloud.y) < averageHeight * yFactor;
  });
}

export function createClouds(
  width: number,
  height: number,
  kind: WeatherKind,
  reducedMotion: boolean,
): Cloud[] {
  const isPartly = kind === 'partly-cloudy-day' || kind === 'partly-cloudy-night';
  const isCloudy = kind === 'cloudy-day' || kind === 'cloudy-night';
  const isOvercast = kind === 'overcast';
  const isThunder = kind === 'thunder';
  const isRainCloud = kind === 'rain' || kind === 'shower';
  const count = isRainCloud
    ? getParticleCount(width, height, kind === 'shower' ? 0.000007 : 0.000005, kind === 'shower' ? 4 : 3, kind === 'shower' ? 6 : 5, reducedMotion)
    : isPartly
      ? getParticleCount(width, height, 0.000006, 4, 6, reducedMotion)
      : isCloudy
        ? getParticleCount(width, height, 0.000009, 10, 16, reducedMotion)
        : isOvercast
          ? getParticleCount(width, height, 0.000021, 14, 22, reducedMotion)
          : getParticleCount(width, height, 0.000015, 7, 14, reducedMotion);

  const createCloud = (index: number): Cloud => {
    const position = getCloudDistributedPosition(index, count, width, height, kind);
    const scale = isRainCloud
      ? random(kind === 'shower' ? 0.75 : 0.65, kind === 'shower' ? 1.35 : 1.2)
      : isCloudy
        ? random(0.75, 1.35)
        : isOvercast
          ? random(1.12, 2)
          : random(isPartly ? 0.55 : 0.85, isPartly ? 1.15 : 1.75);
    const speedBase = isRainCloud
      ? random(3, 7)
      : isCloudy
        ? random(5, 12)
        : isOvercast
          ? random(2.2, 5.4)
          : isThunder
            ? random(3, 8)
            : random(5, 14);

    return {
      x: position.x,
      y: position.y,
      scale,
      speed: speedBase * (reducedMotion ? 0.25 : 1),
      alpha: isRainCloud
        ? random(kind === 'shower' ? 0.2 : 0.16, kind === 'shower' ? 0.36 : 0.3)
        : isPartly
          ? random(0.2, 0.38)
          : isCloudy
            ? random(0.2, 0.38)
          : isOvercast
            ? random(0.35, 0.6)
          : random(0.24, 0.5),
      shade: index % 3 === 0 ? '255,255,255' : '226,232,240',
    };
  };

  const clouds: Cloud[] = [];

  for (let index = 0; index < count; index += 1) {
    let cloud = createCloud(index);

    for (let attempt = 0; attempt < 9 && areCloudsTooClose(cloud, clouds, kind); attempt += 1) {
      const position = getCloudDistributedPosition(index + attempt + 1, count, width, height, kind);

      cloud = {
        ...cloud,
        x: position.x,
        y: position.y,
      };
    }

    clouds.push(cloud);
  }

  return clouds;
}

function drawCloud(ctx: CanvasRenderingContext2D, cloud: Cloud) {
  const width = 170 * cloud.scale;
  const height = 58 * cloud.scale;

  ctx.save();
  ctx.globalAlpha = cloud.alpha;
  ctx.fillStyle = `rgba(${cloud.shade}, 1)`;
  ctx.beginPath();
  ctx.ellipse(cloud.x, cloud.y + height * 0.15, width * 0.4, height * 0.42, 0, 0, Math.PI * 2);
  ctx.ellipse(cloud.x + width * 0.24, cloud.y, width * 0.28, height * 0.54, 0, 0, Math.PI * 2);
  ctx.ellipse(cloud.x + width * 0.5, cloud.y + height * 0.1, width * 0.36, height * 0.48, 0, 0, Math.PI * 2);
  ctx.ellipse(cloud.x + width * 0.76, cloud.y + height * 0.17, width * 0.32, height * 0.36, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function updateClouds(scene: SceneState, dt: number) {
  scene.clouds.forEach((cloud, index) => {
    const cloudWidth = 220 * cloud.scale;
    cloud.x += cloud.speed * dt;

    if (cloud.x - cloudWidth > scene.width + 80) {
      const otherClouds = scene.clouds.filter((otherCloud) => otherCloud !== cloud);

      for (let attempt = 0; attempt < 9; attempt += 1) {
        const position = getCloudDistributedPosition(index + attempt + 1, scene.clouds.length, scene.width, scene.height, scene.kind);

        cloud.x = -cloudWidth - random(40, scene.width * 0.18);
        cloud.y = position.y;

        if (!areCloudsTooClose(cloud, otherClouds, scene.kind)) break;
      }
    }
  });
}

export function drawClouds(ctx: CanvasRenderingContext2D, scene: SceneState, dt: number) {
  updateClouds(scene, dt);
  scene.clouds.forEach((cloud) => drawCloud(ctx, cloud));
}
