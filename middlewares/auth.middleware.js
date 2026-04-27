const JwtHelperService = require('../services/jwt-helper.service');
const ApiError = require('../utils/api-error');
const { StatusCode } = require('../utils/api-response');

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new ApiError(StatusCode.UNAUTHORIZED, 'Missing or invalid Authorization header'));
  }
  try {
    const decoded = JwtHelperService.verifyToken(header.slice(7));
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = requireAuth;
