const { z } = require('zod');
const { objectId } = require('./comman.validation');

const addToCartSchema = z.object({
  productId: objectId,
});

const cartProductIdParam = z.object({
  productId: objectId,
});

const updateCartSchema = z.object({
  action: z.enum(['inc', 'dec']),
});

module.exports = {
  addToCartSchema,
  cartProductIdParam,
  updateCartSchema,
};
