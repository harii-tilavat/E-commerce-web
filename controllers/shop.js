const Product = require('../models/mongo/product');
const Order = require('../models/sql/order');
const UserService = require('../services/user.service');

exports.getProducts = async (req, res, next) => {
  const products = await Product.find();
  res.render('shop/product-list', {
    prods: products,
    pageTitle: 'All Products',
    path: '/products',
  });
};

exports.getProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);
  res.render('shop/product-detail', {
    product: product,
    pageTitle: product.title,
    path: '/products',
  });
};

exports.getIndex = async (req, res, next) => {
  const products = await Product.find();
  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
  });
};

exports.getCart = async (req, res, next) => {
  const cartProducts = await UserService.getCartItems(req.user.id);
  // res.json({ cartProducts });
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    products: cartProducts,
  });
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const userId = req.user.id;

  await UserService.addProductToCart(prodId, userId);
  res.redirect('/cart');
};

exports.postCartIncrement = async (req, res, next) => {
  const prodId = req.body.productId;
  const userId = req.user.id;

  await UserService.incrementCartItem(prodId, userId);
  res.redirect('/cart');
};

exports.postCartDecrement = async (req, res, next) => {
  const prodId = req.body.productId;
  const userId = req.user.id;

  await UserService.decrementCartItem(prodId, userId);
  res.redirect('/cart');
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const userId = req.user.id;
  await UserService.removeItemFromCart(prodId, userId);
  res.redirect('/cart');
};

exports.getOrders = async (req, res, next) => {
  const orders = await UserService.getOrders(req.user.id);
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders: orders,
  });
};

exports.postOrder = async (req, res, next) => {
  await UserService.createNewOrder(req.user.id);
  await UserService.clearCart(req.user.id);
  res.redirect('/orders');
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};
