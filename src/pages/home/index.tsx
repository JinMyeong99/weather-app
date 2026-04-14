import { useState } from 'react';
import { useGeolocation } from '../../features/geolocation/useGeolocation';
import { useWeather } from '../../entities/weather/model/useWeather';
import { useFavorites } from '../../features/favorites/useFavorites';
import { SearchBar } from '../../widgets/search-bar/SearchBar';
import { WeatherDetail } from '../../widgets/weather-detail/WeatherDetail';
import { FavoriteList } from '../../widgets/favorite-list/FavoriteList';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import { ErrorMessage } from '../../shared/ui/ErrorMessage';
import type { District } from '../../shared/types';

export const HomePage = () => {
  const geo = useGeolocation();
  const [selected, setSelected] = useState<{ lat: number; lon: number; district: District } | null>(null);

  const lat = selected?.lat ?? geo.lat;
  const lon = selected?.lon ?? geo.lon;

  const { data, isLoading: weatherLoading, isError } = useWeather(lat, lon);
  const { favorites, isFavorite, addFavorite, removeFavorite, updateAlias } = useFavorites();

  const [addError, setAddError] = useState<string | null>(null);

  const handleSelect = (lat: number, lon: number, district: District) => {
    setSelected({ lat, lon, district });
    setAddError(null);
  };

  const handleAddFavorite = () => {
    if (!data || lat === null || lon === null) return;
    const district = selected?.district ?? {
      fullName: data.locationName,
      displayName: data.locationName,
      sido: data.locationName,
    };
    try {
      addFavorite(district, lat, lon);
      setAddError(null);
    } catch (e) {
      setAddError((e as Error).message);
    }
  };

  const currentFullName = selected?.district.fullName ?? geo.lat?.toString() ?? '';
  const alreadyFavorited = isFavorite(currentFullName);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8">

        {/* 헤더 */}
        <h1 className="mb-6 text-2xl font-bold text-gray-800">날씨</h1>

        {/* 검색 */}
        <div className="mb-6">
          <SearchBar onSelect={handleSelect} />
        </div>

        {/* 현재 날씨 */}
        <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              {selected ? selected.district.displayName : '현재 위치'}
            </p>
            {data && !alreadyFavorited && (
              <button
                onClick={handleAddFavorite}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-500 hover:bg-blue-100"
              >
                + 즐겨찾기
              </button>
            )}
            {data && alreadyFavorited && (
              <span className="text-xs text-gray-400">즐겨찾기 추가됨</span>
            )}
          </div>

          {addError && <ErrorMessage message={addError} />}

          {geo.loading && !selected && <LoadingSpinner />}
          {geo.error && !selected && <ErrorMessage message={geo.error} />}
          {(weatherLoading) && <LoadingSpinner />}
          {isError && <ErrorMessage message="날씨 정보를 불러올 수 없습니다." />}
          {data && <WeatherDetail data={data} />}
        </section>

        {/* 즐겨찾기 */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-600">즐겨찾기</h2>
          <FavoriteList
            favorites={favorites}
            onRemove={removeFavorite}
            onAliasUpdate={updateAlias}
          />
        </section>

      </div>
    </div>
  );
};
