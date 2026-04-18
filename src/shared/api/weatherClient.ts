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
    if (axios.isCancel(err) || err?.code === 'ERR_CANCELED') {
      return Promise.reject(err);
    }

    if (import.meta.env.DEV) {
      console.error('[API Error]', {
        method: err.config?.method?.toUpperCase(),
        url: err.config?.url,
        status: err.response?.status,
        code: err.code,
        message: err.message,
        data: err.response?.data,
      });
    }

    return Promise.reject(err);
  }
);
