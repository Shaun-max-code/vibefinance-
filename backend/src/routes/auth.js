const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const { authLimiter } = require('../utils/rate_limiter');

// Rate-limited authentication endpoints
router.post('/login', authLimiter, (req, res) => authController.login(req, res));
router.post('/signup', authLimiter, (req, res) => authController.signup(req, res));
router.get('/me', (req, res) => authController.me(req, res));

module.exports = router;
