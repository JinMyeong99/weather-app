import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../../entities/weather/model/useWeather';
import { getWeatherIcon } from '../../shared/lib/getWeatherIcon';
import { Skeleton } from '../../shared/ui/Skeleton';
import { makeLocationId } from '../../shared/lib/locationId';
import type { Favorite } from '../../shared/types';

interface FavoriteCardProps {
  favorite: Favorite;
  onRemove: (id: string) => void;
  onAliasUpdate: (id: string, alias: string) => void;
}

export function FavoriteCard({ favorite, onRemove, onAliasUpdate }: FavoriteCardProps) {
  const navigate = useNavigate();
  const { data, isLoading } = useWeather(favorite.lat, favorite.lon);
  const [isEditing, setIsEditing] = useState(false);
  const [alias, setAlias] = useState(favorite.alias);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCardClick = () => {
    if (isEditing) return;
    navigate(`/detail/${makeLocationId(favorite.lat, favorite.lon)}`, {
      state: { locationName: favorite.alias, district: favorite.district },
    });
  };

  const handleAliasConfirm = () => {
    const trimmed = alias.trim();
    if (trimmed) {
      onAliasUpdate(favorite.id, trimmed);
    } else {
      setAlias(favorite.alias);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAliasConfirm();
    if (e.key === 'Escape') {
      setAlias(favorite.alias);
      setIsEditing(false);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex cursor-pointer items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm transition hover:shadow-md"
    >
      {/* 별칭 */}
      <div className="flex-1 min-w-0" onClick={(e) => isEditing && e.stopPropagation()}>
        {isEditing ? (
          <input
            ref={inputRef}
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            onBlur={handleAliasConfirm}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded border border-blue-300 px-1 text-sm font-semibold outline-none focus:ring-1 focus:ring-blue-300"
          />
        ) : (
          <div className="flex items-center gap-1">
            <p className="truncate text-sm font-semibold text-gray-700">
              {favorite.alias}
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); setTimeout(() => inputRef.current?.select(), 0); }}
              className="shrink-0 -my-1 p-1.5 text-gray-300 hover:text-blue-400 transition-colors rounded-md hover:bg-blue-50"
              aria-label="별칭 수정"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
        )}
        {data && (
          <p className="mt-0.5 text-xs capitalize text-gray-400">{data.current.description}</p>
        )}
      </div>

      {/* 날씨 정보 */}
      {isLoading && (
        <div className="flex shrink-0 items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col items-end gap-1.5">
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
      )}
      {data && (
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-4xl leading-none" role="img" aria-label={data.current.description}>
            {getWeatherIcon(data.current.icon)}
          </span>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800">{data.current.temp}°</p>
            <p className="text-xs">
              <span className="text-blue-600">{data.current.tempMin}°</span>
              <span className="mx-0.5 text-gray-300">/</span>
              <span className="text-red-600">{data.current.tempMax}°</span>
            </p>
          </div>
        </div>
      )}

      {/* 삭제 버튼 */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(favorite.id); }}
        className="shrink-0 -mr-2 p-2 text-gray-300 hover:text-red-400"
        aria-label="즐겨찾기 삭제"
      >
        ✕
      </button>
    </div>
  );
}
