import './App.css';

function App() {
  return (
    <>
      <header className="app-header">Hookspector</header>
      <div className="dashboard-layout">
        <aside className="inbox-sidebar" aria-label="Inboxes">
          <p>No inboxes yet</p>
        </aside>
        <main className="dashboard-main">
          <header className="dashboard-header">
            <h1>All inboxes</h1>
            <button type="button">Create inbox</button>
          </header>
          <p className="dashboard-empty">No inboxes yet</p>
        </main>
      </div>
    </>
  );
}

export default App;
