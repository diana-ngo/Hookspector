import { useRef } from 'react';
import { inboxes, type Inbox } from './sampleInboxes';
import './App.css';

function inboxLabel(inbox: Inbox) {
  return inbox.name ?? `Inbox ${inbox.id.slice(0, 6)}`;
}

function App() {
  const createDialog = useRef<HTMLDialogElement>(null);
  const hasInboxes = inboxes.length > 0;

  return (
    <>
      <header className="app-header">Hookspector</header>
      <div className="dashboard-layout">
        <aside className="inbox-sidebar" aria-label="Inboxes">
          {hasInboxes ? (
            <ul className="inbox-list" role="list">
              {inboxes.map((inbox) => (
                <li key={inbox.id}>{inboxLabel(inbox)}</li>
              ))}
            </ul>
          ) : (
            <p>No inboxes yet</p>
          )}
        </aside>
        <main className="dashboard-main">
          <header className="dashboard-header">
            <h1>All inboxes</h1>
            <button type="button" onClick={() => createDialog.current?.showModal()}>
              Create inbox
            </button>
          </header>
          {hasInboxes ? (
            <table className="inbox-table">
              <thead>
                <tr>
                  <th scope="col">Inbox</th>
                  <th scope="col">Endpoint URL</th>
                </tr>
              </thead>
              <tbody>
                {inboxes.map((inbox) => (
                  <tr key={inbox.id}>
                    <th scope="row">{inboxLabel(inbox)}</th>
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
      <dialog ref={createDialog} aria-labelledby="create-inbox-title">
        <h2 id="create-inbox-title">Create inbox</h2>
        <button type="button" onClick={() => createDialog.current?.close()}>
          Cancel
        </button>
      </dialog>
    </>
  );
}

export default App;
