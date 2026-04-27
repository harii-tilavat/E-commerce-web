const express = require('express');

const authController = require('../controllers/auth');
const validate = require('../middlewares/validate.middleware');
const { signupSchema, loginSchema, resetPasswordSchema, newPasswordSchema } = require('../validations/auth.validation');

const router = express.Router();

router.post('/signup', validate({ body: signupSchema }), authController.signup);

router.post('/login', validate({ body: loginSchema }), authController.login);

router.post('/reset-password', validate({ body: resetPasswordSchema }), authController.resetPassword);

router.post('/new-password', validate({ body: newPasswordSchema }), authController.newPassword);

module.exports = router;
