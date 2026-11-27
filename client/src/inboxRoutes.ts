import type { LoaderFunctionArgs } from 'react-router';
import { mockInboxApi } from './mockInboxApi';

export async function loadInbox({ params }: LoaderFunctionArgs) {
  try {
    const inbox = params.inboxId ? await mockInboxApi.getInbox(params.inboxId) : null;
    return { inbox };
  } catch {
    return { error: 'Could not load this inbox.' };
  }
}
