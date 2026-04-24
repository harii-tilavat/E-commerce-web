const User = require('../models/sql/user');

exports.getAuthLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    editing: false,
  });
};

exports.postAuthLogin = async (req, res, next) => {
  // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly; Secure; Max-Age=5');
  const user = await User.findByPk(1);
  req.session.user = user.toJSON();
  req.session.save(() => {
    res.redirect('/');
  });
};

exports.getAuthLogout = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
};
