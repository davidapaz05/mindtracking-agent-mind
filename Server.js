import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import chatRouter from './Routes/chatRoutes.js';

dotenv.config({ path: './config/.env' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000', 'https://interface-agente-mind.vercel.app'],
  credentials: true,
  methods: 'POST',
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api', chatRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
