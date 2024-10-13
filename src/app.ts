import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { auth } from './api/index.api.js';

import {
  notFoundMiddleware,
  errorHandlerMiddleware,
} from './middleware/index.middleware.js';
import { TspecDocsMiddleware } from 'tspec';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(helmet.xssFilter());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'trusted-cdn.com'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  }),
);

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
// app.use('/api/', api);

app.use('/auth/', auth);

app.use(
  '/docs',
  await TspecDocsMiddleware({
    openapi: {
      securityDefinitions: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  }),
);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
