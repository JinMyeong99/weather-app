function formatTime(unix: number): string {
  return new Date(unix * 1000).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

interface SunTimeCardProps {
  label: string;
  value: number;
  type: 'sunrise' | 'sunset';
  className?: string;
}

function SunTimeIcon({ type }: { type: 'sunrise' | 'sunset' }) {
  const isSunrise = type === 'sunrise';

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {isSunrise ? (
        <>
          <path d="M7.5 17a4.5 4.5 0 0 1 9 0H7.5Z" fill="currentColor" opacity="0.18" stroke="none" />
          <path d="M7.5 17a4.5 4.5 0 0 1 9 0" />
          <path d="M4 17h16" />
          <path d="M12 5.5v2" />
          <path d="M7.8 8.2l1.4 1.4" />
          <path d="M16.2 8.2l-1.4 1.4" />
        </>
      ) : (
        <>
          <path d="M7.5 13a4.5 4.5 0 0 0 9 0H7.5Z" fill="currentColor" opacity="0.16" stroke="none" />
          <path d="M4 13h16" />
          <path d="M7.5 13a4.5 4.5 0 0 0 9 0" />
          <path d="M6 17h12" opacity="0.75" />
          <path d="M9 20h6" opacity="0.5" />
        </>
      )}
    </svg>
  );
}

export function SunTimeCard({ label, value, type, className = '' }: SunTimeCardProps) {
  const isSunrise = type === 'sunrise';
  const color = isSunrise
    ? 'border-amber-200/80 bg-amber-50/80 text-amber-800'
    : 'border-orange-200/80 bg-orange-50/80 text-orange-800';
  const labelColor = isSunrise ? 'text-amber-700' : 'text-orange-700';
  const timeLineColor = isSunrise ? 'bg-amber-300/45' : 'bg-orange-300/45';
  const iconBg = isSunrise ? 'bg-amber-100/45' : 'bg-orange-100/45';

  return (
    <div className={`relative flex min-w-0 items-center gap-2 overflow-hidden rounded-xl border px-3 py-2.5 ${color} ${className}`}>
      <span className={`pointer-events-none absolute inset-x-0 bottom-0 h-1 ${timeLineColor}`} />
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
        <SunTimeIcon type={type} />
      </span>
      <div className="flex min-w-0 flex-col items-start">
        <span className={`text-xs font-medium ${labelColor}`}>{label}</span>
        <span className="whitespace-nowrap text-base font-bold tabular-nums">{formatTime(value)}</span>
      </div>
    </div>
  );
}
