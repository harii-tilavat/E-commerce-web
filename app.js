require('dotenv').config();

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const { connectDB, uri } = require('./util/database');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const User = require('./models/mongo/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
const store = new MongoDBStore({ uri });
app.use(
  session({
    secret: 'my secret key',
    name: 'sessionId',
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
);
app.use(flash());

app.use(async (req, res, next) => {
  try {
    const sessionUserId = req.session.user?.id;
    const user = sessionUserId ? await User.findById(sessionUserId) : null;
    res.locals.isAuthenticated = !!(req.session && req.session.user);
    req.user = user;
    next();
  } catch (e) {
    console.log('Error=> ', e);
    next();
  }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

connectDB()
  .then(() => {
    console.log('Mongodb connected successfully! 🟢');
    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000 🟢');
    });
  })
  .catch((err) => {
    console.log('DB connect failed:', err);
    process.exit(1);
  });
