# 날씨 앱

[![배포](https://img.shields.io/badge/배포-Vercel-black?logo=vercel)](https://weather-app-snowy-nine-96.vercel.app/)
[![Storybook](https://img.shields.io/badge/Storybook-FF4785?logo=storybook&logoColor=white)](https://weather-app-snowy-nine-96.vercel.app/)

OpenWeather API와 Kakao Local API를 활용한 React 날씨 앱입니다.  
현재 위치 또는 한국 행정구역 검색으로 날씨를 확인하고, 자주 보는 지역을 즐겨찾기로 저장할 수 있습니다.

---

## 미리보기

> 배포 URL 접속 후 **좌측 하단 🎨 날씨 테마** 버튼으로 맑음·비·눈·뇌우 등 12가지 배경 애니메이션을 바로 확인할 수 있습니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 현재 위치 날씨 | 브라우저 Geolocation으로 위치를 감지해 즉시 날씨를 표시합니다 |
| 지역 검색 | 시·구·동 단위로 검색하며 ↑↓ Enter Escape 키보드 내비게이션을 지원합니다 |
| 날씨 상세 | 기온·체감온도·습도·풍속·미세먼지(PM10/PM2.5)·자외선·일출일몰을 표시합니다 |
| 시간별 예보 | 48시간 기온 변화를 SVG 곡선 그래프로 시각화합니다 |
| 주간 예보 | 8일 예보를 오전·오후 아이콘과 강수확률로 구분해 표시합니다 |
| 즐겨찾기 | 최대 6개 저장, 별칭 인라인 편집, 새로고침 후에도 유지됩니다 |
| 배경 애니메이션 | 날씨 코드에 따라 비·눈·뇌우·안개 등 Canvas 배경이 바뀝니다 |
| 스켈레톤 플레이스홀더 | 데이터 로딩 중 실제 레이아웃과 일치하는 스켈레톤을 표시합니다 |

---

## 기술 스택

| 분류 | 기술 | 선택 이유 |
|------|------|----------|
| UI | React 19 + TypeScript | — |
| 스타일 | Tailwind CSS 4 | — |
| 라우팅 | React Router 7 | — |
| 서버 상태 | TanStack Query 5 | 5분 staleTime 캐싱, AbortSignal 기반 요청 자동 취소 |
| 클라이언트 상태 | Zustand 5 | `persist` 미들웨어로 즐겨찾기 localStorage 자동 동기화 |
| 런타임 검증 | Zod 4 | 외부 API 응답을 스키마로 검증해 타입 단언 없이 안전하게 사용 |
| 컴포넌트 문서 | Storybook 10 | `play` 함수로 키보드 내비게이션·별칭 편집 등 인터랙션 자동 검증 |
| 빌드 | Vite 8 | — |

---

## 아키텍처

**FSD(Feature Sliced Design)** 를 채택했습니다. 기능이 추가될수록 `pages/`나 `components/`에 파일이 몰리는 평면 구조의 문제를 방지하고, 레이어 간 의존성 방향을 단방향으로 강제해 응집도를 유지하기 위해서입니다.

```
src/
├── app/        # 라우터, 전역 프로바이더
├── pages/      # 홈·상세 페이지
├── widgets/    # 페이지를 구성하는 독립 UI 블록 (SearchBar, WeatherCard 등)
├── features/   # 단일 책임 기능 (즐겨찾기, 검색 지오코딩, 위치 감지)
├── entities/   # 도메인 모델 (weather, district)
└── shared/     # 공용 타입·유틸·UI 컴포넌트
```

---

## 기술적 의사결정

### 1. Canvas 날씨 애니메이션

DOM 엘리먼트로 파티클을 만들면 수십~수백 개의 리플로우가 발생합니다. Canvas + `requestAnimationFrame`을 사용하면 GPU 합성 레이어에서 처리되므로 메인 스레드 부담 없이 부드러운 애니메이션이 가능합니다.

추가로 두 가지를 고려했습니다.
- `prefers-reduced-motion` 감지: 접근성 설정이 켜진 경우 파티클 수를 45% 수준으로 줄입니다.
- `devicePixelRatio` 캡: 고해상도 디스플레이에서 4K 해상도로 렌더링되는 것을 막기 위해 2x까지만 허용합니다.

### 2. 지역 데이터 954KB 동적 로드

전국 행정구역 JSON(954KB)을 정적으로 import하면 초기 번들에 포함되어 앱 진입 시 모든 사용자가 불필요하게 받아야 합니다. 검색창에 **첫 글자를 입력하는 시점**에 `dynamic import`로 로드하도록 변경해 초기 번들을 분리했습니다.

모듈 레벨 변수에 캐싱해 두 번째 검색부터는 즉시 반환되며, 로드가 진행 중일 때 중복 요청도 방지합니다.

```
초기 번들(index.js)  195KB   ← 지역 데이터 제외
korea_districts.js   915KB   ← 첫 검색 시 1회만 로드
```

### 3. API 응답 Zod 런타임 검증

OpenWeather와 Kakao API의 응답 구조는 언제든 바뀔 수 있습니다. TypeScript 타입은 컴파일 타임에만 유효하므로 런타임에서 예상 밖의 응답이 들어와도 에러 위치를 특정하기 어렵습니다.

Zod 스키마로 검증하면 스펙 불일치 시 어느 필드가 문제인지 메시지가 명확하게 출력되고, 검증 통과 후에는 TypeScript가 타입을 완전히 추론하므로 `as` 단언 없이 안전하게 사용할 수 있습니다.

### 4. TanStack Query AbortSignal 연동

`queryFn`이 받는 `signal`을 axios 요청 설정에 전달합니다. 사용자가 날씨를 불러오는 중에 다른 페이지로 이동하면 TanStack Query가 signal을 abort하고, 브라우저 레벨에서 OpenWeather·ReverseGeo·AirPollution 세 요청이 모두 즉시 취소됩니다.

### 5. 즐겨찾기 중복 방지와 별칭 분리

같은 장소를 다른 경로로 두 번 추가하는 상황을 막기 위해 좌표를 소수점 4자리로 정규화한 키(`lat_lon`)로 중복을 판별합니다. 약 10m 이내의 오차는 동일 위치로 처리합니다.

별칭은 `favoritesStore`에만 저장하고 날씨 API 위치명과 분리했습니다. 즐겨찾기 별칭을 바꿔도 날씨 카드의 공식 지역명이 바뀌지 않아야 한다고 판단했습니다. 카드 클릭 시 `state.locationName`으로 별칭을 헤더에 표시하는 방식으로 두 값을 구분합니다.

### 6. Geolocation Promise 싱글턴

`getCurrentPositionOnce`는 이름처럼 한 번만 실행되어야 합니다. 진행 중인 Promise를 모듈 레벨 변수에 저장해 두면, 현재 위치 버튼을 빠르게 여러 번 눌러도 브라우저 권한 팝업이 중복으로 뜨지 않습니다. 요청 실패 시에는 변수를 `null`로 초기화해 재시도가 가능하도록 합니다.

### 7. 즐겨찾기 추가 한도 토스트 알림

"최대 6개" 제한을 모달 대신 토스트로 처리했습니다. 모달은 사용자 흐름을 끊지만 토스트는 현재 화면을 유지한 채 정보를 전달합니다. CSS `@keyframes`로 Y축 슬라이드 인 애니메이션을 구현하고 3초 후 자동 소멸합니다.

---

## 실행 방법

```bash
npm install
cp .env.example .env
# .env에 API 키 입력 후 실행
npm run dev
```

Storybook:

```bash
npm run storybook   # port 6006
```

프로덕션 빌드 검증:

```bash
npm run lint
npm run build
```

---

## 환경 변수

```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
VITE_KAKAO_REST_API_KEY=your_kakao_rest_api_key
```

- **OpenWeather**: [One Call API 3.0](https://openweathermap.org/api/one-call-3) + Air Pollution API 사용
- **Kakao**: [Kakao Developers](https://developers.kakao.com/)에서 앱 생성 후 카카오맵 활성화, 로컬/배포 도메인을 Web 플랫폼에 등록

---

## Git 워크플로우

`main` ← `develop` ← `feat/*` 브랜치 전략을 유지했습니다.  
GitHub 저장소에서 Squash·Rebase Merge를 비활성화하고 Merge Commit만 허용해 기능 브랜치 단위 이력이 보존되도록 설정했습니다.

기능별 Issue 생성 → `feat/*` 브랜치 작업 → PR → Merge 순서로 진행했습니다.

> PR #38~#48은 GitHub 저장소 설정 오류로 Squash Merge가 적용되었습니다. 이후 설정을 수정해 Merge Commit 전략으로 통일했습니다.
