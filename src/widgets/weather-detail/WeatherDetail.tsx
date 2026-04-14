import type { WeatherData } from '../../shared/types';
import { getWeatherIcon } from '../../shared/lib/getWeatherIcon';

interface WeatherDetailProps {
  data: WeatherData;
}

function formatTime(unix: number): string {
  return new Date(unix * 1000).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function WeatherDetail({ data }: WeatherDetailProps) {
  const { current } = data;

  return (
    <div className="flex flex-col gap-3">
      {/* 기온 + 아이콘 */}
      <div className="flex items-center gap-3">
        <span className="text-6xl leading-none" role="img" aria-label={current.description}>
          {getWeatherIcon(current.icon)}
        </span>
        <div>
          <p className="text-5xl font-bold text-gray-800">{current.temp}°</p>
          <p className="mt-0.5 text-sm capitalize text-gray-500">{current.description}</p>
        </div>
      </div>

      {/* 최저/최고 · 체감 */}
      <div className="flex gap-3 text-sm text-gray-500">
        <span>최저 {current.tempMin}°</span>
        <span>최고 {current.tempMax}°</span>
        <span className="text-gray-400">·</span>
        <span>체감 {current.feelsLike}°</span>
      </div>

      {/* 습도 · 풍속 · 일출 · 일몰 */}
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-50 p-3 text-xs text-gray-500 sm:grid-cols-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-gray-400">습도</span>
          <span className="font-medium text-gray-700">{current.humidity}%</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-gray-400">풍속</span>
          <span className="font-medium text-gray-700">{current.windSpeed}m/s</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-gray-400">일출</span>
          <span className="font-medium text-gray-700">{formatTime(current.sunrise)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-gray-400">일몰</span>
          <span className="font-medium text-gray-700">{formatTime(current.sunset)}</span>
        </div>
      </div>
    </div>
  );
}
