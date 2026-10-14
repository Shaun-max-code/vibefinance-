const express = require('express');
const router = express.Router();
const riskController = require('../controllers/risk_controller');

router.get('/', (req, res) => riskController.getRiskOverview(req, res));
router.get('/scenarios', (req, res) => riskController.getScenarios(req, res));
router.post('/stress-test', (req, res) => riskController.runScenario(req, res));

module.exports = router;
