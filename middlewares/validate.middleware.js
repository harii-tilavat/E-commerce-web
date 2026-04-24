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
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.issues?.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }
};

module.exports = validate;
