import { useState, useMemo, useEffect } from 'react';
import type { District } from '../../../shared/types';

function parseDistrict(fullName: string): District {
  const parts = fullName.split('-');
  const sido = parts[0];
  const sigungu = parts[1];
  const dong = parts[2];

  let displayName = sido;
  if (sigungu && dong) {
    displayName = `${dong} (${sigungu}, ${sido})`;
  } else if (sigungu) {
    displayName = `${sigungu} (${sido})`;
  }

  return { fullName, sido, sigungu, dong, displayName };
}

// 954KB JSON을 초기 번들에서 분리해 첫 검색 시점에 한 번만 로드한다.
let cachedDistricts: District[] | null = null;
let loadPromise: Promise<District[]> | null = null;

function loadDistricts(): Promise<District[]> {
  if (cachedDistricts) return Promise.resolve(cachedDistricts);
  if (!loadPromise) {
    loadPromise = import('../../../shared/lib/korea_districts.json').then((m) => {
      cachedDistricts = (m.default as string[]).map(parseDistrict);
      return cachedDistricts;
    });
  }
  return loadPromise;
}

export function useDistrictSearch() {
  const [query, setQuery] = useState('');
  const [districts, setDistricts] = useState<District[]>(() => cachedDistricts ?? []);

  // 첫 입력 시점에 JSON을 동적으로 로드한다. 이미 캐싱된 경우 즉시 반환된다.
  useEffect(() => {
    if (query.trim().length > 0 && districts.length === 0) {
      loadDistricts().then(setDistricts);
    }
  }, [query, districts.length]);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length < 1) return [];
    return districts
      .filter((d) => d.fullName.replace(/-/g, '').includes(trimmed) || d.displayName.includes(trimmed))
      .slice(0, 10);
  }, [query, districts]);

  return { query, setQuery, results };
}
