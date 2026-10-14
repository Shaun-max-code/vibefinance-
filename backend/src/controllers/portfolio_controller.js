/**
 * Portfolio Controller
 * Manages holdings, allocation, performance, and simulated trades.
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
      count: activePortfolio.holdings.length,
      holdings: activePortfolio.holdings
    });
  }

  /**
   * Execute simulated buy/sell order
   */
  executeTrade(req, res) {
    const { symbol, type, shares, price } = req.body;

    if (!symbol || !type || !shares) {
      return res.status(400).json({
        success: false,
        error: 'Missing required trade fields: symbol, type (BUY/SELL), shares.'
      });
    }

    const cleanSym = symbol.toUpperCase();
    const tradeType = type.toUpperCase();
    const numShares = parseFloat(shares);
    const stock = marketsData.stocks[cleanSym];
    const tradePrice = parseFloat(price) || (stock ? stock.current_price : 100);
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
      updated_cash_balance: activePortfolio.summary.cash_balance_formatted
    });
  }

  /**
   * Get transaction history
   */
  getTransactions(req, res) {
    res.json({
      success: true,
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
      summary: activePortfolio.summary
    });
  }
}

module.exports = new PortfolioController();
