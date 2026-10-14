/**
 * Portfolio Controller for VibeFinance
 * Manages holdings, allocation, performance, and simulated trades with strict validation.
 */

const portfolioData = require('../data/portfolio.json');
const marketsData = require('../data/markets.json');

// In-memory clone to allow simulated additions without mutating disk permanently
let activePortfolio = JSON.parse(JSON.stringify(portfolioData));

class PortfolioController {
  /**
   * Get full portfolio snapshot
   */
  getPortfolio(req, res) {
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: activePortfolio.summary,
      holdings: activePortfolio.holdings,
      allocation: activePortfolio.allocation,
      recent_transactions: activePortfolio.recent_transactions
    });
  }

  /**
   * Get holdings only
   */
  getHoldings(req, res) {
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: activePortfolio.holdings.length,
      holdings: activePortfolio.holdings
    });
  }

  /**
   * Execute simulated buy/sell order with strict input validation
   */
  executeTrade(req, res) {
    const { symbol, type, shares, price } = req.body || {};

    if (!symbol || !type || shares === undefined || shares === null) {
      return res.status(400).json({
        success: false,
        error: 'Missing required trade fields: symbol, type (BUY/SELL), shares.',
        code: 'MISSING_TRADE_FIELDS',
        timestamp: new Date().toISOString()
      });
    }

    const cleanSym = String(symbol).trim().toUpperCase();
    const tradeType = String(type).trim().toUpperCase();
    const numShares = parseFloat(shares);

    if (isNaN(numShares) || numShares <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Shares must be a positive number greater than zero.',
        code: 'INVALID_SHARES_QUANTITY',
        timestamp: new Date().toISOString()
      });
    }

    if (tradeType !== 'BUY' && tradeType !== 'SELL') {
      return res.status(400).json({
        success: false,
        error: "Trade type must be either 'BUY' or 'SELL'.",
        code: 'INVALID_TRADE_TYPE',
        timestamp: new Date().toISOString()
      });
    }

    const stock = marketsData.stocks[cleanSym];
    const tradePrice = parseFloat(price) || (stock ? stock.current_price : 100);

    if (isNaN(tradePrice) || tradePrice <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Trade price must be a positive number.',
        code: 'INVALID_TRADE_PRICE',
        timestamp: new Date().toISOString()
      });
    }

    const tradeTotal = Math.round(numShares * tradePrice * 100) / 100;

    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      symbol: cleanSym,
      type: tradeType,
      shares: numShares,
      price: tradePrice,
      total: tradeTotal,
      status: 'COMPLETED'
    };

    activePortfolio.recent_transactions.unshift(newTx);

    res.json({
      success: true,
      message: `Simulated ${tradeType} order for ${numShares} shares of ${cleanSym} executed successfully.`,
      transaction: newTx,
      updated_cash_balance: activePortfolio.summary.cash_balance_formatted,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get transaction history
   */
  getTransactions(req, res) {
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      transactions: activePortfolio.recent_transactions
    });
  }

  /**
   * Reset portfolio to initial demo state
   */
  resetPortfolio(req, res) {
    activePortfolio = JSON.parse(JSON.stringify(portfolioData));
    res.json({
      success: true,
      message: 'Portfolio state reset to initial demo values.',
      summary: activePortfolio.summary,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new PortfolioController();
