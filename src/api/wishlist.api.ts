import { Router } from 'express';
import type { Tspec } from 'tspec';
import {
  addToWishlist,
  removeFromWishlist,
  getWishlistItems,
  type AddToWishlistResponseBody,
  type RemoveFromWishlistResponseBody,
  type GetWishlistItemsResponseBody,
} from '../controllers/wishlist.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import type {
  AuthenticationErrorResponse,
  NotFoundErrorResponse,
} from '../api/types.js';
import validate from '../middleware/validation.middleware.js';
import {
  AddToWishlistInputSchema,
  WishlistItemInputSchema,
} from '../schemas/wishlistSchemas.js';

export type WishlistSpec = Tspec.DefineApiSpec<{
  tags: ['Wishlist'];
  security: 'jwt';
  basePath: '/api/wishlist';
  paths: {
    '/add': {
      post: {
        summary: 'Add item to wishlist';
        handler: typeof addToWishlist;
        responses: {
          200: Extract<AddToWishlistResponseBody, { status: 'success' }>;
          401: AuthenticationErrorResponse;
          404: NotFoundErrorResponse;
        };
      };
    };
    '/remove': {
      post: {
        summary: 'Remove item from wishlist';
        handler: typeof removeFromWishlist;
        responses: {
          200: Extract<RemoveFromWishlistResponseBody, { status: 'success' }>;
          401: AuthenticationErrorResponse;
          404: NotFoundErrorResponse;
        };
      };
    };
    '/items': {
      get: {
        summary: 'Get wishlist items';
        handler: typeof getWishlistItems;
        responses: {
          200: Extract<GetWishlistItemsResponseBody, { status: 'success' }>;
          401: NotFoundErrorResponse;
          404: NotFoundErrorResponse;
        };
      };
    };
  };
}>;

// Create the router
const router = Router();

router.post('/add', authMiddleware, validate(AddToWishlistInputSchema), addToWishlist);
router.post(
  '/remove',
  authMiddleware,
  validate(WishlistItemInputSchema),
  removeFromWishlist,
);
router.get('/items', authMiddleware, getWishlistItems);

export default router;