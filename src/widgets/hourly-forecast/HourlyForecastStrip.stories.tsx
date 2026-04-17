import type { Meta, StoryObj } from '@storybook/react-vite';
import { HourlyForecastStrip } from './HourlyForecastStrip';
import type { WeatherHourly } from '../../shared/types';

const now = Math.floor(Date.now() / 1000);

const mockHourly: WeatherHourly[] = Array.from({ length: 24 }, (_, i) => {
  const hour = (new Date().getHours() + i) % 24;
  return {
    dt: now + i * 3600,
    time: `${String(hour).padStart(2, '0')}:00`,
    temp: Math.round(18 + Math.sin((i / 24) * Math.PI * 2) * 6),
    icon: hour >= 6 && hour < 20 ? (i % 5 === 3 ? '10d' : '01d') : '01n',
    pop: i % 5 === 3 ? 0.6 : 0,
  };
});

const meta: Meta<typeof HourlyForecastStrip> = {
  title: 'widgets/HourlyForecastStrip',
  component: HourlyForecastStrip,
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
          '24시간 시간대별 기온을 SVG 곡선 그래프로 표시합니다. 가로 스크롤과 날짜 구분선을 지원하며, 좌우 화살표 버튼으로 스크롤할 수 있습니다.',
      },
    },
    layout: 'centered',
  },
  args: {
    hourly: mockHourly,
  },
};

export default meta;
type Story = StoryObj<typeof HourlyForecastStrip>;

export const Default: Story = {
  name: '기본 (24시간)',
  parameters: {
    docs: {
      description: {
        story: '24시간 예보 데이터를 기온 곡선 그래프로 표시합니다. 오른쪽 화살표로 스크롤하면 다음 시간대를 확인할 수 있습니다.',
      },
    },
  },
};

export const WithRain: Story = {
  name: '강수확률 포함',
  args: {
    hourly: mockHourly.map((h, i) => ({
      ...h,
      pop: i >= 6 && i <= 12 ? 0.4 + (i - 6) * 0.08 : 0,
      icon: i >= 6 && i <= 12 ? '10d' : h.icon,
    })),
  },
  parameters: {
    docs: {
      description: {
        story: '강수확률이 있는 시간대에는 아이콘 아래 💧와 확률이 표시됩니다.',
      },
    },
  },
};

export const NightTime: Story = {
  name: '야간 위주',
  args: {
    hourly: Array.from({ length: 24 }, (_, i) => ({
      dt: now + i * 3600,
      time: `${String((20 + i) % 24).padStart(2, '0')}:00`,
      temp: Math.round(12 + Math.sin((i / 24) * Math.PI) * 4),
      icon: i < 8 ? '01n' : '01d',
      pop: 0,
    })),
  },
};
