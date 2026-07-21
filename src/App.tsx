import { initialCalculatorState } from './calculator/engine';
import { Display } from './components/Display';

export function App() {
  return (
    <main className="app-shell bg-app-background text-app-text" aria-label="Everyday Calculator">
      <section
        className="calculator-screen rounded-panel bg-app-surface shadow-lift"
        aria-label="Calculator screen"
      >
        <Display state={initialCalculatorState} />
      </section>
    </main>
  );
}
