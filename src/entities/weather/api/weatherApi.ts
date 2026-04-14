import { weatherClient } from '../../../shared/api/weatherClient';
import { WEATHER_DESCRIPTION_KO } from '../../../shared/lib/weatherDescriptionKo';
import type { WeatherData, WeatherHourly, WeatherDaily } from '../../../shared/types';

interface OWMCurrentResponse {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: { id: number; description: string; icon: string }[];
  wind: { speed: number };
  sys: { sunrise: number; sunset: number };
}

interface OWMForecastItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: { icon: string }[];
  pop: number;
}

interface OWMForecastResponse {
  list: OWMForecastItem[];
  city: { name: string };
}

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  const [currentRes, forecastRes] = await Promise.all([
    weatherClient.get<OWMCurrentResponse>('/data/2.5/weather', { params: { lat, lon } }),
    weatherClient.get<OWMForecastResponse>('/data/2.5/forecast', { params: { lat, lon } }),
  ]);

  const current = currentRes.data;
  const forecast = forecastRes.data;

  const today = new Date().toISOString().slice(0, 10);
  const todayItems = forecast.list.filter((item) => item.dt_txt.startsWith(today));

  const tempMin =
    todayItems.length > 0
      ? Math.min(...todayItems.map((item) => item.main.temp_min))
      : current.main.temp;
  const tempMax =
    todayItems.length > 0
      ? Math.max(...todayItems.map((item) => item.main.temp_max))
      : current.main.temp;

  const hourly: WeatherHourly[] = forecast.list.slice(0, 8).map((item) => ({
    dt: item.dt,
    time: item.dt_txt.slice(11, 16),
    temp: Math.round(item.main.temp),
    icon: item.weather[0].icon,
    pop: item.pop,
  }));

  // 날짜별 그룹핑 → 주간예보
  const DAY_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];
  const todayDate = new Date().toISOString().slice(0, 10);

  const groupedByDate = forecast.list.reduce<Record<string, OWMForecastItem[]>>((acc, item) => {
    const date = item.dt_txt.slice(0, 10);
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const daily: WeatherDaily[] = Object.entries(groupedByDate).map(([date, items]) => {
    const amItems = items.filter((i) => { const h = parseInt(i.dt_txt.slice(11, 13)); return h >= 6 && h < 12; });
    const pmItems = items.filter((i) => { const h = parseInt(i.dt_txt.slice(11, 13)); return h >= 12 && h < 18; });
    const fallback = [...items].sort((a, b) => b.pop - a.pop);

    const amBest = amItems.sort((a, b) => b.pop - a.pop)[0] ?? fallback[0];
    const pmBest = pmItems.sort((a, b) => b.pop - a.pop)[0] ?? fallback[0];

    const d = new Date(date + 'T12:00:00');
    let dayLabel: string;
    if (date === todayDate) {
      dayLabel = '오늘';
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().slice(0, 10);
      dayLabel = date === tomorrowDate ? '내일' : DAY_OF_WEEK[d.getDay()];
    }

    return {
      date,
      dayLabel,
      tempMin: Math.round(Math.min(...items.map((i) => i.main.temp_min))),
      tempMax: Math.round(Math.max(...items.map((i) => i.main.temp_max))),
      amIcon: amBest.weather[0].icon,
      pmIcon: pmBest.weather[0].icon,
      amPop: Math.max(...(amItems.length ? amItems : items).map((i) => i.pop)),
      pmPop: Math.max(...(pmItems.length ? pmItems : items).map((i) => i.pop)),
    };
  });

  return {
    locationName: current.name,
    current: {
      temp: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      tempMin: Math.round(tempMin),
      tempMax: Math.round(tempMax),
      description: WEATHER_DESCRIPTION_KO[current.weather[0].id] ?? current.weather[0].description,
      icon: current.weather[0].icon,
      humidity: current.main.humidity,
      windSpeed: current.wind.speed,
      sunrise: current.sys.sunrise,
      sunset: current.sys.sunset,
    },
    hourly,
    daily,
  };
}
