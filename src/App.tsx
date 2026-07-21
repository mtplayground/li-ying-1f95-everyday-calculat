export function App() {
  return (
    <main className="app-shell" aria-label="Everyday Calculator">
      <section className="calculator-screen" aria-label="Calculator screen">
        <output className="calculator-display" aria-live="polite">
          0
        </output>
      </section>
    </main>
  );
}
