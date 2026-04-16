import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfoCard } from './InfoCard';

const meta: Meta<typeof InfoCard> = {
  title: 'widgets/weather-detail/InfoCard',
  component: InfoCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'UV 지수, 미세먼지, 습도 등 날씨 상세 정보를 표시하는 범용 카드입니다. `weatherGrades.ts`의 등급 함수와 함께 사용합니다.',
      },
    },
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof InfoCard>;

export const UVLow: Story = {
  name: 'UV — 낮음',
  args: {
    label: '자외선',
    value: '낮음',
    bg: 'bg-green-200/80',
    text: 'text-green-700',
    labelColor: 'text-green-600',
    className: 'w-36',
  },
};

export const UVHigh: Story = {
  name: 'UV — 높음',
  args: {
    label: '자외선',
    value: '높음',
    bg: 'bg-orange-200/80',
    text: 'text-orange-700',
    labelColor: 'text-orange-600',
    className: 'w-36',
  },
};

export const UVDanger: Story = {
  name: 'UV — 위험',
  args: {
    label: '자외선',
    value: '위험',
    bg: 'bg-purple-200/80',
    text: 'text-purple-700',
    labelColor: 'text-purple-600',
    className: 'w-36',
  },
};

export const PMGood: Story = {
  name: '미세먼지 — 좋음',
  args: {
    label: '미세먼지',
    value: '좋음',
    bg: 'bg-green-200/80',
    text: 'text-green-700',
    labelColor: 'text-green-600',
    className: 'w-36',
  },
};

export const PMBad: Story = {
  name: '미세먼지 — 나쁨',
  args: {
    label: '미세먼지',
    value: '나쁨',
    bg: 'bg-orange-200/80',
    text: 'text-orange-700',
    labelColor: 'text-orange-600',
    className: 'w-36',
  },
};

export const Unavailable: Story = {
  name: '정보 없음',
  args: {
    label: '미세먼지',
    value: '정보 없음',
    bg: 'bg-slate-100',
    text: 'text-slate-500',
    labelColor: 'text-slate-500',
    className: 'w-36',
  },
};
