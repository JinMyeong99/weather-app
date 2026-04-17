import { useFavorites } from '../../features/favorites/useFavorites';
import { FavoriteCard } from './FavoriteCard';
import { FavoriteListEmpty } from './FavoriteListEmpty';

export function FavoriteList() {
  const { favorites, removeFavorite, updateAlias } = useFavorites();

  if (favorites.length === 0) {
    return <FavoriteListEmpty />;
  }

  return (
    <ul className="flex flex-col gap-3">
      {favorites.map((favorite) => (
        <li key={favorite.id}>
          <FavoriteCard
            favorite={favorite}
            onRemove={removeFavorite}
            onAliasUpdate={updateAlias}
          />
        </li>
      ))}
    </ul>
  );
}
