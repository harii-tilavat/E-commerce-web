const { z } = require('zod');

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

const createProductSchema = z.object({
  title: z.string().min(3),
  price: z.coerce.number().positive(),
  imageUrl: z.string().url(),
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

module.exports = {
  createProductSchema,
  updateProductSchema,
  productIdParam,
  productIdParamId,
};
