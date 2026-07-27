import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { notFoundMiddleware } from './middleware/notFound.middleware.js';
import cors from 'cors';
import { env } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.middleware.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use (cors({
  credentials: true,
  origin: env.FRONTEND_URL || 'http://localhost:5173'
}));
  
app.use('/api', routes); 
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to TradeSift Backend' });
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;


