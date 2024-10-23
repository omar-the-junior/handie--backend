import express from 'express';
import validate from '../middleware/validation.middleware.js';
import { loginSchema, signupSchema } from '../schemas/userSchemas.js';
import {
  login,
  logout,
  refreshToken,
  signup,
  type LoginResponse,
} from '../controllers/auth.controller.js';

const router = express.Router();

import { type Tspec } from 'tspec';

export type AuthSpec = Tspec.DefineApiSpec<{
  basePath: '/auth';
  tags: ['auth'];
  paths: {
    '/login': {
      post: {
        summary: 'Login';
        description: 'Login to the application';
        handler: typeof login;
        responses: {
          200: Extract<LoginResponse, { success: true }>;
          401: Extract<LoginResponse, { success: false }>;
          500: Extract<LoginResponse, { success: false }>;
        };
      };
    };
    '/signup': {
      post: {
        summary: 'Signup';
        description: 'Signup to the application';
        handler: typeof signup;
      };
    };
    '/refresh-token': {
      post: {
        summary: 'Refresh Token';
        description: 'Refresh the access token';
        handler: typeof refreshToken;
        cookie: {
          refreshToken?: string;
        };
      };
    };
    '/logout': {
      post: {
        summary: 'Logout';
        description: 'Logout from the application';
        handler: typeof logout;
        responses: {
          200: { success: true; message: 'Logged out successfully' };
        };
      };
    };
  };
}>;

// Login route
router.post('/login', validate(loginSchema), login);

// Signup route
router.post('/signup', validate(signupSchema), signup);

// refresh token route
router.post('/refresh-token', refreshToken);

router.post('/logout', logout);
export default router;
