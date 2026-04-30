const Product = require('../models/mongo/product');
const { ApiResponse, StatusCode } = require('../utils/api-response');
const ApiError = require('../utils/api-error');
const ProductService = require('../services/product.service');

class AdminController {
  constructor() {
    this.productService = new ProductService();
  }
  getProducts = async (req, res) => {
    const response = await this.productService.getUsersProducts(req.user.id, req.query);
    return ApiResponse.ok(res, 'Products fetched', response);
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
    await this.productService.deleteProduct(req.params.id, req.user.id);
    // TODO: Remove image if it's deleted
    return ApiResponse.noContent(res);
  };
}

module.exports = AdminController;
