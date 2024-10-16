import type { RequestHandler } from 'express';
import prisma from '../client.js';
import bcrypt from 'bcrypt';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/token.utils.js';
import type { CustomJwtPayload } from '../utils/jwt.utils.js';
import { InternalSeverError } from '../errors/index.js';

import type { LoginReqType, SignupReqType } from '../schemas/userSchemas.js';
import type { ValidationErrorResponseBody } from '../middleware/validation.middleware.js';

// Define response types
interface LoginResponse {
  success: boolean;
  accessToken?: string;
  error?: string;
}

interface SignupResponse {
  success: boolean;
  accessToken?: string;
  error?: string;
}

interface RefreshTokenResponse {
  accessToken?: string;
  error?: string;
}

// Define types for the request handlers
type LoginHandler = RequestHandler<
  unknown,
  LoginResponse | ValidationErrorResponseBody,
  LoginReqType['body']
>;
type SignupHandler = RequestHandler<
  unknown,
  SignupResponse | ValidationErrorResponseBody,
  SignupReqType['body']
>;
type RefreshTokenHandler = RequestHandler<unknown, RefreshTokenResponse>;

export const login: LoginHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    } else {
      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
      } else {
        // Generate access and refresh tokens
        const accessToken = generateAccessToken({
          userId: user.id,
          userType: user.userType,
          email: user.email,
        });

        const refreshToken = generateRefreshToken({
          userId: user.id,
          userType: user.userType,
          email: user.email,
        });

        // Set the refresh token as an HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
        });

        // Respond with the access token
        res.json({ success: true, accessToken });
      }
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ success: false, error: 'Failed to login' });
  }
};

export const signup: SignupHandler = async (req, res) => {
  const { email, password, repeatPassword, name } = req.body;

  if (password !== repeatPassword) {
    res.status(400).json({ success: false, error: 'Passwords do not match' });
  } else {
    try {
      // Check if the user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ success: false, error: 'Email already in use' });
      } else {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            userType: 'BUYER',
          },
        });

        // Generate access and refresh tokens
        const accessToken = generateAccessToken({
          userId: user.id,
          userType: user.userType,
          email: user.email,
        });

        const refreshToken = generateRefreshToken({
          userId: user.id,
          userType: user.userType,
          email: user.email,
        });

        // Set the refresh token as an HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
        });

        // Respond with the access token
        res.json({ success: true, accessToken });
      }
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ success: false, error: 'Failed to signup' });
    }
  }
};

export const refreshToken: RefreshTokenHandler = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    res.status(401).json({ error: 'Refresh token missing' });
  } else {
    const { payload, expired } = verifyRefreshToken(token);

    if (!payload || expired) {
      res.status(401).json({ error: 'Invalid or expired refresh token' });
    } else {
      if (typeof payload === 'string') {
        throw new InternalSeverError('Unexpected error: Invalid payload', 500);
      }

      const userPayload = payload as CustomJwtPayload;

      const user = {
        userId: userPayload.userId,
        email: userPayload.email,
        userType: userPayload.userType,
      };

      const accessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
      });

      res.json({ accessToken });
    }
  }
};
