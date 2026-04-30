import jwt from 'jsonwebtoken';
import ApiError from '../utils/api-error.js';
import { StatusCode } from '../utils/api-response.js';

class JwtHelperService {
  constructor() {}

  static generateToken(payload, expiresIn = '1d') {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new ApiError(StatusCode.UNAUTHORIZED, err?.message);
    }
  }
}

export default JwtHelperService;
