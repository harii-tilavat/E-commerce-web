const crypto = require('crypto');

class CommanService {
  constructor() {}

  static generateRandomToken() {
    return crypto.randomBytes(32).toString('hex');
  }
}

module.exports = CommanService;
