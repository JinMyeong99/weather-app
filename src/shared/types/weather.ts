export interface WeatherCurrent {
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  sunrise: number;  // Unix timestamp
  sunset: number;   // Unix timestamp
}

export interface WeatherHourly {
  dt: number;       // Unix timestamp
  time: string;     // "14:00" 형태
  temp: number;
  icon: string;
  pop: number;      // 강수확률 0~1
}

export interface WeatherData {
  locationName: string;
  current: WeatherCurrent;
  hourly: WeatherHourly[];
}
