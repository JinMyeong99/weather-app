# 날씨 앱

[![App](https://img.shields.io/badge/App-Vercel-black?logo=vercel)](https://weather-app-snowy-nine-96.vercel.app/)
[![Storybook](https://img.shields.io/badge/Storybook-FF4785?logo=storybook&logoColor=white)](https://weather-app-storybook-xi.vercel.app/)

> OpenWeather API와 Kakao Local API를 활용한 React 날씨 앱입니다.  
> 현재 위치 또는 대한민국 행정구역 검색으로 날씨를 확인하고, 자주 보는 지역을 즐겨찾기로 저장할 수 있습니다.

![앱 전체 흐름](./assets/README%20스크린샷/앱%20전체%20흐름.gif)

---

## 제출 링크

| 항목 | URL |
|------|-----|
| GitHub Repository | https://github.com/JinMyeong99/weather-app |
| App 배포 | https://weather-app-snowy-nine-96.vercel.app/ |
| Storybook 배포 | https://weather-app-storybook-xi.vercel.app/ |

---

## 빠르게 확인하는 방법

1. 배포 앱에 접속하고 위치 권한을 허용해 현재 위치 날씨가 표시되는지 확인합니다.
2. 검색창에 `성동구`, `성수동`, `청운동` 등을 입력해 행정구역 검색 결과가 나오는지 확인합니다.
3. 검색 결과를 선택해 날씨 카드, 시간별 예보, 주간 예보가 선택 지역 기준으로 전환되는지 확인합니다.
4. 날씨 카드를 즐겨찾기에 추가하고, 즐겨찾기 카드의 별칭 수정과 삭제를 확인합니다.
5. 즐겨찾기 카드 또는 날씨 카드의 "날씨 더보기"를 통해 상세 페이지로 이동합니다.
6. 상세 페이지에서 현재 날씨, 시간별 예보, 주간 예보가 함께 표시되는지 확인합니다.
7. 모바일 폭 또는 반응형 UI GIF를 통해 카드, 예보, 즐겨찾기 레이아웃이 자연스럽게 전환되는지 확인합니다.

---

## 과제 요구사항 충족 여부

| 요구사항 | 구현 내용 | 확인 방법 |
|----------|-----------|-----------|
| Open API로 날씨 정보 표시 | OpenWeather One Call API로 현재 기온, 당일 최저/최고, 체감온도, 습도, 풍속, 자외선, 시간별·주간 예보를 표시합니다 | 홈/상세 페이지의 날씨 카드, 시간별 예보, 주간 예보 확인 |
| 앱 첫 진입 시 현재 위치 감지 | 브라우저 Geolocation으로 좌표를 얻고, Kakao reverse geocoding으로 행정동명을 표시합니다 | 첫 접속 후 위치 권한 허용 |
| 시·군·구·동 단위 장소 검색 | `korea_districts.json`을 후보 목록으로 사용하고, 선택한 행정구역을 Kakao Local API로 좌표 변환합니다 | `성동구`, `성수동`, `청운동` 검색 |
| 검색 결과 리스트 표시 | 입력값과 매칭되는 행정구역 리스트를 dropdown으로 표시하고, 마우스와 키보드로 선택할 수 있습니다 | 검색창 입력 후 ↑↓ Enter Escape 조작 |
| 장소 정보 없음 UI | 좌표 변환 실패 또는 날씨 조회 실패 시 안내 메시지를 표시합니다 | 존재하지 않는 장소 검색 또는 API 실패 케이스 |
| 즐겨찾기 추가·삭제 | 검색한 장소를 최대 6개까지 저장하고, 저장된 장소는 카드 UI로 표시합니다 | 날씨 카드의 즐겨찾기 버튼, 즐겨찾기 카드 삭제 버튼 확인 |
| 즐겨찾기 별칭 수정 | 즐겨찾기 카드에서 별칭을 인라인으로 수정하고 localStorage에 유지합니다 | 즐겨찾기 카드의 편집 버튼 클릭 후 새로고침 |
| 즐겨찾기 카드 정보 표시 | 즐겨찾기 카드에 현재 날씨, 현재 기온, 당일 최저/최고 기온을 표시합니다 | 홈 하단 즐겨찾기 영역 확인 |
| 상세 페이지 이동 | 즐겨찾기 카드 또는 날씨 카드에서 상세 페이지로 이동해 추가 예보를 확인할 수 있습니다 | 카드 클릭 또는 "날씨 더보기" 클릭 |
| 반응형 UI | 모바일과 데스크톱에서 카드, 예보, 즐겨찾기 레이아웃이 화면 폭에 맞게 전환됩니다 | 브라우저 모바일 폭 또는 반응형 UI GIF 확인 |
| 로딩·에러 상태 처리 | skeleton placeholder와 ErrorBoundary/ErrorMessage로 로딩·오류 상태를 표시합니다 | 초기 로딩, 지역 전환, Storybook 오류 케이스 확인 |
| 성능 및 UX 최적화 | route lazy loading, 요청 취소, 캐싱, 검색 데이터 지연 로드, skeleton placeholder를 적용했습니다 | 아래 `성능 최적화와 요청 생명주기 관리` 및 관련 코드 확인 |
| 접근성·SEO 개선 | `main` 랜드마크, `robots.txt`, 색상 대비를 개선했습니다 | Lighthouse 또는 관련 PR 확인 |
| Storybook 확인 환경 | 주요 UI, 모바일 상태, 오류 화면 story를 제공합니다 | Storybook 배포 링크 확인 |
| 필수 기술 스택 | React, TypeScript, Functional Component, FSD, TanStack Query, Tailwind CSS로 구현했습니다 | `src/` 구조와 `package.json` 확인 |

---

## 검증 결과

Vercel 배포 환경에서 Chrome Lighthouse Mobile 기준으로 확인했습니다.

| 화면 | 성능 | 접근성 | 권장사항 | SEO |
|------|-----:|-------:|---------:|----:|
| 홈 페이지 | 92 | 100 | 100 | 100 |
| 상세 페이지 | 96 | 100 | 100 | 100 |

<p>
  <img src="./assets/README%20스크린샷/lighthouse-home.png" alt="홈 페이지 Lighthouse 결과" width="49%" />
  <img src="./assets/README%20스크린샷/lighthouse-detail.png" alt="상세 페이지 Lighthouse 결과" width="49%" />
</p>

---

## 목차

1. [구현 기능](#구현-기능)
2. [기술적 의사결정](#기술적-의사결정)
3. [아키텍처](#아키텍처)
4. [기술 스택](#기술-스택)
5. [프로젝트 실행 방법](#프로젝트-실행-방법)
6. [Git 워크플로우](#git-워크플로우)
7. [주요 PR](#주요-pr)

---

## 구현 기능

### 현재 위치 날씨

![현재 위치 날씨](./assets/README%20스크린샷/현재위치%20날씨.gif)

브라우저 Geolocation API로 좌표를 얻고, Kakao reverse geocoding으로 행정동명을 표시합니다.
현재 기온, 당일 최저/최고, 체감온도, 습도, 풍속, 미세먼지(PM10/PM2.5), 자외선 지수, 일출/일몰 시간을 한 화면에서 확인할 수 있습니다.

### 대한민국 행정구역 검색

![검색 흐름](./assets/README%20스크린샷/검색%20흐름.gif)

과제에서 제공된 `korea_districts.json`을 검색 후보 목록으로 사용하고, 선택 시 Kakao Local API로 좌표를 변환해 날씨를 조회합니다.  
키보드 ↑↓ 탐색과 Enter/Escape 조작, 외부 클릭 닫힘을 지원합니다.

### 시간별 예보

![시간별 예보](./assets/README%20스크린샷/시간별%20예보%20영역%20스크롤.gif)

48시간 기온 변화를 SVG cubic bezier 곡선으로 시각화합니다.  
날짜 구분선, 강수확률, 날씨 아이콘을 함께 표시하며 가로 스크롤로 탐색합니다.

### 주간 예보

오전·오후 날씨 아이콘과 강수확률, 최저·최고 기온을 8일치로 표시합니다.

### 즐겨찾기

![즐겨찾기 흐름](./assets/README%20스크린샷/즐겨찾기%20흐름.gif)

- 즐겨찾기 카드에서 현재 날씨, 기온, 당일 최저/최고 표시
- 별칭 인라인 편집 및 새로고침 후에도 유지 (localStorage 영속)
- 카드 클릭 → 상세 페이지 이동
- 최대 6개 장소 저장 (초과 시 안내 메시지)

### 상세 페이지

![상세페이지 흐름](./assets/README%20스크린샷/상세페이지%20흐름.gif)

날씨 카드 하단 "날씨 더보기" 클릭 시 이동합니다.  
현재 날씨 정보, 48시간 시간별 예보, 8일 주간 예보를 한 페이지에서 확인합니다.

### 날씨 배경 애니메이션

![날씨 배경 변경](./assets/README%20스크린샷/날씨%20배경%20변경.gif)

OpenWeather 아이콘 코드에 따라 맑음·구름·비·소나기·뇌우·눈·안개 Canvas 배경이 실시간으로 전환됩니다.

### 반응형 UI

![모바일 화면 흐름](./assets/README%20스크린샷/모바일%20화면%20흐름.gif)

모바일과 데스크톱 모두에서 카드, 예보, 즐겨찾기 레이아웃이 자연스럽게 전환됩니다.

### 스켈레톤 UI

초기 로딩과 지역 전환 중 실제 레이아웃과 동일한 크기의 skeleton placeholder를 표시해 레이아웃 쉬프트를 방지합니다.

### 정보 없음 UI

좌표 변환 실패 또는 날씨 조회 실패 시 안내 메시지를 표시합니다.

---

## 기술적 의사결정

### 1. FSD로 레이어 간 책임 분리

검색, 현재 위치, 즐겨찾기, 날씨 조회, 배경 애니메이션처럼 변경 이유가 다른 기능이 공존합니다.  
FSD 레이어로 분리해 **페이지는 조합에만 집중**하고, 각 기능은 독립적으로 수정·테스트할 수 있게 했습니다.  
`features/favorites`, `features/geolocation`, `features/search-geocoding`은 서로를 모르고 `shared`만 참조합니다.

### 2. TanStack Query — 서버 상태 관리

날씨 데이터는 좌표가 바뀔 때마다 새로 조회되어야 하고, 같은 좌표를 반복해서 볼 때는 불필요한 요청을 줄여야 합니다.

- `staleTime` 설정으로 같은 좌표의 반복 호출 최소화
- `queryKey`를 `[lat, lon]` 조합으로 설계해 좌표별 캐시 자동 분리
- `enabled` 조건으로 좌표 준비 전 API 호출 방지

### 3. 성능 최적화와 요청 생명주기 관리

초기 로드, 검색 반응성, 빠른 지역 전환, 애니메이션 렌더링 비용을 각각 분리해 관리했습니다.

- route 단위 lazy loading으로 홈/상세 페이지 코드를 필요한 시점에 로드합니다.
- 약 954KB의 `korea_districts.json`은 초기 번들에 포함하지 않고 검색 시점에 동적 import합니다.
- 검색바 focus 시 지역 데이터를 prefetch해 첫 검색의 체감 대기 시간을 줄입니다.
- TanStack Query `staleTime`으로 같은 좌표의 반복 요청을 줄입니다.
- `queryFn`의 `AbortSignal`을 axios에 전달해 빠른 지역 전환 중 이전 OpenWeather 요청을 취소합니다.
- 취소된 Axios 요청은 개발 콘솔의 `[API Error]` noise에서 제외하고, 실제 HTTP/API 실패만 구조화해 기록합니다.
- Canvas 배경은 `requestAnimationFrame`으로 그리고, `devicePixelRatio`를 2로 제한해 고해상도 기기 렌더링 비용을 제어합니다.
- `prefers-reduced-motion` 환경에서는 애니메이션 움직임을 줄여 접근성과 성능을 함께 고려합니다.
- 실제 UI와 동일한 skeleton placeholder로 로딩 중 레이아웃 shift를 줄입니다.

### 4. 검색 후보는 JSON, 좌표 변환은 Kakao API

과제에서 제공된 `korea_districts.json`은 검색 **후보 목록의 기준 데이터**로 사용합니다.  
후보 선택 후에는 Kakao Local API로 실제 좌표를 변환합니다.

- 검색 UI는 과제 데이터 기반으로 동작
- 동명이 있는 지역이나 행정동 좌표는 지오코딩 API의 정확도를 활용
- 두 역할을 분리해 JSON 데이터 변경 없이 좌표 변환 로직을 교체할 수 있습니다

### 5. Zod로 외부 API 응답 런타임 검증

Axios 제네릭은 TypeScript에게 기대 타입을 전달할 뿐 런타임 응답을 검증하지 않습니다.  
외부 API 응답은 `unknown`으로 받은 뒤 Zod schema를 통과한 데이터만 내부 모델로 변환합니다.

- 필수 데이터(One Call, 지역명): 검증 실패 → 에러 처리
- 부가 데이터(대기질): 검증 실패 → `null` 표시 (앱 전체 중단 방지)

타입 단언(`as`) 없이 API 응답과 내부 타입 사이의 계약을 명시적으로 유지합니다.

### 6. Canvas 기반 날씨 배경 애니메이션

DOM 엘리먼트로 파티클을 표현하면 수가 늘수록 리플로우 비용이 커집니다.  
Canvas + `requestAnimationFrame`으로 배경을 단일 레이어에서 처리합니다.

- `prefers-reduced-motion` 감지 → 파티클 수·움직임 축소 (접근성)
- `devicePixelRatio` 제한 → 고해상도 기기에서 과도한 렌더링 방지

### 7. 즐겨찾기 중복 방지와 별칭 분리

- 좌표를 소수점 4자리로 정규화한 key로 중복 판별 (다른 경로로 같은 장소 추가 방지)
- 별칭은 즐겨찾기 상태에만 저장 → 사용자 지정 이름과 API 공식 위치명이 섞이지 않음
- Zustand `persist` 미들웨어로 localStorage 영속 처리를 단순화

### 8. Discriminated Union으로 날씨 카드 상태 관리

홈 날씨 카드는 `loading | error | success | idle` 네 가지 상태를 가집니다.  
`status` 필드를 가진 discriminated union 타입으로 정의해 각 상태에서 접근 가능한 데이터를 타입 레벨에서 보장합니다.

```ts
type WeatherCardState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: WeatherData; lat: number; lon: number }
  | { status: 'idle' };
```

장소 정보 없음과 API 오류는 `error` 상태의 메시지로 처리하고, 아직 표시할 데이터가 없는 상태는 `idle`로 분리합니다.  
`cardState.status === 'success'`인 블록 안에서만 `cardState.data`에 접근 가능하므로, 런타임 null 체크 없이 타입 안전성을 유지합니다.

### 9. Skeleton Placeholder로 레이아웃 안정성 확보

초기 진입·지역 전환 중 spinner만 보여주면 카드·예보 영역 높이가 순간적으로 바뀝니다.  
실제 UI와 동일한 구조·크기의 skeleton placeholder를 사용해 **로딩 중에도 레이아웃이 흔들리지 않게** 했습니다.

---

## 아키텍처

**FSD(Feature-Sliced Design)** 를 채택했습니다.  
기능이 늘어나도 레이어 간 단방향 의존성을 유지하고, 각 슬라이스가 독립적으로 수정·테스트 가능하게 합니다.

```
src/
├── app/        # 라우터, 전역 프로바이더
├── pages/      # 홈 · 상세 페이지 (조합 레이어)
├── widgets/    # 페이지를 구성하는 독립 UI 블록
│               # (WeatherCard, HourlyForecast, WeeklyForecast, SearchBar, FavoriteList …)
├── features/   # 단일 책임 기능
│               # (favorites 관리, 위치 감지, 지오코딩 검색)
├── entities/   # 도메인 모델 (weather, district)
└── shared/     # 공용 타입 · 유틸 · UI 컴포넌트
```

> **의존성 규칙**: `pages → widgets → features → entities → shared` 방향만 허용합니다.  
> 상위 레이어가 하위를 참조하며, 역방향 참조는 금지합니다.

---

## 기술 스택

| 분류 | 기술 | 선택 이유 |
|------|------|----------|
| UI | React 19 · TypeScript | 함수형 컴포넌트 기반 선언적 UI, 타입 안정성 확보 |
| 스타일 | Tailwind CSS v4 | 반응형·상태별 스타일을 유틸리티 클래스로 빠르게 구성 |
| 라우팅 | React Router 7 | 홈·상세 페이지 전환, route state로 페이지 간 데이터 전달 |
| 서버 상태 | TanStack Query 5 | 좌표별 캐싱, 요청 취소, 로딩·에러 상태 일관 관리 |
| 클라이언트 상태 | Zustand 5 | `persist` 미들웨어로 즐겨찾기 localStorage 영속 단순화 |
| 런타임 검증 | Zod 4 | 외부 API 응답을 schema로 검증해 타입 단언(`as`) 제거 |
| 컴포넌트 문서 | Storybook 10 | 컴포넌트 상태·인터랙션을 독립 환경에서 검증 |
| 빌드 | Vite 8 | 빠른 개발 서버, route 단위 코드 스플리팅 |
| API | OpenWeather One Call 3.0 · Kakao Local API | 날씨 데이터와 한국 행정구역 좌표 변환 역할 분리 |
| 배포 | Vercel | GitHub 연동 자동 배포, PR별 Preview 환경 제공 |

---

## 프로젝트 실행 방법

### 사전 준비

- [OpenWeather One Call API 3.0](https://openweathermap.org/api/one-call-3) 키
- [Kakao Developers](https://developers.kakao.com/) REST API 키 (카카오맵 사용 설정 ON, Web 플랫폼 도메인 등록 필요)

### 로컬 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일에 아래 키 입력
```

```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
VITE_KAKAO_REST_API_KEY=your_kakao_rest_api_key
VITE_ENABLE_BACKGROUND_DEMO=false   # 배경 데모 버튼 노출 여부
```

```bash
# 3. 개발 서버 시작
npm run dev
```

### Storybook

```bash
npm run storybook          # 개발 서버 (localhost:6006)
npm run build-storybook    # 정적 빌드
```

### 프로덕션 빌드 검증

```bash
npm run lint
npm run build
```

---

## Git 워크플로우

`main ← develop ← feat/fix/refactor/*` 브랜치 전략을 사용합니다.

```
기능별 Issue 생성
  → 이슈 번호 포함 브랜치 생성 (예: feat/42-hourly-forecast)
    → PR 생성 (배경·의사결정·변경 파일 포함 상세 작성)
      → develop Merge
        → main 배포
```

- GitHub 저장소에서 Merge Commit만 허용해 기능 브랜치 단위 이력을 보존합니다.
- PR 본문에 이슈 번호(`Close #N`)를 연결해 이슈-커밋-PR 흐름을 추적합니다.

> PR #38~#48은 저장소 설정 오류로 Squash Merge가 적용되었습니다. 이후 Merge Commit 전략으로 통일했습니다.

---

## 주요 PR

| 분류 | PR | 내용 |
|------|----|------|
| 초기 구조 | [#8](https://github.com/JinMyeong99/weather-app/pull/8) | FSD 구조, 라우터, TanStack Query, Tailwind 초기 세팅 |
| 날씨 API | [#9](https://github.com/JinMyeong99/weather-app/pull/9) | OpenWeather API 연동과 TanStack Query 캐싱 |
| 검색 | [#10](https://github.com/JinMyeong99/weather-app/pull/10), [#83](https://github.com/JinMyeong99/weather-app/pull/83), [#106](https://github.com/JinMyeong99/weather-app/pull/106) | 행정구역 검색, Enter 즉시 선택, 검색 데이터 prefetch, 검색 결과 우선순위 개선 |
| 즐겨찾기 | [#11](https://github.com/JinMyeong99/weather-app/pull/11), [#108](https://github.com/JinMyeong99/weather-app/pull/108) | localStorage 기반 즐겨찾기와 별칭 편집, Zustand selector 기반 구독 범위 정리 |
| 홈 UI | [#12](https://github.com/JinMyeong99/weather-app/pull/12) | 현재 위치 날씨, 검색, 즐겨찾기 UI |
| 런타임 검증 | [#45](https://github.com/JinMyeong99/weather-app/pull/45) | Zod 기반 외부 API 응답 검증 |
| 성능 | [#58](https://github.com/JinMyeong99/weather-app/pull/58) | 번들 스플리팅, API 캐싱, 요청 취소 |
| 접근성/SEO | [#62](https://github.com/JinMyeong99/weather-app/pull/62) | Lighthouse 접근성·SEO 개선 |
| Storybook | [#60](https://github.com/JinMyeong99/weather-app/pull/60), [#86](https://github.com/JinMyeong99/weather-app/pull/86) | 컴포넌트 story 및 오류 UI 확인 환경 |
| 반응형 개선 | [#84](https://github.com/JinMyeong99/weather-app/pull/84), [#85](https://github.com/JinMyeong99/weather-app/pull/85) | WeatherCard·주간예보 모바일/데스크톱 개선 |
