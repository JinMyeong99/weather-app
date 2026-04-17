import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useGeolocation } from '../../features/geolocation/useGeolocation';
import { reverseGeocode } from '../../features/geolocation/reverseGeocode';
import { useWeather } from '../../entities/weather/model/useWeather';
import { useFavorites } from '../../features/favorites/useFavorites';
import { SearchBar } from '../../widgets/search-bar/SearchBar';
import { WeatherCard } from '../../widgets/weather-card/WeatherCard';
import { WeatherCardPlaceholder } from '../../widgets/weather-card/WeatherCardPlaceholder';
import { HourlyForecastStrip } from '../../widgets/hourly-forecast/HourlyForecastStrip';
import { FavoriteList } from '../../widgets/favorite-list/FavoriteList';
import { ErrorMessage } from '../../shared/ui/ErrorMessage';
import { getWeatherTheme } from '../../shared/lib/getWeatherTheme';
import { getCachedWeatherIcon, setCachedWeatherIcon } from '../../shared/lib/weatherThemeCache';
import { useDevWeather } from '../../shared/lib/useDevWeather';
import { WeatherAnimation } from '../../shared/ui/WeatherAnimation';
import type { District } from '../../shared/types';
import { HomePagePlaceholder, HourlyForecastPlaceholder } from './HomePagePlaceholder';

export const HomePage = () => {
  const navigate = useNavigate();
  const geo = useGeolocation();
  const [selected, setSelected] = useState<{ lat: number; lon: number; district: District } | null>(null);
  const [isResolvingSearchLocation, setIsResolvingSearchLocation] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

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
  const [transitionWeatherIcon, setTransitionWeatherIcon] = useState<string | null>(null);
  const [cachedWeatherIcon] = useState(() => getCachedWeatherIcon());
  const currentWeatherIcon = data?.current.icon;

  useEffect(() => {
    if (currentWeatherIcon) {
      setCachedWeatherIcon(currentWeatherIcon);
    }
  }, [currentWeatherIcon]);

  const { mockIcon } = useDevWeather();
  const weatherIcon = mockIcon ?? currentWeatherIcon ?? transitionWeatherIcon ?? cachedWeatherIcon ?? '01d';
  const { gradient, isDark } = getWeatherTheme(weatherIcon);
  const isWeatherLoading = (geo.loading && !selected) || weatherLoading || isResolvingSearchLocation;
  const isInitialLoading = isWeatherLoading && !data;

  const handleSelect = (newLat: number, newLon: number, district: District) => {
    setIsNotFound(false);
    setTransitionWeatherIcon(currentWeatherIcon ?? transitionWeatherIcon);
    setSelected({ lat: newLat, lon: newLon, district });
  };

  const handleCurrentLocation = () => {
    setIsNotFound(false);
    setTransitionWeatherIcon(currentWeatherIcon ?? transitionWeatherIcon);
    setSelected(null);
  };

  return (
    <div className={`min-h-screen ${gradient} transition-colors duration-500`}>
      <WeatherAnimation icon={weatherIcon} />
      {isInitialLoading ? (
        <HomePagePlaceholder />
      ) : (
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8">

        {/* 헤더 */}
        <h1 className={`mb-6 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>날씨</h1>

        {/* 검색 */}
        <div className="mb-6">
          <SearchBar
            onSelect={handleSelect}
            onCurrentLocation={handleCurrentLocation}
            onSearchingChange={setIsResolvingSearchLocation}
            onNotFound={setIsNotFound}
          />
        </div>

        {/* 현재 날씨 */}
        {isWeatherLoading ? (
          <WeatherCardPlaceholder
            className="mb-6"
            locationName={currentLocationName}
            showMore
          />
        ) : isNotFound ? (
          <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <ErrorMessage message="해당 장소의 정보가 제공되지 않습니다." />
          </div>
        ) : geo.error && !selected ? (
          <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <ErrorMessage message={geo.error} />
          </div>
        ) : isError ? (
          <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <ErrorMessage message="해당 장소의 정보가 제공되지 않습니다." />
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
                state: {
                  locationName: currentLocationName,
                  district: selected?.district,
                  weatherIcon: data.current.icon,
                },
              })
            }
          />
        ) : null}

        {/* 시간별 예보 */}
        {isWeatherLoading && data ? (
          <HourlyForecastPlaceholder />
        ) : data ? (
          <section className="mb-6">
            <HourlyForecastStrip hourly={data.hourly} />
          </section>
        ) : null}

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
      )}
    </div>
  );
};
