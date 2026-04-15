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

function getUviGrade(uvi: number): { label: string; color: string } {
  if (uvi <= 2) return { label: '낮음', color: 'text-blue-500' };
  if (uvi <= 5) return { label: '보통', color: 'text-green-500' };
  if (uvi <= 7) return { label: '높음', color: 'text-orange-500' };
  if (uvi <= 10) return { label: '매우높음', color: 'text-red-500' };
  return { label: '위험', color: 'text-purple-600' };
}

function getPm10Grade(pm10: number): { label: string; color: string } {
  if (pm10 <= 30) return { label: '좋음', color: 'text-blue-500' };
  if (pm10 <= 80) return { label: '보통', color: 'text-green-500' };
  if (pm10 <= 150) return { label: '나쁨', color: 'text-orange-500' };
  return { label: '매우나쁨', color: 'text-red-500' };
}

function getPm25Grade(pm25: number): { label: string; color: string } {
  if (pm25 <= 15) return { label: '좋음', color: 'text-blue-500' };
  if (pm25 <= 35) return { label: '보통', color: 'text-green-500' };
  if (pm25 <= 75) return { label: '나쁨', color: 'text-orange-500' };
  return { label: '매우나쁨', color: 'text-red-500' };
}

export function WeatherDetail({ data }: WeatherDetailProps) {
  const { current } = data;

  const uviGrade = getUviGrade(current.uvi);
  const pm10Grade = getPm10Grade(current.pm10);
  const pm25Grade = getPm25Grade(current.pm25);

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

      {/* 6타일 정보 그리드 */}
      <div className="grid grid-cols-3 gap-2 rounded-xl bg-gray-50 p-3 text-xs text-gray-500">
        {/* Row 1 */}
        <div className="flex flex-col gap-0.5">
          <span className="text-gray-400">습도</span>
          <span className="font-medium text-gray-700">{current.humidity}%</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-gray-400">풍속</span>
          <span className="font-medium text-gray-700">{current.windSpeed}m/s</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-gray-400">자외선</span>
          <span className="font-medium text-gray-700">
            {current.uvi}{' '}
            <span className={uviGrade.color}>({uviGrade.label})</span>
          </span>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col gap-0.5">
          <span className="text-gray-400">미세먼지</span>
          <span className="font-medium text-gray-700">
            {current.pm10}㎍{' '}
            <span className={pm10Grade.color}>({pm10Grade.label})</span>
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-gray-400">초미세먼지</span>
          <span className="font-medium text-gray-700">
            {current.pm25}㎍{' '}
            <span className={pm25Grade.color}>({pm25Grade.label})</span>
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-gray-400">일출·일몰</span>
          <span className="font-medium text-gray-700">
            {formatTime(current.sunrise)}
          </span>
          <span className="font-medium text-gray-700">
            {formatTime(current.sunset)}
          </span>
        </div>
      </div>
    </div>
  );
}
