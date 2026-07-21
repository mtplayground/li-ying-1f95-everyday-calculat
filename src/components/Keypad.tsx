import { CalcButton } from './CalcButton';

export type KeypadKey =
  | 'clear'
  | 'percent'
  | 'divide'
  | 'multiply'
  | 'subtract'
  | 'add'
  | 'equals'
  | 'decimal'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9';

interface KeypadProps {
  onKeyPress?: (key: KeypadKey) => void;
}

export function Keypad({ onKeyPress }: KeypadProps) {
  return (
    <div className="calculator-keypad" role="group" aria-label="Calculator keypad">
      <CalcButton label="C" ariaLabel="Clear" kind="action" onPress={() => onKeyPress?.('clear')} />
      <CalcButton
        label="%"
        ariaLabel="Percentage"
        kind="action"
        onPress={() => onKeyPress?.('percent')}
      />
      <CalcButton
        label="÷"
        ariaLabel="Divide"
        kind="operator"
        onPress={() => onKeyPress?.('divide')}
      />
      <CalcButton
        label="×"
        ariaLabel="Multiply"
        kind="operator"
        onPress={() => onKeyPress?.('multiply')}
      />

      <CalcButton label="7" ariaLabel="Seven" onPress={() => onKeyPress?.('7')} />
      <CalcButton label="8" ariaLabel="Eight" onPress={() => onKeyPress?.('8')} />
      <CalcButton label="9" ariaLabel="Nine" onPress={() => onKeyPress?.('9')} />
      <CalcButton
        label="−"
        ariaLabel="Subtract"
        kind="operator"
        onPress={() => onKeyPress?.('subtract')}
      />

      <CalcButton label="4" ariaLabel="Four" onPress={() => onKeyPress?.('4')} />
      <CalcButton label="5" ariaLabel="Five" onPress={() => onKeyPress?.('5')} />
      <CalcButton label="6" ariaLabel="Six" onPress={() => onKeyPress?.('6')} />
      <CalcButton label="+" ariaLabel="Add" kind="operator" onPress={() => onKeyPress?.('add')} />

      <CalcButton label="1" ariaLabel="One" onPress={() => onKeyPress?.('1')} />
      <CalcButton label="2" ariaLabel="Two" onPress={() => onKeyPress?.('2')} />
      <CalcButton label="3" ariaLabel="Three" onPress={() => onKeyPress?.('3')} />
      <CalcButton
        label="="
        ariaLabel="Equals"
        kind="equals"
        rowSpan={2}
        onPress={() => onKeyPress?.('equals')}
      />

      <CalcButton label="0" ariaLabel="Zero" span={2} onPress={() => onKeyPress?.('0')} />
      <CalcButton label="." ariaLabel="Decimal point" onPress={() => onKeyPress?.('decimal')} />
    </div>
  );
}
