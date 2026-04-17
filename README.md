# 날씨 앱

[![App](https://img.shields.io/badge/App-Vercel-black?logo=vercel)](https://weather-app-snowy-nine-96.vercel.app/)
[![Storybook](https://img.shields.io/badge/Storybook-FF4785?logo=storybook&logoColor=white)](https://weather-app-storybook-xi.vercel.app/)

OpenWeather API와 Kakao Local API를 활용한 React 날씨 앱입니다.  
현재 위치 또는 대한민국 행정구역 검색으로 날씨를 확인하고, 자주 보는 지역을 즐겨찾기로 저장할 수 있습니다.

---

## 제출 링크

| 항목 | URL |
|------|-----|
| GitHub Repository | https://github.com/JinMyeong99/weather-app |
| App 배포 | https://weather-app-snowy-nine-96.vercel.app/ |
| Storybook 배포 | https://weather-app-storybook-xi.vercel.app/ |

---

## 과제 요구사항 충족 여부

| 과제 요구사항 | 구현 내용 | 확인 방법 |
|--------------|----------|----------|
| Open API로 날씨 정보 표시 | OpenWeather One Call API로 현재 기온, 당일 최저/최고, 체감온도, 습도, 풍속, 일출/일몰, 시간별·주간 예보를 표시합니다 | 홈 또는 상세 페이지의 날씨 카드, 시간별 예보, 주간 예보 확인 |
| 앱 첫 진입 시 현재 위치 감지 | 브라우저 Geolocation으로 좌표를 얻고, Kakao reverse geocoding으로 지역명을 변환한 뒤 OpenWeather 날씨를 조회합니다 | 첫 접속 후 위치 권한 허용 |
| 시·군·구·동 단위 장소 검색 | 제공된 `korea_districts.json`을 후보 목록으로 사용하고, 선택한 행정구역을 Kakao Local API로 좌표 변환합니다 | `서울특별시`, `종로구`, `청운동` 등 검색 |
| 검색 결과 리스트 표시 | 입력값과 매칭되는 행정구역 리스트를 dropdown으로 표시하고, 마우스와 키보드로 선택할 수 있습니다 | 검색창 입력 후 ↑↓ Enter Escape 조작 |
| 장소 정보 없음 UI | 좌표 변환 또는 날씨 조회에 실패하면 `해당 장소의 정보가 제공되지 않습니다.`를 표시합니다 | 존재하지 않는 장소 검색 또는 API 실패 케이스 |
| 즐겨찾기 추가·삭제 | 검색한 장소를 최대 6개까지 저장하고, 저장된 장소는 카드 UI로 표시합니다 | 날씨 카드의 추가 버튼 클릭 |
| 즐겨찾기 별칭 수정 | 즐겨찾기 카드에서 별칭을 인라인으로 수정하고 localStorage에 유지합니다 | 즐겨찾기 카드의 편집 버튼 클릭 |
| 즐겨찾기 카드 정보 표시 | 즐겨찾기 카드에 현재 날씨, 현재 기온, 당일 최저/최고 기온을 표시합니다 | 홈 하단 즐겨찾기 영역 확인 |
| 상세 페이지 이동 | 즐겨찾기 카드를 클릭하면 상세 페이지로 이동하고, 과제에 명시된 날씨 정보를 표시합니다 | 즐겨찾기 카드 클릭 |
| 필수 기술 스택 | React, TypeScript, Functional Component, FSD, TanStack Query, Tailwind CSS로 구현했습니다 | `src/` 구조와 `package.json` 확인 |
| 반응형 UI | 모바일과 데스크탑에서 카드, 예보, 즐겨찾기 레이아웃이 자연스럽게 바뀝니다 | 브라우저 모바일 폭 또는 DevTools 확인 |

---

## 빠르게 확인하는 방법

1. 배포 앱에 접속하고 위치 권한을 허용해 현재 위치 날씨가 표시되는지 확인합니다.
2. 검색창에 `서울특별시`, `종로구`, `청운동`을 입력해 시·구·동 단위 검색 결과가 나오는지 확인합니다.
3. 검색 결과를 선택해 날씨 카드와 시간별 예보가 새 지역 기준으로 전환되는지 확인합니다.
4. 날씨 카드를 즐겨찾기에 추가하고, 즐겨찾기 카드 별칭을 수정한 뒤 새로고침 후 유지되는지 확인합니다.
5. 즐겨찾기 카드를 클릭해 상세 페이지로 이동하고, 현재 기온·최저/최고·시간별 예보가 표시되는지 확인합니다.
6. 좌측 하단 **🎨 배경 데모** 버튼으로 맑음·비·눈·뇌우 등 Canvas 배경을 확인합니다.
7. 모바일 폭에서 검색창, 날씨 카드, 시간별 예보, 즐겨찾기 카드가 깨지지 않는지 확인합니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 현재 위치 날씨 | Geolocation 좌표를 Kakao Local API로 행정동명 변환 후 날씨를 조회합니다 |
| 대한민국 행정구역 검색 | `korea_districts.json` 기반 후보 목록과 Kakao Local API 좌표 변환으로 시·구·동 검색을 지원합니다 |
| 날씨 상세 | 현재 기온, 당일 최저/최고, 체감온도, 습도, 풍속, 미세먼지(PM10/PM2.5), 자외선, 일출/일몰을 표시합니다 |
| 시간별 예보 | 48시간 기온 변화를 SVG 곡선 그래프로 시각화합니다 |
| 주간 예보 | 8일 예보를 오전·오후 아이콘과 강수확률로 구분해 표시합니다 |
| 즐겨찾기 | 최대 6개 저장, 별칭 인라인 편집, 현재 날씨와 당일 최저/최고 표시, 상세 페이지 이동을 지원합니다 |
| 배경 애니메이션 | OpenWeather icon code에 따라 맑음·구름·비·소나기·뇌우·눈·안개 Canvas 배경이 바뀝니다 |
| 스켈레톤 placeholder | 초기 로딩과 지역 전환 중 실제 레이아웃과 같은 크기의 placeholder를 표시합니다 |
| Storybook | 주요 UI 컴포넌트를 독립적으로 확인하고 interaction 테스트를 실행할 수 있습니다 |

---

## 기술 스택

| 분류 | 기술 | 선택 이유 |
|------|------|----------|
| UI | React 19 + TypeScript | Functional Component 기반으로 타입 안정성과 컴포넌트 재사용성을 확보했습니다 |
| 스타일 | Tailwind CSS 4 | 반응형 UI와 상태별 스타일을 빠르게 구성했습니다 |
| 라우팅 | React Router 7 | 홈·상세 페이지 전환과 route state 전달에 사용했습니다 |
| 서버 상태 | TanStack Query 5 | 캐싱, staleTime, 요청 취소, 로딩·에러 상태 관리를 일관화했습니다 |
| 클라이언트 상태 | Zustand 5 | `persist` 미들웨어로 즐겨찾기 localStorage 저장을 단순화했습니다 |
| 런타임 검증 | Zod 4 | 외부 API 응답을 schema로 검증해 타입 단언 없이 안전하게 변환합니다 |
| API | OpenWeather, Kakao Local API | OpenWeather는 날씨 데이터, Kakao는 한국 지역 좌표 변환에 사용했습니다 |
| 컴포넌트 문서 | Storybook 10 | 컴포넌트 상태와 키보드/편집 interaction을 독립적으로 검증합니다 |
| 빌드 | Vite 8 | 빠른 개발 서버와 production build에 사용했습니다 |

---

## 아키텍처

**FSD(Feature Sliced Design)** 를 채택했습니다. 기능이 추가될수록 `pages/`나 `components/`에 파일이 몰리는 평면 구조를 피하고, 레이어 간 의존성 방향을 단방향으로 유지하기 위해서입니다.

```
src/
├── app/        # 라우터, 전역 프로바이더
├── pages/      # 홈·상세 페이지
├── widgets/    # 페이지를 구성하는 독립 UI 블록
├── features/   # 단일 책임 기능 (즐겨찾기, 검색 지오코딩, 위치 감지)
├── entities/   # 도메인 모델 (weather, district)
└── shared/     # 공용 타입·유틸·UI 컴포넌트
```

---

## 기술적 의사결정

### 1. FSD로 페이지·위젯·기능 책임 분리

날씨 앱은 검색, 현재 위치, 즐겨찾기, 날씨 조회, 배경 애니메이션처럼 변경 이유가 다른 기능이 함께 존재합니다. FSD 레이어로 분리해 페이지는 조합에 집중하고, 검색·위치·즐겨찾기 같은 기능은 독립적으로 테스트하고 수정할 수 있게 했습니다.

### 2. TanStack Query로 서버 데이터 관리

날씨 데이터는 좌표가 바뀔 때마다 다시 조회되어야 하고, 페이지 이동이나 빠른 지역 전환 중 이전 요청을 취소해야 합니다. `queryFn`의 `signal`을 axios 요청에 전달해 OpenWeather 요청을 브라우저 레벨에서 취소하고, `staleTime`으로 불필요한 반복 호출을 줄였습니다.

### 3. `korea_districts.json`은 검색 후보, Kakao는 좌표 변환

과제에서 제공된 대한민국 행정구역 JSON은 검색 후보 목록의 기준 데이터로 사용했습니다. 다만 동 단위 좌표 정확도를 높이기 위해, 사용자가 후보를 선택한 뒤에는 Kakao Local API로 실제 좌표를 변환합니다.

이렇게 분리하면 검색 UI는 과제 데이터에 기반하면서도, 같은 동명이 있는 지역이나 행정동 좌표 변환은 지오코딩 API의 정확도를 활용할 수 있습니다.

### 4. OpenWeather와 Kakao API 역할 분리

Kakao Local API는 지역 검색과 좌표 변환만 담당하고, 날씨 데이터는 OpenWeather로 유지했습니다. 현재 기온, 최저/최고, 시간별 예보, 자외선, 미세먼지, 일출/일몰은 모두 OpenWeather 응답에서 가져옵니다.

### 5. Zod로 외부 API 응답 검증

Axios 제네릭은 TypeScript에게 기대 타입을 알려줄 뿐 런타임 응답을 검증하지 않습니다. 외부 API 응답은 `unknown`으로 받은 뒤 Zod schema를 통과한 데이터만 내부 모델로 변환하도록 구성했습니다.

필수 데이터인 One Call·지역명 응답은 검증 실패 시 에러로 처리하고, 부가 데이터인 대기질 응답은 실패해도 앱 전체가 깨지지 않도록 `null`로 표시합니다.

### 6. Canvas 기반 날씨 배경

비, 눈, 구름, 번개 같은 효과를 DOM 엘리먼트로 만들면 파티클 수가 늘어날수록 리플로우 부담이 커집니다. Canvas + `requestAnimationFrame`으로 배경을 한 레이어에서 그려 성능 부담을 낮췄습니다.

접근성을 위해 `prefers-reduced-motion`이 켜진 경우 파티클 수와 움직임을 줄이고, 고해상도 화면에서는 `devicePixelRatio`를 제한해 과도한 렌더링 비용을 막았습니다.

### 7. 즐겨찾기 중복 방지와 별칭 분리

같은 장소를 여러 경로로 추가하는 상황을 막기 위해 좌표를 소수점 4자리로 정규화한 key로 중복을 판별합니다. 별칭은 즐겨찾기 상태에만 저장해 사용자가 이름을 바꿔도 API에서 받은 공식 위치명과 섞이지 않게 했습니다.

### 8. 레이아웃 안정성을 위한 placeholder

초기 진입과 지역 전환 중 spinner만 보여주면 카드와 예보 영역의 높이가 순간적으로 바뀝니다. 실제 UI와 같은 크기의 skeleton placeholder를 사용해 로딩 중에도 화면 구조가 흔들리지 않게 했습니다.

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
npm run storybook
npm run build-storybook
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
VITE_ENABLE_BACKGROUND_DEMO=false
```

- 실제 API 키는 저장소에 커밋하지 않고 로컬 `.env`와 Vercel Environment Variables에만 등록합니다.
- `VITE_OPENWEATHER_API_KEY`: OpenWeather One Call API 3.0, Air Pollution API 호출에 사용합니다.
- `VITE_KAKAO_REST_API_KEY`: Kakao Local API 주소 검색과 좌표 → 행정동 변환에 사용합니다.
- `VITE_ENABLE_BACKGROUND_DEMO`: 제출용 배포에서 Canvas 배경을 바로 확인할 수 있게 `true`로 설정합니다. 일반 운영 환경에서는 생략하거나 `false`로 둡니다.

Kakao 설정 체크리스트:

- Kakao Developers에서 앱 생성
- 카카오맵 사용 설정 ON
- Web 플랫폼에 로컬 도메인과 Vercel 배포 도메인 등록
- Vercel 프로젝트 환경변수에 `VITE_KAKAO_REST_API_KEY` 등록

---

## Git 워크플로우

`main` ← `develop` ← `feat/*` 브랜치 전략을 유지했습니다.  
기능별 Issue 생성 → `feat/*` 브랜치 작업 → PR → Merge 순서로 진행했습니다.

GitHub 저장소에서 Squash·Rebase Merge를 비활성화하고 Merge Commit만 허용해 기능 브랜치 단위 이력이 보존되도록 설정했습니다.

> PR #38~#48은 GitHub 저장소 설정 오류로 Squash Merge가 적용되었습니다. 이후 설정을 수정해 Merge Commit 전략으로 통일했습니다.
