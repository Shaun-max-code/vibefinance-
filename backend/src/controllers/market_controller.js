/**
 * Market Controller
 * Provides market overview, quotes, technical metrics, and search.
 */

const marketsData = require('../data/markets.json');

class MarketController {
  /**
   * Get all market overview indices (S&P 500, NASDAQ, NIFTY 50, BTC/USD)
   */
  getOverview(req, res) {
    res.json({
      success: true,
      count: marketsData.market_overview.length,
      markets: marketsData.market_overview
    });
  }

  /**
   * Get list of tracked stocks
   */
  getStocks(req, res) {
    const list = Object.values(marketsData.stocks).map(s => ({
      symbol: s.symbol,
      company_name: s.company_name,
      exchange: s.exchange,
      sector: s.sector,
      current_price: s.current_price,
      change: s.change,
      market_cap: s.market_cap,
      pe_ratio: s.pe_ratio,
      beta: s.beta,
      sparkline: s.sparkline
    }));

    res.json({
      success: true,
      total: list.length,
      stocks: list
    });
  }

  /**
   * Get deep quotes & technicals for a single symbol
   */
  getStockBySymbol(req, res) {
    const symbol = (req.params.symbol || '').toUpperCase();
    const stock = marketsData.stocks[symbol];

    if (!stock) {
      return res.status(404).json({
        success: false,
        error: `Symbol ${symbol} not found in market registry.`
      });
    }

    res.json({
      success: true,
      stock
    });
  }

  /**
   * Search markets by symbol or name
   */
  search(req, res) {
    const query = (req.query.q || '').toLowerCase();
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter q is required.' });
    }

    const matchedStocks = Object.values(marketsData.stocks).filter(s =>
      s.symbol.toLowerCase().includes(query) ||
      s.company_name.toLowerCase().includes(query) ||
      s.sector.toLowerCase().includes(query)
    );

    const matchedIndices = marketsData.market_overview.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.category.toLowerCase().includes(query)
    );

    res.json({
      success: true,
      query,
      results: {
        indices: matchedIndices,
        stocks: matchedStocks
      }
    });
  }
}

module.exports = new MarketController();
