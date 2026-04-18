import { useState, useMemo, useEffect, useCallback } from 'react';
import type { District } from '../../../shared/types';

interface SearchableDistrict {
  district: District;
  normalizedPrimaryName: string;
  normalizedFullName: string;
  normalizedDisplayName: string;
  normalizedParts: string[];
}

interface RankedDistrict {
  district: District;
  score: number;
  originalIndex: number;
}

function normalizeSearchText(value: string): string {
  return value.replace(/[-\s(),]/g, '');
}

function parseDistrict(fullName: string): SearchableDistrict {
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

  const district = {
    fullName,
    sido,
    sigungu,
    dong,
    displayName,
  };

  return {
    district,
    normalizedPrimaryName: normalizeSearchText(dong ?? sigungu ?? sido),
    normalizedFullName: normalizeSearchText(fullName),
    normalizedDisplayName: normalizeSearchText(displayName),
    normalizedParts: [sido, sigungu, dong].filter(Boolean).map(normalizeSearchText),
  };
}

// 954KB JSON을 초기 번들에서 분리해 첫 검색 시점에 한 번만 로드한다.
let cachedDistricts: SearchableDistrict[] | null = null;
let loadPromise: Promise<SearchableDistrict[]> | null = null;

function loadDistricts(): Promise<SearchableDistrict[]> {
  if (cachedDistricts) return Promise.resolve(cachedDistricts);
  if (!loadPromise) {
    loadPromise = import('../../../shared/lib/korea_districts.json').then((m) => {
      cachedDistricts = (m.default as string[]).map(parseDistrict);
      return cachedDistricts;
    });
  }
  return loadPromise;
}

function getSearchScore(
  district: SearchableDistrict,
  normalizedKeyword: string,
  keywordParts: string[],
): number | null {
  const targets = [district.normalizedDisplayName, district.normalizedFullName];
  const lastKeywordPart = keywordParts[keywordParts.length - 1];
  const isMultiKeywordMatch = keywordParts.length > 1
    && keywordParts.every((keywordPart) =>
      district.normalizedParts.some((districtPart) => districtPart.startsWith(keywordPart)),
    );

  if (
    isMultiKeywordMatch
    && lastKeywordPart
    && district.normalizedPrimaryName.startsWith(lastKeywordPart)
  ) {
    return 0;
  }
  if (isMultiKeywordMatch) return 1;
  if (district.normalizedPrimaryName === normalizedKeyword) return 2;
  if (district.normalizedPrimaryName.startsWith(normalizedKeyword)) return 3;
  if (district.normalizedParts.some((part) => part === normalizedKeyword)) return 4;
  if (district.normalizedParts.some((part) => part.startsWith(normalizedKeyword))) return 5;
  if (targets.some((target) => target.startsWith(normalizedKeyword))) return 6;
  if (normalizedKeyword.length < 2) return null;
  if (district.normalizedPrimaryName.includes(normalizedKeyword)) return 7;
  if (district.normalizedParts.some((part) => part.includes(normalizedKeyword))) return 8;
  if (targets.some((target) => target.includes(normalizedKeyword))) return 9;

  return null;
}

function filterDistricts(districts: SearchableDistrict[], keyword: string): District[] {
  const trimmed = keyword.trim();
  if (trimmed.length < 1) return [];
  const normalizedKeyword = normalizeSearchText(trimmed);
  if (normalizedKeyword.length < 1) return [];
  const keywordParts = trimmed
    .split(/[-\s]+/)
    .map(normalizeSearchText)
    .filter(Boolean);
  const results: RankedDistrict[] = [];

  districts.forEach((district, originalIndex) => {
    const score = getSearchScore(district, normalizedKeyword, keywordParts);

    if (score !== null) {
      results.push({ district: district.district, score, originalIndex });
    }
  });

  return results
    .sort((a, b) => a.score - b.score || a.originalIndex - b.originalIndex)
    .slice(0, 10)
    .map((result) => result.district);
}

export function useDistrictSearch() {
  const [query, setQuery] = useState('');
  const [districts, setDistricts] = useState<SearchableDistrict[]>(() => cachedDistricts ?? []);

  // 첫 입력 시점에 JSON을 동적으로 로드한다. 이미 캐싱된 경우 즉시 반환된다.
  useEffect(() => {
    if (query.trim().length > 0 && districts.length === 0) {
      loadDistricts().then(setDistricts);
    }
  }, [query, districts.length]);

  const results = useMemo(() => filterDistricts(districts, query), [query, districts]);

  const prefetchDistricts = useCallback(async () => {
    if (districts.length > 0) return;

    const availableDistricts = await loadDistricts();
    setDistricts(availableDistricts);
  }, [districts.length]);

  const searchImmediately = useCallback(
    async (keyword: string) => {
      const availableDistricts = districts.length > 0 ? districts : await loadDistricts();
      if (districts.length === 0) setDistricts(availableDistricts);
      return filterDistricts(availableDistricts, keyword);
    },
    [districts],
  );

  return { query, setQuery, results, prefetchDistricts, searchImmediately };
}
