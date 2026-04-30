import Product from '../models/mongo/product.js';
import UserService from '../services/user.service.js';
import { ApiResponse, StatusCode } from '../utils/api-response.js';
import ApiError from '../utils/api-error.js';
import ProductService from '../services/product.service.js';

class ShopController {
  constructor() {
    this.userService = new UserService();
    this.productService = new ProductService();
  }

  getProducts = async (req, res) => {
    const response = await this.productService.getAllProducts(req.query);
    return ApiResponse.ok(res, response);
  };

  getProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(StatusCode.NOT_FOUND, 'Product not found');
    return ApiResponse.ok(res, 'Product fetched', { product });
  };

  getCart = async (req, res) => {
    const items = await this.userService.getCartItems(req.user.id);
    return ApiResponse.ok(res, 'Cart fetched', { items });
  };

  addToCart = async (req, res) => {
    const { productId } = req.body;
    const item = await this.userService.addProductToCart(productId, req.user.id);
    return ApiResponse.created(res, 'Added to cart', { item });
  };

  updateCartItem = async (req, res) => {
    const { productId } = req.params;
    const { action } = req.body;
    if (action === 'inc') {
      await this.userService.incrementCartItem(productId, req.user.id);
    } else {
      await this.userService.decrementCartItem(productId, req.user.id);
    }
    return ApiResponse.ok(res, 'Cart item updated');
  };

  removeCartItem = async (req, res) => {
    await this.userService.removeItemFromCart(req.params.productId, req.user.id);
    return ApiResponse.ok(res, 'Removed from cart');
  };

  getOrders = async (req, res) => {
    const orders = await this.userService.getOrders(req.user.id);
    return ApiResponse.ok(res, 'Orders fetched', { orders });
  };

  getInvoice = async (req, res) => {
    const { doc, fileName } = await this.userService.getInvoice(req.params.id, req.user?.id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    doc.pipe(res);
    return doc.end();
  };

  createOrder = async (req, res) => {
    const order = await this.userService.createNewOrder(req.user.id);
    return ApiResponse.created(res, 'Order placed', { order });
  };
}

export default ShopController;
