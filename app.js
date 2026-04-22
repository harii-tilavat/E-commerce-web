const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const { connectDB } = require('./util/database');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  const user = await User.findById('69e777764dcaffb8b528a7db');
  req.user = user;
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Relations
// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Product);

// User.hasOne(Cart);
// Cart.belongsTo(User);

// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });

// Order.belongsTo(User);
// User.hasMany(Order);

// Order.belongsToMany(Product, { through: OrderItem });
// Product.belongsToMany(Order, { through: OrderItem });

// sequelize
//   .sync()
//   .then(async () => {
//     let user = await User.findByPk(1);
//     if (!user) {
//       user = await User.create({ name: 'Suhag', email: 'test@test.com' });
//       await user.createCart();
//     }
//     console.log('\nData base connected successfully! ');
//     app.listen(3000, () => {
//       console.log('Server running at http://localhost:3000 🟢');
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
connectDB().then(async () => {
  console.log('Mongodb connected successfully! 🟢');
  let user = await User.findById('69e777764dcaffb8b528a7db');
  if (!user) {
    user = await User.create({ name: 'Harit', email: 'harit@gmail.com', cart: { items: [] } });
  }
  app.listen(3000, async () => {
    console.log('Server running at http://localhost:3000 🟢');
  });
});
