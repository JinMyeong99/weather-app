import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { DevWeatherProvider } from '../shared/lib/DevWeatherProvider';
import { DevPanel } from '../widgets/dev-panel/DevPanel';

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((module) => ({
        default: module.ReactQueryDevtools,
      })),
    )
  : null;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export const AppProviders = () => (
  <QueryClientProvider client={queryClient}>
    <DevWeatherProvider>
      <RouterProvider router={router} />
      {import.meta.env.DEV && <DevPanel />}
    </DevWeatherProvider>
    {ReactQueryDevtools && (
      <Suspense fallback={null}>
        <ReactQueryDevtools initialIsOpen={false} />
      </Suspense>
    )}
  </QueryClientProvider>
);
