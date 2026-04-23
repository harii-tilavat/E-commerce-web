const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getAuthLogin);
router.post('/login', authController.postAuthLogin);

module.exports = router;
