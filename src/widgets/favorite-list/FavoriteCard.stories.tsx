import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { FavoriteCard } from './FavoriteCard';
import type { Favorite, WeatherData } from '../../shared/types';

const mockWeatherData: WeatherData = {
  locationName: '서울특별시 성동구',
  current: {
    temp: 22,
    feelsLike: 21,
    tempMin: 16,
    tempMax: 25,
    description: '맑음',
    icon: '01d',
    humidity: 48,
    windSpeed: 3.2,
    sunrise: 1744851720,
    sunset: 1744901100,
    uvi: 4.5,
    pm10: 28,
    pm25: 12,
  },
  hourly: [],
  daily: [],
};

const mockFavorite: Favorite = {
  id: 'fav-1',
  key: 'district:서울특별시 성동구',
  alias: '성동구',
  district: {
    fullName: '서울특별시 성동구',
    displayName: '성동구',
    sido: '서울특별시',
    sigungu: '성동구',
  },
  lat: 37.5634,
  lon: 127.0369,
};

function makeDecorator(weatherData?: WeatherData | 'loading') {
  const queryClient =
    weatherData === 'loading'
      ? new QueryClient({
          defaultOptions: {
            queries: {
              queryFn: () => new Promise(() => {}),
              retry: false,
            },
          },
        })
      : new QueryClient({ defaultOptions: { queries: { retry: false } } });

  if (weatherData && weatherData !== 'loading') {
    queryClient.setQueryData(['weather', mockFavorite.lat, mockFavorite.lon], weatherData);
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

const meta: Meta<typeof FavoriteCard> = {
  title: 'widgets/favorite-list/FavoriteCard',
  component: FavoriteCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '즐겨찾기 항목 카드입니다. 현재 날씨(아이콘·기온·최저/최고), 별칭, 삭제 버튼을 표시합니다. 연필 아이콘 클릭으로 별칭을 인라인 편집할 수 있으며, 카드 클릭 시 상세 페이지로 이동합니다.',
      },
    },
    layout: 'centered',
  },
  args: {
    favorite: mockFavorite,
    onRemove: () => {},
    onAliasUpdate: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof FavoriteCard>;

export const Default: Story = {
  name: '날씨 로드 완료',
  decorators: [makeDecorator(mockWeatherData)],
  parameters: {
    docs: {
      description: {
        story: '날씨 데이터가 캐시에 있을 때의 상태입니다. 연필 아이콘을 클릭하면 별칭 편집 모드로 진입합니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 연필 아이콘 버튼이 렌더링되어 있어야 함
    const editBtn = canvas.getByRole('button', { name: '별칭 수정' });
    await expect(editBtn).toBeInTheDocument();

    // 클릭 → input이 나타나야 함
    await userEvent.click(editBtn);
    const input = canvas.getByRole('textbox');
    await expect(input).toBeInTheDocument();
    await expect(input).toHaveValue('성동구');

    // 새 별칭 입력 후 Enter → 편집 종료
    await userEvent.clear(input);
    await userEvent.type(input, '성동 사무실');
    await userEvent.keyboard('{Enter}');
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    await expect(canvas.getByText('성동 사무실')).toBeInTheDocument();
  },
};

export const EditCancel: Story = {
  name: '별칭 수정 → Escape 취소',
  decorators: [makeDecorator(mockWeatherData)],
  parameters: {
    docs: {
      description: {
        story: 'Escape 키를 누르면 수정 내용이 버려지고 원래 별칭으로 복원됩니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const editBtn = canvas.getByRole('button', { name: '별칭 수정' });
    await userEvent.click(editBtn);

    const input = canvas.getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, '잘못 입력한 값');

    // Escape → 원래 별칭 복원
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    await expect(canvas.getByText('성동구')).toBeInTheDocument();
  },
};

export const Loading: Story = {
  name: '날씨 로딩 중 (스켈레톤)',
  decorators: [makeDecorator('loading')],
  parameters: {
    docs: {
      description: {
        story: '날씨 데이터를 불러오는 중 스켈레톤 UI가 표시됩니다. queryFn이 절대 resolve되지 않아 영구적으로 로딩 상태를 유지합니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 스켈레톤이 표시되어야 함 (animate-pulse 클래스 존재 확인)
    const skeletons = canvasElement.querySelectorAll('.animate-pulse');
    await expect(skeletons.length).toBeGreaterThan(0);

    // 날씨 데이터(기온 텍스트)는 없어야 함
    await expect(canvas.queryByText(/°/)).not.toBeInTheDocument();
  },
};

export const RainyWeather: Story = {
  name: '비 오는 날',
  decorators: [
    makeDecorator({
      ...mockWeatherData,
      current: {
        ...mockWeatherData.current,
        temp: 12,
        tempMin: 9,
        tempMax: 15,
        description: '비',
        icon: '10d',
        humidity: 85,
      },
    }),
  ],
  args: {
    favorite: { ...mockFavorite, alias: '성수동2가' },
  },
};

export const LongAlias: Story = {
  name: '긴 별칭 (말줄임 처리)',
  decorators: [makeDecorator(mockWeatherData)],
  args: {
    favorite: { ...mockFavorite, alias: '서울특별시 성동구 성수동2가 우리 회사 근처' },
  },
  parameters: {
    docs: {
      description: {
        story: '별칭이 길면 말줄임(truncate) 처리됩니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 긴 텍스트가 렌더링되어 있어야 함
    const aliasEl = canvas.getByText('서울특별시 성동구 성수동2가 우리 회사 근처');
    await expect(aliasEl).toBeInTheDocument();

    // truncate 클래스가 적용되어 오버플로우가 숨겨져야 함
    await expect(aliasEl).toHaveClass('truncate');

    // 실제 렌더 너비가 컨테이너보다 작거나 같아야 함 (잘림 확인)
    const parent = aliasEl.parentElement!;
    await expect(aliasEl.scrollWidth).toBeGreaterThanOrEqual(parent.clientWidth);
  },
};
