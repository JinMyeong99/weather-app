import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorBoundary } from './ErrorBoundary';

const longReactErrorMessage =
  'Should have a queue. You are likely calling Hooks conditionally, which is not allowed. (https://react.dev/link/invalid-hook-call) '.repeat(6);

function ThrowError({ message }: { message: string }) {
  if (message) throw new Error(message);
  return null;
}

const meta: Meta<typeof ErrorBoundary> = {
  title: 'shared/ui/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '페이지 렌더링 중 예외가 발생했을 때 보여주는 fallback UI입니다. Story에서는 테스트용 컴포넌트가 의도적으로 에러를 던집니다.',
      },
    },
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

export const HomeError: Story = {
  name: '홈 오류 화면',
  render: () => (
    <ErrorBoundary pageName="홈">
      <ThrowError message="홈 데이터를 불러오는 중 예외가 발생했습니다." />
    </ErrorBoundary>
  ),
};

export const DetailError: Story = {
  name: '상세 오류 화면',
  render: () => (
    <ErrorBoundary pageName="상세">
      <ThrowError message="상세 데이터를 불러오는 중 예외가 발생했습니다." />
    </ErrorBoundary>
  ),
};

export const LongDevError: Story = {
  name: '긴 오류 메시지',
  render: () => (
    <ErrorBoundary pageName="홈">
      <ThrowError message={longReactErrorMessage} />
    </ErrorBoundary>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'React 내부 오류처럼 긴 메시지가 오류 메시지 박스 안에서 줄바꿈되고, 모바일 화면 밖으로 넘치지 않는지 확인합니다.',
      },
    },
  },
};

export const MobileLongError: Story = {
  name: '모바일 긴 오류 메시지',
  render: () => (
    <div style={{ width: '320px', margin: '0 auto' }}>
      <ErrorBoundary pageName="홈">
        <ThrowError message={longReactErrorMessage} />
      </ErrorBoundary>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '320px 모바일 폭에서 긴 오류 메시지가 박스 안에서 줄바꿈되고 스크롤되는지 확인합니다.',
      },
    },
  },
};
