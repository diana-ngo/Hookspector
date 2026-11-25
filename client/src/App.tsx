import './App.css';

function App() {
  return (
    <>
      <header>Hookspector</header>
      <div className="dashboard-layout">
        <aside aria-label="Inboxes">
          <p>No inboxes yet</p>
        </aside>
        <main>
          <header className="dashboard-header">
            <h1>All inboxes</h1>
            <button type="button">Create inbox</button>
          </header>
          <p>No inboxes yet</p>
        </main>
      </div>
    </>
  );
}

export default App;
