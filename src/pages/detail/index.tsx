import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useWeather } from '../../entities/weather/model/useWeather';
import { WeatherDetail } from '../../widgets/weather-detail/WeatherDetail';
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

        {/* 에러: 잘못된 locationId */}
        {!coords && (
          <ErrorMessage message="잘못된 위치 정보입니다." />
        )}

        {isLoading && <LoadingSpinner />}
        {isError && <ErrorMessage message="날씨 정보를 불러올 수 없습니다." />}

        {data && (
          <>
            {/* 현재 날씨 */}
            <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
              <WeatherDetail data={data} />
            </section>

            {/* 시간별 예보 */}
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-gray-600">시간별 예보</h2>
              <ul className="divide-y divide-gray-100">
                {data.hourly.map((item) => (
                  <li key={item.time} className="flex items-center justify-between py-3">
                    <span className="w-16 text-sm text-gray-500">{item.time}</span>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                      alt=""
                      className="h-8 w-8"
                    />
                    <span className="text-sm font-semibold text-gray-800">{item.temp}°</span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

      </div>
    </div>
  );
};
