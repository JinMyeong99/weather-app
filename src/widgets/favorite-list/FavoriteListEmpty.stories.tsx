import type { Meta, StoryObj } from '@storybook/react';
import { FavoriteListEmpty } from './FavoriteListEmpty';

const meta: Meta<typeof FavoriteListEmpty> = {
  title: 'widgets/favorite-list/FavoriteListEmpty',
  component: FavoriteListEmpty,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '즐겨찾기 목록이 비어있을 때 표시되는 안내 컴포넌트입니다. FavoriteCard와 동일한 카드 크기를 유지하면서 사용자에게 추가를 유도합니다.',
      },
    },
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof FavoriteListEmpty>;

export const Default: Story = {
  name: '빈 즐겨찾기',
  parameters: {
    docs: {
      description: {
        story: '즐겨찾기가 하나도 없을 때 렌더링됩니다. FavoriteList에서 `favorites.length === 0` 조건으로 표시됩니다.',
      },
    },
  },
};
