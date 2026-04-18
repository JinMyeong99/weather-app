import { Skeleton } from '../../shared/ui/Skeleton';
import { WeatherCardPlaceholder } from '../../widgets/weather-card/WeatherCardPlaceholder';

export function HourlyForecastPlaceholder() {
  return (
    <section className="mb-6 rounded-2xl bg-white p-4 shadow-sm" aria-busy="true">
      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-5 w-20" />
        <div className="flex gap-1">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="mb-1 h-21 pt-4">
          <Skeleton className="mx-auto h-10 w-[92%] rounded-full" />
        </div>
        <div className="flex">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-0.5 pb-1">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-9" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FavoriteCardPlaceholder() {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm" aria-busy="true">
      <div className="min-w-0 flex-1">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="mt-0.5 h-4 w-16" />
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col items-end gap-1.5">
          <Skeleton className="h-5 w-10" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
      <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
    </div>
  );
}

export function HomePagePlaceholder() {
  return (
    <div className="relative z-10 mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 h-8" aria-hidden="true" />

      <div className="mb-6">
        <Skeleton className="h-11.5 w-full rounded-xl" />
      </div>

      <WeatherCardPlaceholder className="mb-6" showMore />

      <HourlyForecastPlaceholder />

      <section>
        <div className="mb-3 h-5" aria-hidden="true" />
        <FavoriteCardPlaceholder />
      </section>
    </div>
  );
}
