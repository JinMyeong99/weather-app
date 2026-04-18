import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorMessage } from './ErrorMessage';

const meta: Meta<typeof ErrorMessage> = {
  title: 'shared/ui/ErrorMessage',
  component: ErrorMessage,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '카드나 상세 페이지 안에서 짧은 사용자용 오류 메시지를 표시합니다.',
      },
    },
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ErrorMessage>;

export const NotFound: Story = {
  name: '정보 없음',
  args: {
    message: '해당 장소의 정보가 제공되지 않습니다.',
  },
};

export const CurrentLocationError: Story = {
  name: '현재 위치 오류',
  args: {
    message: '현재 위치를 불러올 수 없습니다.',
  },
};

export const LongMessage: Story = {
  name: '긴 메시지',
  args: {
    message:
      '현재 위치를 불러오는 중 문제가 발생했습니다. 브라우저 위치 권한을 확인한 뒤 다시 시도해주세요. 문제가 계속되면 지역명을 직접 검색해주세요.',
  },
};
