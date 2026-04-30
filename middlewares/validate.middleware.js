import ApiError from '../utils/api-error.js';
import { StatusCode } from '../utils/api-response.js';

const validate = (schemas) => (req, res, next) => {
  try {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }
    if (schemas.params) {
      req.params = schemas.params.parse(req.params);
    }
    if (schemas.query) {
      req.query = schemas.query.parse(req.query);
    }
    next();
  } catch (err) {
    const errors =
      err.issues?.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })) || [];
    next(new ApiError(StatusCode.BAD_REQUEST, 'Validation failed', errors));
  }
};

export default validate;
