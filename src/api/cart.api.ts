import { Router } from 'express';
import type { Tspec } from 'tspec';
import {
  addToCart,
  removeFromCart,
  decreaseCartItemQuantity,
  type AddToCartResponseBody,
  type RemoveFromCartResponseBody,
  type DecreaseCartItemQuantityResponseBody,
  type GetCartItemsResponseBody,
  getCartItems,
  type IncreaseCartItemQuantityResponseBody,
  increaseCartItemQuantity,
} from '../controllers/cart.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import type {
  AuthenticationErrorResponse,
  InsufficientStockErrorResponse,
  NotFoundErrorResponse,
} from '../api/types.js';
import validate from '../middleware/validation.middleware.js';
import {
  AddToCartInputSchema,
  CartItemInputSchema,
} from '../schemas/cartSchemas.js';

export type CartSpec = Tspec.DefineApiSpec<{
  tags: ['Cart'];
  security: 'jwt';
  basePath: '/api/cart';
  paths: {
    '/add': {
      post: {
        summary: 'Add item to cart';
        handler: typeof addToCart;
        responses: {
          200: Extract<AddToCartResponseBody, { status: 'success' }>;
          401: AuthenticationErrorResponse;
          404: NotFoundErrorResponse;
        };
      };
    };
    '/remove': {
      post: {
        summary: 'Remove item from cart';
        handler: typeof removeFromCart;
        responses: {
          200: Extract<RemoveFromCartResponseBody, { status: 'success' }>;
          401: AuthenticationErrorResponse;
          404: NotFoundErrorResponse;
        };
      };
    };
    '/decrease': {
      post: {
        summary: 'Decrease item quantity in cart';
        handler: typeof decreaseCartItemQuantity;
        responses: {
          200: Extract<
            DecreaseCartItemQuantityResponseBody,
            { status: 'success' }
          >;
          401: AuthenticationErrorResponse;
          404: NotFoundErrorResponse;
        };
      };
    };
    '/increase': {
      post: {
        summary: 'Increase item quantity in cart';
        handler: typeof increaseCartItemQuantity;
        responses: {
          200: Extract<
            IncreaseCartItemQuantityResponseBody,
            { status: 'success' }
          >;
          400: InsufficientStockErrorResponse;
          401: AuthenticationErrorResponse;
          404: NotFoundErrorResponse;
        };
      };
    };
    '/items': {
      get: {
        summary: 'Get cart items';
        handler: typeof getCartItems;
        responses: {
          200: Extract<GetCartItemsResponseBody, { status: 'success' }>;
          401: NotFoundErrorResponse;
          404: NotFoundErrorResponse;
        };
      };
    };
  };
}>;

// Create the router
const router = Router();

router.post('/add', authMiddleware, validate(AddToCartInputSchema), addToCart);
router.post(
  '/remove',
  authMiddleware,
  validate(CartItemInputSchema),
  removeFromCart,
);
router.post(
  '/increase',
  authMiddleware,
  validate(CartItemInputSchema),
  increaseCartItemQuantity,
);
router.post(
  '/decrease',
  authMiddleware,
  validate(CartItemInputSchema),
  decreaseCartItemQuantity,
);
router.get('/items', authMiddleware, getCartItems);

export default router;
