import { useState } from 'react';
import { useFavorites } from '../../features/favorites/useFavorites';
import { useDevWeather } from '../../shared/lib/useDevWeather';
import { WeatherDetail } from '../weather-detail/WeatherDetail';
import { Toast } from '../../shared/ui/Toast';
import { LocationTitle } from '../../shared/ui/LocationTitle';
import type { District, WeatherData } from '../../shared/types';

interface WeatherCardProps {
  locationName: string;
  data: WeatherData;
  lat: number;
  lon: number;
  district?: District;
  /** 제공 시 카드 전체가 클릭 가능 (홈 → 상세 이동용) */
  onClick?: () => void;
  className?: string;
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-11"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.25 4.65A2.35 2.35 0 0 1 8.6 2.3h6.8a2.35 2.35 0 0 1 2.35 2.35v16.9L12 17.8l-5.75 3.75z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function WeatherCard({ locationName, data, lat, lon, district, onClick, className = '' }: WeatherCardProps) {
  const { isFavoriteByLocation, findFavoriteByLocation, addFavorite, removeFavorite } = useFavorites();
  const { mockIcon } = useDevWeather();
  const displayIcon = mockIcon ?? data.current.icon;
  const [addError, setAddError] = useState<string | null>(null);
  const favoriteDistrict = district ?? { fullName: `${lat},${lon}`, displayName: locationName, sido: locationName };

  const alreadyFavorited = isFavoriteByLocation(favoriteDistrict, lat, lon);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (alreadyFavorited) {
      const fav = findFavoriteByLocation(favoriteDistrict, lat, lon);
      if (fav) removeFavorite(fav.id);
    } else {
      try {
        addFavorite(favoriteDistrict, lat, lon);
        setAddError(null);
      } catch (err) {
        setAddError((err as Error).message);
      }
    }
  };

  return (
    <div className={`rounded-2xl bg-white shadow-lg ${className}`}>
      {/* 날씨 본문 */}
      <div className="px-4 pt-4 pb-5 sm:p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <LocationTitle
            locationName={locationName}
            primaryClassName="min-w-0 truncate text-lg font-bold text-slate-800 sm:text-xl"
            secondaryClassName="mt-0.5 truncate text-xs font-medium text-slate-500 sm:text-sm"
            stackOnDesktop
          />
          <button
            onClick={handleToggleFavorite}
            className={`group flex h-9 w-12 shrink-0 translate-x-2 -translate-y-1 items-center justify-center transition-colors sm:translate-x-0 sm:translate-y-0 ${
              alreadyFavorited
                ? 'text-yellow-400 hover:text-yellow-500'
                : 'text-gray-400 hover:text-blue-500'
            }`}
            aria-label={alreadyFavorited ? '즐겨찾기 제거' : '즐겨찾기 추가'}
          >
            {alreadyFavorited ? (
              <BookmarkIcon filled />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-blue-50">
                <PlusIcon />
              </span>
            )}
          </button>
        </div>

        {addError && <Toast message={addError} onDismiss={() => setAddError(null)} />}
        <WeatherDetail data={data} icon={displayIcon} />
      </div>

      {/* 날씨 더보기 버튼 */}
      {onClick && (
        <>
          <div className="mx-5 border-t border-slate-200" />
          <button
            onClick={onClick}
            className="flex w-full items-center justify-center gap-1 py-3 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
          >
            날씨 더보기
            <span className="text-base leading-none">→</span>
          </button>
        </>
      )}
    </div>
  );
}
