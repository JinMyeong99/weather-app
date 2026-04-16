import axios from 'axios';

export const kakaoClient = axios.create({
  baseURL: 'https://dapi.kakao.com',
});

kakaoClient.interceptors.request.use((config) => {
  const kakaoRestApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY?.trim();

  if (!kakaoRestApiKey) {
    throw new Error('VITE_KAKAO_REST_API_KEY 환경변수가 설정되지 않았습니다.');
  }

  config.headers.Authorization = `KakaoAK ${kakaoRestApiKey}`;
  return config;
});

kakaoClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (import.meta.env.DEV) {
      console.error('[Kakao API Error]', err.config?.url, err.response?.status, err.response?.data);
    }

    return Promise.reject(err);
  }
);
