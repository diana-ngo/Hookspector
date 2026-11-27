export type Inbox = {
  id: string;
  name: string | null;
  url: string;
  createdAt: string;
};

export interface InboxApi {
  listInboxes(): Promise<{ data: Inbox[] }>;
  getInbox(id: string): Promise<Inbox | null>;
  createInbox(name: string): Promise<{ id: string }>;
}
