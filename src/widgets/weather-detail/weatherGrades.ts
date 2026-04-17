export interface Grade {
  label: string;
  bgLight: string;
  textLight: string;
  labelLight: string;
}

// ── 자외선 지수 임계값 (WHO 기준) ──────────────────────────────
const UVI_LOW = 2;
const UVI_MODERATE = 5;
const UVI_HIGH = 7;
const UVI_VERY_HIGH = 10;

// ── 미세먼지(PM10) 임계값 (환경부 기준, μg/m³) ──────────────────
const PM10_GOOD = 30;
const PM10_MODERATE = 80;
const PM10_BAD = 150;

// ── 초미세먼지(PM2.5) 임계값 (환경부 기준, μg/m³) ────────────────
const PM25_GOOD = 15;
const PM25_MODERATE = 35;
const PM25_BAD = 75;

export function getUviGrade(uvi: number): Grade {
  if (uvi <= UVI_LOW)       return { label: '낮음',   bgLight: 'bg-green-200/80',  textLight: 'text-green-900',  labelLight: 'text-green-800' };
  if (uvi <= UVI_MODERATE)  return { label: '보통',   bgLight: 'bg-yellow-200/80', textLight: 'text-yellow-900', labelLight: 'text-yellow-800' };
  if (uvi <= UVI_HIGH)      return { label: '높음',   bgLight: 'bg-orange-200/80', textLight: 'text-orange-900', labelLight: 'text-orange-800' };
  if (uvi <= UVI_VERY_HIGH) return { label: '매우높음', bgLight: 'bg-red-200/80',  textLight: 'text-red-900',    labelLight: 'text-red-800' };
  return                           { label: '위험',   bgLight: 'bg-purple-200/80', textLight: 'text-purple-900', labelLight: 'text-purple-800' };
}

export function getPm10Grade(pm10: number): Grade {
  if (pm10 <= PM10_GOOD)     return { label: '좋음',   bgLight: 'bg-green-200/80',  textLight: 'text-green-900',  labelLight: 'text-green-800' };
  if (pm10 <= PM10_MODERATE) return { label: '보통',   bgLight: 'bg-yellow-200/80', textLight: 'text-yellow-900', labelLight: 'text-yellow-800' };
  if (pm10 <= PM10_BAD)      return { label: '나쁨',   bgLight: 'bg-orange-200/80', textLight: 'text-orange-900', labelLight: 'text-orange-800' };
  return                            { label: '매우나쁨', bgLight: 'bg-red-200/80',  textLight: 'text-red-900',    labelLight: 'text-red-800' };
}

export function getPm25Grade(pm25: number): Grade {
  if (pm25 <= PM25_GOOD)     return { label: '좋음',   bgLight: 'bg-green-200/80',  textLight: 'text-green-900',  labelLight: 'text-green-800' };
  if (pm25 <= PM25_MODERATE) return { label: '보통',   bgLight: 'bg-yellow-200/80', textLight: 'text-yellow-900', labelLight: 'text-yellow-800' };
  if (pm25 <= PM25_BAD)      return { label: '나쁨',   bgLight: 'bg-orange-200/80', textLight: 'text-orange-900', labelLight: 'text-orange-800' };
  return                            { label: '매우나쁨', bgLight: 'bg-red-200/80',  textLight: 'text-red-900',    labelLight: 'text-red-800' };
}

export function getUnavailableGrade(): Grade {
  return {
    label: '정보 없음',
    bgLight: 'bg-slate-100',
    textLight: 'text-slate-500',
    labelLight: 'text-slate-500',
  };
}

export function toInfoCardStyle(grade: Grade) {
  return {
    bg: grade.bgLight,
    text: grade.textLight,
    labelColor: grade.labelLight,
  };
}
