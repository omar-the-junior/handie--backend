import express from 'express';
import validate from '../middleware/validation.middleware.js';
import { loginSchema, signupSchema } from '../schemas/userSchemas.js';
import { login, refreshToken, signup } from '../controllers/auth.controller.js';

const router = express.Router();

import { type Tspec } from 'tspec';

export type APISpec = Tspec.DefineApiSpec<{
  basePath: '/auth';
  tags: ['auth'];
  paths: {
    '/login': {
      post: {
        summary: 'Login';
        description: 'Login to the application';
        handler: typeof login;
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
  };
}>;

// Login route
router.post('/login', validate(loginSchema), login);

// Signup route
router.post('/signup', validate(signupSchema), signup);

// refresh token route
router.post('/refresh-token', refreshToken);
export default router;