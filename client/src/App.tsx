import { inboxes } from './sampleInboxes';
import './App.css';

function App() {
  const hasInboxes = inboxes.length > 0;

  return (
    <>
      <header className="app-header">Hookspector</header>
      <div className="dashboard-layout">
        <aside className="inbox-sidebar" aria-label="Inboxes">
          {hasInboxes ? (
            <ul>
              {inboxes.map((inbox) => (
                <li key={inbox.id}>{inbox.name}</li>
              ))}
            </ul>
          ) : (
            <p>No inboxes yet</p>
          )}
        </aside>
        <main className="dashboard-main">
          <header className="dashboard-header">
            <h1>All inboxes</h1>
            <button type="button">Create inbox</button>
          </header>
          {hasInboxes ? (
            <table>
              <thead>
                <tr>
                  <th scope="col">Inbox</th>
                  <th scope="col">Endpoint URL</th>
                </tr>
              </thead>
              <tbody>
                {inboxes.map((inbox) => (
                  <tr key={inbox.id}>
                    <th scope="row">{inbox.name}</th>
                    <td>
                      <code>{inbox.url}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="dashboard-empty">No inboxes yet</p>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
