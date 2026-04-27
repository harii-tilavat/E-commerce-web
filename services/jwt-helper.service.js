const jwt = require('jsonwebtoken');
const ApiError = require('../utils/api-error');
const { StatusCode } = require('../utils/api-response');

class JwtHelperService {
  constructor() {}

  static generateToken(payload, expiresIn = '1d') {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw new ApiError(StatusCode.UNAUTHORIZED, 'Invalid or expired token');
    }
  }
}

module.exports = JwtHelperService;
