// const { Schema, model } = require('mongoose');

// const orderSchema = new Schema({
//   products: [
//     {
//       product: { type: Object, required: true },
//       quantity: { type: Number, required: true },
//     },
//   ],
//   user: {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//   },
// });

// module.exports = model('Order', orderSchema);

const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/database');

const Order = sequelize.define('order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Order;
