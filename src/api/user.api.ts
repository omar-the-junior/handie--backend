import { Router } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  // deleteUser,
  type GetUserProfileResponseBody,
  type UpdateUserProfileResponseBody,
  // type DeleteUserResponseBody,
} from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import validate, {
  type ValidationErrorResponseBody,
} from '../middleware/validation.middleware.js';
import { UpdateUserProfileInputSchema } from '../schemas/userSchemas.js';
import type { Tspec } from 'tspec';
import type {
  AuthenticationErrorResponse,
  NotFoundErrorResponse,
} from '../api/types.js';

export type UserSpec = Tspec.DefineApiSpec<{
  tags: ['User'];
  security: 'jwt';
  basePath: '/api/user';
  paths: {
    '/profile': {
      get: {
        summary: 'Get user profile';
        handler: typeof getUserProfile;
        responses: {
          200: Extract<GetUserProfileResponseBody, { status: 'success' }>;
          401: AuthenticationErrorResponse;
          404: NotFoundErrorResponse;
        };
      };
      put: {
        summary: 'Update user profile';
        handler: typeof updateUserProfile;
        responses: {
          200: Extract<UpdateUserProfileResponseBody, { status: 'success' }>;
          400: ValidationErrorResponseBody;
          401: AuthenticationErrorResponse;
          404: NotFoundErrorResponse;
        };
      };
    };
    // '/delete': {
    //   delete: {
    //     summary: 'Delete user profile';
    //     handler: typeof deleteUser;
    //     responses: {
    //       204: Extract<DeleteUserResponseBody, { status: 'success' }>;
    //       401: AuthenticationErrorResponse;
    //       404: NotFoundErrorResponse;
    //     };
    //   };
    // };
  };
}>;

// Create the router
const router = Router();

router.get('/profile', authMiddleware, getUserProfile);
router.put(
  '/profile',
  authMiddleware,
  validate(UpdateUserProfileInputSchema),
  updateUserProfile,
);
// router.delete('/delete', authMiddleware, deleteUser);

export default router;
