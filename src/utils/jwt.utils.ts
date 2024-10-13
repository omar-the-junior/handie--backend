import jwt from 'jsonwebtoken';
import { logger } from '../config/logger.js';
import { InternalSeverError } from '../errors/index.js';

import type { TokenPayload } from './token.utils.js';

export function signJWT(
  payload: object,
  expiresIn: string | number = '5m',
  secretKey: string,
) {
  if (!secretKey) {
    throw new Error('Secret key is not defined');
  }

  return jwt.sign(payload, secretKey, { expiresIn });
}

// Define a custom type that extends jwt.JwtPayload
export interface CustomJwtPayload extends jwt.JwtPayload, TokenPayload {}

export function verifyJWT(
  token: string,
  secretKey: string,
): { payload: string | CustomJwtPayload | null; expired: boolean } {
  if (!secretKey) {
    throw new Error('Secret key is not defined');
  }

  try {
    const decoded = jwt.verify(token, secretKey) as string | CustomJwtPayload;

    return { payload: decoded, expired: false };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { payload: null, expired: true };
    }

    logger.error(error);
    throw new InternalSeverError(
      'Unexpected error: Failed to verify token',
      500,
    );
  }
}
