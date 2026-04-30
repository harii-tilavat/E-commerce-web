import type { Response } from 'express';

const StatusCode = Object.freeze({
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,

  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
});

class ApiResponse {
  static send(res: Response, statusCode: number, message: string, data: unknown = null) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data: data ?? undefined,
    });
  }

  static ok(res: Response, message = 'Success', data: unknown = null) {
    return this.send(res, StatusCode.OK, message, data);
  }

  static created(res: Response, message = 'Created', data: unknown = null) {
    return this.send(res, StatusCode.CREATED, message, data);
  }

  static noContent(res: Response) {
    return res.status(StatusCode.NO_CONTENT).end();
  }
}

export { ApiResponse, StatusCode };
