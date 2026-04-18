import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useWeather } from '../../entities/weather/model/useWeather';
import { useCurrentLocationNavigation } from '../../features/geolocation/useCurrentLocationNavigation';
import { SearchBar } from '../../widgets/search-bar/SearchBar';
import { WeatherCard } from '../../widgets/weather-card/WeatherCard';
import { WeatherCardPlaceholder } from '../../widgets/weather-card/WeatherCardPlaceholder';
import { HourlyForecastStrip } from '../../widgets/hourly-forecast/HourlyForecastStrip';
import { DetailPagePlaceholder } from './DetailPagePlaceholder';
import { WeeklyForecast } from '../../widgets/weekly-forecast/WeeklyForecast';
import { FavoriteList } from '../../widgets/favorite-list/FavoriteList';
import { ErrorMessage } from '../../shared/ui/ErrorMessage';
import { LocationTitle } from '../../shared/ui/LocationTitle';
import { getWeatherTheme } from '../../shared/lib/getWeatherTheme';
import { getCachedWeatherIcon, setCachedWeatherIcon } from '../../shared/lib/weatherThemeCache';
import { useDevWeather } from '../../shared/lib/useDevWeather';
import { WeatherAnimation } from '../../shared/ui/WeatherAnimation';
import { makeLocationId, parseLocationId } from '../../shared/lib/locationId';
import type { District } from '../../shared/types';

export const DetailPage = () => {
  const { locationId = '' } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state: { locationName?: string; district?: District; weatherIcon?: string } | null;
  };

  const coords = parseLocationId(locationId);
  const { data, isLoading, isError } = useWeather(coords?.lat ?? null, coords?.lon ?? null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [locationId]);

  const [isResolvingSearchLocation, setIsResolvingSearchLocation] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const locationName = state?.locationName ?? data?.locationName ?? '날씨 상세';
  const [cachedWeatherIcon] = useState(() => getCachedWeatherIcon());
  const currentWeatherIcon = data?.current.icon;

  useEffect(() => {
    if (currentWeatherIcon) {
      setCachedWeatherIcon(currentWeatherIcon);
    }
  }, [currentWeatherIcon]);

  const { mockIcon } = useDevWeather();
  const weatherIcon = mockIcon ?? currentWeatherIcon ?? state?.weatherIcon ?? cachedWeatherIcon ?? '01d';
  const { gradient, isDark } = getWeatherTheme(weatherIcon);

  // 현재 위치 이동 흐름을 훅으로 캡슐화 (weatherIcon 결정 후 호출)
  const {
    isResolving: isResolvingCurrentLocation,
    error: currentLocationError,
    handleCurrentLocation,
  } = useCurrentLocationNavigation(weatherIcon);

  const isResolvingLocation = isResolvingSearchLocation || isResolvingCurrentLocation;
  const isInitialLoading = coords !== null && isLoading && !data && !isResolvingLocation;
  const canShowWeather = coords !== null && data !== undefined && !isLoading && !isResolvingLocation;
  const placeholderLocationName = isResolvingCurrentLocation
    ? '현재 위치 불러오는 중'
    : isResolvingSearchLocation
      ? '위치 불러오는 중'
      : locationName;

  const handleSelect = (lat: number, lon: number, district: District) => {
    setIsNotFound(false);
    navigate(`/detail/${makeLocationId(lat, lon)}`, {
      state: {
        locationName: district.displayName,
        district,
        weatherIcon,
      },
    });
  };

  const handleSearchingChange = (isSearching: boolean) => {
    setIsResolvingSearchLocation(isSearching);
  };

  return (
    <div className={`min-h-screen ${gradient} transition-colors duration-500`}>
      <WeatherAnimation icon={weatherIcon} />
      {isInitialLoading ? (
        <DetailPagePlaceholder
          locationName={locationName}
          isDark={isDark}
          onBack={() => navigate('/')}
        />
      ) : (
        <main className="relative z-10 mx-auto max-w-2xl px-4 py-8">

          {/* 헤더 */}
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className={`rounded-full p-2 transition-colors ${isDark ? 'text-white/80 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'}`}
              aria-label="홈으로"
            >
              ←
            </button>
            <LocationTitle
              locationName={locationName}
              primaryClassName={`min-w-0 truncate text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}
              secondaryClassName={`mt-0.5 truncate text-xs font-medium ${isDark ? 'text-white/70' : 'text-slate-500'}`}
              stackOnDesktop
              as="h1"
            />
          </div>

          {/* 검색 */}
          <div className="mb-6">
            <SearchBar
              onSelect={handleSelect}
              onCurrentLocation={handleCurrentLocation}
              onSearchingChange={handleSearchingChange}
              onNotFound={setIsNotFound}
            />
          </div>

          {currentLocationError && (
            <div className="mb-6">
              <ErrorMessage message={currentLocationError} />
            </div>
          )}

          {!coords && !isResolvingLocation && <ErrorMessage message="잘못된 위치 정보입니다." />}
          {isResolvingLocation && (
            <WeatherCardPlaceholder className="mb-6" locationName={placeholderLocationName} />
          )}
          {(isError || isNotFound) && (
            <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
              <ErrorMessage message="해당 장소의 정보가 제공되지 않습니다." />
            </div>
          )}

          {canShowWeather && (
            <>
              {/* 현재 날씨 */}
              <WeatherCard
                className="mb-6"
                locationName={locationName}
                data={data}
                lat={coords.lat}
                lon={coords.lon}
                district={state?.district}
              />

              {/* 시간별 예보 */}
              <section className="mb-4">
                <HourlyForecastStrip hourly={data.hourly} />
              </section>

              {/* 주간예보 */}
              <section className="mb-6">
                <WeeklyForecast daily={data.daily} />
              </section>

              {/* 즐겨찾기 */}
              <section>
                <h2 className={`mb-3 text-sm font-semibold ${isDark ? 'text-white/70' : 'text-slate-600'}`}>즐겨찾기</h2>
                <FavoriteList />
              </section>
            </>
          )}

        </main>
      )}
    </div>
  );
};
