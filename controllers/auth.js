const AuthService = require('../services/auth.service');

exports.getAuthLogin = (req, res, next) => {
  const messages = req.flash('error');
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    editing: false,
    errorMessage: messages.length ? messages[0] : null,
  });
};

exports.postAuthLogin = async (req, res, next) => {
  try {
    const user = await AuthService.login(req.body.email, req.body.password);
    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }
    req.session.user = user;
    req.session.save(() => {
      res.redirect('/');
    });
  } catch (error) {
    console.log('Error => ', error);
    req.flash('error', 'Something went wrong. Try again.');
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

exports.getResetPassword = (req, res, next) => {
  const messages = req.flash('error');
  res.render('auth/reset-password', {
    pageTitle: 'Reset Password',
    path: '/reset-password',
    errorMessage: messages.length ? messages[0] : null,
  });
};

exports.postResetPassword = async (req, res, next) => {
};
