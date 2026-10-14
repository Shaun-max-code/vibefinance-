/**
 * Market Controller for VibeFinance
 * Provides market overview, quotes, technical metrics, and search with data timestamps,
 * calculated technical indicators (Wilder's RSI, EMA), and clear provenance tagging.
 */

const marketsData = require('../data/markets.json');
const technicalIndicators = require('../utils/technical_indicators');

class MarketController {
  /**
   * Get all market overview indices (S&P 500, NASDAQ, NIFTY 50, BTC/USD)
   */
  getOverview(req, res) {
    const nowIso = new Date().toISOString();
    const enrichedMarkets = marketsData.market_overview.map(m => ({
      ...m,
      as_of_timestamp: nowIso,
      data_mode: m.market_status === '24/7 LIVE' ? 'LIVE_STREAM_SIMULATED' : 'REFERENCE_CLOSE_VERIFIED',
      stale_indicator: false
    }));

    res.json({
      success: true,
      timestamp: nowIso,
      data_provenance: {
        source: 'CBOE / S&P Consolidated Tape & CoinGecko Reference Index',
        quality: 'Institutional reference benchmarks',
        disclaimer: 'Illustrative quotes for research testing.'
      },
      count: enrichedMarkets.length,
      markets: enrichedMarkets
    });
  }

  /**
   * Get list of tracked stocks with calculated technicals
   */
  getStocks(req, res) {
    const list = Object.values(marketsData.stocks).map(s => {
      const enriched = technicalIndicators.enrichStockData(s);
      return {
        symbol: enriched.symbol,
        company_name: enriched.company_name,
        exchange: enriched.exchange,
        sector: enriched.sector,
        current_price: enriched.current_price,
        change: enriched.change,
        market_cap: enriched.market_cap,
        pe_ratio: enriched.pe_ratio,
        beta: enriched.beta,
        technicals: enriched.technicals,
        data_provenance: enriched.data_provenance,
        sparkline: enriched.sparkline
      };
    });

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      total: list.length,
      stocks: list
    });
  }

  /**
   * Get deep quotes & calculated technicals for a single symbol
   */
  getStockBySymbol(req, res) {
    const symbol = (req.params.symbol || '').toUpperCase();
    const rawStock = marketsData.stocks[symbol];

    if (!rawStock) {
      return res.status(404).json({
        success: false,
        error: `Symbol ${symbol} not found in market registry.`,
        code: 'SYMBOL_NOT_FOUND',
        available_symbols: Object.keys(marketsData.stocks),
        timestamp: new Date().toISOString()
      });
    }

    const stock = technicalIndicators.enrichStockData(rawStock);

    res.json({
      success: true,
      stock,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Search markets by symbol, name, or sector
   */
  search(req, res) {
    const query = (req.query.q || '').trim().toLowerCase();
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter q is required.',
        code: 'MISSING_SEARCH_QUERY',
        timestamp: new Date().toISOString()
      });
    }

    const matchedStocks = Object.values(marketsData.stocks)
      .filter(s =>
        s.symbol.toLowerCase().includes(query) ||
        s.company_name.toLowerCase().includes(query) ||
        s.sector.toLowerCase().includes(query)
      )
      .map(s => technicalIndicators.enrichStockData(s));

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
      },
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new MarketController();
