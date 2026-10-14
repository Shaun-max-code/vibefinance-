/**
 * Risk Controller for VibeFinance
 * Computes portfolio concentration (HHI), Beta, VaR, dynamic sector weights,
 * and stress scenarios with mathematical consistency and stated statistical limitations.
 */

const riskCalculator = require('../utils/risk_calculator');
const riskData = require('../data/risk_data.json');
const portfolioData = require('../data/portfolio.json');

class RiskController {
  /**
   * Get complete risk overview
   */
  getRiskOverview(req, res) {
    const snapshot = riskCalculator.getRiskSnapshot(
      portfolioData.holdings,
      portfolioData.summary.portfolio_value
    );

    // Merge calculated sector weights with palette colors
    const palette = ['#94a3b8', '#60a5fa', '#a3e635', '#fbbf24', '#34d399', '#a78bfa'];
    const dynamicSectorWeights = snapshot.sector_weights.map((sw, idx) => ({
      sector: sw.sector,
      weight: sw.weight,
      color: palette[idx % palette.length]
    }));

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      metrics: {
        portfolio_value: snapshot.portfolio_value,
        portfolio_beta: snapshot.portfolio_beta,
        hhi: {
          score: snapshot.hhi,
          rating: snapshot.hhi_rating,
          description: snapshot.hhi_description
        },
        var_95: snapshot.var_95,
        tech_exposure_pct: snapshot.tech_exposure_pct,
        tech_holdings: snapshot.tech_holdings,
        max_drawdown_1y: riskData.portfolio_metrics.max_drawdown_1y,
        sharpe_ratio: riskData.portfolio_metrics.sharpe_ratio,
        annualized_volatility: snapshot.var_95.annualized_volatility
      },
      sector_weights: dynamicSectorWeights.length > 0 ? dynamicSectorWeights : riskData.sector_weights,
      predefined_scenarios: riskData.stress_scenarios,
      assumptions_and_limitations: snapshot.assumptions_and_limitations
    });
  }

  /**
   * List all predefined stress test scenarios
   */
  getScenarios(req, res) {
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      scenarios: riskData.stress_scenarios
    });
  }

  /**
   * Run a stress test scenario simulation
   */
  runScenario(req, res) {
    const { scenario_id, custom_shocks } = req.body || {};

    if (scenario_id) {
      const scenario = riskData.stress_scenarios.find(s => s.id === scenario_id);
      if (!scenario) {
        return res.status(404).json({
          success: false,
          error: `Scenario ${scenario_id} not found in stress test library.`,
          code: 'SCENARIO_NOT_FOUND',
          timestamp: new Date().toISOString()
        });
      }

      return res.json({
        success: true,
        scenario,
        timestamp: new Date().toISOString()
      });
    }

    // Custom shocks simulation
    const simulation = riskCalculator.simulateStress(
      portfolioData.holdings,
      portfolioData.summary.portfolio_value,
      custom_shocks || { DEFAULT: -5 }
    );

    res.json({
      success: true,
      simulation,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new RiskController();
