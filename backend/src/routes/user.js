const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');

router.get('/profile', (req, res) => userController.getProfile(req, res));
router.put('/preferences', (req, res) => userController.updatePreferences(req, res));
router.patch('/notifications/:id/read', (req, res) => userController.markNotificationRead(req, res));

module.exports = router;
