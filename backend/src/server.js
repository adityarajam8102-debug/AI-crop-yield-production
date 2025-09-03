import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import predictRouter from './routes/predict.js';

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '4000', 10);

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/api/predict', predictRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


