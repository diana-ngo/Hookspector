import 'dotenv/config';
import express from 'express';
import pool from './db/postgres.ts';

const app = express();
const PORT = process.env.PORT || 3000; // reads port form .env

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hookspector server is running');
});

const result = await pool.query<{ now: Date }>('SELECT NOW()');
console.log('Connected to Postgres at', result.rows[0]?.now);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
