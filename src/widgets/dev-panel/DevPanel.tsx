import { useState } from 'react';
import { useDevWeather } from '../../shared/lib/useDevWeather';
import { getWeatherIcon } from '../../shared/lib/getWeatherIcon';

const PRESETS = [
  { icon: '01d', label: '맑음 낮' },
  { icon: '01n', label: '맑음 밤' },
  { icon: '02d', label: '구름조금 낮' },
  { icon: '02n', label: '구름조금 밤' },
  { icon: '03d', label: '구름많음' },
  { icon: '03n', label: '구름많음 밤' },
  { icon: '04d', label: '흐림' },
  { icon: '09d', label: '소나기' },
  { icon: '10d', label: '비' },
  { icon: '11d', label: '뇌우' },
  { icon: '13d', label: '눈' },
  { icon: '50d', label: '안개' },
] as const;

export function DevPanel() {
  const { mockIcon, setMockIcon } = useDevWeather();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {isOpen ? (
        <div className="rounded-2xl border border-white/10 bg-gray-900/95 p-4 shadow-2xl backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between gap-8">
            <span className="text-xs font-semibold tracking-widest text-gray-400">🛠 배경 테스트</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-500 hover:text-white"
            >
              닫기 ✕
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {/* 실제 날씨 리셋 */}
            <button
              onClick={() => setMockIcon(null)}
              className={`col-span-4 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                mockIcon === null
                  ? 'bg-white text-gray-900'
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
              }`}
            >
              실제 날씨
            </button>

            {PRESETS.map((p) => (
              <button
                key={p.icon}
                onClick={() => setMockIcon(p.icon)}
                className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs transition-colors ${
                  mockIcon === p.icon
                    ? 'bg-white text-gray-900'
                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                }`}
              >
                <span className="text-lg leading-none">{getWeatherIcon(p.icon)}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full border border-white/10 bg-gray-900/90 px-4 py-2 text-xs font-medium text-white/70 shadow-lg backdrop-blur-sm hover:text-white"
        >
          🛠 {mockIcon ? `테스트 중: ${PRESETS.find((p) => p.icon === mockIcon)?.label}` : '배경 테스트'}
        </button>
      )}
    </div>
  );
}
