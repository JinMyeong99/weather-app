import type { Meta, StoryObj } from '@storybook/react-vite';
import { WeeklyForecast } from './WeeklyForecast';
import type { WeatherDaily } from '../../shared/types';

const mockDaily: WeatherDaily[] = [
  { date: '2026-04-17', dayLabel: '오늘', tempMin: 16, tempMax: 25, amIcon: '01d', pmIcon: '01d', amPop: 0,   pmPop: 0 },
  { date: '2026-04-18', dayLabel: '내일', tempMin: 14, tempMax: 21, amIcon: '03d', pmIcon: '10d', amPop: 0.1, pmPop: 0.6 },
  { date: '2026-04-19', dayLabel: '토',   tempMin: 12, tempMax: 18, amIcon: '10d', pmIcon: '10d', amPop: 0.8, pmPop: 0.7 },
  { date: '2026-04-20', dayLabel: '일',   tempMin: 13, tempMax: 20, amIcon: '04d', pmIcon: '02d', amPop: 0.2, pmPop: 0 },
  { date: '2026-04-21', dayLabel: '월',   tempMin: 15, tempMax: 23, amIcon: '01d', pmIcon: '01d', amPop: 0,   pmPop: 0 },
  { date: '2026-04-22', dayLabel: '화',   tempMin: 17, tempMax: 26, amIcon: '01d', pmIcon: '02d', amPop: 0,   pmPop: 0.1 },
  { date: '2026-04-23', dayLabel: '수',   tempMin: 14, tempMax: 22, amIcon: '04d', pmIcon: '10d', amPop: 0.3, pmPop: 0.5 },
  { date: '2026-04-24', dayLabel: '목',   tempMin: 13, tempMax: 19, amIcon: '10d', pmIcon: '09d', amPop: 0.7, pmPop: 0.9 },
];

const meta: Meta<typeof WeeklyForecast> = {
  title: 'widgets/WeeklyForecast',
  component: WeeklyForecast,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '672px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          '8일 주간 예보를 테이블 형태로 표시합니다. 날짜·오전/오후 날씨 아이콘·강수확률·최저/최고 기온을 포함합니다. 오늘은 파란색으로 강조됩니다.',
      },
    },
    layout: 'centered',
  },
  args: {
    daily: mockDaily,
  },
};

export default meta;
type Story = StoryObj<typeof WeeklyForecast>;

export const Default: Story = {
  name: '8일 예보',
  parameters: {
    docs: {
      description: {
        story: '오늘(첫 번째 행)이 파란 배경으로 강조됩니다. 강수확률이 0보다 클 때만 퍼센트가 표시됩니다.',
      },
    },
  },
};

export const MobileDefault: Story = {
  name: '모바일 320px',
  render: (args) => (
    <div style={{ width: '320px' }}>
      <WeeklyForecast {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '320px 모바일 폭에서 오전/오후/최저·최고 정렬과 강수확률 표시를 확인합니다.',
      },
    },
  },
};

export const AllRainy: Story = {
  name: '장마 (강수확률 높음)',
  args: {
    daily: mockDaily.map((d) => ({
      ...d,
      amIcon: '10d',
      pmIcon: '09d',
      amPop: 0.7,
      pmPop: 0.9,
    })),
  },
  parameters: {
    docs: {
      description: {
        story: '모든 날 강수확률이 높을 때의 표시 예시입니다.',
      },
    },
  },
};

export const Winter: Story = {
  name: '겨울 (눈)',
  args: {
    daily: mockDaily.map((d, i) => ({
      ...d,
      tempMin: -5 + i,
      tempMax: 2 + i,
      amIcon: '13d',
      pmIcon: i % 2 === 0 ? '13d' : '01d',
      amPop: 0.5,
      pmPop: i % 2 === 0 ? 0.4 : 0,
    })),
  },
};
