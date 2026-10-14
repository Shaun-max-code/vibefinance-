const express = require('express');
const router = express.Router();
const marketController = require('../controllers/market_controller');

router.get('/', (req, res) => marketController.getOverview(req, res));
router.get('/stocks', (req, res) => marketController.getStocks(req, res));
router.get('/stocks/:symbol', (req, res) => marketController.getStockBySymbol(req, res));
router.get('/search', (req, res) => marketController.search(req, res));

module.exports = router;
