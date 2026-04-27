const Product = require('../models/mongo/product');
const asyncHandler = require('../middlewares/async-handler');
const { ApiResponse, StatusCode } = require('../utils/api-response');
const ApiError = require('../utils/api-error');

exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ userId: req.user.id });
  return ApiResponse.ok(res, 'Products fetched', { products });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const { title, price, imageUrl, description } = req.body;
  const product = await Product.create({
    title,
    price,
    imageUrl,
    description,
    userId: req.user.id,
  });
  return ApiResponse.created(res, 'Product created', { product });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true },
  );
  if (!product) throw new ApiError(StatusCode.NOT_FOUND, 'Product not found');
  return ApiResponse.ok(res, 'Product updated', { product });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const result = await Product.deleteOne({ _id: req.params.id, userId: req.user.id });
  if (result.deletedCount === 0) throw new ApiError(StatusCode.NOT_FOUND, 'Product not found');
  return ApiResponse.ok(res, 'Product deleted');
});
