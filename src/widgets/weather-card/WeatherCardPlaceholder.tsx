import { Skeleton } from '../../shared/ui/Skeleton';

interface WeatherCardPlaceholderProps {
  locationName?: string;
  showMore?: boolean;
  className?: string;
}

export function WeatherCardPlaceholder({
  locationName = '날씨 불러오는 중',
  showMore = false,
  className = '',
}: WeatherCardPlaceholderProps) {
  return (
    <div className={`rounded-2xl bg-white shadow-lg ${className}`} aria-busy="true">
      <div className="px-4 pt-4 pb-5 sm:p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-lg font-bold text-slate-700">{locationName}</p>
          <Skeleton className="h-9 w-12 shrink-0 rounded-lg" />
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex h-20 items-center justify-center">
            <Skeleton className="h-12 w-28 rounded-xl" />
          </div>

          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-5 w-48" />

          <div className="grid w-full grid-cols-6 gap-2 sm:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              index < 3 ? (
                <div
                  key={index}
                  className="col-span-2 flex min-w-0 flex-col items-start justify-center gap-1 rounded-xl bg-gray-100/70 px-3 py-2.5 sm:col-span-1"
                >
                  <Skeleton className="h-5 w-14" />
                  <Skeleton className="h-5 w-10" />
                </div>
              ) : (
                <div
                  key={index}
                  className="col-span-3 flex min-w-0 items-center gap-2 rounded-xl border border-gray-100 bg-gray-100/70 px-3 py-2.5 sm:col-span-1"
                >
                  <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
                  <div className="flex min-w-0 flex-col items-start gap-1">
                    <Skeleton className="h-3 w-7" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {showMore && (
        <>
          <div className="mx-5 border-t border-slate-200" />
          <div className="flex items-center justify-center py-3">
            <Skeleton className="h-5 w-24" />
          </div>
        </>
      )}
    </div>
  );
}
