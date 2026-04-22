const Product = require('../models/product');
const Order = require('../models/order');
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
  // const userInfo = await req.user.populate('cart.items.productId');
  // const cartProducts = userInfo.cart.items;
  const cartProducts = [];
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

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  await req.user.removeFromCart(prodId);
  res.redirect('/cart');
};

exports.getOrders = async (req, res, next) => {
  const orders = await Order.find({ 'user.userId': req.user._id });
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders: orders,
  });
};

exports.postOrder = async (req, res, next) => {
  const userInfo = await req.user.populate('cart.items.productId');
  const cartProducts = userInfo.cart.items;
  const products = cartProducts.map((i) => {
    return { product: { ...i.productId }, quantity: i.quantity };
  });
  const order = new Order({
    user: {
      userId: req.user._id,
      name: req.user.name,
    },
    products: products,
  });

  await order.save();
  await req.user.clearCart();
  res.redirect('/orders');
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};
