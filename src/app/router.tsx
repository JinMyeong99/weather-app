import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/home';
import { DetailPage } from '../pages/detail';
import { ErrorBoundary } from '../shared/ui/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary pageName="홈">
        <HomePage />
      </ErrorBoundary>
    ),
  },
  {
    path: '/detail/:locationId',
    element: (
      <ErrorBoundary pageName="상세">
        <DetailPage />
      </ErrorBoundary>
    ),
  },
]);
