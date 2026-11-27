import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { Link, NavLink, Outlet, useNavigate, useOutletContext } from 'react-router';
import type { Inbox } from './inboxApi';
import { inboxLabel } from './inboxLabel';
import { mockInboxApi } from './mockInboxApi';
import './App.css';

type InboxList =
  { status: 'loading' } | { status: 'error' } | { status: 'ready'; inboxes: Inbox[] };

type DashboardContext = {
  inboxList: InboxList;
  refreshInboxList: () => void;
};

function inboxPath(id: string) {
  return `/inboxes/${encodeURIComponent(id)}`;
}

function SidebarInboxList({ inboxList }: { inboxList: InboxList }) {
  if (inboxList.status !== 'ready') return null;
  if (inboxList.inboxes.length === 0) return <p>No inboxes yet</p>;

  return (
    <ul className="inbox-list" role="list">
      {inboxList.inboxes.map((inbox) => (
        <li key={inbox.id}>
          <NavLink to={inboxPath(inbox.id)}>{inboxLabel(inbox)}</NavLink>
        </li>
      ))}
    </ul>
  );
}

function DashboardInboxList({ inboxList, refreshInboxList }: DashboardContext) {
  if (inboxList.status === 'loading') {
    return <p role="status">Loading inboxes…</p>;
  }

  if (inboxList.status === 'error') {
    return (
      <div>
        <p role="alert">Could not load inboxes.</p>
        <button className="secondary-button" type="button" onClick={refreshInboxList}>
          Retry
        </button>
      </div>
    );
  }

  if (inboxList.inboxes.length === 0) {
    return <p className="dashboard-empty">No inboxes yet</p>;
  }

  return (
    <table className="inbox-table">
      <thead>
        <tr>
          <th scope="col">Inbox</th>
          <th scope="col">Endpoint URL</th>
        </tr>
      </thead>
      <tbody>
        {inboxList.inboxes.map((inbox) => (
          <tr key={inbox.id}>
            <th scope="row">
              <Link to={inboxPath(inbox.id)}>{inboxLabel(inbox)}</Link>
            </th>
            <td>
              <code>{inbox.url}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function App() {
  const [inboxList, setInboxList] = useState<InboxList>({ status: 'loading' });
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;
    void mockInboxApi.listInboxes().then(
      ({ data }) => {
        if (!ignore) setInboxList({ status: 'ready', inboxes: data });
      },
      () => {
        if (!ignore) setInboxList({ status: 'error' });
      },
    );

    return () => {
      ignore = true;
    };
  }, [loadAttempt]);

  function refreshInboxList() {
    setInboxList({ status: 'loading' });
    setLoadAttempt((attempt) => attempt + 1);
  }

  const dashboardContext: DashboardContext = { inboxList, refreshInboxList };

  return (
    <>
      <header className="app-header">Hookspector</header>
      <div className="dashboard-layout">
        <aside className="inbox-sidebar" aria-label="Inboxes">
          <SidebarInboxList inboxList={inboxList} />
        </aside>
        <main className="dashboard-main">
          <Outlet context={dashboardContext} />
        </main>
      </div>
    </>
  );
}

export function Dashboard() {
  const { inboxList, refreshInboxList } = useOutletContext<DashboardContext>();
  const navigate = useNavigate();
  const createDialog = useRef<HTMLDialogElement>(null);
  const [inboxName, setInboxName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const trimmedName = inboxName.trim();

  function openCreateDialog() {
    const dialog = createDialog.current;
    if (!dialog) return;

    setInboxName('');
    dialog.showModal();
  }

  async function submitCreateInbox(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isCreating || trimmedName.length === 0) return;

    setIsCreating(true);
    try {
      const { id } = await mockInboxApi.createInbox(trimmedName);
      refreshInboxList();
      createDialog.current?.close();
      await navigate(inboxPath(id));
    } catch (error) {
      console.error('Could not complete inbox creation.', error);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <>
      <header className="dashboard-header">
        <h1>All inboxes</h1>
        <button className="primary-button" type="button" onClick={openCreateDialog}>
          Create inbox
        </button>
      </header>
      <DashboardInboxList inboxList={inboxList} refreshInboxList={refreshInboxList} />
      <dialog
        ref={createDialog}
        className="create-inbox-dialog"
        aria-labelledby="create-inbox-title"
        onCancel={(event) => {
          if (isCreating) event.preventDefault();
        }}
      >
        <h2 id="create-inbox-title">Create inbox</h2>
        <form method="dialog" onSubmit={(event) => void submitCreateInbox(event)}>
          <label htmlFor="inbox-name">Inbox name</label>
          <input
            id="inbox-name"
            name="name"
            type="text"
            required
            maxLength={100}
            readOnly={isCreating}
            value={inboxName}
            onChange={(event) => setInboxName(event.currentTarget.value)}
          />
          <div className="dialog-actions">
            <button
              className="secondary-button"
              type="button"
              disabled={isCreating}
              onClick={() => createDialog.current?.close()}
            >
              Cancel
            </button>
            <button
              className="primary-button"
              type="submit"
              disabled={isCreating || trimmedName.length === 0}
            >
              {isCreating ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default App;
