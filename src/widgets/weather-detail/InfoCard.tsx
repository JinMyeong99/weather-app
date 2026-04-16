interface InfoCardProps {
  label: string;
  value: string;
  bg: string;
  text: string;
  labelColor: string;
  className?: string;
}

export function InfoCard({ label, value, bg, text, labelColor, className = '' }: InfoCardProps) {
  return (
    <div className={`flex min-w-0 flex-col items-start gap-1 rounded-xl px-3 py-2.5 ${bg} ${className}`}>
      <span className={`text-sm font-medium ${labelColor}`}>{label}</span>
      <span className={`text-sm font-bold ${text}`}>{value}</span>
    </div>
  );
}
