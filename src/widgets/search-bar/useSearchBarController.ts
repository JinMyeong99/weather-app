import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useDistrictSearch } from '../../entities/district/model/useDistrictSearch';
import { geocodeDistrict } from '../../features/search/geocodeApi';
import type { District } from '../../shared/types';

const SEARCH_DEBOUNCE_MS = 300;

interface UseSearchBarControllerParams {
  onSelect: (lat: number, lon: number, district: District) => void;
  onCurrentLocation?: () => void;
}

export function useSearchBarController({ onSelect, onCurrentLocation }: UseSearchBarControllerParams) {
  const { query, setQuery, results } = useDistrictSearch();
  const [inputValue, setInputValue] = useState(query);
  const [isOpen, setIsOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLocationTooltip, setShowLocationTooltip] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;

    setInputValue(nextValue);
    setNotFound(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);

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

    const coords = await geocodeDistrict(district);
    setLoading(false);

    if (!coords) {
      setNotFound(true);
      return;
    }

    setInputValue('');
    setQuery('');
    onSelect(coords.lat, coords.lon, district);
  };

  const handleCurrentLocationClick = () => {
    setShowLocationTooltip(false);
    onCurrentLocation?.();
  };

  const openResultsIfAvailable = () => {
    if (results.length > 0) setIsOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
    showLocationTooltip,
    handleChange,
    handleSelect,
    handleCurrentLocationClick,
    openResultsIfAvailable,
    setShowLocationTooltip,
  };
}
