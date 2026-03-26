import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './database';
import authRouter from './routes/auth';
import cardsRouter from './routes/cards';
import decksRouter from './routes/decks';
import rotationRouter from './routes/rotation';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/cards', cardsRouter);
app.use('/api/decks', decksRouter);
app.use('/api/rotation', rotationRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Pokemon TCG API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
