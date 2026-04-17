import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentPositionOnce } from '../../features/geolocation/getCurrentPositionOnce';
import { reverseGeocode } from '../../features/geolocation/reverseGeocode';
import { useWeather } from '../../entities/weather/model/useWeather';
import { SearchBar } from '../../widgets/search-bar/SearchBar';
import { WeatherCard } from '../../widgets/weather-card/WeatherCard';
import { WeatherCardPlaceholder } from '../../widgets/weather-card/WeatherCardPlaceholder';
import { HourlyForecastStrip } from '../../widgets/hourly-forecast/HourlyForecastStrip';
import { DetailPagePlaceholder } from './DetailPagePlaceholder';
import { WeeklyForecast } from '../../widgets/weekly-forecast/WeeklyForecast';
import { FavoriteList } from '../../widgets/favorite-list/FavoriteList';
import { ErrorMessage } from '../../shared/ui/ErrorMessage';
import { useFavorites } from '../../features/favorites/useFavorites';
import { getWeatherTheme } from '../../shared/lib/getWeatherTheme';
import { getCachedWeatherIcon, setCachedWeatherIcon } from '../../shared/lib/weatherThemeCache';
import { useDevWeather } from '../../shared/lib/useDevWeather';
import { WeatherAnimation } from '../../shared/ui/WeatherAnimation';
import type { District } from '../../shared/types';

function parseLocationId(locationId: string): { lat: number; lon: number } | null {
  try {
    const decoded = atob(locationId);
    const [lat, lon] = decoded.split(',').map(Number);
    if (isNaN(lat) || isNaN(lon)) return null;
    return { lat, lon };
  } catch {
    return null;
  }
}

function makeLocationId(lat: number, lon: number): string {
  return btoa(`${lat},${lon}`);
}

export const DetailPage = () => {
  const { locationId = '' } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state: { locationName?: string; district?: District; weatherIcon?: string } | null;
  };

  const coords = parseLocationId(locationId);
  const { data, isLoading, isError } = useWeather(coords?.lat ?? null, coords?.lon ?? null);
  const { favorites, removeFavorite, updateAlias } = useFavorites();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [locationId]);

  const [isResolvingSearchLocation, setIsResolvingSearchLocation] = useState(false);
  const [isResolvingCurrentLocation, setIsResolvingCurrentLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
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
  const isResolvingLocation = isResolvingSearchLocation || isResolvingCurrentLocation;
  const isInitialLoading = coords !== null && isLoading && !data && !isResolvingLocation;
  const canShowWeather = coords !== null && data !== undefined && !isLoading && !isResolvingLocation;
  const placeholderLocationName = isResolvingCurrentLocation
    ? '현재 위치 불러오는 중'
    : isResolvingSearchLocation
      ? '위치 불러오는 중'
      : locationName;

  const handleSelect = (lat: number, lon: number, district: District) => {
    setLocationError(null);
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
    if (isSearching) {
      setLocationError(null);
    }
  };

  const handleCurrentLocation = async () => {
    setLocationError(null);
    setIsResolvingCurrentLocation(true);

    try {
      const position = await getCurrentPositionOnce();
      const currentLocationName = await reverseGeocode(position.lat, position.lon);

      navigate(`/detail/${makeLocationId(position.lat, position.lon)}`, {
        state: {
          locationName: currentLocationName,
          weatherIcon,
        },
      });
    } catch (error) {
      setLocationError((error as Error).message);
    } finally {
      setIsResolvingCurrentLocation(false);
    }
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
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{locationName}</h1>
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

          {locationError && (
            <div className="mb-6">
              <ErrorMessage message={locationError} />
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
                <FavoriteList
                  favorites={favorites}
                  onRemove={removeFavorite}
                  onAliasUpdate={updateAlias}
                />
              </section>
            </>
          )}

        </main>
      )}
    </div>
  );
};
