import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/home';
import { DetailPage } from '../pages/detail';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/detail/:locationId',
    element: <DetailPage />,
  },
]);
