const { ObjectId } = require('mongodb');
const CartItem = require('../models/cart-item');

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
}

module.exports = UserService;
