import type { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import type {
  ApiResponse,
  AuthenticationErrorResponse,
  NotFoundErrorResponse,
} from '../api/types.js';

import type { UpdateUserProfileInputType } from '../schemas/userSchemas.js';

const prisma = new PrismaClient();

// Define response types for different status codes
export type GetUserProfileResponseBody = ApiResponse<{
  user: {
    id: number;
    email: string;
    name: string;
    phone: string | null;
    userType: string;
  };
}>;

export type UpdateUserProfileResponseBody = ApiResponse<{
  user: {
    id: number;
    email: string;
    name: string;
    phone: string | null;
    userType: string;
  };
}>;

// Define types for the request handlers
type GetUserProfileHandler = RequestHandler<
  unknown,
  | GetUserProfileResponseBody
  | AuthenticationErrorResponse
  | NotFoundErrorResponse
>;

type UpdateUserProfileHandler = RequestHandler<
  unknown,
  UpdateUserProfileResponseBody,
  UpdateUserProfileInputType['body']
>;

export const getUserProfile: GetUserProfileHandler = async (req, res, next) => {
  if (!req.user) {
    const unauthorizedResponse: AuthenticationErrorResponse = {
      status: 'error',
      error: 'Token missing or user credentials not present',
      errorCode: 'AUTHENTICATION_ERROR',
    };
    res.status(401).json(unauthorizedResponse);
  } else {
    const { userId } = req.user;

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        res.json({
          status: 'success',
          data: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              phone: user.phone,
              userType: user.userType,
            },
          },
        });
      } else {
        const notFoundResponse: NotFoundErrorResponse = {
          status: 'error',
          error: 'User not found',
          errorCode: 'NOT_FOUND_ERROR',
        };
        res.status(404).json(notFoundResponse);
      }
    } catch (error) {
      next(error);
    }
  }
};

export const updateUserProfile: UpdateUserProfileHandler = async (
  req,
  res,
  next,
) => {
  if (!req.user) {
    const unauthorizedResponse: AuthenticationErrorResponse = {
      status: 'error',
      error: 'Token missing or user credentials not present',
      errorCode: 'AUTHENTICATION_ERROR',
    };
    res.status(401).json(unauthorizedResponse);
  } else {
    const { userId } = req.user;
    const { email, name, phone } = req.body;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          email,
          name,
          phone,
        },
      });
      res.json({
        status: 'success',
        message: 'User profile updated successfully',
        data: {
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            phone: updatedUser.phone,
            userType: updatedUser.userType,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
};

// export type DeleteUserResponseBody = ApiResponse<null>;

// type DeleteUserHandler = RequestHandler<
//   unknown,
//   DeleteUserResponseBody | AuthenticationErrorResponse | NotFoundErrorResponse
// >;

// export const deleteUser: DeleteUserHandler = async (req, res, next) => {
//   if (!req.user) {
//     const unauthorizedResponse: AuthenticationErrorResponse = {
//       status: 'error',
//       error: 'Token missing or user credentials not present',
//       errorCode: 'AUTHENTICATION_ERROR',
//     };
//     res.status(401).json(unauthorizedResponse);
//   } else {
//     const { userId } = req.user;

//     try {
//       console.log('Deleting user with id:', userId);

//       await prisma.user.delete({ where: { id: Number(userId) } });
//       const successResponse: SuccessResponse<null> = {
//         status: 'success',
//         message: 'User profile deleted successfully',
//         data: null,
//       };
//       res.status(204).json(successResponse);
//     } catch (error) {
//       next(error);
//     }
//   }
// };
