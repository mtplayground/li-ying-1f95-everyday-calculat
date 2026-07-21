import type { ReactNode } from 'react';

export type CalcButtonKind = 'digit' | 'operator' | 'action' | 'equals';

interface CalcButtonProps {
  label: ReactNode;
  ariaLabel: string;
  kind?: CalcButtonKind;
  span?: 1 | 2;
  rowSpan?: 1 | 2;
  onPress?: () => void;
}

export function CalcButton({
  label,
  ariaLabel,
  kind = 'digit',
  span = 1,
  rowSpan = 1,
  onPress,
}: CalcButtonProps) {
  const classes = [
    'calc-button',
    `calc-button--${kind}`,
    span === 2 ? 'calc-button--span-2' : '',
    rowSpan === 2 ? 'calc-button--row-span-2' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classes} aria-label={ariaLabel} onClick={onPress}>
      {label}
    </button>
  );
}
