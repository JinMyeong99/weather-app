# Weather App

**🌐 배포:** https://weather-app-snowy-nine-96.vercel.app/

OpenWeather API를 활용한 React 날씨 앱입니다. 현재 위치 또는 한국 행정구역 검색으로 날씨를 확인하고, 자주 보는 지역을 즐겨찾기로 저장할 수 있습니다.

## 주요 기능

- 현재 위치 기반 날씨 조회
- 시/구/동 단위 지역 검색
- 현재 날씨, 체감 온도, 습도, 풍속, 일출/일몰, 미세먼지, 자외선 표시
- 48시간 시간별 예보와 주간 예보
- 즐겨찾기 저장, 삭제, 별칭 수정
- 날씨 코드별 Canvas 배경 애니메이션
- 개발 환경 전용 날씨 배경 테스트 패널

## 기술 스택

- React 19
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Zustand
- Axios
- OpenWeather One Call / Geocoding / Air Pollution API

## 실행 방법

```bash
npm install
cp .env.example .env
npm run dev
```

`.env`에 OpenWeather API 키를 설정합니다.

```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```

## 검증 명령

```bash
npm run lint
npm run build
```

## 구현 포인트

- API 요청은 `weatherClient`에서 공통 파라미터(`appid`, `units`, `lang`)를 주입합니다.
- 날씨 데이터는 TanStack Query로 캐싱하고, 즐겨찾기는 Zustand persist로 localStorage에 저장합니다.
- 배경 효과는 DOM 파티클 대신 Canvas와 `requestAnimationFrame`으로 렌더링합니다.
- 개발용 날씨 preset 패널과 React Query Devtools는 개발 환경에서만 노출합니다.

## 알려진 제한사항

- 지역 검색은 한국 행정구역 데이터를 기준으로 합니다.
- OpenWeather Geocoding 결과에 의존하므로 일부 동명이 지역은 외부 API 응답 품질의 영향을 받을 수 있습니다.
- 브라우저에서 위치 권한을 거부하면 검색으로 지역을 선택해야 합니다.
