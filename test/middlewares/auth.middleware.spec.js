const { expect } = require('chai');
const { StatusCode } = require('../../utils/api-response');
const JwtHelperService = require('../../services/jwt-helper.service');
const requireAuth = require('../../middlewares/auth.middleware');

describe('Auth middleware', () => {
  it('should throw an error if no autorization header is present', () => {
    const req = {
      headers: {},
    };
    requireAuth(req, {}, (err) => {
      expect(err.message).to.equals('Missing or invalid Authorization header');
      expect(err.statusCode).to.equals(StatusCode.UNAUTHORIZED);
    });
  });

  it('should throw an error if authorization token is invalid', () => {
    const req = {
      headers: {
        authorization: 'Bearer invalid-token',
      },
    };
    requireAuth(req, {}, (err) => {
      expect(err.message).to.equals('jwt malformed');
      expect(err.statusCode).to.equals(StatusCode.UNAUTHORIZED);
    });
  });

  it('should not throw an error if token is valid and set user in request', () => {
    const payload = { id: '123', email: 'john@gmail.com' };
    const token = JwtHelperService.generateToken(payload);
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    requireAuth(req, {}, (err) => {
      expect(err).to.equals(undefined);
    });
    expect(req.user.id).to.equals(payload.id);
    expect(req.user.email).to.equals(payload.email);
  });
});
