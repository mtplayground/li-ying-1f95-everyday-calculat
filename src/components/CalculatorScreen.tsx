import { useCallback, useReducer } from 'react';
import { createInitialCalculatorState, reduceCalculatorState } from '../calculator/engine';
import type { CalculatorAction, Digit, Operator } from '../calculator/types';
import { Display } from './Display';
import { Keypad } from './Keypad';
import type { KeypadKey } from './Keypad';

type OperatorKey = Extract<KeypadKey, 'add' | 'subtract' | 'multiply' | 'divide'>;

const keypadOperators: Record<OperatorKey, Operator> = {
  add: 'add',
  subtract: 'subtract',
  multiply: 'multiply',
  divide: 'divide',
};

export function CalculatorScreen() {
  const [state, dispatch] = useReducer(reduceCalculatorState, createInitialCalculatorState());

  const handleKeyPress = useCallback((key: KeypadKey) => {
    dispatch(toCalculatorAction(key));
  }, []);

  return (
    <section
      className="calculator-screen rounded-panel bg-app-surface shadow-lift"
      aria-label="Calculator screen"
    >
      <Display state={state} />
      <Keypad onKeyPress={handleKeyPress} />
    </section>
  );
}

function toCalculatorAction(key: KeypadKey): CalculatorAction {
  if (isDigitKey(key)) {
    return { type: 'digit', digit: key };
  }

  if (key === 'decimal') {
    return { type: 'decimal' };
  }

  if (key === 'percent') {
    return { type: 'percent' };
  }

  if (key === 'equals') {
    return { type: 'equals' };
  }

  if (key === 'clear') {
    return { type: 'clear' };
  }

  if (isOperatorKey(key)) {
    return { type: 'operator', operator: keypadOperators[key] };
  }

  throw new Error(`Unsupported keypad key: ${key}`);
}

function isDigitKey(key: KeypadKey): key is Digit {
  return /^\d$/.test(key);
}

function isOperatorKey(key: KeypadKey): key is OperatorKey {
  return key in keypadOperators;
}
