import type { Inbox } from './inboxApi';

export function inboxLabel(inbox: Inbox) {
  return inbox.name ?? `Inbox ${inbox.id.slice(0, 6)}`;
}
