import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'shared/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '데이터 로딩 중 자리를 채우는 펄스 애니메이션 로더입니다. className으로 크기와 모양을 자유롭게 지정할 수 있습니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const TextLine: Story = {
  name: '텍스트 한 줄',
  args: { className: 'w-48 h-4' },
};

export const Title: Story = {
  name: '제목',
  args: { className: 'w-32 h-7' },
};

export const Circle: Story = {
  name: '원형 (아바타)',
  args: { className: 'w-12 h-12 rounded-full' },
};

export const Card: Story = {
  name: '카드',
  args: { className: 'w-64 h-32' },
};
