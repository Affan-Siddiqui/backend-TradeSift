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
app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        // Remove trailing slash from FRONTEND_URL if it exists
        const frontendUrl = env.FRONTEND_URL?.endsWith('/') ? env.FRONTEND_URL.slice(0, -1) : env.FRONTEND_URL;
        const allowedOrigins = [frontendUrl, 'http://localhost:5173', 'http://localhost:3000'];
        if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use('/api', routes);
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to TradeSift Backend' });
});
app.use(notFoundMiddleware);
app.use(errorMiddleware);
export default app;
//# sourceMappingURL=app.js.map