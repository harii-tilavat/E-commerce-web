const { expect } = require('chai');
const sinon = require('sinon');

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

  it('should not throw an error if token is valid using sinon stub', () => {
    const payload = { id: '123', email: 'john@gmail.com' };
    const token = 'valid-token';
    const stub = sinon.stub(JwtHelperService, 'verifyToken').returns(payload);
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
    expect(JwtHelperService.verifyToken.called).to.be.true;

    // Restore the stub after each test
    stub.restore();
  });

  it('should not throw an error if token is valid and set user in request', () => {
    const payload = { id: '123', email: 'john2@email.com' };
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
