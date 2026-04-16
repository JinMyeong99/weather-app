/**
 * OWM icon 코드 → 이모지 변환
 * OWM icon code 형식: "01d", "02n" 등 (앞 2자리: 조건, 마지막: d=낮/n=밤)
 */
export function getWeatherIcon(iconCode: string): string {
  const code = iconCode.slice(0, 2);
  const isNight = iconCode.endsWith('n');

  switch (code) {
    case '01': return isNight ? '🌙' : '☀️';
    case '02': return isNight ? '🌤️' : '🌤️';
    case '03': return '⛅';
    case '04': return '☁️';
    case '09': return '🌧️';
    case '10': return isNight ? '🌧️' : '🌦️';
    case '11': return '⛈️';
    case '13': return '❄️';
    case '50': return '☁️';
    default:   return '🌡️';
  }
}
