/**
 * Risk Agent: Exposure & Downside Risk
 * Examines concentration (HHI), volatility, drawdown, portfolio Beta, and downside stress scenarios.
 */

const AgentBase = require('./agent_base');
const riskCalculator = require('../utils/risk_calculator');
const portfolioData = require('../data/portfolio.json');
const riskData = require('../data/risk_data.json');

class RiskAgent extends AgentBase {
  constructor() {
    super(
      'risk',
      'Risk Agent',
      'Exposure & downside risk',
      'purple',
      'Examines concentration, volatility and potential downside scenarios.'
    );
  }

  async analyze(question, context = {}) {
    const q = (question || '').toLowerCase();
    const holdings = portfolioData.holdings;
    const portfolioValue = portfolioData.summary.portfolio_value;
    const snapshot = riskCalculator.getRiskSnapshot(holdings, portfolioValue);

    // Specific suggestion: "Explain the difference between volatility and drawdown"
    if (q.includes('difference between volatility and drawdown') || (q.includes('volatil') && q.includes('drawdown'))) {
      return this.formatOutput({
        title: 'Volatility vs Drawdown Analysis Framework',
        summary: 'While often conflated, volatility measures dispersion of returns around the mean, whereas drawdown quantifies peak-to-trough capital impairment.',
        findings: [
          ['Volatility (Dispersion Metric)', `Measures the standard deviation of asset price swings over time regardless of direction. Your portfolio annualized volatility currently stands at ${riskData.portfolio_metrics.volatility_annualized}.`],
          ['Drawdown (Capital Impairment Metric)', `Measures cumulative peak-to-trough decline before a new high is formed. Historical maximum 1-year drawdown for your portfolio is ${riskData.portfolio_metrics.max_drawdown_1y}.`],
          ['Risk Management Application', 'Volatility affects day-to-day position sizing; drawdown determines systemic survival, investor psychological stress, and recovery time needed to regain lost capital.']
        ],
        caveat: 'Drawdown recovery requires asymmetrical gain: a 20% drawdown requires a 25% gain to break even, while a 50% loss requires a 100% gain.',
        sources: [
          { id: 'RISK-VAR-ENGINE', title: 'Parametric Value-at-Risk Engine', ref: 'Historical Daily Return Series', date: '2026-10-14' },
          { id: 'RISK-PORTFOLIO-HOLDINGS', title: 'User Holdings Risk Matrix', ref: 'Active Asset Registry', date: '2026-10-14' }
        ],
        confidencePct: 95
      });
    }

    // Specific suggestion: "What risks should I investigate in a tech-heavy portfolio?" or tech concentration
    if (q.includes('tech-heavy') || q.includes('concentration') || q.includes('investigate in a tech')) {
      const topHolding = holdings[0];
      return this.formatOutput({
        title: 'Technology Sector Concentration & Downside Review',
        summary: `Your portfolio maintains an aggregate 72.1% exposure to technology and semiconductor equities, driving an elevated Portfolio Beta of ${snapshot.portfolio_beta}.`,
        findings: [
          ['Herfindahl-Hirschman Index (HHI)', `Current HHI score is ${snapshot.hhi} (${snapshot.hhi_rating}). Top position ${topHolding.symbol} (${topHolding.weight}) exceeds the recommended 20% single-stock ceiling.`],
          ['Systemic Factor Sensitivity (Beta)', `Portfolio Beta of ${snapshot.portfolio_beta} indicates that a 5% correction in the NASDAQ could induce an estimated -${(5 * snapshot.portfolio_beta).toFixed(1)}% decline in total portfolio equity.`],
          ['Downside Cushion & Mitigation', `Unallocated cash reserve of ${portfolioData.summary.cash_balance_formatted} (${portfolioData.summary.cash_balance_change}) provides liquidity to absorb short-term drawdowns or dollar-cost average.`],
          ['Stress Scenario Projection', `${riskData.stress_scenarios[0].name}: Estimated impact of ${riskData.stress_scenarios[0].estimated_pct} (${riskData.stress_scenarios[0].estimated_pnl} USD) under a 15% semiconductor contraction.`]
        ],
        caveat: 'High sector correlation means diversification across multiple tech companies does not eliminate systemic factor risk.',
        sources: [
          { id: 'RISK-HHI-METRICS', title: 'Herfindahl Concentration Model', ref: 'Portfolio Allocation Matrix', date: '2026-10-14' },
          { id: 'RISK-STRESS-MODEL', title: 'Macro Scenario Stress Simulation', ref: 'Factor Sensitivity Engine', date: '2026-10-14' }
        ],
        confidencePct: 93
      });
    }

    // General risk query
    return this.formatOutput({
      title: 'Portfolio Downside & Risk Parameter Review',
      summary: `Current risk analysis indicates moderate concentration with 1-Day 95% Value-at-Risk calibrated at ${snapshot.var_95.var_95_amount_formatted} (${snapshot.var_95.var_95_pct} of equity).`,
      findings: [
        ['Herfindahl-Hirschman Index (HHI)', `Concentration score of ${snapshot.hhi} (${snapshot.hhi_rating}). ${snapshot.hhi_description}`],
        ['Parametric 95% Value-at-Risk (VaR)', `In 95% of trading days under normal conditions, daily loss is projected not to exceed ${snapshot.var_95.var_95_amount_formatted}.`],
        ['Portfolio Beta & Volatility', `Weighted Beta is ${snapshot.portfolio_beta} relative to the S&P 500, with annualized asset volatility at ${riskData.portfolio_metrics.volatility_annualized}.`]
      ],
      caveat: 'Parametric VaR assumes normal distribution of returns; fat-tail events or liquidity dry-ups can exceed statistical estimates.',
      sources: [
        { id: 'RISK-PARAMETRIC-VAR', title: 'Parametric 95% 1-Day VaR Model', ref: 'Active Asset Registry', date: '2026-10-14' }
      ],
      confidencePct: 90
    });
  }
}

module.exports = new RiskAgent();
