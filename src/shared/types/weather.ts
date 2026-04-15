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
  uvi: number;      // UV 지수 (0~11+)
  pm10: number;     // 미세먼지 μg/m³
  pm25: number;     // 초미세먼지 μg/m³
}

export interface WeatherHourly {
  dt: number;       // Unix timestamp
  time: string;     // "14:00" 형태
  temp: number;
  icon: string;
  pop: number;      // 강수확률 0~1
}

export interface WeatherDaily {
  date: string;      // "2026-04-15"
  dayLabel: string;  // "오늘" | "내일" | "목" | "금" ...
  tempMin: number;
  tempMax: number;
  amIcon: string;    // 오전 대표 아이콘 코드 (06~11시)
  pmIcon: string;    // 오후 대표 아이콘 코드 (12~17시)
  amPop: number;     // 오전 최대 강수확률 0~1
  pmPop: number;     // 오후 최대 강수확률 0~1
}

export interface WeatherData {
  locationName: string;
  current: WeatherCurrent;
  hourly: WeatherHourly[];
  daily: WeatherDaily[];
}
