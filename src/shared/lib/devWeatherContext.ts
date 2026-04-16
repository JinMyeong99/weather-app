import { createContext } from 'react';

export interface DevWeatherContextValue {
  mockIcon: string | null;
  setMockIcon: (icon: string | null) => void;
}

export const DevWeatherContext = createContext<DevWeatherContextValue>({
  mockIcon: null,
  setMockIcon: () => {},
});
