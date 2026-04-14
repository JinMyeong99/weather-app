import type { WeatherData } from '../../shared/types';

interface WeatherDetailProps {
  data: WeatherData;
}

export function WeatherDetail({ data }: WeatherDetailProps) {
  const { current } = data;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <img
          src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
          alt={current.description}
          className="h-16 w-16"
        />
        <div>
          <p className="text-5xl font-bold text-gray-800">{current.temp}°</p>
          <p className="text-sm capitalize text-gray-500">{current.description}</p>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        최저 {current.tempMin}° / 최고 {current.tempMax}°
      </p>

      <div className="flex gap-4 text-xs text-gray-400">
        <span>습도 {current.humidity}%</span>
        <span>풍속 {current.windSpeed}m/s</span>
      </div>
    </div>
  );
}
