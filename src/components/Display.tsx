import type { CSSProperties } from 'react';
import type { CalculatorState, Operator } from '../calculator/types';

interface DisplayProps {
  state: CalculatorState;
}

const operatorSymbols: Record<Operator, string> = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
};

export function Display({ state }: DisplayProps) {
  const text = getDisplayText(state);
  const style = {
    '--display-font-size': getDisplayFontSize(text, state.status === 'error'),
  } as CSSProperties;

  return (
    <output
      className="calculator-display text-app-text"
      aria-live="polite"
      aria-label="Calculator display"
      style={style}
    >
      {text}
    </output>
  );
}

function getDisplayText(state: CalculatorState): string {
  if (state.status === 'error') {
    return state.errorMessage ?? state.display;
  }

  if (state.status === 'operator-pending' && state.pendingOperator !== null) {
    return `${state.display} ${operatorSymbols[state.pendingOperator]}`;
  }

  return state.display;
}

function getDisplayFontSize(text: string, isError: boolean): string {
  const maxRem = isError ? 1.5 : 4.75;
  const minRem = 0.875;
  const scaledRem = 27 / Math.max(text.length, 6);

  return `${Math.min(maxRem, Math.max(minRem, scaledRem)).toFixed(3)}rem`;
}
