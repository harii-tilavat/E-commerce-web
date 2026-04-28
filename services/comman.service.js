const crypto = require('crypto');
const ApiError = require('../utils/api-error');
const { StatusCode } = require('../utils/api-response');

class CommanService {
  constructor() {}

  static generateRandomToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  static getPagination(query = {}, maxLimit = 50) {
    const limit = Number(query.limit) || maxLimit;
    const offset = Number(query.offset) || 0;
    if (limit > maxLimit) {
      throw new ApiError(StatusCode.BAD_REQUEST, `Limit should >= 1 and <= ${maxLimit}`);
    }
    return { limit, offset };
  }
}

module.exports = CommanService;
