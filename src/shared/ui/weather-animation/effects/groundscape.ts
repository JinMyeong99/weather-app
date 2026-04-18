import type { GroundscapeDecor, GroundscapeItem, GroundWindow, SceneState, WeatherKind } from '../types';
import { isFogKind, isNightKind, isOvercastKind, isRainKind, isShowerKind, isSnowKind, isThunderKind } from '../profiles';
import { clamp, getParticleCount, random } from '../utils';

function createGroundWindows(type: GroundscapeItem['type'], itemWidth: number, itemHeight: number): GroundWindow[] {
  if (type === 'house') {
    const windowCount = itemWidth > 54 ? 2 : 1;
    const houseWindowY = random(0.58, 0.62);
    const houseWindowHeight = random(0.18, 0.21);
    const houseWindowWidth = random(0.16, 0.2);

    return Array.from({ length: windowCount }, (_, index) => ({
      x: windowCount === 1 ? 0.5 : 0.32 + index * 0.36,
      y: houseWindowY,
      width: houseWindowWidth,
      height: houseWindowHeight,
      lit: Math.random() < 0.64,
      phase: random(0, Math.PI * 2),
      shape: 'house',
      pane: Math.random() < 0.72 ? 'split' : 'single',
    }));
  }

  const columns = clamp(Math.floor(itemWidth / 16), 2, 5);
  const rows = clamp(Math.floor(itemHeight / 19), 2, 6);
  const windows: GroundWindow[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if (Math.random() < 0.34) continue;

      windows.push({
        x: 0.17 + column * (0.66 / Math.max(1, columns - 1)),
        y: 0.18 + row * (0.62 / Math.max(1, rows - 1)),
        width: random(0.042, 0.066),
        height: random(0.07, 0.102),
        lit: Math.random() < 0.38,
        phase: random(0, Math.PI * 2),
        shape: 'building',
        pane: 'single',
      });
    }
  }

  return windows;
}

export function createGroundscape(width: number, height: number): GroundscapeItem[] {
  const count = getParticleCount(width, height, 0.000012, 12, 22, false);
  const isMobile = width < 640;
  const maxHeight = clamp(height * (isMobile ? 0.12 : 0.16), isMobile ? 52 : 76, isMobile ? 96 : 150);
  const bandWidth = width * 1.12;
  const startX = -width * 0.06;
  const slotWidth = bandWidth / count;

  return Array.from({ length: count }, (_, index) => {
    const type: GroundscapeItem['type'] = Math.random() < 0.42 ? 'house' : 'building';
    const itemWidth = clamp(
      random(slotWidth * 0.55, slotWidth * 1.16),
      type === 'house' ? 34 : 48,
      type === 'house' ? 76 : 124,
    );
    const itemHeight = random(
      maxHeight * (type === 'house' ? 0.3 : 0.52),
      maxHeight * (type === 'house' ? 0.58 : 1),
    );
    const roofType: GroundscapeItem['roofType'] = type === 'house'
      ? 'gable'
      : Math.random() < 0.16
        ? 'antenna'
        : 'flat';

    return {
      x: startX + slotWidth * index + random(slotWidth * 0.08, slotWidth * 0.58),
      width: itemWidth,
      height: itemHeight,
      type,
      roofType,
      windowSeed: random(0, Math.PI * 2),
      windows: createGroundWindows(type, itemWidth, itemHeight),
    };
  });
}

function getGroundscapeGaps(width: number, groundscape: GroundscapeItem[]) {
  const sorted = [...groundscape].sort((a, b) => a.x - b.x);
  const gaps: Array<{ start: number; end: number }> = [];
  let cursor = -width * 0.04;

  sorted.forEach((item) => {
    const gapStart = cursor;
    const gapEnd = item.x;

    if (gapEnd - gapStart > 30) {
      gaps.push({ start: gapStart, end: gapEnd });
    }

    cursor = Math.max(cursor, item.x + item.width);
  });

  if (width * 1.04 - cursor > 30) {
    gaps.push({ start: cursor, end: width * 1.04 });
  }

  return gaps;
}

export function createGroundDecor(width: number, height: number, groundscape: GroundscapeItem[]): GroundscapeDecor[] {
  const count = getParticleCount(width, height, 0.0000045, 5, 10, false);
  const isMobile = width < 640;
  const gaps = getGroundscapeGaps(width, groundscape);
  const bandWidth = width * 1.08;
  const startX = -width * 0.04;
  const slotWidth = bandWidth / count;
  const maxTreeHeight = clamp(height * (isMobile ? 0.075 : 0.095), isMobile ? 28 : 36, isMobile ? 54 : 78);
  const maxLightHeight = clamp(height * (isMobile ? 0.07 : 0.09), isMobile ? 26 : 34, isMobile ? 50 : 70);

  return Array.from({ length: count }, (_, index) => {
    const depth: GroundscapeDecor['depth'] = Math.random() < 0.68 ? 'back' : 'front';
    const type: GroundscapeDecor['type'] = Math.random() < (depth === 'front' ? 0.48 : 0.84) ? 'tree' : 'streetlight';
    const decorHeight = type === 'tree'
      ? random(maxTreeHeight * (depth === 'front' ? 0.45 : 0.58), maxTreeHeight * (depth === 'front' ? 0.78 : 1))
      : random(maxLightHeight * 0.68, maxLightHeight);
    const decorWidth = type === 'tree'
      ? random(decorHeight * 0.44, decorHeight * 0.72)
      : random(8, 13);
    const gap = gaps.length > 0 ? gaps[index % gaps.length] : null;
    const gapSpace = gap ? gap.end - gap.start - decorWidth : 0;
    const x = gap && gapSpace > 0
      ? gap.start + gapSpace * random(depth === 'front' ? 0.28 : 0.16, depth === 'front' ? 0.72 : 0.84)
      : startX + slotWidth * index + random(slotWidth * 0.12, slotWidth * 0.74);

    return {
      x,
      width: decorWidth,
      height: decorHeight,
      type,
      depth,
      phase: random(0, Math.PI * 2),
      lit: type === 'streetlight' && Math.random() < 0.78,
    };
  });
}

function getGroundscapeStyle(kind: WeatherKind) {
  if (isSnowKind(kind)) {
    return isNightKind(kind)
      ? { rgb: '15, 23, 42', alpha: 0.4, windowAlpha: 0.48 }
      : { rgb: '100, 116, 139', alpha: 0.14, windowAlpha: 0 };
  }

  if (isThunderKind(kind)) {
    return isNightKind(kind)
      ? { rgb: '15, 23, 42', alpha: 0.54, windowAlpha: 0.5 }
      : { rgb: '15, 23, 42', alpha: 0.5, windowAlpha: 0.36 };
  }

  if (isNightKind(kind)) {
    return { rgb: '15, 23, 42', alpha: 0.44, windowAlpha: 0.56 };
  }

  if (isRainKind(kind) || isShowerKind(kind) || isOvercastKind(kind)) {
    return { rgb: '15, 23, 42', alpha: 0.36, windowAlpha: 0.26 };
  }

  if (isFogKind(kind)) {
    return { rgb: '15, 23, 42', alpha: 0.2, windowAlpha: 0.14 };
  }

  return { rgb: '100, 116, 139', alpha: 0.16, windowAlpha: 0 };
}

function shouldShowStreetlights(kind: WeatherKind) {
  return isNightKind(kind)
    || isRainKind(kind)
    || isShowerKind(kind)
    || isThunderKind(kind)
    || isFogKind(kind);
}

function drawGroundDecor(
  ctx: CanvasRenderingContext2D,
  scene: SceneState,
  baseY: number,
  style: ReturnType<typeof getGroundscapeStyle>,
  time: number,
  isSnow: boolean,
  snowLineWidth: number,
  depth: GroundscapeDecor['depth'],
) {
  const showStreetlights = shouldShowStreetlights(scene.kind);
  const decorFill = `rgba(${style.rgb}, ${style.alpha * (depth === 'back' ? 0.46 : 0.7)})`;

  scene.groundDecor.forEach((decor) => {
    if (decor.depth !== depth) return;

    const centerX = decor.x + decor.width * 0.5;
    const topY = baseY - decor.height;

    ctx.save();
    ctx.fillStyle = decorFill;
    ctx.strokeStyle = decorFill;
    ctx.lineCap = 'round';

    if (decor.type === 'tree') {
      const trunkWidth = clamp(decor.width * 0.16, 2, 4);
      const trunkHeight = decor.height * 0.44;
      const canopyY = topY + decor.height * 0.33;

      ctx.fillRect(centerX - trunkWidth * 0.5, baseY - trunkHeight, trunkWidth, trunkHeight);
      ctx.beginPath();
      ctx.ellipse(centerX, canopyY, decor.width * 0.48, decor.height * 0.28, 0, 0, Math.PI * 2);
      ctx.ellipse(centerX - decor.width * 0.22, canopyY + decor.height * 0.08, decor.width * 0.34, decor.height * 0.24, 0, 0, Math.PI * 2);
      ctx.ellipse(centerX + decor.width * 0.22, canopyY + decor.height * 0.08, decor.width * 0.34, decor.height * 0.24, 0, 0, Math.PI * 2);
      ctx.fill();

      if (isSnow) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.34)';
        ctx.lineWidth = snowLineWidth * 0.82;
        ctx.beginPath();
        ctx.moveTo(centerX - decor.width * 0.32, canopyY - decor.height * 0.1);
        ctx.quadraticCurveTo(centerX, canopyY - decor.height * 0.24, centerX + decor.width * 0.32, canopyY - decor.height * 0.1);
        ctx.stroke();
      }
    } else {
      ctx.lineWidth = clamp(decor.width * 0.14, 1.2, 2);
      ctx.beginPath();
      ctx.moveTo(centerX, baseY);
      ctx.lineTo(centerX, topY + decor.height * 0.18);
      ctx.lineTo(centerX + decor.width * 0.36, topY + decor.height * 0.18);
      ctx.stroke();

      if (depth === 'front' && showStreetlights && decor.lit) {
        const flicker = scene.reducedMotion ? 1 : 0.9 + Math.sin(time * 0.24 + decor.phase) * 0.1;
        const lampX = centerX + decor.width * 0.4;
        const lampY = topY + decor.height * 0.18;
        const glowAlpha = clamp(style.windowAlpha * 0.42 * flicker, 0.06, 0.24);
        const glow = ctx.createRadialGradient(lampX, lampY, 0, lampX, lampY, decor.height * 0.36);

        glow.addColorStop(0, `rgba(253, 224, 71, ${glowAlpha})`);
        glow.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(lampX, lampY, decor.height * 0.36, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(253, 224, 71, ${clamp(style.windowAlpha * 0.75, 0.12, 0.42)})`;
        ctx.beginPath();
        ctx.arc(lampX, lampY, clamp(decor.width * 0.22, 2, 3.4), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  });
}

function drawGroundWindows(
  ctx: CanvasRenderingContext2D,
  item: GroundscapeItem,
  topY: number,
  windowAlpha: number,
  time: number,
  reducedMotion: boolean,
) {
  if (windowAlpha <= 0) return;

  item.windows.forEach((window) => {
    if (!window.lit) return;

    const flicker = reducedMotion ? 1 : 0.88 + Math.sin(time * 0.28 + window.phase + item.windowSeed) * 0.12;
    const width = window.shape === 'house'
      ? clamp(item.width * window.width, 5.2, 12)
      : clamp(item.width * window.width, 1.8, 4.2);
    const height = window.shape === 'house'
      ? clamp(item.height * window.height, 5.2, 11)
      : clamp(item.height * window.height, 2.2, 5.6);
    const x = item.x + item.width * window.x - width * 0.5;
    const y = topY + item.height * window.y - height * 0.5;
    const alpha = window.shape === 'house'
      ? windowAlpha * 1.08 * flicker
      : windowAlpha * 0.78 * flicker;

    ctx.fillStyle = `rgba(253, 224, 71, ${alpha})`;
    ctx.fillRect(x, y, width, height);

    if (window.shape === 'house' && window.pane === 'split') {
      ctx.strokeStyle = `rgba(15, 23, 42, ${clamp(windowAlpha * 0.28, 0.04, 0.18)})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(x + width * 0.5, y + 1);
      ctx.lineTo(x + width * 0.5, y + height - 1);
      ctx.moveTo(x + 1, y + height * 0.5);
      ctx.lineTo(x + width - 1, y + height * 0.5);
      ctx.stroke();
    }
  });
}

function drawGroundscapeItem(
  ctx: CanvasRenderingContext2D,
  item: GroundscapeItem,
  baseY: number,
  fillStyle: string,
  windowAlpha: number,
  time: number,
  reducedMotion: boolean,
  isSnow: boolean,
  snowLineWidth: number,
) {
  const topY = baseY - item.height;

  ctx.fillStyle = fillStyle;

  if (item.type === 'house') {
    const roofHeight = item.height * 0.3;
    const bodyTop = topY + roofHeight;
    const bodyX = item.x + item.width * 0.1;
    const bodyWidth = item.width * 0.8;

    ctx.fillRect(bodyX, bodyTop, bodyWidth, baseY - bodyTop);
    ctx.beginPath();
    ctx.moveTo(item.x, bodyTop);
    ctx.lineTo(item.x + item.width * 0.5, topY);
    ctx.lineTo(item.x + item.width, bodyTop);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillRect(item.x, topY, item.width, item.height);

    if (item.roofType === 'antenna') {
      ctx.strokeStyle = fillStyle;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(item.x + item.width * 0.55, topY);
      ctx.lineTo(item.x + item.width * 0.55, topY - item.height * 0.18);
      ctx.stroke();
    }
  }

  if (isSnow) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.46)';
    ctx.lineWidth = snowLineWidth;
    ctx.lineCap = 'round';

    if (item.type === 'house') {
      const roofHeight = item.height * 0.3;
      const bodyTop = topY + roofHeight;
      const peakX = item.x + item.width * 0.5;

      ctx.beginPath();
      ctx.moveTo(item.x + 2, bodyTop);
      ctx.lineTo(peakX, topY + 1);
      ctx.lineTo(item.x + item.width - 2, bodyTop);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(item.x + 3, topY + 0.5);
      ctx.lineTo(item.x + item.width - 3, topY + 0.5);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawGroundWindows(ctx, item, topY, windowAlpha, time, reducedMotion);
}

export function drawGroundscape(ctx: CanvasRenderingContext2D, scene: SceneState, time: number) {
  const style = getGroundscapeStyle(scene.kind);
  const isSnow = isSnowKind(scene.kind);
  const snowLineWidth = clamp(scene.width * 0.002, 1.2, 2.6);
  const groundBaseY = scene.height;
  const buildingBaseY = scene.height - clamp(scene.height * 0.025, 12, 24);
  const hillHeight = clamp(scene.height * 0.045, 22, 52);

  ctx.save();
  ctx.fillStyle = `rgba(${style.rgb}, ${style.alpha * 0.22})`;
  ctx.beginPath();
  ctx.moveTo(0, groundBaseY);
  ctx.lineTo(0, groundBaseY - hillHeight * 0.5);
  ctx.bezierCurveTo(
    scene.width * 0.22,
    groundBaseY - hillHeight * 0.88,
    scene.width * 0.52,
    groundBaseY - hillHeight * 0.32,
    scene.width,
    groundBaseY - hillHeight * 0.66,
  );
  ctx.lineTo(scene.width, groundBaseY);
  ctx.closePath();
  ctx.fill();

  drawGroundDecor(ctx, scene, buildingBaseY, style, time, isSnow, snowLineWidth, 'back');

  scene.groundscape.forEach((item, index) => {
    const depth = 0.82 + (index % 4) * 0.04;
    const fillStyle = `rgba(${style.rgb}, ${style.alpha * depth})`;
    drawGroundscapeItem(ctx, item, buildingBaseY, fillStyle, style.windowAlpha, time, scene.reducedMotion, isSnow, snowLineWidth);
  });

  drawGroundDecor(ctx, scene, buildingBaseY, style, time, isSnow, snowLineWidth, 'front');

  ctx.fillStyle = isSnow ? 'rgba(255, 255, 255, 0.28)' : `rgba(${style.rgb}, ${style.alpha * 0.18})`;
  ctx.fillRect(0, buildingBaseY, scene.width, isSnow ? 2 : 1);
  ctx.restore();
}
