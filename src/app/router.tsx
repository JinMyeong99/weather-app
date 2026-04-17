import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../shared/ui/ErrorBoundary';
import { HomePage, DetailPage } from './lazyPages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary pageName="홈">
        <Suspense fallback={null}>
          <HomePage />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: '/detail/:locationId',
    element: (
      <ErrorBoundary pageName="상세">
        <Suspense fallback={null}>
          <DetailPage />
        </Suspense>
      </ErrorBoundary>
    ),
  },
]);
