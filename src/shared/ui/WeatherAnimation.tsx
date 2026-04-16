import { useEffect, useRef } from 'react';
import {
  createScene,
  drawScene,
  getWeatherKind,
  type SceneState,
} from './weather-animation/renderer';

interface WeatherAnimationProps {
  icon: string;
}

export function WeatherAnimation({ icon }: WeatherAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<SceneState | null>(null);
  const kind = getWeatherKind(icon);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) return;

    let frameId = 0;
    let lastTime = performance.now();
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const now = performance.now() / 1000;

      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      sceneRef.current = createScene(kind, width, height, dpr, motionQuery.matches, now);
    };

    const tick = (nowMs: number) => {
      const scene = sceneRef.current;

      if (!scene) return;

      const dt = Math.min((nowMs - lastTime) / 1000, 0.05);
      lastTime = nowMs;
      context.setTransform(scene.dpr, 0, 0, scene.dpr, 0, 0);
      drawScene(context, scene, nowMs / 1000, dt);
      frameId = requestAnimationFrame(tick);
    };

    const handleReducedMotionChange = () => {
      resize();
    };

    resize();
    frameId = requestAnimationFrame(tick);
    window.addEventListener('resize', resize);
    motionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      motionQuery.removeEventListener('change', handleReducedMotionChange);
      sceneRef.current = null;
    };
  }, [kind]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
