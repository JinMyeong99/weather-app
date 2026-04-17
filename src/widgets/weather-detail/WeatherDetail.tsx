import type { WeatherData } from '../../shared/types';
import { InfoCard } from './InfoCard';
import { MainWeatherEmoji } from './MainWeatherEmoji';
import { SunTimeCard } from './SunTimeCard';
import {
  getPm10Grade,
  getPm25Grade,
  getUnavailableGrade,
  getUviGrade,
  toInfoCardStyle,
} from './weatherGrades';

interface WeatherDetailProps {
  data: WeatherData;
  /** 상위(WeatherCard)에서 dev mock override가 완료된 최종 날씨 아이콘 */
  icon: string;
}

export function WeatherDetail({ data, icon }: WeatherDetailProps) {
  const { current } = data;

  const pm10Grade = current.pm10 === null ? getUnavailableGrade() : getPm10Grade(current.pm10);
  const pm25Grade = current.pm25 === null ? getUnavailableGrade() : getPm25Grade(current.pm25);
  const uviGrade = getUviGrade(current.uvi);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-center gap-0">
        <MainWeatherEmoji icon={icon} label={current.description} />
        <p className="relative z-10 -ml-4 text-6xl font-bold tabular-nums text-slate-800">{current.temp}°</p>
      </div>

      <p className="text-lg font-semibold text-slate-800">{current.description}</p>

      <p className="text-base font-medium">
        <span className="text-blue-600">최저 {current.tempMin}°</span>
        <span className="mx-1.5 text-slate-300">/</span>
        <span className="text-red-600">최고 {current.tempMax}°</span>
      </p>

      <p className="text-sm text-slate-500">
        체감 <span className="font-semibold text-slate-700">{current.feelsLike}°</span>
        {' · '}
        습도 <span className="font-semibold text-slate-700">{current.humidity}%</span>
        {' · '}
        풍속 <span className="font-semibold text-slate-700">{current.windSpeed.toFixed(1)}m/s</span>
      </p>

      <div className="grid w-full grid-cols-6 gap-2 sm:grid-cols-5">
        <InfoCard label="미세먼지" value={pm10Grade.label} {...toInfoCardStyle(pm10Grade)} className="col-span-2 sm:col-span-1" />
        <InfoCard label="초미세먼지" value={pm25Grade.label} {...toInfoCardStyle(pm25Grade)} className="col-span-2 sm:col-span-1" />
        <InfoCard label="자외선" value={uviGrade.label} {...toInfoCardStyle(uviGrade)} className="col-span-2 sm:col-span-1" />
        <SunTimeCard label="일출" value={current.sunrise} type="sunrise" className="col-span-3 sm:col-span-1" />
        <SunTimeCard label="일몰" value={current.sunset} type="sunset" className="col-span-3 sm:col-span-1" />
      </div>
    </div>
  );
}
