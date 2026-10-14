const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports_controller');

router.get('/', (req, res) => reportsController.getReports(req, res));
router.get('/:id', (req, res) => reportsController.getReportById(req, res));
router.post('/generate', (req, res) => reportsController.generateReport(req, res));

module.exports = router;
