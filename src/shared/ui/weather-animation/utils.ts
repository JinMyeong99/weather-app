export function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getParticleCount(
  width: number,
  height: number,
  density: number,
  min: number,
  max: number,
  reducedMotion: boolean,
) {
  const count = clamp(Math.round(width * height * density), min, max);
  return reducedMotion ? Math.max(1, Math.round(count * 0.45)) : count;
}
