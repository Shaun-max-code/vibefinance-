const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard_controller');

router.get('/', (req, res) => dashboardController.getDashboardData(req, res));
router.get('/performance', (req, res) => dashboardController.getPerformance(req, res));
router.get('/performance/:period', (req, res) => dashboardController.getPerformance(req, res));
router.get('/allocation', (req, res) => dashboardController.getAllocation(req, res));

module.exports = router;
