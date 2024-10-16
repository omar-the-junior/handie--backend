import { Router } from 'express';
// import multer from 'multer';
import {
  getProducts,
  getProductById,
  // createProduct,
  // updateProduct,
  // deleteProduct,
} from '../controllers/product.controller.js';

// import authMiddleware, {
//   authorizeRoles,
// } from '../middleware/auth.middleware.js';

import { type Tspec } from 'tspec';
import validate from '../middleware/validation.middleware.js';
import {
  getProductByIdSchema,
  getProductsSchema,
} from '../schemas/productSchemas.js';

export type ProductSpec = Tspec.DefineApiSpec<{
  basePath: '/api/products';
  tags: ['Products'];
  paths: {
    '/': {
      get: {
        summary: 'Get Products';
        description: 'Retrieve a list of all products';
        handler: typeof getProducts;
      };
      // post: {
      //   summary: 'Create Product';
      //   description: 'Create a new product';
      //   handler: typeof createProduct;
      //   security: 'jwt';
      // };
    };
    '/{id}': {
      get: {
        summary: 'Get Product by ID';
        description: 'Retrieve a product by its ID';
        handler: typeof getProductById;
      };
      // put: {
      //   summary: 'Update Product';
      //   description: 'Update an existing product';
      //   handler: typeof updateProduct;
      //   security: 'jwt';
      // };
      // delete: {
      //   summary: 'Delete Product';
      //   description: 'Delete a product by its ID';
      //   handler: typeof deleteProduct;
      //   security: 'jwt';
      // };
    };
  };
}>;

const router = Router();
// const upload = multer({ dest: 'uploads/' });

router.get('/', validate(getProductsSchema), getProducts);
router.get('/:id', validate(getProductByIdSchema), getProductById);
// router.post(
//   '/',
//   authMiddleware,
//   authorizeRoles('SELLER'),
//   upload.array('images', 10),
//   createProduct,
// );
// router.put(
//   '/:id',
//   authMiddleware,
//   authorizeRoles('SELLER'),
//   upload.array('images', 10),
//   updateProduct,
// );
// router.delete('/:id', authMiddleware, authorizeRoles('SELLER'), deleteProduct);

export default router;
