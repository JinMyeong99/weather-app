import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useGeolocation } from '../../features/geolocation/useGeolocation';
import { reverseGeocode } from '../../features/geolocation/reverseGeocode';
import { useWeather } from '../../entities/weather/model/useWeather';
import { useFavorites } from '../../features/favorites/useFavorites';
import { SearchBar } from '../../widgets/search-bar/SearchBar';
import { WeatherDetail } from '../../widgets/weather-detail/WeatherDetail';
import { HourlyForecastStrip } from '../../widgets/hourly-forecast/HourlyForecastStrip';
import { FavoriteList } from '../../widgets/favorite-list/FavoriteList';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import { ErrorMessage } from '../../shared/ui/ErrorMessage';
import type { District } from '../../shared/types';

export const HomePage = () => {
  const navigate = useNavigate();
  const geo = useGeolocation();
  const [selected, setSelected] = useState<{ lat: number; lon: number; district: District } | null>(null);

  const lat = selected?.lat ?? geo.lat;
  const lon = selected?.lon ?? geo.lon;

  // geolocation 좌표를 한국어 행정구역명으로 변환
  const { data: geoLocationName } = useQuery({
    queryKey: ['reverseGeocode', geo.lat, geo.lon],
    queryFn: () => reverseGeocode(geo.lat!, geo.lon!),
    enabled: geo.lat !== null && geo.lon !== null && selected === null,
    staleTime: Infinity,
  });

  const currentLocationName = selected?.district.displayName ?? geoLocationName ?? '현재 위치';

  const { data, isLoading: weatherLoading, isError } = useWeather(lat, lon);
  const { favorites, isFavoriteByCoords, addFavorite, removeFavorite, updateAlias } = useFavorites();

  const getFavoriteByCoords = (lat: number, lon: number) =>
    favorites.find((f) => f.lat === lat && f.lon === lon);

  const [addError, setAddError] = useState<string | null>(null);

  const handleSelect = (newLat: number, newLon: number, district: District) => {
    setSelected({ lat: newLat, lon: newLon, district });
    setAddError(null);
  };

  const handleAddFavorite = () => {
    if (!data || lat === null || lon === null) return;
    const district = selected?.district ?? {
      fullName: `${lat},${lon}`,
      displayName: currentLocationName,
      sido: currentLocationName,
    };
    try {
      addFavorite(district, lat, lon);
      setAddError(null);
    } catch (e) {
      setAddError((e as Error).message);
    }
  };

  const alreadyFavorited = lat !== null && lon !== null && isFavoriteByCoords(lat, lon);

  const handleToggleFavorite = () => {
    if (lat === null || lon === null || !data) return;
    if (alreadyFavorited) {
      const fav = getFavoriteByCoords(lat, lon);
      if (fav) removeFavorite(fav.id);
    } else {
      handleAddFavorite();
    }
  };

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
        <section
          onClick={() => {
            if (data && lat !== null && lon !== null) {
              navigate(`/detail/${btoa(`${lat},${lon}`)}`, {
                state: { locationName: currentLocationName },
              });
            }
          }}
          className={`mb-6 rounded-2xl bg-white p-5 shadow-sm transition ${data ? 'cursor-pointer hover:shadow-md' : ''}`}
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{currentLocationName}</p>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              {data && (
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
              )}
            </div>
          </div>

          {addError && <ErrorMessage message={addError} />}

          {geo.loading && !selected && <LoadingSpinner />}
          {geo.error && !selected && <ErrorMessage message={geo.error} />}
          {weatherLoading && <LoadingSpinner />}
          {isError && <ErrorMessage message="날씨 정보를 불러올 수 없습니다." />}
          {data && <WeatherDetail data={data} />}
        </section>

        {/* 시간별 예보 */}
        {data && (
          <section className="mb-6">
            <HourlyForecastStrip hourly={data.hourly} />
          </section>
        )}

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
