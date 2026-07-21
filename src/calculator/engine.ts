import { formatNumber, roundForDisplay } from './format';
import type { CalculatorAction, CalculatorState, Digit, Operator } from './types';

const DIVIDE_BY_ZERO_MESSAGE = "Can't divide by zero";
const OVERFLOW_MESSAGE = 'Result is too large';

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
    case 'clear':
      return createInitialCalculatorState();
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
  }
}

function inputDigit(state: CalculatorState, digit: Digit): CalculatorState {
  if (state.status === 'result' || state.status === 'error') {
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
  if (state.status === 'result' || state.status === 'error') {
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
  if (state.status === 'error') {
    return state;
  }

  if (state.status === 'operator-pending') {
    return {
      ...state,
      pendingOperator: operator,
    };
  }

  const currentValue = parseEntry(state.currentEntry);

  if (!Number.isFinite(currentValue)) {
    return errorState(OVERFLOW_MESSAGE);
  }

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

  if (!result.ok) {
    return errorState(result.message);
  }

  const display = formatNumber(result.value);

  return {
    currentEntry: display,
    pendingOperator: operator,
    accumulator: result.value,
    display,
    status: 'operator-pending',
  };
}

function inputPercent(state: CalculatorState): CalculatorState {
  if (state.status === 'error') {
    return state;
  }

  if (state.status === 'operator-pending') {
    return state;
  }

  const currentValue = parseEntry(state.currentEntry);
  if (!Number.isFinite(currentValue)) {
    return errorState(OVERFLOW_MESSAGE);
  }

  const percentValue = getPercentValue(currentValue, state.accumulator, state.pendingOperator);
  if (!Number.isFinite(percentValue)) {
    return errorState(OVERFLOW_MESSAGE);
  }

  const display = formatNumber(percentValue);

  return {
    ...state,
    currentEntry: display,
    display,
    status: 'editing',
  };
}

function inputEquals(state: CalculatorState): CalculatorState {
  if (state.status === 'error') {
    return state;
  }

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

  const currentValue = parseEntry(state.currentEntry);
  if (!Number.isFinite(currentValue)) {
    return errorState(OVERFLOW_MESSAGE);
  }

  const result = calculate(state.accumulator, currentValue, state.pendingOperator);

  if (!result.ok) {
    return errorState(result.message);
  }

  const display = formatNumber(result.value);

  return {
    currentEntry: display,
    pendingOperator: null,
    accumulator: result.value,
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

function errorState(message: string): CalculatorState {
  return {
    currentEntry: '0',
    pendingOperator: null,
    accumulator: null,
    display: message,
    status: 'error',
    errorMessage: message,
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

type CalculationResult = { ok: true; value: number } | { ok: false; message: string };

function calculate(left: number, right: number, operator: Operator): CalculationResult {
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
      if (right === 0) {
        return { ok: false, message: DIVIDE_BY_ZERO_MESSAGE };
      }

      result = left / right;
      break;
  }

  if (!Number.isFinite(result)) {
    return { ok: false, message: OVERFLOW_MESSAGE };
  }

  const rounded = roundForDisplay(result);

  if (!Number.isFinite(rounded)) {
    return { ok: false, message: OVERFLOW_MESSAGE };
  }

  return { ok: true, value: rounded };
}

function parseEntry(entry: string): number {
  return Number(entry);
}
