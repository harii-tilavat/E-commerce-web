const express = require('express');

const shopController = require('../controllers/shop');
const requireLogin = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', requireLogin, shopController.getCart);

router.post('/cart', requireLogin, shopController.postCart);

router.post('/cart/increment', requireLogin, shopController.postCartIncrement);

router.post('/cart/decrement', requireLogin, shopController.postCartDecrement);

router.post('/cart-delete-item', requireLogin, shopController.postCartDeleteProduct);

router.get('/orders', requireLogin, shopController.getOrders);

router.post('/create-order', requireLogin, shopController.postOrder);

// router.get('/checkout', shopController.getCheckout);

module.exports = router;
