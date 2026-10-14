const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolio_controller');

router.get('/', (req, res) => portfolioController.getPortfolio(req, res));
router.get('/holdings', (req, res) => portfolioController.getHoldings(req, res));
router.post('/trade', (req, res) => portfolioController.executeTrade(req, res));
router.get('/transactions', (req, res) => portfolioController.getTransactions(req, res));
router.post('/reset', (req, res) => portfolioController.resetPortfolio(req, res));

module.exports = router;
