import type { Request, Response, NextFunction } from 'express';
import type { ZodTypeAny, ZodError } from 'zod';
import ApiError from '../utils/api-error.js';
import { StatusCode } from '../utils/api-response.js';

type Schemas = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

const validate = (schemas: Schemas) => (req: Request, res: Response, next: NextFunction) => {
  try {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }
    if (schemas.params) {
      Object.assign(req.params, schemas.params.parse(req.params));
    }
    if (schemas.query) {
      Object.assign(req.query, schemas.query.parse(req.query));
    }
    next();
  } catch (err) {
    const zErr = err as ZodError;
    const errors =
      zErr.issues?.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })) || [];
    next(new ApiError(StatusCode.BAD_REQUEST, 'Validation failed', errors));
  }
};

export default validate;
