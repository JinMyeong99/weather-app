import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'shared/ui/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '화면 상단 중앙에 표시되는 토스트 알림입니다. `duration`(기본 3초) 후 자동으로 사라지며, `onDismiss` 콜백으로 상태를 제거합니다. 즐겨찾기 6개 초과 시 사용합니다.',
      },
    },
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  name: '기본 토스트',
  args: {
    message: '즐겨찾기는 최대 6개까지 추가할 수 있습니다.',
    onDismiss: () => {},
    duration: 999999,
  },
  parameters: {
    docs: {
      description: {
        story: '즐겨찾기 초과 시 표시되는 토스트입니다. `duration`을 크게 설정해 Story에서 사라지지 않도록 했습니다.',
      },
    },
  },
};

function ToastDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex h-40 items-center justify-center">
      <button
        onClick={() => setVisible(true)}
        className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
      >
        토스트 띄우기
      </button>
      {visible && (
        <Toast
          message="즐겨찾기는 최대 6개까지 추가할 수 있습니다."
          onDismiss={() => setVisible(false)}
          duration={3000}
        />
      )}
    </div>
  );
}

export const Interactive: Story = {
  name: '인터랙티브 (3초 자동 소멸)',
  render: () => <ToastDemo />,
  parameters: {
    docs: {
      description: {
        story: '버튼을 클릭하면 토스트가 나타나고 3초 후 자동으로 사라집니다.',
      },
    },
  },
};
