exports.getAuthLogin = (req, res, next) => {
  const cookie = req.get('Cookie');
  console.log('Login', cookie);
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    editing: false,
  });
};

exports.postAuthLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly; Secure; Max-Age=5');
  res.redirect('/login');
};
