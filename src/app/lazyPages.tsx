import { lazy } from 'react';

export const HomePage = lazy(() =>
  import('../pages/home').then((m) => ({ default: m.HomePage })),
);

export const DetailPage = lazy(() =>
  import('../pages/detail').then((m) => ({ default: m.DetailPage })),
);
