import jwt, { type SignOptions } from 'jsonwebtoken';
import ApiError from '../utils/api-error.js';
import { StatusCode } from '../utils/api-response.js';

type TokenPayload = { id: string; email: string };

class JwtHelperService {
  constructor() {}

  static generateToken(payload: TokenPayload, expiresIn: SignOptions['expiresIn'] = '1d') {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn });
  }

  static verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    } catch (err) {
      throw new ApiError(StatusCode.UNAUTHORIZED, (err as Error)?.message);
    }
  }
}

export default JwtHelperService;
