import { useSearchBarController } from './useSearchBarController';
import type { District } from '../../shared/types';

interface SearchBarProps {
  onSelect: (lat: number, lon: number, district: District) => void;
  onCurrentLocation?: () => void;
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4.3-4.3" />
    </svg>
  );
}

function CurrentLocationIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="6.5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
    </svg>
  );
}

export function SearchBar({ onSelect, onCurrentLocation }: SearchBarProps) {
  const {
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
  } = useSearchBarController({ onSelect, onCurrentLocation });

  return (
    <div ref={containerRef} className="relative z-30 w-full">
      <div className="relative">
        {/* 검색 아이콘 */}
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <SearchIcon />
        </span>

        <input
          type="text"
          placeholder="시·구·동 단위로 검색 (예: 종로구, 청운동)"
          value={inputValue}
          onChange={handleChange}
          onFocus={openResultsIfAvailable}
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-10 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />

        {/* 현재 위치 버튼 */}
        {onCurrentLocation && (
          <div
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onMouseEnter={() => setShowLocationTooltip(true)}
            onMouseLeave={() => setShowLocationTooltip(false)}
          >
            <button
              type="button"
              onClick={handleCurrentLocationClick}
              onFocus={() => setShowLocationTooltip(true)}
              onBlur={() => setShowLocationTooltip(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-500"
              aria-label="현재 위치 날씨 보기"
            >
              <CurrentLocationIcon />
            </button>
            <span
              className={`pointer-events-none absolute bottom-full right-0 z-50 mb-2 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm transition-opacity ${
                showLocationTooltip ? 'opacity-100' : 'opacity-0'
              }`}
            >
              현재 위치 날씨 보기
            </span>
          </div>
        )}
      </div>

      {loading && (
        <p className="mt-1 text-xs text-gray-400">위치 정보를 가져오는 중...</p>
      )}

      {notFound && (
        <p className="mt-1 text-xs text-red-400">해당 장소의 정보가 제공되지 않습니다.</p>
      )}

      {isOpen && results.length > 0 && (
        <ul className="absolute z-40 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {results.map((district) => (
            <li key={district.fullName}>
              <button
                type="button"
                onClick={() => handleSelect(district)}
                className="block w-full cursor-pointer px-4 py-2.5 text-left text-sm hover:bg-blue-50"
              >
                {district.displayName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
