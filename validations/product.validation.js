import { z } from 'zod';
import { objectId } from './comman.validation.js';

const createProductSchema = z.object({
  title: z.string().min(3),
  price: z.coerce.number().positive(),
  description: z.string().min(3),
});

const updateProductSchema = z.object({
  title: z.string().min(3).optional(),
  price: z.coerce.number().positive().optional(),
  imageUrl: z.string().url().optional(),
  description: z.string().min(3).optional(),
});

const productIdParam = z.object({
  productId: objectId,
});

const productIdParamId = z.object({
  id: objectId,
});

export {
  createProductSchema,
  updateProductSchema,
  productIdParam,
  productIdParamId,
};
