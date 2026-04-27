const { z } = require('zod');

const objectId = z.string().regex(/^[a-f\d]{24}$/i);

module.exports = { objectId };
