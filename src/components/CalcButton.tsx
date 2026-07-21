import { useState } from 'react';
import type { KeyboardEvent, PointerEvent, ReactNode } from 'react';

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
  const [isPressed, setIsPressed] = useState(false);
  const classes = [
    'calc-button',
    `calc-button--${kind}`,
    isPressed ? 'calc-button--pressed' : '',
    span === 2 ? 'calc-button--span-2' : '',
    rowSpan === 2 ? 'calc-button--row-span-2' : '',
  ]
    .filter(Boolean)
    .join(' ');

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) {
      return;
    }

    setIsPressed(true);
    onPress?.();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.repeat) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsPressed(true);
      onPress?.();
    }
  }

  function handleKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsPressed(false);
    }
  }

  return (
    <button
      type="button"
      className={classes}
      aria-label={ariaLabel}
      onPointerDown={handlePointerDown}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
      onPointerCancel={() => setIsPressed(false)}
      onBlur={() => setIsPressed(false)}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      {label}
    </button>
  );
}
