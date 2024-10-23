import type { RequestHandler } from 'express';
import prisma from '../client.js';

// interface CreateProductRequest {
//   title: string;
//   description?: string;
//   price: number;
//   discount?: number;
//   discountFrom?: Date;
//   discountTo?: Date;
//   stock: number;
//   sellerId: number;
//   categoryId: number;
//   attributes: {
//     key: string;
//     values: string[];
//   }[];
// }

// interface CreateProductResponse extends GetProductsResponse {}

// interface UpdateProductRequest extends CreateProductRequest {}

// interface UpdateProductResponse extends GetProductsResponse {}

// interface DeleteProductResponse {
//   message: string;
// }

// type CreateProductHandler = RequestHandler<
//   unknown,
//   CreateProductResponse,
//   CreateProductRequest
// >;
// type UpdateProductHandler = RequestHandler<
//   { id: string },
//   UpdateProductResponse,
//   UpdateProductRequest
// >;
// type DeleteProductHandler = RequestHandler<
//   { id: string },
//   DeleteProductResponse
// >;

import type { ApiResponse, SuccessResponse } from '../api/types.js';

import type {
  GetProductByIdInputType,
  GetProductsInputType,
} from '../schemas/productSchemas.js';
import { constructImageUrl } from '../utils/helpers.utils.js';

type product = {
  id: number;
  title: string;
  price: number;
  discount?: number;
  image: string | null;
  stock: number;
  category: {
    id: number;
    name: string;
  };
  seller: {
    id: number;
    name: string;
    image: string | null;
  };
  rating: number | null;
};
// Define response types for different status codes
export type GetProductsResponseBody = ApiResponse<{
  products: product[];
}>;

// Define types for the request handlers
type GetProductsHandler = RequestHandler<
  unknown,
  GetProductsResponseBody,
  unknown,
  GetProductsInputType['query']
>;

export const getProducts: GetProductsHandler = async (req, res, next) => {
  try {
    const {
      title,
      minPrice,
      maxPrice,
      categories,
      sellerId,
      priceSortOrder = 'asc',
    } = req.query;

    const filters: {
      title?: { contains: string; mode: 'insensitive' };
      price?: { gte?: number; lte?: number };
      categories?: number[];
      sellerId?: number;
    } = {};

    if (title) {
      filters.title = { contains: title, mode: 'insensitive' };
    }
    if (minPrice) {
      filters.price = { gte: minPrice };
    }
    if (maxPrice) {
      filters.price = { ...filters.price, lte: maxPrice };
    }
    if (categories) {
      filters.categories =
        categories instanceof Array ? categories : [categories];
    }
    if (sellerId) {
      filters.sellerId = sellerId;
    }

    const products = await prisma.product.findMany({
      where: {
        category: {
          id: {
            in: filters.categories,
          },
        },
      },
      orderBy: { price: priceSortOrder },
      select: {
        id: true,
        title: true,
        price: true,
        discount: true,
        stock: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        seller: {
          select: {
            id: true,
            businessName: true,
            image: true,
          },
        },
        images: {
          select: {
            path: true,
          },
          where: { isPrimary: true },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    const successResponse: SuccessResponse<{
      products: product[];
    }> = {
      status: 'success',
      data: {
        products: products.map((product) => {
          const ratingsSum = product.reviews.reduce(
            (sum, review) => sum + review.rating,
            0,
          );
          const averageRating =
            product.reviews.length > 0
              ? ratingsSum / product.reviews.length
              : null;

          return {
            id: product.id,
            title: product.title,
            price: product.price,
            discount: product.discount,
            image: constructImageUrl(req, product.images[0]?.path || null),
            stock: product.stock,
            category: product.category,
            seller: {
              id: product.seller.id,
              name: product.seller.businessName,
              image: constructImageUrl(req, product.seller.image || null),
            },
            rating: averageRating,
          };
        }),
      },
    };

    res.json(successResponse);
  } catch (error) {
    next(error);
  }
};

interface GetProductByIdResponseBody {
  id: number;
  title: string;
  description: string;
  price: number;
  discount?: number;
  discountFrom: Date | null;
  discountTo: Date | null;
  stock: number;
  sellerId: number;
  categoryId: number;
  Attributes: {
    key: string;
    values: {
      value: string;
    }[];
  }[];
  primaryImage?: string;
  images: string[];
}

// Define types for the request handlers
type GetProductByIdHandler = RequestHandler<
  GetProductByIdInputType['params'],
  ApiResponse<GetProductByIdResponseBody>
>;

export const getProductById: GetProductByIdHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
      include: {
        Attributes: { include: { values: true } },
        images: true,
      },
    });
    if (product) {
      res.json({
        status: 'success',
        data: {
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          discount: product.discount,
          discountFrom: product.discountFrom,
          discountTo: product.discountTo,
          stock: product.stock,
          sellerId: product.sellerId,
          categoryId: product.categoryId,
          Attributes: product.Attributes.map((attr) => ({
            key: attr.key,
            values: attr.values.map((value) => ({ value: value.value })),
          })),
          primaryImage: product.images.find((img) => img.isPrimary)?.path,
          images: product.images.map((img) => img.path),
        },
      });
    } else {
      res.status(404).json({
        status: 'error',
        error: 'Product not found',
        errorCode: 'NOT_FOUND_ERROR',
      });
    }
  } catch (error) {
    next(error);
  }
};

// export const createProduct: CreateProductHandler = async (req, res, next) => {
//   const {
//     title,
//     description,
//     price,
//     discount,
//     discountFrom,
//     discountTo,
//     stock,
//     sellerId,
//     categoryId,
//     attributes,
//   } = req.body;
//   const images = req.files as Express.Multer.File[];
//   try {
//     const newProduct = await prisma.product.create({
//       data: {
//         title,
//         description,
//         price,
//         discount,
//         discountFrom,
//         discountTo,
//         stock,
//         sellerId,
//         categoryId,
//         Attributes: {
//           create: attributes.map((attr) => ({
//             key: attr.key,
//             values: {
//               create: attr.values.map((value) => ({ value })),
//             },
//           })),
//         },
//         images: {
//           create: images.map((img, index) => ({
//             path: img.filename,
//             isPrimary: index === 0,
//           })),
//         },
//       },
//     });
//     res.status(201).json(newProduct);
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateProduct: UpdateProductHandler = async (req, res, next) => {
//   const { id } = req.params;
//   const {
//     title,
//     description,
//     price,
//     discount,
//     discountFrom,
//     discountTo,
//     stock,
//     sellerId,
//     categoryId,
//     attributes,
//   } = req.body;
//   const images = req.files as Express.Multer.File[];
//   try {
//     // Delete existing images from the file system
//     const existingImages = await prisma.productImage.findMany({
//       where: { productId: Number(id) },
//     });
//     await Promise.all(
//       existingImages.map((img) =>
//         unlink(path.join(__dirname, '..', 'uploads', img.path)),
//       ),
//     );

//     const updatedProduct = await prisma.product.update({
//       where: { id: Number(id) },
//       data: {
//         title,
//         description,
//         price,
//         discount,
//         discountFrom,
//         discountTo,
//         stock,
//         sellerId,
//         categoryId,
//         Attributes: {
//           deleteMany: {}, // Delete existing attributes
//           create: attributes.map((attr) => ({
//             key: attr.key,
//             values: {
//               create: attr.values.map((value) => ({ value })),
//             },
//           })),
//         },
//         images: {
//           deleteMany: {}, // Delete existing images
//           create: images.map((img, index) => ({
//             path: img.filename,
//             isPrimary: index === 0,
//           })),
//         },
//       },
//     });
//     res.json(updatedProduct);
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteProduct: DeleteProductHandler = async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     // Delete images from the file system
//     const images = await prisma.productImage.findMany({
//       where: { productId: Number(id) },
//     });
//     await Promise.all(
//       images.map((img) =>
//         unlink(path.join(__dirname, '..', 'uploads', img.path)),
//       ),
//     );

//     await prisma.product.delete({ where: { id: Number(id) } });
//     res.status(204).end();
//   } catch (error) {
//     next(error);
//   }
// };
