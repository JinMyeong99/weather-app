import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Favorite, District } from '../../shared/types';

const MAX_FAVORITES = 6;
const STORAGE_KEY = 'weather-favorites';
const COORD_PRECISION = 4;

function createCoordsKey(lat: number, lon: number): string {
  return `coords:${lat.toFixed(COORD_PRECISION)},${lon.toFixed(COORD_PRECISION)}`;
}

function createFavoriteKey(district: District | undefined, lat: number, lon: number): string {
  if (district?.fullName && !district.fullName.includes(',')) {
    return `district:${district.fullName}`;
  }

  return createCoordsKey(lat, lon);
}

function getStoredFavoriteKey(favorite: Favorite): string {
  return favorite.key ?? createFavoriteKey(favorite.district, favorite.lat, favorite.lon);
}

function matchesFavoriteLocation(
  favorite: Favorite,
  district: District | undefined,
  lat: number,
  lon: number,
): boolean {
  const storedKey = getStoredFavoriteKey(favorite);

  return storedKey === createFavoriteKey(district, lat, lon)
    || storedKey === createCoordsKey(lat, lon);
}

interface FavoritesStore {
  favorites: Favorite[];
  isFavorite: (fullName: string) => boolean;
  isFavoriteByCoords: (lat: number, lon: number) => boolean;
  isFavoriteByLocation: (district: District | undefined, lat: number, lon: number) => boolean;
  findFavoriteByLocation: (district: District | undefined, lat: number, lon: number) => Favorite | undefined;
  addFavorite: (district: District, lat: number, lon: number) => void;
  removeFavorite: (id: string) => void;
  updateAlias: (id: string, alias: string) => void;
}

export const useFavorites = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      isFavorite: (fullName) =>
        get().favorites.some((f) => f.district.fullName === fullName),

      isFavoriteByCoords: (lat, lon) =>
        get().favorites.some((f) => getStoredFavoriteKey(f) === createCoordsKey(lat, lon)),

      isFavoriteByLocation: (district, lat, lon) => {
        return get().favorites.some((f) => matchesFavoriteLocation(f, district, lat, lon));
      },

      findFavoriteByLocation: (district, lat, lon) => {
        return get().favorites.find((f) => matchesFavoriteLocation(f, district, lat, lon));
      },

      addFavorite: (district, lat, lon) => {
        const key = createFavoriteKey(district, lat, lon);

        if (get().favorites.some((f) => matchesFavoriteLocation(f, district, lat, lon))) {
          return;
        }

        if (get().favorites.length >= MAX_FAVORITES) {
          throw new Error(`즐겨찾기는 최대 ${MAX_FAVORITES}개까지 추가할 수 있습니다.`);
        }
        const newFavorite: Favorite = {
          id: crypto.randomUUID(),
          key,
          alias: district.displayName,
          district: {
            fullName: district.fullName,
            displayName: district.displayName,
            sido: district.sido,
            sigungu: district.sigungu,
            dong: district.dong,
          },
          lat,
          lon,
        };
        set({ favorites: [...get().favorites, newFavorite] });
      },

      removeFavorite: (id) =>
        set({ favorites: get().favorites.filter((f) => f.id !== id) }),

      updateAlias: (id, alias) =>
        set({ favorites: get().favorites.map((f) => (f.id === id ? { ...f, alias } : f)) }),
    }),
    { name: STORAGE_KEY },
  ),
);
