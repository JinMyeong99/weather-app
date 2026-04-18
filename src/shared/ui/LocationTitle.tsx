interface LocationTitleProps {
  locationName: string;
  primaryClassName: string;
  secondaryClassName?: string;
  desktopClassName?: string;
  stackOnDesktop?: boolean;
  as?: 'p' | 'h1';
}

function splitLocationName(locationName: string): { primary: string; secondary: string | null } {
  const match = locationName.match(/^(.+?)\s*\((.+)\)$/);
  if (!match) return { primary: locationName, secondary: null };

  return {
    primary: match[1],
    secondary: match[2],
  };
}

export function LocationTitle({
  locationName,
  primaryClassName,
  secondaryClassName = '',
  desktopClassName = primaryClassName,
  stackOnDesktop = false,
  as: TitleTag = 'p',
}: LocationTitleProps) {
  const { primary, secondary } = splitLocationName(locationName);

  if (!secondary) {
    return <TitleTag className={primaryClassName}>{locationName}</TitleTag>;
  }

  return (
    <TitleTag className="min-w-0">
      <span className={stackOnDesktop ? '' : 'sm:hidden'}>
        <span className={`block ${primaryClassName}`}>{primary}</span>
        <span className={`block ${secondaryClassName}`}>{secondary}</span>
      </span>
      {!stackOnDesktop && (
        <span className={`hidden sm:block ${desktopClassName}`}>{locationName}</span>
      )}
    </TitleTag>
  );
}
