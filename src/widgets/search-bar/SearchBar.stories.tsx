import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, waitFor, fn } from 'storybook/test';
import { SearchBar } from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'widgets/search-bar/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '672px', padding: '24px 16px 120px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          '지역명(시·구·동)을 입력하면 자동완성 드롭다운이 표시됩니다. ↑↓ 키로 항목을 탐색하고 Enter로 선택, Escape로 닫을 수 있습니다. `onCurrentLocation` prop을 전달하면 현재 위치 버튼이 활성화됩니다.',
      },
    },
    layout: 'centered',
  },
  args: {
    onSelect: fn(),
    onCurrentLocation: fn(),
    onSearchingChange: fn(),
    onNotFound: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  name: '기본',
  parameters: {
    docs: {
      description: {
        story: '초기 상태의 검색바입니다. 입력 전에는 드롭다운이 표시되지 않습니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    await expect(input).toBeInTheDocument();
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
  },
};

export const WithCurrentLocation: Story = {
  name: '현재 위치 버튼 포함',
  parameters: {
    docs: {
      description: {
        story:
          '`onCurrentLocation` prop을 전달하면 우측에 현재 위치 버튼이 나타납니다. 호버 시 툴팁이 표시됩니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const locationBtn = canvas.getByRole('button', { name: '현재 위치 날씨 보기' });
    await expect(locationBtn).toBeInTheDocument();
  },
};

export const SearchResults: Story = {
  name: '검색 결과 드롭다운',
  parameters: {
    docs: {
      description: {
        story:
          '"성동구"를 입력하면 디바운스(300ms) 후 자동완성 결과가 드롭다운으로 표시됩니다. 결과는 최대 10개로 제한됩니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    await userEvent.click(input);
    await userEvent.type(input, '성동구');

    // 디바운스(300ms) + 동적 JSON 로드 대기
    await waitFor(
      () => expect(canvas.getByRole('listbox')).toBeInTheDocument(),
      { timeout: 3000 },
    );

    const options = canvas.getAllByRole('option');
    await expect(options.length).toBeGreaterThan(0);
    await expect(input).toHaveAttribute('aria-expanded', 'true');
  },
};

export const KeyboardNavigation: Story = {
  name: '키보드 내비게이션 (↑↓ Escape)',
  parameters: {
    docs: {
      description: {
        story:
          '↓ 키로 항목을 이동하면 파란 배경으로 포커스가 강조됩니다. ↑ 키로 위로 이동, Escape로 드롭다운을 닫습니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    // 검색어 입력 후 드롭다운 대기
    await userEvent.click(input);
    await userEvent.type(input, '성동구');
    await waitFor(
      () => expect(canvas.getByRole('listbox')).toBeInTheDocument(),
      { timeout: 3000 },
    );

    const options = canvas.getAllByRole('option');

    // ↓ → 첫 번째 항목 선택
    await userEvent.keyboard('{ArrowDown}');
    await expect(options[0]).toHaveAttribute('aria-selected', 'true');

    // ↓ → 두 번째 항목 선택
    await userEvent.keyboard('{ArrowDown}');
    await expect(options[1]).toHaveAttribute('aria-selected', 'true');

    // ↑ → 첫 번째 항목으로 복귀
    await userEvent.keyboard('{ArrowUp}');
    await expect(options[0]).toHaveAttribute('aria-selected', 'true');

    // Escape → 드롭다운 닫힘
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
  },
};

export const ClearInput: Story = {
  name: '입력 지우면 드롭다운 닫힘',
  parameters: {
    docs: {
      description: {
        story: '검색어를 모두 지우면 드롭다운이 즉시 닫힙니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    await userEvent.click(input);
    await userEvent.type(input, '성동구');
    await waitFor(
      () => expect(canvas.getByRole('listbox')).toBeInTheDocument(),
      { timeout: 3000 },
    );

    // 전체 삭제 → 드롭다운 닫힘
    await userEvent.clear(input);
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
  },
};
