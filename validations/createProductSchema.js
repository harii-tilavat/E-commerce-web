const { z } = require('zod');

const createProductSchema = z.object({
  title: z.string().min(3),
  imageUrl: z.string(),
  description: z.string().min(3),
});

module.exports = createProductSchema;
