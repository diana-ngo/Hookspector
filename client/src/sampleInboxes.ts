import type { Inbox } from './inboxApi';
import mockData from './mock-data.json' with { type: 'json' };

export type { Inbox } from './inboxApi';

export const inboxes: Inbox[] = mockData.bins;
