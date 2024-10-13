import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import CustomAPIError from '../errors/custom.error.js';

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
  errors?: { [key: string]: { message: string } };
  path?: string;
  code?: number;
  keyValue?: { [key: string]: string };
}

const errorHandlerMiddleware = (err: unknown, req: Request, res: Response) => {
  const defaultError = {
    statusCode: 500,
    msg: 'Something went wrong, try again later',
  };

  if (err instanceof CustomAPIError) {
    defaultError.statusCode = err.statusCode || 500;
    defaultError.msg = err.message || 'Something went wrong, try again later';
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2000':
        defaultError.statusCode = 400;
        defaultError.msg =
          "The provided value for the column is too long for the column's type.";
        break;
      case 'P2001':
        defaultError.statusCode = 404;
        defaultError.msg = 'The record searched for does not exist.';
        break;
      case 'P2002':
        defaultError.statusCode = 400;
        defaultError.msg = 'Unique constraint failed.';
        break;
      case 'P2003':
        defaultError.statusCode = 400;
        defaultError.msg = 'Foreign key constraint failed.';
        break;
      case 'P2004':
        defaultError.statusCode = 400;
        defaultError.msg = 'A constraint failed on the database.';
        break;
      case 'P2005':
        defaultError.statusCode = 400;
        defaultError.msg = 'Invalid value stored in the database.';
        break;
      default:
        defaultError.statusCode = 500;
        defaultError.msg = 'An unknown database error occurred.';
        break;
    }
  } else if (err instanceof Error) {
    const error = err as ErrorWithStatusCode;

    if (error.name === 'ValidationError' && error.errors) {
      defaultError.statusCode = 400;
      defaultError.msg = Object.values(error.errors)
        .map((item) => item.message)
        .join(',');
    } else if (error.name === 'CastError' && error.path) {
      defaultError.statusCode = 400;
      defaultError.msg = `Resource not found. Invalid: ${error.path}`;
    }
  }

  res
    .status(defaultError.statusCode)
    .json({ message: defaultError.msg, success: false });
};

export default errorHandlerMiddleware;
