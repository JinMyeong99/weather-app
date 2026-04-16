export function FavoriteListEmpty() {
  return (
    <div className="relative flex items-center gap-4 rounded-2xl border border-white/60 bg-white/85 px-5 py-4 shadow-sm backdrop-blur-sm">
      {/* 실제 카드와 높이 맞추기 위한 투명 구조 */}
      <div className="flex-1 min-w-0">
        <div className="h-5" />         {/* 별칭 text-sm font-semibold */}
        <div className="mt-0.5 h-4" />  {/* 설명 mt-0.5 text-xs */}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <div className="h-9 w-9" />  {/* 이모지 text-4xl leading-none */}
        <div className="text-right">
          <div className="h-7" />  {/* 기온 text-xl */}
          <div className="h-4" />  {/* 최저최고 text-xs */}
        </div>
      </div>
      {/* 중앙 안내 문구 */}
      <p className="absolute inset-0 flex items-center justify-center text-sm font-medium text-slate-500">
        ＋ 즐겨찾기를 추가해보세요
      </p>
    </div>
  );
}
