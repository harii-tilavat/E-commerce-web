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
  static send(res, statusCode, message, data = null) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data: data ?? undefined,
    });
  }

  static ok(res, message = 'Success', data = null) {
    return this.send(res, StatusCode.OK, message, data);
  }

  static created(res, message = 'Created', data = null) {
    return this.send(res, StatusCode.CREATED, message, data);
  }

  static noContent(res) {
    return res.status(StatusCode.NO_CONTENT).end();
  }
}

export { ApiResponse, StatusCode };
