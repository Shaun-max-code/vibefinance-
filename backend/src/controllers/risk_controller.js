/**
 * Risk Controller
 * Computes portfolio concentration (HHI), Beta, VaR, and stress scenarios.
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

    res.json({
      success: true,
      metrics: {
        portfolio_value: snapshot.portfolio_value,
        portfolio_beta: snapshot.portfolio_beta,
        hhi: {
          score: snapshot.hhi,
          rating: snapshot.hhi_rating,
          description: snapshot.hhi_description
        },
        var_95: snapshot.var_95,
        max_drawdown_1y: riskData.portfolio_metrics.max_drawdown_1y,
        sharpe_ratio: riskData.portfolio_metrics.sharpe_ratio,
        annualized_volatility: riskData.portfolio_metrics.volatility_annualized
      },
      sector_weights: riskData.sector_weights,
      predefined_scenarios: riskData.stress_scenarios
    });
  }

  /**
   * List all predefined stress test scenarios
   */
  getScenarios(req, res) {
    res.json({
      success: true,
      scenarios: riskData.stress_scenarios
    });
  }

  /**
   * Run a stress test scenario simulation
   */
  runScenario(req, res) {
    const { scenario_id, custom_shocks } = req.body;

    if (scenario_id) {
      const scenario = riskData.stress_scenarios.find(s => s.id === scenario_id);
      if (!scenario) {
        return res.status(404).json({ success: false, error: `Scenario ${scenario_id} not found.` });
      }

      return res.json({
        success: true,
        scenario
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
      simulation
    });
  }
}

module.exports = new RiskController();
