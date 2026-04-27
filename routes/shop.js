const express = require('express');

const shopController = require('../controllers/shop');
const requireAuth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { productIdParamId } = require('../validations/product.validation');
const { addToCartSchema, cartProductIdParam, updateCartSchema } = require('../validations/cart.validation');

const router = express.Router();

router.get('/products', shopController.getProducts);

router.get('/products/:id', validate({ params: productIdParamId }), shopController.getProduct);

router.get('/cart', requireAuth, shopController.getCart);

router.post('/cart', requireAuth, validate({ body: addToCartSchema }), shopController.addToCart);

router.patch(
  '/cart/:productId',
  requireAuth,
  validate({ params: cartProductIdParam, body: updateCartSchema }),
  shopController.updateCartItem,
);

router.delete('/cart/:productId', requireAuth, validate({ params: cartProductIdParam }), shopController.removeCartItem);

router.get('/orders', requireAuth, shopController.getOrders);

router.post('/orders', requireAuth, shopController.createOrder);

module.exports = router;
