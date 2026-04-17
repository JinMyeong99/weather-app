import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '../../features/geolocation/useGeolocation';
import { useCurrentLocationName } from '../../features/geolocation/useCurrentLocationName';
import { useWeather } from '../../entities/weather/model/useWeather';
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
import { makeLocationId } from '../../shared/lib/locationId';
import type { District } from '../../shared/types';
import { HomePagePlaceholder, HourlyForecastPlaceholder } from './HomePagePlaceholder';
import { getWeatherCardState } from './weatherCardState';

export const HomePage = () => {
  const navigate = useNavigate();
  const geo = useGeolocation();
  const [selected, setSelected] = useState<{ lat: number; lon: number; district: District } | null>(null);
  const [isResolvingSearchLocation, setIsResolvingSearchLocation] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const lat = selected?.lat ?? geo.lat;
  const lon = selected?.lon ?? geo.lon;

  const geoLocationName = useCurrentLocationName(geo.lat, geo.lon, selected === null);
  const currentLocationName = selected?.district.displayName ?? geoLocationName ?? '현재 위치';

  const { data, isLoading: weatherLoading, isError } = useWeather(lat, lon);
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

  const cardState = getWeatherCardState({
    isWeatherLoading,
    isNotFound,
    geoError: geo.error,
    isSelected: selected !== null,
    isError,
    data,
    lat,
    lon,
  });

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
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-8">

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

        {/* 현재 날씨 — discriminated union으로 분기 */}
        {cardState.status === 'loading' && (
          <WeatherCardPlaceholder className="mb-6" locationName={currentLocationName} showMore />
        )}
        {cardState.status === 'error' && (
          <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <ErrorMessage message={cardState.message} />
          </div>
        )}
        {cardState.status === 'success' && (
          <WeatherCard
            className="mb-6"
            locationName={currentLocationName}
            data={cardState.data}
            lat={cardState.lat}
            lon={cardState.lon}
            district={selected?.district}
            onClick={() =>
              navigate(`/detail/${makeLocationId(cardState.lat, cardState.lon)}`, {
                state: {
                  locationName: currentLocationName,
                  district: selected?.district,
                  weatherIcon: cardState.data.current.icon,
                },
              })
            }
          />
        )}

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
          <FavoriteList />
        </section>

      </main>
      )}
    </div>
  );
};
