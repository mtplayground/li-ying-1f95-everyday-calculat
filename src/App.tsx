import { CalculatorScreen } from './components/CalculatorScreen';

export function App() {
  return (
    <main className="app-shell bg-app-background text-app-text" aria-label="Everyday Calculator">
      <CalculatorScreen />
    </main>
  );
}
