const User = require('../models/sql/user');
const AuthService = require('../services/auth.service');

exports.getAuthLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    editing: false,
  });
};

exports.postAuthLogin = async (req, res, next) => {
  try {
    const user = await AuthService.login(req.body.email, req.body.password);
    if (!user) {
      return res.redirect('/login');
    }
    req.session.user = user;
    req.session.save(() => {
      res.redirect('/');
    });
  } catch (error) {
    console.log('Error => ', error);
    res.redirect('/login');
  }
};

exports.getAuthLogout = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
};

exports.getAuthSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Sign Up',
    path: '/signup',
  });
};

exports.postAuthSignup = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || password !== confirmPassword) {
    return res.redirect('/signup');
  }
  try {
    await AuthService.signup(name, email, password);
    res.redirect('/login');
  } catch (err) {
    console.log('Signup error =>', err);
    res.redirect('/signup');
  }
};
