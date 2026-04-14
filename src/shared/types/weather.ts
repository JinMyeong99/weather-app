export interface WeatherCurrent {
  temp: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface WeatherHourly {
  time: string;
  temp: number;
  icon: string;
}

export interface WeatherData {
  locationName: string;
  current: WeatherCurrent;
  hourly: WeatherHourly[];
}
