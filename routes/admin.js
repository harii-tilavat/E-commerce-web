import express from 'express';

import requireAuth from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import asyncHandler from '../middlewares/async-handler.js';
import { createProductSchema, updateProductSchema, productIdParamId } from '../validations/product.validation.js';
import AdminController from '../controllers/admin.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

const adminController = new AdminController();

router.use(requireAuth);

router.get('/products', asyncHandler(adminController.getProducts));

router.post(
  '/products',
  validate({ body: createProductSchema }),
  upload.single('file'),
  asyncHandler(adminController.createProduct),
);

router.patch(
  '/products/:id',
  validate({ params: productIdParamId, body: updateProductSchema }),
  upload.single('file'),
  asyncHandler(adminController.updateProduct),
);

router.delete('/products/:id', validate({ params: productIdParamId }), asyncHandler(adminController.deleteProduct));

export default router;
