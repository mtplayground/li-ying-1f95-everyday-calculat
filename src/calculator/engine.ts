import { formatNumber, roundForDisplay } from './format';
import type { CalculatorAction, CalculatorState, Digit, Operator } from './types';

export const initialCalculatorState: CalculatorState = {
  currentEntry: '0',
  pendingOperator: null,
  accumulator: null,
  display: '0',
  status: 'editing',
};

export function createInitialCalculatorState(): CalculatorState {
  return { ...initialCalculatorState };
}

export function reduceCalculatorState(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case 'digit':
      return inputDigit(state, action.digit);
    case 'decimal':
      return inputDecimal(state);
    case 'operator':
      return inputOperator(state, action.operator);
    case 'percent':
      return inputPercent(state);
    case 'equals':
      return inputEquals(state);
    case 'clear':
      return createInitialCalculatorState();
  }
}

function inputDigit(state: CalculatorState, digit: Digit): CalculatorState {
  if (state.status === 'result') {
    return entryState(digit);
  }

  if (state.status === 'operator-pending') {
    return {
      ...state,
      currentEntry: digit,
      display: digit,
      status: 'editing',
    };
  }

  const nextEntry = state.currentEntry === '0' ? digit : `${state.currentEntry}${digit}`;

  return {
    ...state,
    currentEntry: nextEntry,
    display: nextEntry,
    status: 'editing',
  };
}

function inputDecimal(state: CalculatorState): CalculatorState {
  if (state.status === 'result') {
    return entryState('0.');
  }

  if (state.status === 'operator-pending') {
    return {
      ...state,
      currentEntry: '0.',
      display: '0.',
      status: 'editing',
    };
  }

  if (state.currentEntry.includes('.')) {
    return state;
  }

  const nextEntry = `${state.currentEntry}.`;

  return {
    ...state,
    currentEntry: nextEntry,
    display: nextEntry,
  };
}

function inputOperator(state: CalculatorState, operator: Operator): CalculatorState {
  if (state.status === 'operator-pending') {
    return {
      ...state,
      pendingOperator: operator,
    };
  }

  const currentValue = parseEntry(state.currentEntry);

  if (state.accumulator === null || state.pendingOperator === null || state.status === 'result') {
    return {
      ...state,
      accumulator: currentValue,
      pendingOperator: operator,
      currentEntry: formatNumber(currentValue),
      display: formatNumber(currentValue),
      status: 'operator-pending',
    };
  }

  const result = calculate(state.accumulator, currentValue, state.pendingOperator);
  const display = formatNumber(result);

  return {
    currentEntry: display,
    pendingOperator: operator,
    accumulator: result,
    display,
    status: 'operator-pending',
  };
}

function inputPercent(state: CalculatorState): CalculatorState {
  if (state.status === 'operator-pending') {
    return state;
  }

  const currentValue = parseEntry(state.currentEntry);
  const percentValue = getPercentValue(currentValue, state.accumulator, state.pendingOperator);
  const display = formatNumber(percentValue);

  return {
    ...state,
    currentEntry: display,
    display,
    status: 'editing',
  };
}

function inputEquals(state: CalculatorState): CalculatorState {
  if (state.pendingOperator === null || state.accumulator === null || state.status === 'result') {
    return state;
  }

  if (state.status === 'operator-pending') {
    const display = formatNumber(state.accumulator);

    return {
      ...state,
      currentEntry: display,
      pendingOperator: null,
      display,
      status: 'result',
    };
  }

  const result = calculate(
    state.accumulator,
    parseEntry(state.currentEntry),
    state.pendingOperator,
  );
  const display = formatNumber(result);

  return {
    currentEntry: display,
    pendingOperator: null,
    accumulator: result,
    display,
    status: 'result',
  };
}

function entryState(entry: string): CalculatorState {
  return {
    currentEntry: entry,
    pendingOperator: null,
    accumulator: null,
    display: entry,
    status: 'editing',
  };
}

function getPercentValue(
  currentValue: number,
  accumulator: number | null,
  pendingOperator: Operator | null,
): number {
  if (accumulator === null || pendingOperator === null) {
    return currentValue / 100;
  }

  if (pendingOperator === 'add' || pendingOperator === 'subtract') {
    return (accumulator * currentValue) / 100;
  }

  return currentValue / 100;
}

function calculate(left: number, right: number, operator: Operator): number {
  let result: number;

  switch (operator) {
    case 'add':
      result = left + right;
      break;
    case 'subtract':
      result = left - right;
      break;
    case 'multiply':
      result = left * right;
      break;
    case 'divide':
      result = left / right;
      break;
  }

  return roundForDisplay(result);
}

function parseEntry(entry: string): number {
  return Number(entry);
}
