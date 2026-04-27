const CartItem = require('../models/mongo/cart-item');
const Order = require('../models/mongo/order');
const ApiError = require('../utils/api-error');
const { StatusCode } = require('../utils/api-response');

class UserService {
  constructor() {}

  static async addProductToCart(productId, userId) {
    const existingCartItem = await CartItem.findOne({ userId, productId });
    if (existingCartItem) {
      existingCartItem.quantity += 1;
      await existingCartItem.save();
      return existingCartItem;
    }
    return CartItem.create({ userId, quantity: 1, productId });
  }

  static async getCartItems(userId) {
    return CartItem.find({ userId }).populate('productId');
  }

  static async incrementCartItem(productId, userId) {
    const result = await CartItem.updateOne({ productId, userId }, { $inc: { quantity: 1 } });
    if (result.matchedCount === 0) throw new ApiError(StatusCode.NOT_FOUND, 'Cart item not found');
  }

  static async decrementCartItem(productId, userId) {
    const item = await CartItem.findOne({ productId, userId });
    if (!item) throw new ApiError(StatusCode.NOT_FOUND, 'Cart item not found');
    if (item.quantity <= 1) {
      await CartItem.deleteOne({ _id: item._id });
      return;
    }
    item.quantity -= 1;
    await item.save();
  }

  static async removeItemFromCart(productId, userId) {
    const result = await CartItem.deleteOne({ productId, userId });
    if (result.deletedCount === 0) throw new ApiError(StatusCode.NOT_FOUND, 'Cart item not found');
  }

  static async clearCart(userId) {
    await CartItem.deleteMany({ userId });
  }

  static async getOrders(userId) {
    const orders = await Order.find({ userId }).populate('items.productId');
    return orders.map((order) => {
      const obj = order.toObject({ virtuals: true });
      return {
        ...obj,
        products: order.items.map((i) => ({
          quantity: i.quantity,
          product: i.productId,
        })),
      };
    });
  }

  static async createNewOrder(userId) {
    const cartItems = await CartItem.find({ userId }).lean();
    if (!cartItems.length) throw new ApiError(StatusCode.BAD_REQUEST, 'Cart is empty');
    const order = await Order.create({
      userId,
      items: cartItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    });
    await CartItem.deleteMany({ userId });
    return order;
  }
}

module.exports = UserService;
