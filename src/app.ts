import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { notFoundMiddleware } from './middleware/notFound.middleware.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;