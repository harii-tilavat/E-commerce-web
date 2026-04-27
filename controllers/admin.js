const Product = require('../models/mongo/product');
const { ApiResponse, StatusCode } = require('../utils/api-response');
const ApiError = require('../utils/api-error');
const ProductService = require('../services/product.service');

class AdminController {
  constructor() {
    this.productService = new ProductService();
  }
  getProducts = async (req, res) => {
    const products = await Product.find({ userId: req.user.id });
    return ApiResponse.ok(res, 'Products fetched', { products });
  };

  createProduct = async (req, res) => {
    const product = await this.productService.createNewProduct(req.body, req.file, req.user.id);
    return ApiResponse.created(res, 'Product created', { product });
  };

  // TODO: Move db call in services
  updateProduct = async (req, res) => {
    const product = await Product.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, {
      new: true,
    });
    if (!product) throw new ApiError(StatusCode.NOT_FOUND, 'Product not found');
    return ApiResponse.ok(res, 'Product updated', { product });
  };

  deleteProduct = async (req, res) => {
    const result = await Product.deleteOne({ _id: req.params.id, userId: req.user.id });
    if (result.deletedCount === 0) throw new ApiError(StatusCode.NOT_FOUND, 'Product not found');
    return ApiResponse.noContent(res);
  };
}

module.exports = AdminController;
