import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../../entities/weather/model/useWeather';
import { getWeatherIcon } from '../../shared/lib/getWeatherIcon';
import { Skeleton } from '../../shared/ui/Skeleton';
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
    navigate(`/detail/${btoa(`${favorite.lat},${favorite.lon}`)}`, {
      state: { locationName: favorite.alias, district: favorite.district },
    });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
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
          <p
            onDoubleClick={handleDoubleClick}
            className="truncate text-sm font-semibold text-gray-700"
            title="더블클릭하여 별칭 수정"
          >
            {favorite.alias}
          </p>
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
              <span className="text-blue-400">{data.current.tempMin}°</span>
              <span className="mx-0.5 text-gray-300">/</span>
              <span className="text-red-400">{data.current.tempMax}°</span>
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
