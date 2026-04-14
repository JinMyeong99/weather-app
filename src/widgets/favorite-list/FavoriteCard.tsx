import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../../entities/weather/model/useWeather';
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
      state: { locationName: favorite.alias },
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
        <p className="text-xs text-gray-400">불러오는 중...</p>
      )}
      {data && (
        <div className="flex flex-shrink-0 items-center gap-3">
          <img
            src={`https://openweathermap.org/img/wn/${data.current.icon}.png`}
            alt={data.current.description}
            className="h-10 w-10"
          />
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800">{data.current.temp}°</p>
            <p className="text-xs text-gray-400">
              {data.current.tempMin}° / {data.current.tempMax}°
            </p>
          </div>
        </div>
      )}

      {/* 삭제 버튼 */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(favorite.id); }}
        className="flex-shrink-0 text-gray-300 hover:text-red-400"
        aria-label="즐겨찾기 삭제"
      >
        ✕
      </button>
    </div>
  );
}
