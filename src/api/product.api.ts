import { Router } from 'express';
import multer from 'multer';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';

import authMiddleware from '../middleware/auth.middleware.js';
// import roleMiddleware from '../middleware/role.middleware.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post(
  '/',
  authMiddleware,
  // roleMiddleware(['SELLER']),
  upload.array('images', 10),
  createProduct,
);
router.put(
  '/:id',
  authMiddleware,
  // roleMiddleware(['SELLER']),
  upload.array('images', 10),
  updateProduct,
);
router.delete(
  '/:id',
  authMiddleware,
  // roleMiddleware(['SELLER']),
  deleteProduct,
);

export default router;
