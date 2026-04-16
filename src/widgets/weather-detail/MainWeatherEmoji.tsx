import { getWeatherIcon } from '../../shared/lib/getWeatherIcon';

const MAIN_WEATHER_EMOJI_SCALE_BY_CODE: Record<string, number> = {
  '01d': 0.92,
  '01n': 1.02,
  '02': 1.1,
  '03': 1.08,
  '04': 1.02,
  '09': 1.12,
  '10': 1.12,
  '11': 1.12,
  '13': 0.95,
  '50': 1.02,
};

function getMainWeatherEmojiScale(iconCode: string): number {
  return MAIN_WEATHER_EMOJI_SCALE_BY_CODE[iconCode]
    ?? MAIN_WEATHER_EMOJI_SCALE_BY_CODE[iconCode.slice(0, 2)]
    ?? 1;
}

export function MainWeatherEmoji({ icon, label }: { icon: string; label: string }) {
  const scale = getMainWeatherEmojiScale(icon);

  return (
    <span className="inline-flex h-20 w-20 shrink-0 items-center justify-center">
      <span
        className="text-7xl leading-none"
        role="img"
        aria-label={label}
        style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
      >
        {getWeatherIcon(icon)}
      </span>
    </span>
  );
}
