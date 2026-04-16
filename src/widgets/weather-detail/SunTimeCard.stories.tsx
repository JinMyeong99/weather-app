import type { Meta, StoryObj } from '@storybook/react-vite';
import { SunTimeCard } from './SunTimeCard';

// 2026-04-16 기준 서울 일출 06:02, 일몰 19:25 (Unix)
const SUNRISE_UNIX = 1744851720;
const SUNSET_UNIX  = 1744901100;

const meta: Meta<typeof SunTimeCard> = {
  title: 'widgets/weather-detail/SunTimeCard',
  component: SunTimeCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '일출·일몰 시각을 SVG 아이콘과 함께 표시하는 카드입니다. `type` prop으로 일출/일몰을 구분하며 색상이 달라집니다.',
      },
    },
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SunTimeCard>;

export const Sunrise: Story = {
  name: '일출',
  args: {
    label: '일출',
    value: SUNRISE_UNIX,
    type: 'sunrise',
    className: 'w-40',
  },
};

export const Sunset: Story = {
  name: '일몰',
  args: {
    label: '일몰',
    value: SUNSET_UNIX,
    type: 'sunset',
    className: 'w-40',
  },
};
