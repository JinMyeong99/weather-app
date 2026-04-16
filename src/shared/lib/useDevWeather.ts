import { useContext } from 'react';
import { DevWeatherContext } from './devWeatherContext';

export function useDevWeather() {
  return useContext(DevWeatherContext);
}
