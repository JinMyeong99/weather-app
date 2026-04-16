import { getWeatherIcon } from '../../shared/lib/getWeatherIcon';
import type { WeatherDaily } from '../../shared/types';

interface WeeklyForecastProps {
  daily: WeatherDaily[];
}

function IconWithPop({ icon, pop }: { icon: string; pop: number }) {
  return (
    <div className="flex items-center justify-center">
      <span className="w-8" />
      <span className="text-xl leading-none">{getWeatherIcon(icon)}</span>
      <span className="w-8 text-left text-xs text-blue-400 pl-1.5">
        {pop > 0 ? `${Math.round(pop * 100)}%` : ''}
      </span>
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
      <div className="overflow-x-auto">
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
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">날짜</th>
              <th className="py-2 text-center text-xs font-medium text-gray-400">오전</th>
              <th className="py-2 text-center text-xs font-medium text-gray-400">오후</th>
              <th className="py-2 text-center text-xs font-medium text-blue-400">최저</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-red-400">최고</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {daily.map((day) => {
              const isToday = day.dayLabel === '오늘';
              const dateStr = day.date.slice(5).replace('-', '/');

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
                    <p className="text-xs text-gray-400 mt-0.5">{dateStr}</p>
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
                    <span className="font-medium text-blue-500">{day.tempMin}°</span>
                  </td>

                  {/* 최고 */}
                  <td className="px-4 py-3 text-center">
                    <span className="font-medium text-red-500">{day.tempMax}°</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
