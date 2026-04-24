require('dotenv').config();

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const { connectDB, uri } = require('./util/database');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const User = require('./models/sql/user');
const Order = require('./models/sql/order');
const OrderItem = require('./models/sql/order-item');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
const store = new MongoDBStore({ uri });
app.use(
  session({
    secret: 'my secret key',
    name: 'sessionId',
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //   maxAge: 1000 * 60 * 60 * 24 * 7,
    // },
    store: store,
  }),
);

app.use((req, res, next) => {
  res.locals.isAuthenticated = !!(req.session && req.session.user);
  try {
    User.findByPk(req.session.user?.id).then((user) => {
      req.user = user;
      console.log('Cookies : ', req.get('Cookie'));
      console.log('Session : ', req.session);
      next();
    });
  } catch (e) {
    console.log('Error=> ', e);
    next();
  }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

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

User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

connectDB().then(async () => {
  console.log('Mongodb connected successfully! 🟢');
  let user = await User.findByPk(1);
  if (!user) {
    user = await User.create({ name: 'Harit', email: 'harit@gmail.com' });
  }
  app.listen(3000, async () => {
    console.log('Server running at http://localhost:3000 🟢');
  });
});
