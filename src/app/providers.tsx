import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { DevWeatherProvider } from '../shared/lib/DevWeatherProvider';
import { WeatherBackgroundDemoPanel } from '../widgets/weather-background-demo/WeatherBackgroundDemoPanel';

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((module) => ({
        default: module.ReactQueryDevtools,
      })),
    )
  : null;

const shouldShowBackgroundDemo =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_BACKGROUND_DEMO === 'true';

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
      {shouldShowBackgroundDemo && <WeatherBackgroundDemoPanel />}
    </DevWeatherProvider>
    {ReactQueryDevtools && (
      <Suspense fallback={null}>
        <ReactQueryDevtools initialIsOpen={false} />
      </Suspense>
    )}
  </QueryClientProvider>
);
