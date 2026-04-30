import type { Request, Response, NextFunction } from 'express';
import JwtHelperService from '../services/jwt-helper.service.js';
import ApiError from '../utils/api-error.js';
import { StatusCode } from '../utils/api-response.js';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
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

export default requireAuth;
