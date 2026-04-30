import type { Request, Response } from 'express';
import Product from '../models/mongo/product.js';
import { ApiResponse, StatusCode } from '../utils/api-response.js';
import ApiError from '../utils/api-error.js';
import ProductService from '../services/product.service.js';

class AdminController {
  productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  getProducts = async (req: Request, res: Response) => {
    const response = await this.productService.getUsersProducts(req.user!.id, req.query);
    return ApiResponse.ok(res, 'Products fetched', response);
  };

  createProduct = async (req: Request, res: Response) => {
    const product = await this.productService.createNewProduct(req.body, req.file, req.user!.id);
    return ApiResponse.created(res, 'Product created', { product });
  };

  // TODO: Move db call in services
  updateProduct = async (req: Request, res: Response) => {
    const product = await Product.findOneAndUpdate({ _id: String(req.params.id), userId: req.user!.id }, req.body, {
      new: true,
    });
    if (!product) throw new ApiError(StatusCode.NOT_FOUND, 'Product not found');
    return ApiResponse.ok(res, 'Product updated', { product });
  };

  deleteProduct = async (req: Request, res: Response) => {
    const result = await Product.deleteOne({ _id: String(req.params.id), userId: req.user!.id });
    if (result.deletedCount === 0) throw new ApiError(StatusCode.NOT_FOUND, 'Product not found');
    // TODO: Remove image if it's deleted
    return ApiResponse.noContent(res);
  };
}

export default AdminController;
