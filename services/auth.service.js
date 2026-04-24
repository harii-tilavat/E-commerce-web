const bcrypt = require('bcryptjs');
const User = require('../models/mongo/user');

class AuthService {
  constructor() {}

  static async signup(name, email, password) {
    const existing = await User.findOne({ email });
    if (existing) {
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hashedPassword });
  }

  static async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user.toObject();
  }
}

module.exports = AuthService;
