/**
 * Dashboard Controller
 * Supplies all data required for the main VibeFinance dashboard view.
 */

const portfolioData = require('../data/portfolio.json');
const marketsData = require('../data/markets.json');

class DashboardController {
  /**
   * Get aggregated dashboard payload matching frontend requirements
   */
  getDashboardData(req, res) {
    const period = (req.query.period || '1M').toUpperCase();
    const performanceSeries = portfolioData.performance[period] || portfolioData.performance['1M'];

    res.json({
      success: true,
      data: {
        summary: portfolioData.summary,
        selected_period: period,
        performance_data: performanceSeries,
        allocation: portfolioData.allocation,
        holdings: portfolioData.holdings,
        markets: marketsData.market_overview,
        insights: portfolioData.insights,
        environment: 'Demo environment',
        as_of: 'OCTOBER 14, 2026'
      }
    });
  }

  /**
   * Get performance chart data filtered by period
   */
  getPerformance(req, res) {
    const period = (req.params.period || req.query.period || '1M').toUpperCase();
    const series = portfolioData.performance[period] || portfolioData.performance['1M'];

    res.json({
      period,
      data: series,
      summary: {
        current_total: portfolioData.summary.portfolio_value_formatted,
        total_gain: portfolioData.summary.total_return_formatted,
        total_gain_pct: portfolioData.summary.total_return_pct
      }
    });
  }

  /**
   * Get asset allocation breakdown
   */
  getAllocation(req, res) {
    res.json({
      total_assets: '$24.4k',
      total_assets_exact: portfolioData.summary.portfolio_value_formatted,
      allocation: portfolioData.allocation
    });
  }
}

module.exports = new DashboardController();
