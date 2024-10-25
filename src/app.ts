import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { apiRouter, auth } from './api/index.api.js';

import {
  // notFoundMiddleware,
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

app.use(express.static('public'));

app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));

app.use('/api/', apiRouter);

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

app.use(
  (
    err: { message: string },
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (err instanceof Error && err.message === 'Not allowed by CORS') {
      res.status(403).json({ message: 'CORS error: Not allowed by CORS' });
    } else {
      next(err);
    }
  },
);

app.use(errorHandlerMiddleware);

export default app;
