const bcrypt = require('bcryptjs');
const User = require('../models/sql/user');

class AuthService {
  constructor() {}

  static async signup(name, email, password) {
    try {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.redirect('/signup');
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      await User.create({ name, email, password: hashedPassword });
    } catch (error) {
      throw error;
    }
  }

  static async login(email, password) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return null;
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }
      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
