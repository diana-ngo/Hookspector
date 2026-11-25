import express from 'express';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { binExists, saveCapturedRequest } from '../store/captureStore.ts';

const MAX_BODY_SIZE = '1mb';

type CaptureParams = { id: string; rest?: string[] };

const requireBin: RequestHandler<CaptureParams> = async (req, res, next) => {
  if (!(await binExists(req.params.id))) {
    res.status(404).json({ message: 'Bin not found' });
    return;
  }
  next();
};

// Every content type arrives as untouched bytes; no body yields undefined.
const rawBody = express.raw({ type: () => true, limit: MAX_BODY_SIZE });

const toHeaderPairs = (rawHeaders: string[]): [string, string][] => {
  const pairs: [string, string][] = [];
  for (let i = 0; i + 1 < rawHeaders.length; i += 2) {
    pairs.push([rawHeaders[i] as string, rawHeaders[i + 1] as string]);
  }
  return pairs;
};

const capture: RequestHandler<CaptureParams> = async (req, res) => {
  const body = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);

  try {
    const captured = await saveCapturedRequest({
      binId: req.params.id,
      method: req.method,
      path: '/' + (req.params.rest ?? []).join('/'),
      query: { ...req.query },
      headers: toHeaderPairs(req.rawHeaders),
      body,
      bodySize: body.length,
      sourceIp: req.ip ?? null,
      receivedAt: new Date(),
    });

    res.status(200).json({
      message: 'Request captured successfully',
      requestId: captured.id,
    });
  } catch (error) {
    console.error('Failed to capture request', error);
    res.status(500).json({ message: 'Failed to capture request' });
  }
};

const isTooLarge = (err: unknown): boolean =>
  typeof err === 'object' &&
  err !== null &&
  'type' in err &&
  err.type === 'entity.too.large';

const captureErrors: ErrorRequestHandler = (err: unknown, _req, res, next) => {
  if (isTooLarge(err)) {
    res.status(413).json({ message: 'Payload too large' });
    return;
  }
  console.error('Failed to capture request', err);
  if (res.headersSent) {
    next(err);
    return;
  }
  res.status(500).json({ message: 'Failed to capture request' });
};

const captureRouter = express.Router();

// Any method, optional sub-path: /capture/:id and /capture/:id/any/thing
captureRouter.all('/capture/:id{/*rest}', requireBin, rawBody, capture);
captureRouter.use(captureErrors);

export default captureRouter;
