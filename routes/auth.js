const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getAuthLogin);

router.post('/login', authController.postAuthLogin);

router.get('/logout', authController.getAuthLogout);

router.get('/signup', authController.getAuthSignup);

router.post('/signup', authController.postAuthSignup);

router.get('/reset-password', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);

module.exports = router;
