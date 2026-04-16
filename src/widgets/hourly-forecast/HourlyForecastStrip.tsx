import { useMemo, useRef, useState, useEffect } from 'react';
import type { WeatherHourly } from '../../shared/types';
import { getWeatherIcon } from '../../shared/lib/getWeatherIcon';

interface HourlyForecastStripProps {
  hourly: WeatherHourly[];
}

const TARGET_ITEM_W = 64;
const GRAPH_H = 64;
const V_PAD = 20;
const TEXT_H = 16;

/** cubic bezier 부드러운 곡선 */
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    d += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

/** dt → 로컬 날짜 문자열 "YYYY-MM-DD" */
function toLocalDate(dt: number): string {
  const d = new Date(dt * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** 날짜 구분선 레이블: 내일 / 모레 / M/D */
function makeDateLabel(dt: number): string {
  const now = new Date();
  const d1 = new Date(now); d1.setDate(now.getDate() + 1);
  const d2 = new Date(now); d2.setDate(now.getDate() + 2);
  const target = toLocalDate(dt);
  if (target === toLocalDate(d1.getTime() / 1000)) return '내일';
  if (target === toLocalDate(d2.getTime() / 1000)) return '모레';
  const d = new Date(dt * 1000);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function HourlyForecastStrip({ hourly }: HourlyForecastStripProps) {
  const items = hourly;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [itemW, setItemW] = useState(TARGET_ITEM_W);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      if (w <= 0) return;
      const visibleColumns = Math.max(1, Math.floor(w / TARGET_ITEM_W));
      setItemW(w / visibleColumns);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const nowLabel = useMemo(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:00`;
  }, []);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [items, itemW]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'right' ? itemW * 4 : -itemW * 4,
      behavior: 'smooth',
    });
  };

  const temps = items.map((i) => i.temp);
  const minT = Math.min(...temps);
  const maxT = Math.max(...temps);
  const range = maxT - minT || 1;

  const svgW = items.length * itemW;
  const lineTop = V_PAD;
  const lineBottom = GRAPH_H - V_PAD;

  const getY = (t: number) =>
    lineBottom - ((t - minT) / range) * (lineBottom - lineTop);

  const points = items.map((item, i) => ({
    x: i * itemW + itemW / 2,
    y: getY(item.temp),
  }));

  // 날짜가 바뀌는 인덱스 목록
  const dateDividers = items.reduce<{ index: number; label: string }[]>((acc, item, i) => {
    if (i === 0) return acc;
    if (toLocalDate(item.dt) !== toLocalDate(items[i - 1].dt)) {
      acc.push({ index: i, label: makeDateLabel(item.dt) });
    }
    return acc;
  }, []);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-600">시간별 예보</h2>
        <div className="flex gap-1">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition
                       hover:bg-gray-200 disabled:opacity-25 disabled:cursor-not-allowed"
            aria-label="이전"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M6.5 1.5L3 5l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition
                       hover:bg-gray-200 disabled:opacity-25 disabled:cursor-not-allowed"
            aria-label="다음"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M3.5 1.5L7 5l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="relative">
        {/* 좌측 페이드 */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-linear-to-r from-white to-transparent transition-opacity duration-200"
          style={{ opacity: canScrollLeft ? 1 : 0 }}
        />
        {/* 우측 페이드 */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-4 bg-linear-to-l from-white to-transparent transition-opacity duration-200"
          style={{ opacity: canScrollRight ? 1 : 0 }}
        />

        <div ref={scrollRef} className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <div style={{ width: svgW }}>

            {/* 기온 곡선 그래프 */}
            <div style={{ paddingTop: TEXT_H, paddingBottom: 4 }}>
              <svg
                width={svgW}
                height={GRAPH_H}
                style={{ display: 'block', overflow: 'visible' }}
              >
                {/* 날짜 구분선 + 레이블 */}
                {dateDividers.map(({ index, label }) => {
                  const x = index * itemW;
                  return (
                    <g key={`divider-${index}`}>
                      {/* 점선 */}
                      <line
                        x1={x} y1={lineTop - 4}
                        x2={x} y2={lineBottom + 4}
                        stroke="#d1d5db"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />
                      {/* 날짜 레이블 — SVG overflow:visible 로 그래프 위 패딩 영역에 표시 */}
                      <text
                        x={x}
                        y={lineTop - 8}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#6b7280"
                        fontWeight="500"
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}

                {/* 온도 곡선 */}
                <path
                  d={smoothPath(points)}
                  fill="none"
                  stroke="#93c5fd"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 점 + 기온 텍스트 */}
                {points.map((pt, i) => (
                  <g key={items[i].dt}>
                    <circle cx={pt.x} cy={pt.y} r="3" fill="#3b82f6" />
                    <text
                      x={pt.x}
                      y={pt.y - 8}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="600"
                      fill="#1f2937"
                    >
                      {items[i].temp}°
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* 아이콘 · 강수확률 · 시간 */}
            <div className="flex">
              {items.map((item, i) => (
                <div
                  key={item.dt}
                  className="flex flex-col items-center gap-0.5 pb-1"
                  style={{ width: itemW }}
                >
                  <span className="text-xl leading-none">{getWeatherIcon(item.icon)}</span>
                  <span className="h-4 text-xs text-blue-400">
                    {item.pop > 0 ? `💧${Math.round(item.pop * 100)}%` : ''}
                  </span>
                  <span
                    className={`text-xs ${
                      i === 0 ? 'font-semibold text-blue-500' : 'text-gray-400'
                    }`}
                  >
                    {i === 0 ? nowLabel : item.time}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
