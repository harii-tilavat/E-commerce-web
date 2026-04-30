import type { ErrorRequestHandler } from 'express';
import ApiError from '../utils/api-error.js';
import { StatusCode } from '../utils/api-response.js';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let error: ApiError = err;

  if (err?.name === 'CastError') {
    error = new ApiError(StatusCode.BAD_REQUEST, `Invalid ${err.path}: ${err.value}`);
  } else if (err?.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = new ApiError(StatusCode.CONFLICT, `${field} already exists`);
  } else if (!(error instanceof ApiError)) {
    const statusCode = err.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
    error = new ApiError(statusCode, err.message || 'Internal server error', err.errors || []);
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error('[ERROR]', err);
  }

  res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
  });
};

export default errorHandler;
