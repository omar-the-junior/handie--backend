import app from './app.js';
import { logger } from './config/logger.js';
import { Server, createServer } from 'http';

const port = process.env.PORT || 3000;

const exitHandler = (server: Server | null) => {
  if (server) {
    server.close(async () => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unExpectedErrorHandler = (server: Server) => {
  return function (error: Error) {
    logger.error(error);
    exitHandler(server);
  };
};

const httpServer = createServer(app);

const server: Server = httpServer.listen(port, () => {
  logger.info(`server listening on port ${port}`);
  logger.info(`Start at http://127.0.0.1:${port}/api/`);
  console.log(`Docs at http://127.0.0.1:${port}/docs`);
});

process.on('uncaughtException', unExpectedErrorHandler(server));
process.on('unhandledRejection', unExpectedErrorHandler(server));
process.on('SIGTERM', () => {
  logger.info('SIGTERM recieved');
  if (server) {
    server.close();
  }
});
