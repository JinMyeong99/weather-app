import { weatherClient } from '../../../shared/api/weatherClient';
import { WEATHER_DESCRIPTION_KO } from '../../../shared/lib/weatherDescriptionKo';
import type { WeatherData, WeatherHourly, WeatherDaily } from '../../../shared/types';

interface OWMOneCallResponse {
  current: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    uvi: number;
    weather: { id: number; description: string; icon: string }[];
  };
  hourly: Array<{
    dt: number;
    temp: number;
    weather: { icon: string }[];
    pop: number;
  }>;
  daily: Array<{
    dt: number;
    temp: { min: number; max: number };
    weather: { icon: string }[];
    pop: number;
  }>;
}

interface OWMAirPollutionResponse {
  list: Array<{
    components: {
      pm2_5: number;
      pm10: number;
    };
  }>;
}

interface OWMReverseGeoItem {
  name: string;
  local_names?: { ko?: string };
}

const DAY_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

function toDateStr(dt: number): string {
  const d = new Date(dt * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function toTimeStr(dt: number): string {
  const d = new Date(dt * 1000);
  return `${String(d.getHours()).padStart(2, '0')}:00`;
}

function toLocalDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDayLabel(date: string): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  if (date === toLocalDateStr(now)) return '오늘';
  if (date === toLocalDateStr(tomorrow)) return '내일';
  return DAY_OF_WEEK[new Date(date + 'T12:00:00').getDay()];
}

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  const [oneCallRes, geoRes, airRes] = await Promise.all([
    weatherClient.get<OWMOneCallResponse>('/data/3.0/onecall', {
      params: { lat, lon, exclude: 'minutely,alerts' },
    }),
    weatherClient.get<OWMReverseGeoItem[]>('/geo/1.0/reverse', {
      params: { lat, lon, limit: 1 },
    }),
    weatherClient.get<OWMAirPollutionResponse>('/data/2.5/air_pollution', {
      params: { lat, lon },
    }),
  ]);

  const oc = oneCallRes.data;
  const geoItem = geoRes.data[0];
  const locationName = geoItem?.local_names?.ko ?? geoItem?.name ?? '알 수 없음';

  const airComponents = airRes.data.list[0]?.components;
  const pm10 = Math.round(airComponents?.pm10 ?? 0);
  const pm25 = Math.round(airComponents?.pm2_5 ?? 0);

  // hourly: 현재 시각 항목 prepend
  const nowEpoch = Math.floor(Date.now() / 1000);
  const now = new Date();
  const currentHourlyItem: WeatherHourly = {
    dt: nowEpoch,
    time: `${String(now.getHours()).padStart(2, '0')}:00`,
    temp: Math.round(oc.current.temp),
    icon: oc.current.weather[0].icon,
    pop: 0,
  };

  // 현재 UTC 정각(currentHourStart)과 같은 OWM 항목 제외 (현재 시각으로 prepend 했으므로 중복 방지)
  const currentHourStart = Math.floor(nowEpoch / 3600) * 3600;
  const forecastHourly = oc.hourly.filter((item) => item.dt > currentHourStart);

  const hourly: WeatherHourly[] = [
    currentHourlyItem,
    ...forecastHourly.slice(0, 47).map((item) => ({
      dt: item.dt,
      time: toTimeStr(item.dt),
      temp: Math.round(item.temp),
      icon: item.weather[0].icon,
      pop: item.pop,
    })),
  ];

  // daily: hourly 기반 AM/PM 아이콘 추출
  type HourlyItem = { dt: number; icon: string; pop: number };
  const hourlyByDate = oc.hourly.reduce<Record<string, HourlyItem[]>>((acc, item) => {
    const date = toDateStr(item.dt);
    if (!acc[date]) acc[date] = [];
    acc[date].push({ dt: item.dt, icon: item.weather[0].icon, pop: item.pop });
    return acc;
  }, {});

  const daily: WeatherDaily[] = oc.daily.map((item) => {
    const date = toDateStr(item.dt);
    const dayItems = hourlyByDate[date] ?? [];

    const amItems = dayItems.filter((i) => {
      const h = new Date(i.dt * 1000).getHours();
      return h >= 6 && h < 12;
    });
    const pmItems = dayItems.filter((i) => {
      const h = new Date(i.dt * 1000).getHours();
      return h >= 12 && h < 18;
    });
    const fallback = [...dayItems].sort((a, b) => b.pop - a.pop);
    const dailyIcon = item.weather[0].icon;

    const amBest = [...amItems].sort((a, b) => b.pop - a.pop)[0] ?? fallback[0];
    const pmBest = [...pmItems].sort((a, b) => b.pop - a.pop)[0] ?? fallback[0];

    return {
      date,
      dayLabel: getDayLabel(date),
      tempMin: Math.round(item.temp.min),
      tempMax: Math.round(item.temp.max),
      amIcon: amBest?.icon ?? dailyIcon,
      pmIcon: pmBest?.icon ?? dailyIcon,
      amPop: amItems.length > 0 ? Math.max(...amItems.map((i) => i.pop)) : item.pop,
      pmPop: pmItems.length > 0 ? Math.max(...pmItems.map((i) => i.pop)) : item.pop,
    };
  });

  return {
    locationName,
    current: {
      temp: Math.round(oc.current.temp),
      feelsLike: Math.round(oc.current.feels_like),
      tempMin: Math.round(oc.daily[0].temp.min),
      tempMax: Math.round(oc.daily[0].temp.max),
      description:
        WEATHER_DESCRIPTION_KO[oc.current.weather[0].id] ??
        oc.current.weather[0].description,
      icon: oc.current.weather[0].icon,
      humidity: oc.current.humidity,
      windSpeed: oc.current.wind_speed,
      sunrise: oc.current.sunrise,
      sunset: oc.current.sunset,
      uvi: Math.round(oc.current.uvi),
      pm10,
      pm25,
    },
    hourly,
    daily,
  };
}
