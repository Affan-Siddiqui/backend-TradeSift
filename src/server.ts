
import app from './app.js';
import { env } from './config/env.js';
import redis from './config/redis.js';
import prisma from '../prisma/client.js';
import ngrokUrl from '../ngrok.js';
import logger from './config/logger.js';

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('Database connected');

    app.listen(env.PORT, () => {
      logger.info({ port: env.PORT, env: env.NODE_ENV }, 'Server running');
    });
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
// ngrokUrl()


process.on('SIGINT', async () => {
  await prisma.$disconnect();
  redis.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  redis.disconnect();
  process.exit(0);
});