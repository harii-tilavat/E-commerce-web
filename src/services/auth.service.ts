import bcrypt from 'bcryptjs';
import User from '../models/mongo/user.js';
import CommanService from './comman.service.js';
import JwtHelperService from './jwt-helper.service.js';
import ApiError from '../utils/api-error.js';
import { StatusCode } from '../utils/api-response.js';

class AuthService {
  constructor() {}

  async signupUser(name: string, email: string, password: string) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw new ApiError(StatusCode.CONFLICT, 'Email already registered');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  }

  async loginUser(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(StatusCode.UNAUTHORIZED, 'Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(StatusCode.UNAUTHORIZED, 'Invalid email or password');
    }
    const token = JwtHelperService.generateToken({
      id: user._id.toString(),
      email: user.email,
    });
    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  async resetPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(StatusCode.NOT_FOUND, 'User not found');
    }
    const token = CommanService.generateRandomToken();
    user.resetToken = token;
    user.resetTokenExpiration = new Date(Date.now() + 3600000);
    await user.save();
    console.log('RESET TOKEN : ', token);
    return { resetToken: token };
  }

  async getResetUser(token: string) {
    return User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
  }

  async updatePassword(userId: string, token: string, newPassword: string) {
    const user = await User.findOne({
      _id: userId,
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      throw new ApiError(StatusCode.BAD_REQUEST, 'Reset link is invalid or has expired.');
    }
    user.password = await bcrypt.hash(newPassword, 12);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
  }
}

export default AuthService;
