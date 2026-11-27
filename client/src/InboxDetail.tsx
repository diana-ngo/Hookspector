import { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router';
import { inboxLabel } from './inboxLabel';
import type { loadInbox } from './inboxRoutes';

function InboxEndpoint({ url }: { url: string }) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle');

  useEffect(() => {
    if (copyStatus !== 'copied') return;

    const timeout = window.setTimeout(() => setCopyStatus('idle'), 2000);
    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  async function copyUrl() {
    setCopyStatus('copying');

    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }
  }

  return (
    <section className="inbox-endpoint" aria-labelledby="inbox-endpoint-title">
      <h2 id="inbox-endpoint-title">Endpoint URL</h2>
      <div className="inbox-endpoint-row">
        <code>{url}</code>
        <button
          className="secondary-button"
          type="button"
          aria-live="polite"
          aria-disabled={copyStatus === 'copying'}
          onClick={() => {
            if (copyStatus !== 'copying') void copyUrl();
          }}
        >
          {copyStatus === 'copied' ? 'Copied' : 'Copy URL'}
        </button>
      </div>
      {copyStatus === 'error' && (
        <p className="inbox-endpoint-error" role="alert">
          Could not copy the URL. Select the URL to copy it manually.
        </p>
      )}
    </section>
  );
}

export default function InboxDetail() {
  const { inbox, error } = useLoaderData<typeof loadInbox>();

  return (
    <>
      <Link to="/">All inboxes</Link>
      <h1>{inbox ? inboxLabel(inbox) : (error ?? 'Inbox not found')}</h1>
      {inbox && <InboxEndpoint key={inbox.url} url={inbox.url} />}
    </>
  );
}
