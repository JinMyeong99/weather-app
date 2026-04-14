import { FavoriteCard } from './FavoriteCard';
import type { Favorite } from '../../shared/types';

interface FavoriteListProps {
  favorites: Favorite[];
  onRemove: (id: string) => void;
  onAliasUpdate: (id: string, alias: string) => void;
}

export function FavoriteList({ favorites, onRemove, onAliasUpdate }: FavoriteListProps) {
  if (favorites.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400">
        즐겨찾기를 추가하면 여기에 표시됩니다.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {favorites.map((favorite) => (
        <FavoriteCard
          key={favorite.id}
          favorite={favorite}
          onRemove={onRemove}
          onAliasUpdate={onAliasUpdate}
        />
      ))}
    </div>
  );
}
