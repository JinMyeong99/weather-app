export interface Grade {
  label: string;
  bgLight: string;
  textLight: string;
  labelLight: string;
}

export function getUviGrade(uvi: number): Grade {
  if (uvi <= 2) return { label: '낮음', bgLight: 'bg-green-200/80', textLight: 'text-green-700', labelLight: 'text-green-600' };
  if (uvi <= 5) return { label: '보통', bgLight: 'bg-yellow-200/80', textLight: 'text-yellow-700', labelLight: 'text-yellow-600' };
  if (uvi <= 7) return { label: '높음', bgLight: 'bg-orange-200/80', textLight: 'text-orange-700', labelLight: 'text-orange-600' };
  if (uvi <= 10) return { label: '매우높음', bgLight: 'bg-red-200/80', textLight: 'text-red-700', labelLight: 'text-red-600' };
  return { label: '위험', bgLight: 'bg-purple-200/80', textLight: 'text-purple-700', labelLight: 'text-purple-600' };
}

export function getPm10Grade(pm10: number): Grade {
  if (pm10 <= 30) return { label: '좋음', bgLight: 'bg-green-200/80', textLight: 'text-green-700', labelLight: 'text-green-600' };
  if (pm10 <= 80) return { label: '보통', bgLight: 'bg-yellow-200/80', textLight: 'text-yellow-700', labelLight: 'text-yellow-600' };
  if (pm10 <= 150) return { label: '나쁨', bgLight: 'bg-orange-200/80', textLight: 'text-orange-700', labelLight: 'text-orange-600' };
  return { label: '매우나쁨', bgLight: 'bg-red-200/80', textLight: 'text-red-700', labelLight: 'text-red-600' };
}

export function getPm25Grade(pm25: number): Grade {
  if (pm25 <= 15) return { label: '좋음', bgLight: 'bg-green-200/80', textLight: 'text-green-700', labelLight: 'text-green-600' };
  if (pm25 <= 35) return { label: '보통', bgLight: 'bg-yellow-200/80', textLight: 'text-yellow-700', labelLight: 'text-yellow-600' };
  if (pm25 <= 75) return { label: '나쁨', bgLight: 'bg-orange-200/80', textLight: 'text-orange-700', labelLight: 'text-orange-600' };
  return { label: '매우나쁨', bgLight: 'bg-red-200/80', textLight: 'text-red-700', labelLight: 'text-red-600' };
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
