import 'dotenv/config';
import express from 'express';
import pool from './db/postgres.ts';
import { connectMongo } from './db/mongo.ts';
import captureRouter from './routes/capture.ts';

const app = express();
const PORT = process.env.PORT || 3000; // reads port form .env

// Before express.json() so captured bodies stay raw.
app.use(captureRouter);
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hookspector server is running');
});

const result = await pool.query<{ now: Date }>('SELECT NOW()');
console.log('Connected to Postgres at', result.rows[0]?.now);

await connectMongo();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
