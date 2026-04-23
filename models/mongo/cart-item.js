const { Schema, model } = require('mongoose');

const cartItemSchema = new Schema({
  userId: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
});

module.exports = model('CartItem', cartItemSchema);
