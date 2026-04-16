import { useState, type ReactNode } from 'react';
import { DevWeatherContext } from './devWeatherContext';

export function DevWeatherProvider({ children }: { children: ReactNode }) {
  const [mockIcon, setMockIcon] = useState<string | null>(null);

  return (
    <DevWeatherContext.Provider value={{ mockIcon, setMockIcon }}>
      {children}
    </DevWeatherContext.Provider>
  );
}
