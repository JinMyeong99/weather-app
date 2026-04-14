import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getWeatherIcon } from '../../shared/lib/getWeatherIcon';
import { useWeather } from '../../entities/weather/model/useWeather';
import { WeatherDetail } from '../../widgets/weather-detail/WeatherDetail';
import { WeeklyForecast } from '../../widgets/weekly-forecast/WeeklyForecast';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import { ErrorMessage } from '../../shared/ui/ErrorMessage';
import type { WeatherHourly } from '../../shared/types';

const DAY_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

function formatHourlyLabel(item: WeatherHourly): { dayLabel: string; timeLabel: string; isDaytime: boolean } {
  const date = new Date(item.dt * 1000);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  let dayLabel = '';
  if (isSameDay(date, today)) {
    dayLabel = '오늘';
  } else if (isSameDay(date, tomorrow)) {
    dayLabel = `내일 (${DAY_OF_WEEK[date.getDay()]})`;
  } else {
    dayLabel = `${date.getMonth() + 1}/${date.getDate()} (${DAY_OF_WEEK[date.getDay()]})`;
  }

  const hour = date.getHours();
  const isDaytime = hour >= 6 && hour < 20;
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const timeLabel = `${period} ${displayHour}시`;

  return { dayLabel, timeLabel, isDaytime };
}

function parseLocationId(locationId: string): { lat: number; lon: number } | null {
  try {
    const decoded = atob(locationId);
    const [lat, lon] = decoded.split(',').map(Number);
    if (isNaN(lat) || isNaN(lon)) return null;
    return { lat, lon };
  } catch {
    return null;
  }
}

export const DetailPage = () => {
  const { locationId = '' } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const { state } = useLocation() as { state: { locationName?: string } | null };

  const coords = parseLocationId(locationId);
  const { data, isLoading, isError } = useWeather(coords?.lat ?? null, coords?.lon ?? null);

  const locationName = state?.locationName ?? data?.locationName ?? '날씨 상세';

  // 날짜 구분선을 위해 이전 항목과 날짜가 다른지 확인
  const isDifferentDay = (current: WeatherHourly, prev: WeatherHourly | undefined) => {
    if (!prev) return false;
    const a = new Date(current.dt * 1000);
    const b = new Date(prev.dt * 1000);
    return a.getDate() !== b.getDate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8">

        {/* 헤더 */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="뒤로가기"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-gray-800">{locationName}</h1>
        </div>

        {!coords && <ErrorMessage message="잘못된 위치 정보입니다." />}
        {isLoading && <LoadingSpinner />}
        {isError && <ErrorMessage message="날씨 정보를 불러올 수 없습니다." />}

        {data && (
          <>
            {/* 현재 날씨 */}
            <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
              <WeatherDetail data={data} />
            </section>

            {/* 시간별 예보 */}
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-gray-600">시간별 예보</h2>
              <ul className="divide-y divide-gray-100">
                {data.hourly.map((item, idx) => {
                  const { dayLabel, timeLabel, isDaytime } = formatHourlyLabel(item);
                  const showDayDivider = isDifferentDay(item, data.hourly[idx - 1]);

                  return (
                    <li key={item.dt}>
                      {/* 날짜 구분선 */}
                      {showDayDivider && (
                        <div className="py-2 text-xs font-semibold text-blue-400">
                          — {dayLabel}
                        </div>
                      )}
                      <div className="flex items-center gap-3 py-3">
                        {/* 낮/밤 + 시간 */}
                        <div className="w-28 flex-shrink-0">
                          {idx === 0 && (
                            <p className="text-xs text-gray-400">{dayLabel}</p>
                          )}
                          <p className="text-sm text-gray-700">
                            {isDaytime ? '☀️' : '🌙'} {timeLabel}
                          </p>
                        </div>

                        {/* 아이콘 */}
                        <span className="text-2xl leading-none flex-shrink-0" role="img" aria-hidden>
                          {getWeatherIcon(item.icon)}
                        </span>

                        {/* 강수확률 */}
                        <div className="flex flex-1 items-center gap-1">
                          {item.pop > 0 && (
                            <span className="text-xs text-blue-400">
                              💧 {Math.round(item.pop * 100)}%
                            </span>
                          )}
                        </div>

                        {/* 기온 */}
                        <span className="text-sm font-semibold text-gray-800">
                          {item.temp}°
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* 주간예보 */}
            <section className="mt-4">
              <WeeklyForecast daily={data.daily} />
            </section>
          </>
        )}

      </div>
    </div>
  );
};
