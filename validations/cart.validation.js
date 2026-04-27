const { z } = require('zod');

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

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
