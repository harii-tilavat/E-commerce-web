const { ObjectId } = require('mongodb');
const CartItem = require('../models/cart-item');
const Order = require('../models/order');
const OrderItem = require('../models/order-item');

class UserService {
  constructor() {}

  static async addProductToCart(productId, userId) {
    const existingCartItem = await CartItem.findOne({ userId: userId, productId: productId });
    if (existingCartItem) {
      existingCartItem.quantity += 1;
      await existingCartItem.save();
    } else {
      const newCartItem = new CartItem({ userId: userId, quantity: 1, productId: productId });
      await newCartItem.save();
    }
  }

  static async getCartItems(userId) {
    const cartItems = await CartItem.find({ userId: userId }).populate('productId');
    return cartItems;
  }

  static async incrementCartItem(productId, userId) {
    await CartItem.updateOne({ productId: productId, userId: userId }, { $inc: { quantity: 1 } });
  }

  static async decrementCartItem(productId, userId) {
    await CartItem.updateOne({ productId: productId, userId: userId }, { $inc: { quantity: -1 } });
  }

  static async removeItemFromCart(productId, userId) {
    await CartItem.deleteOne({ productId: productId, userId: userId });
  }

  static async clearCart(userId) {
    await CartItem.deleteMany({ userId: userId });
  }

  // Orders
  static async getOrders(userId) {
    const orders = await Order.findAll({ where: { userId: userId } });
    return orders;
  }

  static async createNewOrder(userId) {
    const cartItems = await CartItem.find({ userId: userId }).lean();
    if (cartItems.length) {
      const order = await Order.create({ userId: userId });
      const orderId = order.id;
      const orderItems = cartItems.map((item) => {
        return {
          orderId: orderId,
          productId: item.productId.toString(),
          quantity: item.quantity,
        };
      });
      await OrderItem.bulkCreate(orderItems);
    }
  }
}

module.exports = UserService;
