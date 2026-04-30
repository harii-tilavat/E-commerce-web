import { z } from 'zod';
import { objectId } from './comman.validation.js';

const addToCartSchema = z.object({
  productId: objectId,
});

const cartProductIdParam = z.object({
  productId: objectId,
});

const updateCartSchema = z.object({
  action: z.enum(['inc', 'dec']),
});

export {
  addToCartSchema,
  cartProductIdParam,
  updateCartSchema,
};
