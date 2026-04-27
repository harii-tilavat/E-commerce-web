const express = require('express');

const requireAuth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const asyncHandler = require('../middlewares/async-handler');
const { productIdParamId } = require('../validations/product.validation');
const { addToCartSchema, cartProductIdParam, updateCartSchema } = require('../validations/cart.validation');
const ShopController = require('../controllers/shop');

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

router.post('/orders', requireAuth, asyncHandler(shopController.createOrder));

module.exports = router;
