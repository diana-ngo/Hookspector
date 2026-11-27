import type { Inbox, InboxApi } from './inboxApi';
import mockData from './mock-data.json';

const inboxes: Inbox[] = [...mockData.bins];

export const mockInboxApi: InboxApi = {
  listInboxes() {
    return Promise.resolve({ data: [...inboxes] });
  },

  getInbox(id) {
    return Promise.resolve(inboxes.find((inbox) => inbox.id === id) ?? null);
  },

  createInbox(name) {
    const id = crypto.randomUUID();
    inboxes.push({
      id,
      name,
      url: `https://hookspector.example/capture/${id}`,
      createdAt: new Date().toISOString(),
    });
    return Promise.resolve({ id });
  },
};
