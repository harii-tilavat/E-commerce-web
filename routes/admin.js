const express = require('express');

const adminController = require('../controllers/admin');
const requireAuth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createProductSchema, updateProductSchema, productIdParamId } = require('../validations/product.validation');

const router = express.Router();

router.use(requireAuth);

router.get('/products', adminController.getProducts);

router.post('/products', validate({ body: createProductSchema }), adminController.createProduct);

router.patch(
  '/products/:id',
  validate({ params: productIdParamId, body: updateProductSchema }),
  adminController.updateProduct,
);

router.delete('/products/:id', validate({ params: productIdParamId }), adminController.deleteProduct);

module.exports = router;
