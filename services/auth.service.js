const bcrypt = require('bcryptjs');
const User = require('../models/mongo/user');
const CommanService = require('./comman.service');

class AuthService {
  constructor() {}

  static async signupUser(name, email, password) {
    const existing = await User.findOne({ email });
    if (existing) {
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hashedPassword });
  }

  static async loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    const updatedUser = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
    return updatedUser;
  }

  static async resetPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    const token = CommanService.generateRandomToken();
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour expiration
    await user.save();
    console.log('RESET LINK : ', `http://localhost:3000/reset-password/${token}`);
  }

  static async getResetUser(token) {
    return User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
  }

  static async updatePassword(userId, token, newPassword) {
    const user = await User.findOne({
      _id: userId,
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      throw new Error('Reset link is invalid or has expired.');
    }
    user.password = await bcrypt.hash(newPassword, 12);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
  }
}

module.exports = AuthService;
