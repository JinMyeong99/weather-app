import { useRef, useState, useEffect } from 'react';
import { useDistrictSearch } from '../../entities/district/model/useDistrictSearch';
import { geocodeDistrict } from '../../features/search/geocodeApi';
import type { District } from '../../shared/types';

interface SearchBarProps {
  onSelect: (lat: number, lon: number, district: District) => void;
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const { query, setQuery, results } = useDistrictSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotFound(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery(e.target.value);
      setIsOpen(true);
    }, 300);
  };

  const handleSelect = async (district: District) => {
    setIsOpen(false);
    setQuery('');
    setLoading(true);
    setNotFound(false);

    const coords = await geocodeDistrict(district);
    setLoading(false);

    if (!coords) {
      setNotFound(true);
      return;
    }

    onSelect(coords.lat, coords.lon, district);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="시·구·동 단위로 검색 (예: 종로구, 청운동)"
        defaultValue={query}
        onChange={handleChange}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />

      {loading && (
        <p className="mt-1 text-xs text-gray-400">위치 정보를 가져오는 중...</p>
      )}

      {notFound && (
        <p className="mt-1 text-xs text-red-400">해당 장소의 정보가 제공되지 않습니다.</p>
      )}

      {isOpen && results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {results.map((district) => (
            <li
              key={district.fullName}
              onClick={() => handleSelect(district)}
              className="cursor-pointer px-4 py-2.5 text-sm hover:bg-blue-50"
            >
              {district.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
