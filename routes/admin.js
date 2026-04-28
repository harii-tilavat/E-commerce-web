const express = require('express');

const requireAuth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const asyncHandler = require('../middlewares/async-handler');
const { createProductSchema, updateProductSchema, productIdParamId } = require('../validations/product.validation');
const AdminController = require('../controllers/admin');
const upload = require('../middlewares/upload');

const router = express.Router();

const adminController = new AdminController();

router.use(requireAuth);

router.get('/products', asyncHandler(adminController.getProducts));

router.post(
  '/products',
  validate({ body: createProductSchema }),
  upload.single('file'),
  asyncHandler(adminController.createProduct),
);

router.patch(
  '/products/:id',
  validate({ params: productIdParamId, body: updateProductSchema }),
  upload.single('file'),
  asyncHandler(adminController.updateProduct),
);

router.delete('/products/:id', validate({ params: productIdParamId }), asyncHandler(adminController.deleteProduct));

module.exports = router;
