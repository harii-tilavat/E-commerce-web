import express from 'express';

import validate from '../middlewares/validate.middleware.js';
import asyncHandler from '../middlewares/async-handler.js';
import { signupSchema, loginSchema, resetPasswordSchema, newPasswordSchema } from '../validations/auth.validation.js';
import AuthController from '../controllers/auth.js';

const router = express.Router();

const authController = new AuthController();

router.post('/signup', validate({ body: signupSchema }), asyncHandler(authController.signup));

router.post('/login', validate({ body: loginSchema }), asyncHandler(authController.login));

router.post('/reset-password', validate({ body: resetPasswordSchema }), asyncHandler(authController.resetPassword));

router.post('/new-password', validate({ body: newPasswordSchema }), asyncHandler(authController.newPassword));

export default router;
