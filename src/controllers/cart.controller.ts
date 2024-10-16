import type { RequestHandler } from 'express';
import prisma from '../client.js';
import type {
  ApiResponse,
  AuthenticationErrorResponse,
  InsufficientStockErrorResponse,
  NotFoundErrorResponse,
  SuccessResponse,
} from '../api/types.js';
import type {
  AddToCartInputType,
  CartItemInputType,
} from '../schemas/cartSchemas.js';

// Define response types for different status codes
export type AddToCartResponseBody = ApiResponse<{
  cartItem: {
    id: number;
    productId: number;
  };
}>;

// Define types for the request handlers
type AddToCartHandler = RequestHandler<
  unknown,
  AddToCartResponseBody,
  AddToCartInputType['body']
>;

export const addToCart: AddToCartHandler = async (req, res, next) => {
  const { productId } = req.body;
  if (!req.user) {
    const unauthorizedResponse: AuthenticationErrorResponse = {
      status: 'error',
      error: 'Token missing or user credentials not present',
      errorCode: 'AUTHENTICATION_ERROR',
    };
    res.status(401).json(unauthorizedResponse);
  } else {
    const userId = req.user.userId; // Assuming req.user is set by authentication middleware

    try {
      // Check if the product exists
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        const notFoundResponse: NotFoundErrorResponse = {
          status: 'error',
          error: 'Product not found',
          errorCode: 'NOT_FOUND_ERROR',
        };
        res.status(404).json(notFoundResponse);
      } else {
        const cart = await prisma.cart.upsert({
          where: { userId },
          update: {},
          create: { userId },
        });

        const cartItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity: 1,
          },
        });

        const successResponse: SuccessResponse<{
          cartItem: {
            id: number;
            productId: number;
          };
        }> = {
          status: 'success',
          message: 'Item added to cart',
          data: {
            cartItem: {
              id: cartItem.id,
              productId: cartItem.productId,
            },
          },
        };

        res.json(successResponse);
      }
    } catch (error) {
      next(error);
    }
  }
};

export interface RemoveFromCartRequestBody {
  cartItemId: number;
}

export type RemoveFromCartResponseBody = ApiResponse<null>;

type RemoveFromCartHandler = RequestHandler<
  unknown,
  RemoveFromCartResponseBody,
  CartItemInputType['body']
>;

export const removeFromCart: RemoveFromCartHandler = async (req, res, next) => {
  const { cartItemId } = req.body;

  if (!req.user) {
    const unauthorizedResponse: AuthenticationErrorResponse = {
      status: 'error',
      error: 'Token missing or user credentials not present',
      errorCode: 'AUTHENTICATION_ERROR',
    };
    res.status(401).json(unauthorizedResponse);
  } else {
    const userId = req.user.userId; // Assuming req.user is set by authentication middleware

    try {
      const cart = await prisma.cart.findUnique({ where: { userId } });

      if (!cart) {
        const notFoundResponse: NotFoundErrorResponse = {
          status: 'error',
          error: 'Cart not found',
          errorCode: 'NOT_FOUND_ERROR',
        };
        res.status(404).json(notFoundResponse);
      } else {
        const cartItem = await prisma.cartItem.findUnique({
          where: {
            id: cartItemId,
          },
        });

        if (!cartItem) {
          const notFoundResponse: NotFoundErrorResponse = {
            status: 'error',
            error: 'Item not found in cart',
            errorCode: 'NOT_FOUND_ERROR',
          };
          res.status(404).json(notFoundResponse);
        } else {
          await prisma.cartItem.delete({ where: { id: cartItem.id } });
          const successResponse: SuccessResponse<null> = {
            status: 'success',
            message: 'Item removed from cart',
            data: null,
          };
          res.json(successResponse);
        }
      }
    } catch (error) {
      next(error);
    }
  }
};

export type DecreaseCartItemQuantityResponseBody = ApiResponse<{
  cartItem: {
    id: number;
    productId: number;
    quantity: number;
  };
} | null>;

type DecreaseCartItemQuantityHandler = RequestHandler<
  unknown,
  DecreaseCartItemQuantityResponseBody,
  CartItemInputType['body']
>;

export const decreaseCartItemQuantity: DecreaseCartItemQuantityHandler = async (
  req,
  res,
  next,
) => {
  const { cartItemId } = req.body;

  if (!req.user) {
    const unauthorizedResponse: AuthenticationErrorResponse = {
      status: 'error',
      error: 'Token missing or user credentials not present',
      errorCode: 'AUTHENTICATION_ERROR',
    };
    res.status(401).json(unauthorizedResponse);
  } else {
    const userId = req.user.userId; // Assuming req.user is set by authentication middleware

    try {
      const cart = await prisma.cart.findUnique({ where: { userId } });

      if (!cart) {
        const notFoundResponse: NotFoundErrorResponse = {
          status: 'error',
          error: 'Cart not found',
          errorCode: 'NOT_FOUND_ERROR',
        };
        res.status(404).json(notFoundResponse);
      } else {
        const cartItem = await prisma.cartItem.findUnique({
          where: { id: cartItemId },
        });

        if (!cartItem) {
          const notFoundResponse: NotFoundErrorResponse = {
            status: 'error',
            error: 'Item not found in cart',
            errorCode: 'NOT_FOUND_ERROR',
          };
          res.status(404).json(notFoundResponse);
        } else if (cartItem.quantity > 1) {
          const updatedCartItem = await prisma.cartItem.update({
            where: { id: cartItem.id },
            data: { quantity: cartItem.quantity - 1 },
          });
          const successResponse: SuccessResponse<{
            cartItem: { id: number; productId: number; quantity: number };
          }> = {
            status: 'success',
            message: 'Item quantity decreased',
            data: {
              cartItem: {
                id: updatedCartItem.id,
                productId: updatedCartItem.productId,
                quantity: updatedCartItem.quantity,
              },
            },
          };
          res.json(successResponse);
        } else {
          await prisma.cartItem.delete({ where: { id: cartItem.id } });
          const successResponse: SuccessResponse<null> = {
            status: 'success',
            message: 'Item removed from cart',
            data: null,
          };
          res.json(successResponse);
        }
      }
    } catch (error) {
      next(error);
    }
  }
};

export type IncreaseCartItemQuantityResponseBody = ApiResponse<{
  cartItem: {
    id: number;
    productId: number;
    quantity: number;
  };
}>;

type IncreaseCartItemQuantityHandler = RequestHandler<
  unknown,
  IncreaseCartItemQuantityResponseBody,
  CartItemInputType['body']
>;

export const increaseCartItemQuantity: IncreaseCartItemQuantityHandler = async (
  req,
  res,
  next,
) => {
  const { cartItemId } = req.body;

  if (!req.user) {
    const unauthorizedResponse: AuthenticationErrorResponse = {
      status: 'error',
      error: 'Token missing or user credentials not present',
      errorCode: 'AUTHENTICATION_ERROR',
    };
    res.status(401).json(unauthorizedResponse);
  } else {
    const userId = req.user.userId; // Assuming req.user is set by authentication middleware

    try {
      const cart = await prisma.cart.findUnique({ where: { userId } });

      if (!cart) {
        const notFoundResponse: NotFoundErrorResponse = {
          status: 'error',
          error: 'Cart not found',
          errorCode: 'NOT_FOUND_ERROR',
        };
        res.status(404).json(notFoundResponse);
      } else {
        const cartItem = await prisma.cartItem.findUnique({
          where: { id: cartItemId },
        });

        if (!cartItem) {
          const notFoundResponse: NotFoundErrorResponse = {
            status: 'error',
            error: 'Item not found in cart',
            errorCode: 'NOT_FOUND_ERROR',
          };
          res.status(404).json(notFoundResponse);
        } else {
          // Check the stock of the product
          const product = await prisma.product.findUnique({
            where: { id: cartItem.productId },
          });

          if (!product || product.stock <= cartItem.quantity) {
            const stockErrorResponse: InsufficientStockErrorResponse = {
              status: 'error',
              error: 'Insufficient stock',
              errorCode: 'INSUFFICIENT_STOCK_ERROR',
            };
            res.status(400).json(stockErrorResponse);
          } else {
            const updatedCartItem = await prisma.cartItem.update({
              where: { id: cartItem.id },
              data: { quantity: cartItem.quantity + 1 },
            });
            const successResponse: SuccessResponse<{
              cartItem: { id: number; productId: number; quantity: number };
            }> = {
              status: 'success',
              message: 'Item quantity increased',
              data: {
                cartItem: {
                  id: updatedCartItem.id,
                  productId: updatedCartItem.productId,
                  quantity: updatedCartItem.quantity,
                },
              },
            };
            res.json(successResponse);
          }
        }
      }
    } catch (error) {
      next(error);
    }
  }
};

export type GetCartItemsResponseBody = ApiResponse<{
  cartItems: {
    id: number;
    quantity: number;
    product: {
      id: number;
      title: string;
      price: number;
      discount?: number;
      image?: string;
      attributes: {
        id: number;
        values: {
          id: number;
          value: string;
        }[];
      }[];
    };
  }[];
}>;

type GetCartItemsHandler = RequestHandler<unknown, GetCartItemsResponseBody>;

export const getCartItems: GetCartItemsHandler = async (req, res, next) => {
  if (!req.user) {
    const unauthorizedResponse: AuthenticationErrorResponse = {
      status: 'error',
      error: 'Token missing or user credentials not present',
      errorCode: 'AUTHENTICATION_ERROR',
    };
    res.status(401).json(unauthorizedResponse);
  } else {
    const userId = req.user.userId; // Assuming req.user is set by authentication middleware

    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            select: {
              id: true,
              quantity: true,
            },
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  price: true,
                  discount: true,
                  images: {
                    select: {
                      path: true,
                    },
                    where: { isPrimary: true },
                  },
                },
                include: {
                  Attributes: {
                    include: {
                      values: {
                        select: {
                          id: true,
                          value: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!cart) {
        const notFoundResponse: NotFoundErrorResponse = {
          status: 'error',
          error: 'Cart not found',
          errorCode: 'NOT_FOUND_ERROR',
        };
        res.status(404).json(notFoundResponse);
      } else {
        const successResponse: SuccessResponse<{
          cartItems: {
            id: number;
            quantity: number;
            product: {
              id: number;
              title: string;
              price: number;
              discount?: number;
              image?: string;
              attributes: {
                id: number;
                values: {
                  id: number;
                  value: string;
                }[];
              }[];
            };
          }[];
        }> = {
          status: 'success',
          message: 'Cart items retrieved successfully',
          data: {
            cartItems: cart.items.map((item) => ({
              id: item.id,
              quantity: item.quantity,
              product: {
                id: item.product.id,
                title: item.product.title,
                price: item.product.price,
                discount: item.product.discount,
                image: item.product.images[0]?.path,
                attributes: item.product.Attributes.map((attr) => ({
                  id: attr.id,
                  values: attr.values.map((value) => ({
                    id: value.id,
                    value: value.value,
                  })),
                })),
              },
            })),
          },
        };
        res.json(successResponse);
      }
    } catch (error) {
      next(error);
    }
  }
};
