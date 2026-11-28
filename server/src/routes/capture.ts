import express from 'express';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { binExists, saveCapturedRequest } from '../store/captureStore.ts';

const MAX_BODY_SIZE = '1mb';

type CaptureParams = { id: string };

// One 404 for unknown Bins, wrong methods and extra segments alike.
const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ message: 'Not found' });
};

// Any '?' in the URL, even a bare one, counts as a query string.
const rejectQuery: RequestHandler<CaptureParams> = (req, res, next) => {
  if (req.originalUrl.includes('?')) {
    res.status(400).json({ message: 'Query parameters are not supported' });
    return;
  }
  next();
};

const requireBin: RequestHandler<CaptureParams> = async (req, res, next) => {
  if (!(await binExists(req.params.id))) {
    notFound(req, res, next);
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

// Exactly POST /capture/:id (trailing slash allowed). Checks run cheapest
// first: method/path, then query string, then Bin lookup, then body size.
captureRouter.post('/capture/:id', rejectQuery, requireBin, rawBody, capture);
// Anything else under /capture: wrong method, extra segments, bare /capture.
captureRouter.all('/capture{/*rest}', notFound);
captureRouter.use(captureErrors);

export default captureRouter;
