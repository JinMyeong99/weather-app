import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { FavoriteList } from './FavoriteList';
import type { Favorite, WeatherData } from '../../shared/types';

// ── Mock 데이터 ────────────────────────────────────────────────

const makeFavorite = (
  id: string,
  alias: string,
  sigungu: string,
  dong: string | undefined,
  lat: number,
  lon: number,
): Favorite => {
  const fullName = dong
    ? `서울특별시-${sigungu}-${dong}`
    : `서울특별시-${sigungu}`;
  return {
    id,
    key: `district:${fullName}`,
    alias,
    district: {
      fullName,
      displayName: dong ? `${dong} (${sigungu}, 서울특별시)` : `${sigungu} (서울특별시)`,
      sido: '서울특별시',
      sigungu,
      dong,
    },
    lat,
    lon,
  };
};

const mockFavorites: Favorite[] = [
  makeFavorite('fav-1', '성동구',    '성동구', undefined,   37.5634, 127.0369),
  makeFavorite('fav-2', '성수동2가', '성동구', '성수동2가', 37.5447, 127.0567),
  makeFavorite('fav-3', '마포구',    '마포구', undefined,   37.5663, 126.9018),
];

const makeWeather = (temp: number, icon: string, description: string): WeatherData => ({
  locationName: '서울특별시 성동구',
  current: {
    temp,
    feelsLike: temp - 1,
    tempMin: temp - 4,
    tempMax: temp + 3,
    description,
    icon,
    humidity: 55,
    windSpeed: 2.8,
    sunrise: 1744851720,
    sunset: 1744901100,
    uvi: 3,
    pm10: 25,
    pm25: 10,
  },
  hourly: [],
  daily: [],
});

// ── Decorator ─────────────────────────────────────────────────

function makeDecorator(
  weatherMap: Record<string, WeatherData> | 'loading',
  favorites: Favorite[] = mockFavorites,
) {
  const queryClient =
    weatherMap === 'loading'
      ? new QueryClient({
          defaultOptions: { queries: { queryFn: () => new Promise(() => {}), retry: false } },
        })
      : new QueryClient({ defaultOptions: { queries: { retry: false } } });

  if (weatherMap !== 'loading') {
    favorites.forEach((fav) => {
      const data = weatherMap[fav.id];
      if (data) {
        queryClient.setQueryData(['weather', fav.lat, fav.lon], data);
      }
    });
  }

  return (Story: React.ComponentType) => (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <div style={{ width: '672px' }}>
          <Story />
        </div>
      </QueryClientProvider>
    </MemoryRouter>
  );
}

const defaultWeatherMap: Record<string, WeatherData> = {
  'fav-1': makeWeather(22, '01d', '맑음'),
  'fav-2': makeWeather(21, '02d', '구름 조금'),
  'fav-3': makeWeather(19, '10d', '비'),
};

// ── Meta ──────────────────────────────────────────────────────

const meta: Meta<typeof FavoriteList> = {
  title: 'widgets/favorite-list/FavoriteList',
  component: FavoriteList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '즐겨찾기 카드 목록입니다. 항목이 없으면 빈 상태 안내를, 있으면 FavoriteCard를 리스트로 렌더링합니다.',
      },
    },
    layout: 'centered',
  },
  args: {
    favorites: mockFavorites,
    onRemove: fn(),
    onAliasUpdate: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof FavoriteList>;

// ── Stories ───────────────────────────────────────────────────

export const Default: Story = {
  name: '목록 (날씨 로드 완료)',
  decorators: [makeDecorator(defaultWeatherMap)],
  parameters: {
    docs: {
      description: {
        story: '성동구·성수동2가·마포구 3개 즐겨찾기가 날씨 데이터와 함께 표시됩니다.',
      },
    },
  },
};

export const Loading: Story = {
  name: '날씨 로딩 중 (스켈레톤)',
  decorators: [makeDecorator('loading')],
  parameters: {
    docs: {
      description: {
        story: '날씨 데이터 로딩 중 각 카드가 스켈레톤으로 표시됩니다.',
      },
    },
  },
};

export const SingleItem: Story = {
  name: '1개',
  decorators: [makeDecorator({ 'fav-1': defaultWeatherMap['fav-1'] }, [mockFavorites[0]])],
  args: {
    favorites: [mockFavorites[0]],
  },
  parameters: {
    docs: {
      description: {
        story: '즐겨찾기가 1개일 때의 표시입니다.',
      },
    },
  },
};

export const MaxItems: Story = {
  name: '최대 6개',
  decorators: [
    makeDecorator(
      Object.fromEntries(
        Array.from({ length: 6 }, (_, i) => [`fav-max-${i}`, makeWeather(20 + i, '01d', '맑음')]),
      ),
      Array.from({ length: 6 }, (_, i) =>
        makeFavorite(`fav-max-${i}`, `즐겨찾기 ${i + 1}`, '성동구', undefined, 37.5634 + i * 0.001, 127.0369),
      ),
    ),
  ],
  args: {
    favorites: Array.from({ length: 6 }, (_, i) =>
      makeFavorite(`fav-max-${i}`, `즐겨찾기 ${i + 1}`, '성동구', undefined, 37.5634 + i * 0.001, 127.0369),
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '즐겨찾기가 최대치(6개)일 때의 표시입니다.',
      },
    },
  },
};

export const Empty: Story = {
  name: '빈 목록',
  decorators: [
    (Story) => (
      <div
        className="p-6"
        style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', width: '672px' }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    favorites: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          '즐겨찾기가 없으면 FavoriteListEmpty 안내 컴포넌트가 렌더링됩니다. 실제 앱처럼 그라디언트 배경 위에서 반투명 카드로 표시됩니다.',
      },
    },
  },
};
