import { randomUUID } from 'node:crypto';

// Storage seam for the capture endpoint. Temporary in-memory implementation:
// Bins will move to Postgres and Captured Requests to MongoDB
// (see docs/adr/0001-mongodb-for-captured-requests.md). Swap this module's
// internals without changing its exported functions.

export interface CapturedRequestInput {
  binId: string;
  method: string;
  path: string;
  query: Record<string, unknown>;
  headers: [name: string, value: string][];
  body: Buffer;
  bodySize: number;
  sourceIp: string | null;
  receivedAt: Date;
}

export interface CapturedRequest extends CapturedRequestInput {
  id: string;
}

// Placeholder Bins until Bin creation exists (separate ticket).
const SEED_BIN_IDS = new Set([
  'c99c541c-df07-4adb-93a6-7a1af1249666',
  'ef4de7f9-d28f-4837-ab05-7255dd1cd857',
]);

const capturedRequests: CapturedRequest[] = [];

export const binExists = async (binId: string): Promise<boolean> => {
  return Promise.resolve(SEED_BIN_IDS.has(binId));
};

export const saveCapturedRequest = async (
  input: CapturedRequestInput,
): Promise<CapturedRequest> => {
  const capturedRequest: CapturedRequest = { id: randomUUID(), ...input };
  capturedRequests.push(capturedRequest);
  return Promise.resolve(capturedRequest);
};
