import { describe, expect, it } from 'vitest';
import {
  createInitialCalculatorState,
  initialCalculatorState,
  reduceCalculatorState,
} from './engine';
import type { CalculatorAction, CalculatorState, Digit, Operator } from './types';

function run(actions: CalculatorAction[], state = createInitialCalculatorState()): CalculatorState {
  return actions.reduce(reduceCalculatorState, state);
}

function enter(value: string): CalculatorAction[] {
  return [...value].map((character) => {
    if (character === '.') {
      return { type: 'decimal' };
    }

    if (!/^\d$/.test(character)) {
      throw new Error(`Unsupported calculator input: ${character}`);
    }

    return { type: 'digit', digit: character as Digit };
  });
}

function operator(operatorValue: Operator): CalculatorAction {
  return { type: 'operator', operator: operatorValue };
}

const equals: CalculatorAction = { type: 'equals' };
const percent: CalculatorAction = { type: 'percent' };
const decimal: CalculatorAction = { type: 'decimal' };
const clear: CalculatorAction = { type: 'clear' };

describe('calculator engine', () => {
  it.each([
    ['add', '12', '7', '19'],
    ['subtract', '9', '4', '5'],
    ['multiply', '6', '7', '42'],
    ['divide', '8', '2', '4'],
  ] satisfies [Operator, string, string, string][])(
    'performs %s operations',
    (operatorValue, left, right, expected) => {
      const state = run([...enter(left), operator(operatorValue), ...enter(right), equals]);

      expect(state).toMatchObject({
        currentEntry: expected,
        display: expected,
        pendingOperator: null,
        accumulator: Number(expected),
        status: 'result',
      });
    },
  );

  it('evaluates chained operations left-to-right as each operator is pressed', () => {
    const state = run([
      ...enter('2'),
      operator('add'),
      ...enter('3'),
      operator('multiply'),
      ...enter('4'),
      equals,
    ]);

    expect(state.display).toBe('20');
    expect(state.accumulator).toBe(20);
    expect(state.status).toBe('result');
  });

  it('supports leading decimal entry and allows only one decimal point per number', () => {
    const leadingDecimal = run([decimal, decimal, ...enter('5')]);
    const repeatedDecimal = run([...enter('1.2'), decimal, ...enter('3')]);

    expect(leadingDecimal.currentEntry).toBe('0.5');
    expect(leadingDecimal.display).toBe('0.5');
    expect(repeatedDecimal.currentEntry).toBe('1.23');
    expect(repeatedDecimal.display).toBe('1.23');
  });

  it('replaces the pending operator when an operator is pressed twice', () => {
    const state = run([
      ...enter('8'),
      operator('add'),
      operator('subtract'),
      ...enter('3'),
      equals,
    ]);

    expect(state.display).toBe('5');
    expect(state.accumulator).toBe(5);
  });

  it('handles standalone percentages', () => {
    const state = run([...enter('50'), percent]);

    expect(state.display).toBe('0.5');
    expect(state.currentEntry).toBe('0.5');
    expect(state.status).toBe('editing');
  });

  it('handles contextual percentages for addition and subtraction', () => {
    const addedPercentage = run([
      ...enter('200'),
      operator('add'),
      ...enter('10'),
      percent,
      equals,
    ]);
    const subtractedPercentage = run([
      ...enter('200'),
      operator('subtract'),
      ...enter('10'),
      percent,
      equals,
    ]);

    expect(addedPercentage.display).toBe('220');
    expect(subtractedPercentage.display).toBe('180');
  });

  it('handles percentage entries for multiplication and division', () => {
    const multipliedPercentage = run([
      ...enter('200'),
      operator('multiply'),
      ...enter('10'),
      percent,
      equals,
    ]);
    const dividedPercentage = run([
      ...enter('200'),
      operator('divide'),
      ...enter('10'),
      percent,
      equals,
    ]);

    expect(multipliedPercentage.display).toBe('20');
    expect(dividedPercentage.display).toBe('2000');
  });

  it('treats repeated equals after a completed calculation as a no-op', () => {
    const result = run([...enter('2'), operator('add'), ...enter('3'), equals]);
    const repeated = run([equals], result);

    expect(repeated).toEqual(result);
    expect(repeated.display).toBe('5');
  });

  it('clears back to the blank zero state from editing, pending, result, and error states', () => {
    const editingState = run([...enter('42'), clear]);
    const pendingState = run([...enter('42'), operator('add'), clear]);
    const resultState = run([...enter('4'), operator('multiply'), ...enter('2'), equals, clear]);
    const errorState = run([...enter('4'), operator('divide'), ...enter('0'), equals, clear]);

    expect(editingState).toEqual(initialCalculatorState);
    expect(pendingState).toEqual(initialCalculatorState);
    expect(resultState).toEqual(initialCalculatorState);
    expect(errorState).toEqual(initialCalculatorState);
  });

  it('returns a recoverable error state for division by zero', () => {
    const errorState = run([...enter('8'), operator('divide'), ...enter('0'), equals]);
    const recoveredState = run([...enter('7')], errorState);

    expect(errorState).toMatchObject({
      currentEntry: '0',
      pendingOperator: null,
      accumulator: null,
      display: "Can't divide by zero",
      errorMessage: "Can't divide by zero",
      status: 'error',
    });
    expect(recoveredState).toMatchObject({
      currentEntry: '7',
      display: '7',
      accumulator: null,
      pendingOperator: null,
      status: 'editing',
    });
  });

  it('rounds decimal-safe results for display and future chained calculations', () => {
    const state = run([...enter('0.1'), operator('add'), ...enter('0.2'), equals]);

    expect(state.display).toBe('0.3');
    expect(state.accumulator).toBe(0.3);
  });

  it('caps long precision results so they stay displayable', () => {
    const repeatingDecimal = run([...enter('1'), operator('divide'), ...enter('7'), equals]);
    const largeResult = run([
      ...enter('1000000000000'),
      operator('multiply'),
      ...enter('9'),
      equals,
    ]);

    expect(repeatingDecimal.display).toBe('0.142857142857');
    expect(repeatingDecimal.display.length).toBeLessThanOrEqual(14);
    expect(largeResult.display).toBe('9e+12');
  });

  it('uses a readable overflow error instead of raw Infinity or NaN', () => {
    const hugeFiniteInput = `1${'0'.repeat(308)}`;
    const state = run([...enter(hugeFiniteInput), operator('multiply'), ...enter('10'), equals]);

    expect(state.status).toBe('error');
    expect(state.display).toBe('Result is too large');
    expect(state.display).not.toMatch(/Infinity|NaN/);
  });
});
