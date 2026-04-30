import 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import type { Request, Response } from 'express';

import { StatusCode } from '../../src/utils/api-response.js';
import JwtHelperService from '../../src/services/jwt-helper.service.js';
import requireAuth from '../../src/middlewares/auth.middleware.js';

type FakeReq = Partial<Request> & { user?: { id: string; email: string } };

describe('Auth middleware', () => {
  it('should throw an error if no autorization header is present', () => {
    const req: FakeReq = {
      headers: {},
    };
    requireAuth(req as Request, {} as Response, (err: any) => {
      expect(err.message).to.equals('Missing or invalid Authorization header');
      expect(err.statusCode).to.equals(StatusCode.UNAUTHORIZED);
    });
  });

  it('should throw an error if authorization token is invalid', () => {
    const req: FakeReq = {
      headers: {
        authorization: 'Bearer invalid-token',
      },
    };
    requireAuth(req as Request, {} as Response, (err: any) => {
      expect(err.message).to.equals('jwt malformed');
      expect(err.statusCode).to.equals(StatusCode.UNAUTHORIZED);
    });
  });

  it('should not throw an error if token is valid using sinon stub', () => {
    const payload = { id: '123', email: 'john@gmail.com' };
    const token = 'valid-token';
    const stub = sinon.stub(JwtHelperService, 'verifyToken').returns(payload);
    const req: FakeReq = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    requireAuth(req as Request, {} as Response, (err: any) => {
      expect(err).to.equals(undefined);
    });
    expect(req.user!.id).to.equals(payload.id);
    expect(req.user!.email).to.equals(payload.email);
    expect(stub.called).to.be.true;

    // Restore the stub after each test
    stub.restore();
  });

  it('should not throw an error if token is valid and set user in request', () => {
    const payload = { id: '123', email: 'john2@email.com' };
    const token = JwtHelperService.generateToken(payload);
    const req: FakeReq = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    requireAuth(req as Request, {} as Response, (err: any) => {
      expect(err).to.equals(undefined);
    });
    expect(req.user!.id).to.equals(payload.id);
    expect(req.user!.email).to.equals(payload.email);
  });
});
