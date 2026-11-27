import { Link, useLoaderData } from 'react-router';
import { inboxLabel } from './inboxLabel';
import type { loadInbox } from './inboxRoutes';

export default function InboxDetail() {
  const { inbox, error } = useLoaderData<typeof loadInbox>();

  return (
    <>
      <Link to="/">All inboxes</Link>
      <h1>{inbox ? inboxLabel(inbox) : (error ?? 'Inbox not found')}</h1>
      {inbox && (
        <p className="inbox-endpoint">
          Endpoint URL <code>{inbox.url}</code>
        </p>
      )}
    </>
  );
}
