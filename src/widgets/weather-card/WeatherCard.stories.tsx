import type { Meta, StoryObj } from '@storybook/react';
import { WeatherCard } from './WeatherCard';
import type { WeatherData } from '../../shared/types';

const mockWeatherData: WeatherData = {
  locationName: '서울특별시 강남구',
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
  hourly: Array.from({ length: 12 }, (_, i) => ({
    dt: 1744851720 + i * 3600,
    time: `${String(6 + i).padStart(2, '0')}:00`,
    temp: 18 + i,
    icon: i < 6 ? '01d' : '01n',
    pop: 0,
  })),
  daily: [
    { date: '2026-04-16', dayLabel: '오늘',  tempMin: 16, tempMax: 25, amIcon: '01d', pmIcon: '01d', amPop: 0,   pmPop: 0 },
    { date: '2026-04-17', dayLabel: '내일',  tempMin: 14, tempMax: 21, amIcon: '03d', pmIcon: '10d', amPop: 0.1, pmPop: 0.6 },
    { date: '2026-04-18', dayLabel: '토',    tempMin: 12, tempMax: 18, amIcon: '10d', pmIcon: '10d', amPop: 0.8, pmPop: 0.7 },
    { date: '2026-04-19', dayLabel: '일',    tempMin: 13, tempMax: 20, amIcon: '04d', pmIcon: '02d', amPop: 0.2, pmPop: 0 },
    { date: '2026-04-20', dayLabel: '월',    tempMin: 15, tempMax: 23, amIcon: '01d', pmIcon: '01d', amPop: 0,   pmPop: 0 },
  ],
};

const meta: Meta<typeof WeatherCard> = {
  title: 'widgets/WeatherCard',
  component: WeatherCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '현재 위치 날씨를 표시하는 메인 카드입니다. 즐겨찾기 토글 버튼과 상세 페이지 이동 버튼을 포함합니다.',
      },
    },
  },
  args: {
    locationName: '강남구',
    data: mockWeatherData,
    lat: 37.5172,
    lon: 127.0473,
  },
};

export default meta;
type Story = StoryObj<typeof WeatherCard>;

export const Default: Story = {
  name: '기본 (더보기 없음)',
  parameters: {
    docs: {
      description: {
        story: '`onClick`이 없으면 "날씨 더보기" 버튼이 표시되지 않습니다. 즐겨찾기 추가/제거가 가능합니다.',
      },
    },
  },
};

export const WithDetailButton: Story = {
  name: '더보기 버튼 포함',
  args: {
    onClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: '`onClick`을 전달하면 카드 하단에 "날씨 더보기 →" 버튼이 나타납니다. 홈 화면에서 상세 페이지로 이동할 때 사용합니다.',
      },
    },
  },
};

export const RainyDay: Story = {
  name: '비 오는 날',
  args: {
    locationName: '부산광역시 해운대구',
    data: {
      ...mockWeatherData,
      current: {
        ...mockWeatherData.current,
        temp: 14,
        feelsLike: 12,
        description: '비',
        icon: '10d',
        humidity: 82,
        pm10: 45,
        pm25: 22,
      },
    },
    onClick: () => {},
  },
};
