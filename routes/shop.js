import express from 'express';

import requireAuth from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import asyncHandler from '../middlewares/async-handler.js';
import { productIdParamId } from '../validations/product.validation.js';
import { addToCartSchema, cartProductIdParam, updateCartSchema } from '../validations/cart.validation.js';
import ShopController from '../controllers/shop.js';

const router = express.Router();

const shopController = new ShopController();

router.get('/products', asyncHandler(shopController.getProducts));

router.get('/products/:id', validate({ params: productIdParamId }), asyncHandler(shopController.getProduct));

router.get('/cart', requireAuth, asyncHandler(shopController.getCart));

router.post('/cart', requireAuth, validate({ body: addToCartSchema }), asyncHandler(shopController.addToCart));

router.patch(
  '/cart/:productId',
  requireAuth,
  validate({ params: cartProductIdParam, body: updateCartSchema }),
  asyncHandler(shopController.updateCartItem),
);

router.delete(
  '/cart/:productId',
  requireAuth,
  validate({ params: cartProductIdParam }),
  asyncHandler(shopController.removeCartItem),
);

router.get('/orders', requireAuth, asyncHandler(shopController.getOrders));

router.get('/orders/:id/invoice', requireAuth, asyncHandler(shopController.getInvoice));

router.post('/orders', requireAuth, asyncHandler(shopController.createOrder));

export default router;
