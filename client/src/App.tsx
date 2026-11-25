import { useRef, useState, type SubmitEvent } from 'react';
import { inboxes, type Inbox } from './sampleInboxes';
import './App.css';

function inboxLabel(inbox: Inbox) {
  return inbox.name ?? `Inbox ${inbox.id.slice(0, 6)}`;
}

function App() {
  const createDialog = useRef<HTMLDialogElement>(null);
  const [inboxName, setInboxName] = useState('');
  const trimmedName = inboxName.trim();
  const hasInboxes = inboxes.length > 0;

  function openCreateDialog() {
    const dialog = createDialog.current;
    if (!dialog) return;

    setInboxName('');
    dialog.returnValue = '';
    dialog.showModal();
  }

  function submitCreateInbox(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (trimmedName.length === 0) return;

    createDialog.current?.close(trimmedName);
  }

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
            <button className="primary-button" type="button" onClick={openCreateDialog}>
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
      <dialog
        ref={createDialog}
        className="create-inbox-dialog"
        aria-labelledby="create-inbox-title"
      >
        <h2 id="create-inbox-title">Create inbox</h2>
        <form method="dialog" onSubmit={submitCreateInbox}>
          <label htmlFor="inbox-name">Inbox name</label>
          <input
            id="inbox-name"
            name="name"
            type="text"
            required
            maxLength={100}
            value={inboxName}
            onChange={(event) => setInboxName(event.currentTarget.value)}
          />
          <div className="dialog-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() => createDialog.current?.close()}
            >
              Cancel
            </button>
            <button className="primary-button" type="submit" disabled={trimmedName.length === 0}>
              Create
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default App;
