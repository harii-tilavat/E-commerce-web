import crypto from 'crypto';
import ApiError from '../utils/api-error.js';
import { StatusCode } from '../utils/api-response.js';

class CommanService {
  constructor() {}

  static generateRandomToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  static getPagination(query: { limit?: unknown; offset?: unknown } = {}, maxLimit = 50) {
    const limit = Number(query.limit) || maxLimit;
    const offset = Number(query.offset) || 0;
    if (limit > maxLimit) {
      throw new ApiError(StatusCode.BAD_REQUEST, `Limit should >= 1 and <= ${maxLimit}`);
    }
    return { limit, offset };
  }
}

export default CommanService;
