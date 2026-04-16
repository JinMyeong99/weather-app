/**
 * OWM 아이콘 코드(예: "01d", "10n") → 날씨 테마 반환
 * 페이지 배경 그라데이션과 헤더 텍스트 대비 기준을 관리.
 */
export interface WeatherTheme {
  gradient: string;
  isDark: boolean;
}

export function getWeatherTheme(icon: string): WeatherTheme {
  const code = icon.slice(0, 2);
  const isDay = icon.endsWith('d');

  switch (code) {
    case '01': return isDay
      ? { gradient: 'bg-[linear-gradient(225deg,#e0f2fe_0%,#7dd3fc_46%,#60a5fa_100%)]', isDark: false }
      : { gradient: 'bg-gradient-to-br from-indigo-900 to-slate-800', isDark: true };
    case '02': return isDay
      ? { gradient: 'bg-[linear-gradient(225deg,#e0f2fe_0%,#7dd3fc_44%,#bfdbfe_100%)]', isDark: false }
      : { gradient: 'bg-gradient-to-br from-indigo-800 to-slate-700', isDark: true };
    case '03': return isDay
      ? { gradient: 'bg-[linear-gradient(225deg,#bae6fd_0%,#7dd3fc_44%,#94a3b8_100%)]', isDark: false }
      : { gradient: 'bg-gradient-to-br from-indigo-900 to-slate-700', isDark: true };
    case '04': return { gradient: 'bg-[linear-gradient(225deg,#64748b_0%,#475569_48%,#374151_100%)]', isDark: true };
    case '09':
    case '10': return { gradient: 'bg-gradient-to-br from-slate-600 to-blue-800', isDark: true };
    case '11': return { gradient: 'bg-gradient-to-br from-slate-800 to-indigo-900', isDark: true };
    case '13': return { gradient: 'bg-gradient-to-br from-blue-300 to-slate-400', isDark: false };
    case '50': return { gradient: 'bg-gradient-to-br from-gray-400 to-slate-500', isDark: true };
    default:   return { gradient: 'bg-gradient-to-br from-sky-500 to-blue-600', isDark: true };
  }
}
