const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');

router.post('/login', (req, res) => authController.login(req, res));
router.post('/signup', (req, res) => authController.signup(req, res));
router.get('/me', (req, res) => authController.me(req, res));

module.exports = router;
