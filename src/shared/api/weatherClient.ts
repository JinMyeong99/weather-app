import axios from 'axios';

export const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org',
  params: {
    appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
    units: 'metric',
    lang: 'ko',
  },
});
