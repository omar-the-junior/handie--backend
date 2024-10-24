import type { RequestHandler } from 'express';
import prisma from '../client.js';
import type {
  ApiResponse,
  AuthenticationErrorResponse,
  NotFoundErrorResponse,
  SuccessResponse,
} from '../api/types.js';
import type {
  AddToWishlistInputType,
  WishlistItemInputType,
} from '../schemas/wishlistSchemas.js';
import { constructImageUrl } from '../utils/helpers.utils.js';

// Define response types for different status codes
export type AddToWishlistResponseBody = ApiResponse<{
  wishlistItem: {
    id: number;
    productId: number;
  };
}>;

// Define types for the request handlers
type AddToWishlistHandler = RequestHandler<
  unknown,
  AddToWishlistResponseBody,
  AddToWishlistInputType['body']
>;

export const addToWishlist: AddToWishlistHandler = async (req, res, next) => {
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
        const wishlist = await prisma.wishlist.upsert({
          where: { userId },
          update: {},
          create: { userId },
        });

        const alreadyInWishlist = await prisma.wishlistItem.findFirst({
          where: {
            wishlistId: wishlist.id,
            productId,
          },
          select: { id: true },
        });

        if (alreadyInWishlist) {
          const successResponse: SuccessResponse<{
            wishlistItem: {
              id: number;
              productId: number;
            };
          }> = {
            status: 'success',
            message: 'Item already in wishlist',
            data: {
              wishlistItem: {
                id: alreadyInWishlist.id,
                productId,
              },
            },
          };
          res.json(successResponse);
        } else {
          const wishlistItem = await prisma.wishlistItem.create({
            data: {
              wishlistId: wishlist.id,
              productId,
            },
          });

          const successResponse: SuccessResponse<{
            wishlistItem: {
              id: number;
              productId: number;
            };
          }> = {
            status: 'success',
            message: 'Item added to wishlist',
            data: {
              wishlistItem: {
                id: wishlistItem.id,
                productId: wishlistItem.productId,
              },
            },
          };

          res.json(successResponse);
        }
      }
    } catch (error) {
      next(error);
    }
  }
};

export interface RemoveFromWishlistRequestBody {
  wishlistItemId: number;
}

export type RemoveFromWishlistResponseBody = ApiResponse<null>;

type RemoveFromWishlistHandler = RequestHandler<
  unknown,
  RemoveFromWishlistResponseBody,
  WishlistItemInputType['body']
>;

export const removeFromWishlist: RemoveFromWishlistHandler = async (
  req,
  res,
  next,
) => {
  const { wishlistItemId } = req.body;

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
      const wishlist = await prisma.wishlist.findUnique({ where: { userId } });

      if (!wishlist) {
        const notFoundResponse: NotFoundErrorResponse = {
          status: 'error',
          error: 'Wishlist not found',
          errorCode: 'NOT_FOUND_ERROR',
        };
        res.status(404).json(notFoundResponse);
      } else {
        const wishlistItem = await prisma.wishlistItem.findUnique({
          where: {
            id: wishlistItemId,
          },
        });

        if (!wishlistItem) {
          const notFoundResponse: NotFoundErrorResponse = {
            status: 'error',
            error: 'Item not found in wishlist',
            errorCode: 'NOT_FOUND_ERROR',
          };
          res.status(404).json(notFoundResponse);
        } else {
          await prisma.wishlistItem.delete({ where: { id: wishlistItem.id } });
          const successResponse: SuccessResponse<null> = {
            status: 'success',
            message: 'Item removed from wishlist',
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

export type GetWishlistItemsResponseBody = ApiResponse<{
  wishlistItems: {
    id: number;
    product: {
      id: number;
      title: string;
      price: number;
      discount?: number;
      image: string | null;
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

type GetWishlistItemsHandler = RequestHandler<
  unknown,
  GetWishlistItemsResponseBody
>;

export const getWishlistItems: GetWishlistItemsHandler = async (
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
    const userId = req.user.userId; // Assuming req.user is set by authentication middleware

    try {
      const wishlist = await prisma.wishlist.findFirst({
        where: {
          userId,
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: {
                      isPrimary: true,
                    },
                  },
                  Attributes: {
                    include: {
                      values: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!wishlist) {
        const notFoundResponse: NotFoundErrorResponse = {
          status: 'error',
          error: 'Wishlist not found',
          errorCode: 'NOT_FOUND_ERROR',
        };
        res.status(404).json(notFoundResponse);
      } else {
        const successResponse: SuccessResponse<{
          wishlistItems: {
            id: number;
            product: {
              id: number;
              title: string;
              price: number;
              discount?: number;
              image: string | null;
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
          message: 'Wishlist items retrieved successfully',
          data: {
            wishlistItems: wishlist.items.map((item) => ({
              id: item.id,
              product: {
                id: item.product.id,
                title: item.product.title,
                price: item.product.price,
                discount: item.product.discount,
                image: constructImageUrl(
                  req,
                  item.product.images[0]?.path ?? '',
                ),
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
