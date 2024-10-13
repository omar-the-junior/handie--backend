import { signJWT, verifyJWT } from './jwt.utils.js';

export type TokenPayload = {
  userId: number;
  userType: string;
  email: string;
};

const generateAccessToken = (user: TokenPayload) => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error('JWT_SECRET is not defined');
  }
  return signJWT(user, '15m', secretKey);
};

const generateRefreshToken = (user: TokenPayload) => {
  const secretKey = process.env.REFRESH_TOKEN_SECRET;
  if (!secretKey) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined');
  }
  return signJWT(user, '7d', secretKey);
};

const verifyAccessToken = (token: string) => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error('JWT_SECRET is not defined');
  }
  return verifyJWT(token, secretKey);
};

const verifyRefreshToken = (token: string) => {
  const secretKey = process.env.REFRESH_TOKEN_SECRET;
  if (!secretKey) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined');
  }
  return verifyJWT(token, secretKey);
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
