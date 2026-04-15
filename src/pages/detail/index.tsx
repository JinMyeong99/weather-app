import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useWeather } from '../../entities/weather/model/useWeather';
import { WeatherCard } from '../../widgets/weather-card/WeatherCard';
import { HourlyForecastStrip } from '../../widgets/hourly-forecast/HourlyForecastStrip';
import { WeeklyForecast } from '../../widgets/weekly-forecast/WeeklyForecast';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import { ErrorMessage } from '../../shared/ui/ErrorMessage';

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

export const DetailPage = () => {
  const { locationId = '' } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const { state } = useLocation() as { state: { locationName?: string } | null };

  const coords = parseLocationId(locationId);
  const { data, isLoading, isError } = useWeather(coords?.lat ?? null, coords?.lon ?? null);

  const locationName = state?.locationName ?? data?.locationName ?? '날씨 상세';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8">

        {/* 헤더 */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="뒤로가기"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-gray-800">{locationName}</h1>
        </div>

        {!coords && <ErrorMessage message="잘못된 위치 정보입니다." />}
        {isLoading && <LoadingSpinner />}
        {isError && <ErrorMessage message="날씨 정보를 불러올 수 없습니다." />}

        {data && (
          <>
            {/* 현재 날씨 */}
            <WeatherCard
              className="mb-6"
              locationName={locationName}
              data={data}
              lat={coords!.lat}
              lon={coords!.lon}
            />

            {/* 시간별 예보 */}
            <section className="mb-4">
              <HourlyForecastStrip hourly={data.hourly} />
            </section>

            {/* 주간예보 */}
            <section>
              <WeeklyForecast daily={data.daily} />
            </section>
          </>
        )}

      </div>
    </div>
  );
};
