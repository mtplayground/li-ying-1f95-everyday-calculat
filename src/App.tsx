export function App() {
  return (
    <main className="app-shell bg-app-background text-app-text" aria-label="Everyday Calculator">
      <section
        className="calculator-screen rounded-panel bg-app-surface shadow-lift"
        aria-label="Calculator screen"
      >
        <output className="calculator-display text-app-text" aria-live="polite">
          0
        </output>
      </section>
    </main>
  );
}
