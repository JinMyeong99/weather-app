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

interface Grade {
  label: string;
  textColor: string;
  bgColor: string;
}

function getUviGrade(uvi: number): Grade {
  if (uvi <= 2) return { label: '낮음', textColor: 'text-green-600', bgColor: 'bg-green-50' };
  if (uvi <= 5) return { label: '보통', textColor: 'text-green-600', bgColor: 'bg-green-50' };
  if (uvi <= 7) return { label: '높음', textColor: 'text-orange-500', bgColor: 'bg-orange-50' };
  if (uvi <= 10) return { label: '매우높음', textColor: 'text-red-500', bgColor: 'bg-red-50' };
  return { label: '위험', textColor: 'text-purple-600', bgColor: 'bg-purple-50' };
}

function getPm10Grade(pm10: number): Grade {
  if (pm10 <= 30) return { label: '좋음', textColor: 'text-blue-600', bgColor: 'bg-blue-50' };
  if (pm10 <= 80) return { label: '보통', textColor: 'text-green-600', bgColor: 'bg-green-50' };
  if (pm10 <= 150) return { label: '나쁨', textColor: 'text-orange-500', bgColor: 'bg-orange-50' };
  return { label: '매우나쁨', textColor: 'text-red-500', bgColor: 'bg-red-50' };
}

function getPm25Grade(pm25: number): Grade {
  if (pm25 <= 15) return { label: '좋음', textColor: 'text-blue-600', bgColor: 'bg-blue-50' };
  if (pm25 <= 35) return { label: '보통', textColor: 'text-green-600', bgColor: 'bg-green-50' };
  if (pm25 <= 75) return { label: '나쁨', textColor: 'text-orange-500', bgColor: 'bg-orange-50' };
  return { label: '매우나쁨', textColor: 'text-red-500', bgColor: 'bg-red-50' };
}

interface InfoCardProps {
  label: string;
  value: string;
  textColor: string;
  bgColor: string;
}

function InfoCard({ label, value, textColor, bgColor }: InfoCardProps) {
  return (
    <div className={`flex flex-1 flex-col items-start gap-1 rounded-xl px-3 py-2.5 ${bgColor}`}>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className={`text-sm font-bold ${textColor}`}>{value}</span>
    </div>
  );
}

export function WeatherDetail({ data }: WeatherDetailProps) {
  const { current } = data;

  const uviGrade = getUviGrade(current.uvi);
  const pm10Grade = getPm10Grade(current.pm10);
  const pm25Grade = getPm25Grade(current.pm25);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* 기온 + 아이콘 */}
      <div className="flex items-center">
        <span className="text-7xl leading-none" role="img" aria-label={current.description}>
          {getWeatherIcon(current.icon)}
        </span>
        <p className="relative z-10 -ml-3 text-6xl font-bold text-gray-800">{current.temp}°</p>
      </div>

      {/* 날씨 설명 */}
      <p className="text-lg font-semibold text-gray-800">{current.description}</p>

      {/* 최저 / 최고 */}
      <p className="text-base font-medium text-gray-600">
        <span className="text-blue-500">최저 {current.tempMin}°</span>
        <span className="mx-1.5 text-gray-300">/</span>
        <span className="text-red-400">최고 {current.tempMax}°</span>
      </p>

      {/* 체감 · 습도 · 풍속 인라인 */}
      <p className="text-sm text-gray-500">
        체감 <span className="font-semibold text-gray-800">{current.feelsLike}°</span>
        {' · '}
        습도 <span className="font-semibold text-gray-800">{current.humidity}%</span>
        {' · '}
        풍속 <span className="font-semibold text-gray-800">{current.windSpeed.toFixed(1)}m/s</span>
      </p>

      {/* 정보 카드 행 */}
      <div className="flex w-full gap-2">
        <InfoCard
          label="미세먼지"
          value={pm10Grade.label}
          textColor={pm10Grade.textColor}
          bgColor={pm10Grade.bgColor}
        />
        <InfoCard
          label="초미세먼지"
          value={pm25Grade.label}
          textColor={pm25Grade.textColor}
          bgColor={pm25Grade.bgColor}
        />
        <InfoCard
          label="자외선"
          value={uviGrade.label}
          textColor={uviGrade.textColor}
          bgColor={uviGrade.bgColor}
        />
        <InfoCard
          label="일출"
          value={formatTime(current.sunrise)}
          textColor="text-amber-600"
          bgColor="bg-amber-50"
        />
        <InfoCard
          label="일몰"
          value={formatTime(current.sunset)}
          textColor="text-orange-500"
          bgColor="bg-orange-50"
        />
      </div>
    </div>
  );
}
