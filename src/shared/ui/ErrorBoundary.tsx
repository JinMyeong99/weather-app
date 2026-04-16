import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** 에러 발생 시 표시할 페이지 이름 (예: "홈", "상세") */
  pageName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const { pageName = '페이지' } = this.props;
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
          <p className="text-5xl">⚠️</p>
          <h1 className="text-xl font-bold text-slate-800">
            {pageName}를 불러오는 중 문제가 발생했습니다
          </h1>
          <p className="text-sm text-slate-500">
            잠시 후 다시 시도하거나 새로고침 해주세요.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="max-w-md rounded-lg bg-red-50 p-3 text-left text-xs text-red-700">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
