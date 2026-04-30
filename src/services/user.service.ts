import CartItem from '../models/mongo/cart-item.js';
import Order from '../models/mongo/order.js';
import Product from '../models/mongo/product.js';
import ApiError from '../utils/api-error.js';
import { StatusCode } from '../utils/api-response.js';
import { generateInvoicePdf } from '../utils/invoice-pdf.js';
import CommanService from './comman.service.js';

type PaginationQuery = { limit?: unknown; offset?: unknown };

class UserService {
  constructor() {}

  async addProductToCart(productId: string, userId: string) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(StatusCode.NOT_FOUND, 'Product not found');
    }
    const existingCartItem = await CartItem.findOne({ userId, productId });
    if (existingCartItem) {
      existingCartItem.quantity += 1;
      await existingCartItem.save();
      return existingCartItem;
    }
    return CartItem.create({ userId, quantity: 1, productId });
  }

  async getCartItems(userId: string) {
    return CartItem.find({ userId }).populate('productId');
  }

  async incrementCartItem(productId: string, userId: string) {
    const result = await CartItem.updateOne({ productId, userId }, { $inc: { quantity: 1 } });
    if (result.matchedCount === 0) throw new ApiError(StatusCode.NOT_FOUND, 'Cart item not found');
  }

  async decrementCartItem(productId: string, userId: string) {
    const item = await CartItem.findOne({ productId, userId });
    if (!item) throw new ApiError(StatusCode.NOT_FOUND, 'Cart item not found');
    if (item.quantity <= 1) {
      await CartItem.deleteOne({ _id: item._id });
      return;
    }
    item.quantity -= 1;
    await item.save();
  }

  async removeItemFromCart(productId: string, userId: string) {
    const result = await CartItem.deleteOne({ productId, userId });
    if (result.deletedCount === 0) throw new ApiError(StatusCode.NOT_FOUND, 'Cart item not found');
  }

  async clearCart(userId: string) {
    await CartItem.deleteMany({ userId });
  }

  async getOrders(userId: string, options: PaginationQuery) {
    const { limit, offset } = CommanService.getPagination(options);

    const [orders, total_count] = await Promise.all([
      Order.find({ userId }).limit(limit).skip(offset).populate('items.productId'),
      Order.find({ userId }).countDocuments(),
    ]);
    const updatedOrders = orders.map((order) => {
      const obj = order.toObject({ virtuals: true });
      return {
        ...obj,
        products: order.items.map((i) => ({
          quantity: i.quantity,
          product: i.productId,
        })),
      };
    });
    return {
      limit,
      offset,
      total_count,
      orders: updatedOrders,
    };
  }

  async createNewOrder(userId: string) {
    const cartItems = await CartItem.find({ userId }).lean();
    if (!cartItems.length) throw new ApiError(StatusCode.BAD_REQUEST, 'Cart is empty');
    const order = await Order.create({
      userId,
      items: cartItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    });
    await CartItem.deleteMany({ userId });
    return order;
  }

  async getInvoice(orderId: string, userId?: string) {
    const order = await Order.findById(orderId).populate('items.productId').populate('userId', 'name email');
    if (!order) {
      throw new ApiError(StatusCode.NOT_FOUND, 'Order not found');
    }
    if (userId && !(order.userId as { _id: { equals: (id: string) => boolean } })._id.equals(userId)) {
      throw new ApiError(StatusCode.FORBIDDEN, 'Not authorized to access this invoice');
    }

    return generateInvoicePdf(order as never);
  }
}

export default UserService;
