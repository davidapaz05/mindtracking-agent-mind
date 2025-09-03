import express from 'express';
import dotenv from 'dotenv';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config({ path: './config/.env' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', chatRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

