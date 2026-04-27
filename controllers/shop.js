const Product = require('../models/mongo/product');
const UserService = require('../services/user.service');
const asyncHandler = require('../middlewares/async-handler');
const { ApiResponse, StatusCode } = require('../utils/api-response');
const ApiError = require('../utils/api-error');

exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  return ApiResponse.ok(res, 'Products fetched', { products });
});

exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(StatusCode.NOT_FOUND, 'Product not found');
  return ApiResponse.ok(res, 'Product fetched', { product });
});

exports.getCart = asyncHandler(async (req, res) => {
  const items = await UserService.getCartItems(req.user.id);
  return ApiResponse.ok(res, 'Cart fetched', { items });
});

exports.addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const item = await UserService.addProductToCart(productId, req.user.id);
  return ApiResponse.created(res, 'Added to cart', { item });
});

exports.updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { action } = req.body;
  if (action === 'inc') {
    await UserService.incrementCartItem(productId, req.user.id);
  } else {
    await UserService.decrementCartItem(productId, req.user.id);
  }
  return ApiResponse.ok(res, 'Cart item updated');
});

exports.removeCartItem = asyncHandler(async (req, res) => {
  await UserService.removeItemFromCart(req.params.productId, req.user.id);
  return ApiResponse.ok(res, 'Removed from cart');
});

exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await UserService.getOrders(req.user.id);
  return ApiResponse.ok(res, 'Orders fetched', { orders });
});

exports.createOrder = asyncHandler(async (req, res) => {
  const order = await UserService.createNewOrder(req.user.id);
  return ApiResponse.created(res, 'Order placed', { order });
});
