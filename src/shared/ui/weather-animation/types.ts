export type WeatherKind =
  | 'clear-day'
  | 'clear-night'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'cloudy-day'
  | 'cloudy-night'
  | 'overcast-day'
  | 'overcast-night'
  | 'rain-day'
  | 'rain-night'
  | 'shower-day'
  | 'shower-night'
  | 'thunder-day'
  | 'thunder-night'
  | 'snow-day'
  | 'snow-night'
  | 'fog-day'
  | 'fog-night';

export interface Cloud {
  x: number;
  y: number;
  scale: number;
  speed: number;
  alpha: number;
  shade: string;
}

export interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

export interface Splash {
  x: number;
  y: number;
  age: number;
  ttl: number;
  size: number;
}

export interface SnowFlake {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  phase: number;
  rotation: number;
  spin: number;
  opacity: number;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
  alpha: number;
}

export interface SkyBird {
  x: number;
  y: number;
  scale: number;
  speed: number;
  phase: number;
  alpha: number;
  wingOffset: number;
}

export interface SunMote {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  phase: number;
  alpha: number;
  warm: boolean;
}

export interface FogBlob {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  alpha: number;
  phase: number;
}

export interface LightningState {
  activeUntil: number;
  flashUntil: number;
  nextAt: number;
  path: Array<{ x: number; y: number }>;
}

export interface GroundWindow {
  x: number;
  y: number;
  width: number;
  height: number;
  lit: boolean;
  phase: number;
  shape: 'building' | 'house';
  pane?: 'single' | 'split';
}

export interface GroundscapeItem {
  x: number;
  width: number;
  height: number;
  type: 'building' | 'house';
  roofType: 'flat' | 'gable' | 'antenna';
  windowSeed: number;
  windows: GroundWindow[];
}

export interface GroundscapeDecor {
  x: number;
  width: number;
  height: number;
  type: 'tree' | 'streetlight';
  depth: 'back' | 'front';
  phase: number;
  lit: boolean;
}

export interface RainProfile {
  density: number;
  length: [number, number];
  speed: [number, number];
  opacity: [number, number];
  splashProbability: number;
  maxSplashes: number;
}

export interface SceneState {
  kind: WeatherKind;
  width: number;
  height: number;
  dpr: number;
  reducedMotion: boolean;
  clouds: Cloud[];
  rainDrops: RainDrop[];
  splashes: Splash[];
  snowFlakes: SnowFlake[];
  stars: Star[];
  skyBirds: SkyBird[];
  sunMotes: SunMote[];
  fogBlobs: FogBlob[];
  groundscape: GroundscapeItem[];
  groundDecor: GroundscapeDecor[];
  lightning: LightningState;
}
