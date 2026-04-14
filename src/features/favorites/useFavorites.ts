import { useState } from 'react';
import type { Favorite, District } from '../../shared/types';

const STORAGE_KEY = 'weather-favorites';
const MAX_FAVORITES = 6;

function loadFromStorage(): Favorite[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Favorite[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(favorites: Favorite[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>(loadFromStorage);

  const isFavorite = (fullName: string) =>
    favorites.some((f) => f.district.fullName === fullName);

  const addFavorite = (district: District, lat: number, lon: number) => {
    if (favorites.length >= MAX_FAVORITES) {
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
    const updated = [...favorites, newFavorite];
    setFavorites(updated);
    saveToStorage(updated);
  };

  const removeFavorite = (id: string) => {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    saveToStorage(updated);
  };

  const updateAlias = (id: string, alias: string) => {
    const updated = favorites.map((f) => (f.id === id ? { ...f, alias } : f));
    setFavorites(updated);
    saveToStorage(updated);
  };

  return { favorites, isFavorite, addFavorite, removeFavorite, updateAlias };
}
