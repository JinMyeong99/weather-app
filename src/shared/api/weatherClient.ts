import axios from 'axios';

export const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org',
});

weatherClient.interceptors.request.use((config) => {
  config.params = {
    appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
    units: 'metric',
    lang: 'ko',
    ...config.params,
  };
  return config;
});

weatherClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API Error]', err.config?.url, err.response?.status, err.response?.data);
    return Promise.reject(err);
  }
);
