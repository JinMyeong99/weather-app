import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Favorite, District } from '../../shared/types';

const MAX_FAVORITES = 6;
const STORAGE_KEY = 'weather-favorites';

interface FavoritesStore {
  favorites: Favorite[];
  isFavorite: (fullName: string) => boolean;
  isFavoriteByCoords: (lat: number, lon: number) => boolean;
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
        get().favorites.some((f) => f.lat === lat && f.lon === lon),

      addFavorite: (district, lat, lon) => {
        if (get().favorites.length >= MAX_FAVORITES) {
          throw new Error(`즐겨찾기는 최대 ${MAX_FAVORITES}개까지 추가할 수 있습니다.`);
        }
        const newFavorite: Favorite = {
          id: crypto.randomUUID(),
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
