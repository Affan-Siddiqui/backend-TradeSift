import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { notFoundMiddleware } from './middleware/notFound.middleware.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use (cors({
  credentials: true
}));

app.use('/api', routes); 
app.use('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to TradeSift Backend' });
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;


