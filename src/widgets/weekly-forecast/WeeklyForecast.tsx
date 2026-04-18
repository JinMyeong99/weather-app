import { getWeatherIcon } from '../../shared/lib/getWeatherIcon';
import type { WeatherDaily } from '../../shared/types';

interface WeeklyForecastProps {
  daily: WeatherDaily[];
}

function formatForecastDate(date: string) {
  return date.slice(5).replace('-', '/');
}

function IconWithPop({ icon, pop }: { icon: string; pop: number }) {
  const isPositivePop = pop > 0;

  return (
    <div className="flex min-w-0 items-center justify-center">
      <span className="text-xl leading-none">{getWeatherIcon(icon)}</span>
      <span className={`${isPositivePop ? '-ml-0.5' : 'ml-0.5'} translate-y-px text-xs font-medium text-blue-600`}>
        {Math.round(pop * 100)}%
      </span>
    </div>
  );
}

function MobilePeriodForecast({
  icon,
  pop,
}: {
  icon: string;
  pop: number;
}) {
  const isPositivePop = pop > 0;

  return (
    <div className="flex min-w-0 items-center justify-center">
      <span className="text-lg leading-none">{getWeatherIcon(icon)}</span>
      <span className={`${isPositivePop ? '-ml-0.5' : 'ml-0.5'} translate-y-px text-[11px] font-medium text-blue-600`}>
        {Math.round(pop * 100)}%
      </span>
    </div>
  );
}

function MobileWeeklyForecast({ daily }: WeeklyForecastProps) {
  return (
    <div className="sm:hidden">
      <div className="flex items-center px-4 pb-1 text-[11px] font-medium text-gray-500">
        <div className="w-12 shrink-0" aria-hidden="true" />
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-2 text-center">
          <span>오전</span>
          <span>오후</span>
        </div>
        <div className="w-16 shrink-0 text-right">
          <span className="text-blue-600">최저</span>
          <span className="mx-1 text-gray-300">/</span>
          <span className="text-red-600">최고</span>
        </div>
      </div>

      {daily.map((day) => {
        const isToday = day.dayLabel === '오늘';
        const dateStr = formatForecastDate(day.date);

        return (
          <article
            key={day.date}
            className={`flex items-center border-t border-gray-100 px-4 py-3 ${
              isToday ? 'bg-blue-50' : ''
            }`}
          >
            <div className="w-12 shrink-0">
              <span className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                {day.dayLabel}
              </span>
              <p className={`mt-0.5 text-[11px] ${isToday ? 'text-gray-600' : 'text-gray-500'}`}>
                {dateStr}
              </p>
            </div>

            <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-2 text-center">
              <MobilePeriodForecast icon={day.amIcon} pop={day.amPop} />
              <MobilePeriodForecast icon={day.pmIcon} pop={day.pmPop} />
            </div>

            <div className="w-16 shrink-0 text-right text-sm font-semibold tabular-nums">
              <span className="text-blue-600">{day.tempMin}°</span>
              <span className="mx-1 text-gray-300">/</span>
              <span className={isToday ? 'text-red-700' : 'text-red-600'}>{day.tempMax}°</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function DesktopWeeklyForecast({ daily }: WeeklyForecastProps) {
  return (
    <div className="hidden overflow-x-auto sm:block">
      <table className="w-full min-w-105 table-fixed text-sm">
        <colgroup>
          <col className="w-[20%]" />
          <col className="w-[20%]" />
          <col className="w-[20%]" />
          <col className="w-[20%]" />
          <col className="w-[20%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">날짜</th>
            <th className="py-2 text-center text-xs font-medium text-gray-500">오전</th>
            <th className="py-2 text-center text-xs font-medium text-gray-500">오후</th>
            <th className="py-2 text-center text-xs font-medium text-blue-600">최저</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-red-600">최고</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {daily.map((day) => {
            const isToday = day.dayLabel === '오늘';
            const dateStr = formatForecastDate(day.date);

            return (
              <tr
                key={day.date}
                className={isToday ? 'bg-blue-50' : 'hover:bg-gray-50'}
              >
                {/* 날짜 — 오늘/내일도 날짜 포함 */}
                <td className="px-4 py-3">
                  <span className={`font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                    {day.dayLabel}
                  </span>
                  <p className={`mt-0.5 text-xs ${isToday ? 'text-gray-600' : 'text-gray-500'}`}>
                    {dateStr}
                  </p>
                </td>

                {/* 오전 */}
                <td className="py-3">
                  <IconWithPop icon={day.amIcon} pop={day.amPop} />
                </td>

                {/* 오후 */}
                <td className="py-3">
                  <IconWithPop icon={day.pmIcon} pop={day.pmPop} />
                </td>

                {/* 최저 */}
                <td className="py-3 text-center">
                  <span className="font-medium text-blue-600">{day.tempMin}°</span>
                </td>

                {/* 최고 */}
                <td className="px-4 py-3 text-center">
                  <span className={`font-medium ${isToday ? 'text-red-700' : 'text-red-600'}`}>
                    {day.tempMax}°
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function WeeklyForecast({ daily }: WeeklyForecastProps) {
  if (daily.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-sm font-semibold text-gray-600">주간예보</h2>
      </div>

      <MobileWeeklyForecast daily={daily} />
      <DesktopWeeklyForecast daily={daily} />
    </div>
  );
}
