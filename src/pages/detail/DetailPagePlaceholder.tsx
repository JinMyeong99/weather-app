import { Skeleton } from '../../shared/ui/Skeleton';
import { WeatherCardPlaceholder } from '../../widgets/weather-card/WeatherCardPlaceholder';
import { HourlyForecastPlaceholder, FavoriteCardPlaceholder } from '../home/HomePagePlaceholder';

function WeeklyForecastPlaceholder() {
  return (
    <section className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm" aria-busy="true">
      <div className="px-4 pt-4 pb-2">
        <Skeleton className="h-5 w-16" />
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
              {[null, null, null, null, null].map((_, i) => (
                <th key={i} className="px-4 py-2">
                  <Skeleton className={`h-3 w-6 ${i === 0 ? '' : 'mx-auto'}`} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-start gap-0.5">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                </td>
                <td className="py-3"><Skeleton className="mx-auto h-6 w-6 rounded-full" /></td>
                <td className="py-3"><Skeleton className="mx-auto h-6 w-6 rounded-full" /></td>
                <td className="py-3"><Skeleton className="mx-auto h-4 w-8" /></td>
                <td className="py-3"><Skeleton className="mx-auto h-4 w-8" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

interface DetailPagePlaceholderProps {
  locationName: string;
  isDark: boolean;
  onBack: () => void;
}

export function DetailPagePlaceholder({ locationName, isDark, onBack }: DetailPagePlaceholderProps) {
  return (
    <div className="relative z-10 mx-auto max-w-2xl px-4 py-8">
      {/* 헤더 */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className={`rounded-full p-2 transition-colors ${isDark ? 'text-white/80 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'}`}
          aria-label="홈으로"
        >
          ←
        </button>
        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{locationName}</h1>
      </div>

      {/* 검색 */}
      <div className="mb-6">
        <Skeleton className="h-11.5 w-full rounded-xl" />
      </div>

      <WeatherCardPlaceholder className="mb-6" locationName={locationName} />

      <HourlyForecastPlaceholder />

      <WeeklyForecastPlaceholder />

      <section>
        <Skeleton className="mb-3 h-5 w-14" />
        <FavoriteCardPlaceholder />
      </section>
    </div>
  );
}
