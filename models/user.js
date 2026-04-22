const { Schema, model } = require('mongoose');
const Product = require('./product');
// const { getCollection } = require('../util/database');
// const Product = require('./product');

// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart || { items: [] };
//     this._id = id;
//   }

//   save() {
//     return getCollection('users').insertOne(this);
//   }

//   static findById(id) {
//     return getCollection('users').findOne({ _id: new ObjectId(id) });
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((cp) => cp.productId.toString() === product._id.toString());
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       updatedCartItems[cartProductIndex].quantity += 1;
//     } else {
//       updatedCartItems.push({ productId: new ObjectId(product._id), quantity: 1 });
//     }

//     const updatedCart = { items: updatedCartItems };
//     return getCollection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
//   }

//   async getCart() {
//     const productIds = this.cart.items.map((i) => i.productId);
//     const products = await Product.fetchAll({ _id: { $in: productIds } });
//     const updatedProducts = products.map((p) => {
//       return {
//         ...p,
//         quantity: this.cart.items.find((i) => i.productId.toString() === p._id.toString()).quantity,
//       };
//     });
//     return updatedProducts;
//   }

//   async deleteItemFromCart(productId) {
//     const updatedProducts = this.cart.items.filter((i) => i.productId.toString() !== productId.toString());
//     const updatedCart = { items: updatedProducts };
//     return getCollection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
//   }

//   async addOrder() {
//     const cartItems = await this.getCart();
//     const order = {
//       items: cartItems,
//       user: {
//         _id: new ObjectId(this._id),
//         name: this.username,
//       },
//     };

//     await getCollection('orders').insertOne(order);
//     this.cart = { items: [] };
//     return getCollection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: this.cart } });
//   }

//   async getOrders() {
//     const orders = await getCollection('orders')
//       .find({ 'user._id': new ObjectId(this._id) })
//       .toArray();
//     return orders;
//   }
// }

// module.exports = User;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = async function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => cp.productId.toString() === product._id.toString());
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    updatedCartItems[cartProductIndex].quantity += 1;
  } else {
    updatedCartItems.push({ productId: product._id, quantity: 1 });
  }
  this.cart = { items: updatedCartItems };
  return await this.save();
};

userSchema.methods.removeFromCart = async function (productId) {
  const updatedCartItems = this.cart.items.filter((i) => i.productId.toString() !== productId.toString());
  this.cart.items = updatedCartItems;
  return await this.save();
};

userSchema.methods.clearCart = async function () {
  this.cart = { items: [] };
  return await this.save();
};

module.exports = model('User', userSchema);
