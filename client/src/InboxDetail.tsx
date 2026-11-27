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
        <section className="inbox-endpoint" aria-labelledby="inbox-endpoint-title">
          <h2 id="inbox-endpoint-title">Endpoint URL</h2>
          <div className="inbox-endpoint-row">
            <code>{inbox.url}</code>
            <button className="secondary-button" type="button" disabled>
              Copy URL
            </button>
          </div>
        </section>
      )}
    </>
  );
}
