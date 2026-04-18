import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { useDistrictSearch } from '../../entities/district/model/useDistrictSearch';
import { geocodeDistrict } from '../../features/search/geocodeApi';
import type { District } from '../../shared/types';

const SEARCH_DEBOUNCE_MS = 300;

interface UseSearchBarControllerParams {
  onSelect: (lat: number, lon: number, district: District) => void;
  onCurrentLocation?: () => void;
  onSearchingChange?: (isSearching: boolean) => void;
  onNotFound?: (notFound: boolean) => void;
}

export function useSearchBarController({
  onSelect,
  onCurrentLocation,
  onSearchingChange,
  onNotFound,
}: UseSearchBarControllerParams) {
  const { query, setQuery, results, prefetchDistricts, searchImmediately } = useDistrictSearch();
  const [inputValue, setInputValue] = useState(query);
  const [isOpen, setIsOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLocationTooltip, setShowLocationTooltip] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 결과가 바뀌면 포커스 초기화
  useEffect(() => {
    setFocusedIndex(-1);
  }, [results]);

  const clearDebounce = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  };

  const clearNotFound = () => {
    if (notFound) {
      setNotFound(false);
      onNotFound?.(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;

    setInputValue(nextValue);
    clearNotFound();
    clearDebounce();

    if (nextValue.trim().length === 0) {
      setQuery('');
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      setQuery(nextValue);
      setIsOpen(true);
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleSelect = async (district: District) => {
    setIsOpen(false);
    setLoading(true);
    setNotFound(false);
    onSearchingChange?.(true);

    try {
      const coords = await geocodeDistrict(district);

      if (!coords) {
        setNotFound(true);
        onNotFound?.(true);
        return;
      }

      setInputValue('');
      setQuery('');
      onSelect(coords.lat, coords.lon, district);
    } finally {
      setLoading(false);
      onSearchingChange?.(false);
    }
  };

  const handleEnterSearch = async () => {
    const keyword = inputValue.trim();
    if (keyword.length === 0) return;

    clearDebounce();
    clearNotFound();

    if (isOpen && results.length > 0 && query.trim() === keyword) {
      await handleSelect(results[focusedIndex >= 0 ? focusedIndex : 0]);
      setFocusedIndex(-1);
      return;
    }

    setQuery(keyword);
    const immediateResults = await searchImmediately(keyword);

    if (immediateResults.length === 0) {
      setIsOpen(false);
      setFocusedIndex(-1);
      setNotFound(true);
      onNotFound?.(true);
      return;
    }

    await handleSelect(immediateResults[0]);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;

    switch (e.key) {
      case 'ArrowDown':
        if (!isOpen || results.length === 0) return;
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        if (!isOpen || results.length === 0) return;
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        void handleEnterSearch();
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  const handleCurrentLocationClick = () => {
    setShowLocationTooltip(false);
    onCurrentLocation?.();
  };

  const openResultsIfAvailable = () => {
    void prefetchDistricts();
    if (results.length > 0) setIsOpen(true);
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 언마운트 시 진행 중인 debounce 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    containerRef,
    inputValue,
    isOpen,
    loading,
    notFound,
    results,
    focusedIndex,
    showLocationTooltip,
    handleChange,
    handleKeyDown,
    handleSelect,
    handleCurrentLocationClick,
    openResultsIfAvailable,
    setShowLocationTooltip,
  };
}
