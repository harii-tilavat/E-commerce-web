const express = require('express');

const validate = require('../middlewares/validate.middleware');
const asyncHandler = require('../middlewares/async-handler');
const { signupSchema, loginSchema, resetPasswordSchema, newPasswordSchema } = require('../validations/auth.validation');
const AuthController = require('../controllers/auth');

const router = express.Router();

const authController = new AuthController();

router.post('/signup', validate({ body: signupSchema }), asyncHandler(authController.signup));

router.post('/login', validate({ body: loginSchema }), asyncHandler(authController.login));

router.post('/reset-password', validate({ body: resetPasswordSchema }), asyncHandler(authController.resetPassword));

router.post('/new-password', validate({ body: newPasswordSchema }), asyncHandler(authController.newPassword));

module.exports = router;
