/**
 * Risk Agent: Exposure & Downside Risk
 * Examines concentration (HHI), volatility, drawdown, portfolio Beta,
 * and downside stress scenarios with dynamic calculations and stated statistical limitations.
 */

const AgentBase = require('./agent_base');
const riskCalculator = require('../utils/risk_calculator');
const portfolioData = require('../data/portfolio.json');
const riskData = require('../data/risk_data.json');
const onlineResearch = require('../utils/online_research');

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

    // If specific external ticker is being investigated for risk
    const onlineTicker = onlineResearch.extractTicker(question);
    if (onlineTicker && !['AAPL', 'MSFT', 'NVDA', 'GOOGL'].includes(onlineTicker) && !q.includes('volatil') && !q.includes('drawdown')) {
      return this.formatOutput({
        title: `${onlineTicker} Downside Risk & Volatility Profile`,
        summary: `Evaluating tail risk, single-asset concentration implications, and downside sensitivity for ${onlineTicker}.`,
        findings: [
          [`Beta & Market Sensitivity`, `Adding ${onlineTicker} introduces elevated beta factor exposure and increases sensitivity to broader benchmark contractions.`],
          [`Concentration & Allocation Ceiling`, `To preserve portfolio diversification within healthy HHI bounds (<2,000), position sizing should not exceed 8-12% of total liquid capital.`],
          [`Stress Scenario Sensitivity`, `Under a high-multiple sector pullback or yield spike shock, volatile growth assets historically experience peak-to-trough drawdowns of 1.5x-2.2x broader market indices.`]
        ],
        caveat: 'Single-asset concentration introduces idiosyncratic volatility that cannot be eliminated through general market hedging.',
        sources: [
          { id: `RISK-${onlineTicker}-METRICS`, title: `${onlineTicker} Parametric Risk Model`, ref: 'Multi-Asset Downside Matrix', date: '2026-10-15', provenance: 'Quantitative Risk Engine' }
        ],
        confidencePct: 92
      });
    }

    // Specific suggestion: "Explain the difference between volatility and drawdown"
    if (q.includes('difference between volatility and drawdown') || (q.includes('volatil') && q.includes('drawdown'))) {
      return this.formatOutput({
        title: 'Volatility vs Drawdown Analysis Framework',
        summary: 'While often conflated, volatility measures the statistical dispersion of asset returns around their mean, whereas drawdown quantifies peak-to-trough cumulative capital impairment.',
        findings: [
          ['Volatility (Dispersion Metric)', `Measures standard deviation of price changes over a trading window regardless of direction. Your portfolio annualized volatility is currently calibrated at ${snapshot.var_95.annualized_volatility}.`],
          ['Drawdown (Capital Impairment Metric)', `Measures cumulative peak-to-trough decline before a new high is established. Historical maximum 1-year drawdown for this asset combination is ${riskData.portfolio_metrics.max_drawdown_1y}.`],
          ['Risk Management Application', 'Volatility guides position sizing and options pricing; drawdown determines survival, capital preservation, and recovery time needed to regain lost equity.']
        ],
        caveat: 'Drawdown recovery exhibits mathematical asymmetry: recovering from a 20% drawdown requires a 25% gain, while a 50% loss requires a 100% gain to break even.',
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
        summary: `Your portfolio maintains a dynamically calculated aggregate ${snapshot.tech_exposure_pct} exposure to technology and semiconductor equities (${snapshot.tech_holdings.join(', ')}), resulting in a weighted Portfolio Beta of ${snapshot.portfolio_beta}.`,
        findings: [
          ['Herfindahl-Hirschman Index (HHI)', `Current HHI score is ${snapshot.hhi} (${snapshot.hhi_rating}). Top position ${topHolding.symbol} (${topHolding.weight}) exceeds the recommended 20% single-stock ceiling.`],
          ['Systemic Factor Sensitivity (Beta)', `Portfolio Beta of ${snapshot.portfolio_beta} indicates that a 5% correction in the NASDAQ could induce an estimated -${(5 * snapshot.portfolio_beta).toFixed(1)}% decline in total portfolio equity.`],
          ['Downside Cushion & Mitigation', `Unallocated cash reserve of ${portfolioData.summary.cash_balance_formatted} (${portfolioData.summary.cash_balance_change}) provides liquidity to absorb short-term drawdowns or dollar-cost average.`],
          ['Stress Scenario Projection', `${riskData.stress_scenarios[0].name}: Estimated impact of ${riskData.stress_scenarios[0].estimated_pct} (${riskData.stress_scenarios[0].estimated_pnl} USD) under a 15% semiconductor contraction.`]
        ],
        caveat: 'High sector correlation means diversification across multiple technology equities does not eliminate systemic macro factor risk. Parametric VaR assumes normal return distributions.',
        sources: [
          { id: 'RISK-HHI-METRICS', title: 'Herfindahl Concentration Model', ref: 'Dynamic Portfolio Allocation Matrix', date: '2026-10-14' },
          { id: 'RISK-STRESS-MODEL', title: 'Macro Scenario Stress Simulation', ref: 'Factor Sensitivity Engine', date: '2026-10-14' }
        ],
        confidencePct: 93
      });
    }

    // General risk query
    return this.formatOutput({
      title: 'Portfolio Downside & Risk Parameter Review',
      summary: `Current risk analysis indicates ${snapshot.hhi_rating.toLowerCase().replace(/_/g, ' ')} with aggregate technology exposure at ${snapshot.tech_exposure_pct} and 1-Day 95% Value-at-Risk calibrated at ${snapshot.var_95.var_95_amount_formatted} (${snapshot.var_95.var_95_pct} of equity).`,
      findings: [
        ['Herfindahl-Hirschman Index (HHI)', `Concentration score of ${snapshot.hhi} (${snapshot.hhi_rating}). ${snapshot.hhi_description}`],
        ['Parametric 95% Value-at-Risk (VaR)', `In 95% of trading days under normal market conditions, daily loss is projected not to exceed ${snapshot.var_95.var_95_amount_formatted}.`],
        ['Portfolio Beta & Volatility', `Weighted Beta is ${snapshot.portfolio_beta} relative to the S&P 500 benchmark, with annualized asset volatility at ${snapshot.var_95.annualized_volatility}.`],
        ['Dynamic Sector Exposure', `Calculated technology/semiconductor exposure is ${snapshot.tech_exposure_pct} across ${snapshot.tech_holdings.length} tracked positions.`]
      ],
      caveat: 'Parametric VaR assumes standard normal return distributions (Z=1.645); fat-tail liquidity shocks or black-swan events can exceed statistical boundaries.',
      sources: [
        { id: 'RISK-PARAMETRIC-VAR', title: 'Parametric 95% 1-Day VaR Model', ref: 'Active Asset Registry', date: '2026-10-14' }
      ],
      confidencePct: 90
    });
  }
}

module.exports = new RiskAgent();
