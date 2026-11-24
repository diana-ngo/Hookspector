import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000; // reads port form .env

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hookspector server is running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
