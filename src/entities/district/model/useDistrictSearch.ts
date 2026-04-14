import { useState, useMemo } from 'react';
import districtData from '../../../shared/lib/korea_districts.json';
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

const allDistricts: District[] = (districtData as string[]).map(parseDistrict);

export function useDistrictSearch() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length < 1) return [];
    return allDistricts
      .filter((d) => d.fullName.replace(/-/g, '').includes(trimmed) || d.displayName.includes(trimmed))
      .slice(0, 10);
  }, [query]);

  return { query, setQuery, results };
}
