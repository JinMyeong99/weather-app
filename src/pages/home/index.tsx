import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useGeolocation } from '../../features/geolocation/useGeolocation';
import { reverseGeocode } from '../../features/geolocation/reverseGeocode';
import { useWeather } from '../../entities/weather/model/useWeather';
import { useFavorites } from '../../features/favorites/useFavorites';
import { SearchBar } from '../../widgets/search-bar/SearchBar';
import { WeatherCard } from '../../widgets/weather-card/WeatherCard';
import { HourlyForecastStrip } from '../../widgets/hourly-forecast/HourlyForecastStrip';
import { FavoriteList } from '../../widgets/favorite-list/FavoriteList';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import { ErrorMessage } from '../../shared/ui/ErrorMessage';
import { getWeatherTheme } from '../../shared/lib/getWeatherTheme';
import { useDevWeather } from '../../shared/lib/useDevWeather';
import { WeatherAnimation } from '../../shared/ui/WeatherAnimation';
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
    queryFn: () => {
      if (geo.lat === null || geo.lon === null) {
        throw new Error('위치명 조회에 필요한 좌표가 없습니다.');
      }

      return reverseGeocode(geo.lat, geo.lon);
    },
    enabled: geo.lat !== null && geo.lon !== null && selected === null,
    staleTime: Infinity,
  });

  const currentLocationName = selected?.district.displayName ?? geoLocationName ?? '현재 위치';

  const { data, isLoading: weatherLoading, isError } = useWeather(lat, lon);
  const { favorites, removeFavorite, updateAlias } = useFavorites();

  const { mockIcon } = useDevWeather();
  const weatherIcon = mockIcon ?? data?.current.icon ?? '01d';
  const { gradient, isDark } = getWeatherTheme(weatherIcon);

  const handleSelect = (newLat: number, newLon: number, district: District) => {
    setSelected({ lat: newLat, lon: newLon, district });
  };

  const handleCurrentLocation = () => {
    setSelected(null);
  };

  return (
    <div className={`min-h-screen ${gradient} transition-colors duration-500`}>
      <WeatherAnimation icon={weatherIcon} />
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8">

        {/* 헤더 */}
        <h1 className={`mb-6 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>날씨</h1>

        {/* 검색 */}
        <div className="mb-6">
          <SearchBar onSelect={handleSelect} onCurrentLocation={handleCurrentLocation} />
        </div>

        {/* 현재 날씨 */}
        {(geo.loading && !selected) || weatherLoading ? (
          <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <LoadingSpinner />
          </div>
        ) : geo.error && !selected ? (
          <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <ErrorMessage message={geo.error} />
          </div>
        ) : isError ? (
          <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <ErrorMessage message="날씨 정보를 불러올 수 없습니다." />
          </div>
        ) : data && lat !== null && lon !== null ? (
          <WeatherCard
            className="mb-6"
            locationName={currentLocationName}
            data={data}
            lat={lat}
            lon={lon}
            district={selected?.district}
            onClick={() =>
              navigate(`/detail/${btoa(`${lat},${lon}`)}`, {
                state: { locationName: currentLocationName, district: selected?.district },
              })
            }
          />
        ) : null}

        {/* 시간별 예보 */}
        {data && (
          <section className="mb-6">
            <HourlyForecastStrip hourly={data.hourly} />
          </section>
        )}

        {/* 즐겨찾기 */}
        <section>
          <h2 className={`mb-3 text-sm font-semibold ${isDark ? 'text-white/70' : 'text-slate-600'}`}>즐겨찾기</h2>
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
