import { useState } from 'react';
import { useFavorites } from '../../features/favorites/useFavorites';
import { WeatherDetail } from '../weather-detail/WeatherDetail';
import { ErrorMessage } from '../../shared/ui/ErrorMessage';
import type { WeatherData } from '../../shared/types';

interface WeatherCardProps {
  locationName: string;
  data: WeatherData;
  lat: number;
  lon: number;
  /** 제공 시 카드 전체가 클릭 가능 (홈 → 상세 이동용) */
  onClick?: () => void;
  className?: string;
}

export function WeatherCard({ locationName, data, lat, lon, onClick, className = '' }: WeatherCardProps) {
  const { favorites, isFavoriteByCoords, addFavorite, removeFavorite } = useFavorites();
  const [addError, setAddError] = useState<string | null>(null);

  const alreadyFavorited = isFavoriteByCoords(lat, lon);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (alreadyFavorited) {
      const fav = favorites.find((f) => f.lat === lat && f.lon === lon);
      if (fav) removeFavorite(fav.id);
    } else {
      try {
        addFavorite(
          { fullName: `${lat},${lon}`, displayName: locationName, sido: locationName },
          lat,
          lon,
        );
        setAddError(null);
      } catch (err) {
        setAddError((err as Error).message);
      }
    }
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl bg-white p-5 shadow-sm transition ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${className}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-lg font-bold text-gray-800">{locationName}</p>
        <button
          onClick={handleToggleFavorite}
          className={`text-2xl leading-none transition-colors ${
            alreadyFavorited
              ? 'text-yellow-400 hover:text-yellow-500'
              : 'text-gray-300 hover:text-yellow-400'
          }`}
          aria-label={alreadyFavorited ? '즐겨찾기 제거' : '즐겨찾기 추가'}
        >
          {alreadyFavorited ? '★' : '☆'}
        </button>
      </div>

      {addError && <ErrorMessage message={addError} />}
      <WeatherDetail data={data} />
    </div>
  );
}
