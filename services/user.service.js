const CartItem = require('../models/mongo/cart-item');
const Order = require('../models/mongo/order');

class UserService {
  constructor() {}

  static async addProductToCart(productId, userId) {
    const existingCartItem = await CartItem.findOne({ userId, productId });
    if (existingCartItem) {
      existingCartItem.quantity += 1;
      await existingCartItem.save();
    } else {
      const newCartItem = new CartItem({ userId, quantity: 1, productId });
      await newCartItem.save();
    }
  }

  static async getCartItems(userId) {
    const cartItems = await CartItem.find({ userId }).populate('productId');
    return cartItems;
  }

  static async incrementCartItem(productId, userId) {
    await CartItem.updateOne({ productId, userId }, { $inc: { quantity: 1 } });
  }

  static async decrementCartItem(productId, userId) {
    await CartItem.updateOne({ productId, userId }, { $inc: { quantity: -1 } });
  }

  static async removeItemFromCart(productId, userId) {
    await CartItem.deleteOne({ productId, userId });
  }

  static async clearCart(userId) {
    await CartItem.deleteMany({ userId });
  }

  // Orders
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
    if (!cartItems.length) return;
    await Order.create({
      userId,
      items: cartItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    });
  }
}

module.exports = UserService;
