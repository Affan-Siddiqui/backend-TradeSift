import { env } from './env.js';
import pino from 'pino';
const logger = pino({
    level: env.LOG_LEVEL ?? (env.NODE_ENV === 'production' ? 'info' : 'debug'),
    ...(env.NODE_ENV !== 'production'
        ? {
            transport: {
                target: 'pino-pretty',
                options: { colorize: true },
            },
        }
        : {}),
});
export default logger;
//# sourceMappingURL=logger.js.map