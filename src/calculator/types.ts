export type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type Operator = 'add' | 'subtract' | 'multiply' | 'divide';

export type CalculatorStatus = 'editing' | 'operator-pending' | 'result';

export interface CalculatorState {
  currentEntry: string;
  pendingOperator: Operator | null;
  accumulator: number | null;
  display: string;
  status: CalculatorStatus;
}

export type CalculatorAction =
  | { type: 'digit'; digit: Digit }
  | { type: 'decimal' }
  | { type: 'operator'; operator: Operator }
  | { type: 'percent' }
  | { type: 'equals' }
  | { type: 'clear' };
