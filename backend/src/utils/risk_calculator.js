/**
 * Risk Calculator for VibeFinance
 * Implements Herfindahl-Hirschman Index (HHI), Weighted Portfolio Beta,
 * Parametric 95% 1-Day Value-at-Risk (VaR), dynamic sector aggregation,
 * and mathematical consistency validations with stated statistical limitations.
 */

const portfolioData = require('../data/portfolio.json');
const marketsData = require('../data/markets.json');

class RiskCalculator {
  /**
   * Calculates Herfindahl-Hirschman Index (HHI)
   * Formula: Sum of squared percentage weights (0 to 10,000)
   * < 1500: Unconcentrated (Diversified)
   * 1500 - 2500: Moderate Concentration
   * > 2500: Highly Concentrated
   */
  calculateHHI(holdings, normalizeToEquity = false) {
    if (!holdings || holdings.length === 0) {
      return { hhi: 0, rating: 'EMPTY', description: 'No active holdings.', total_holdings_weight: 0 };
    }

    let sumWeights = 0;
    holdings.forEach(h => {
      const weight = typeof h.weight_num === 'number'
        ? h.weight_num
        : parseFloat(String(h.weight || 0).replace('%', ''));
      sumWeights += weight;
    });

    let sumSquares = 0;
    holdings.forEach(h => {
      const rawWeight = typeof h.weight_num === 'number'
        ? h.weight_num
        : parseFloat(String(h.weight || 0).replace('%', ''));
      const effectiveWeight = normalizeToEquity && sumWeights > 0
        ? (rawWeight / sumWeights) * 100
        : rawWeight;
      sumSquares += Math.pow(effectiveWeight, 2);
    });

    const hhi = Math.round(sumSquares);
    let rating = 'DIVERSIFIED';
    let description = 'Portfolio displays healthy diversification across individual assets.';

    if (hhi >= 2500) {
      rating = 'HIGH_CONCENTRATION';
      description = 'Portfolio concentration is elevated (HHI >= 2500). Heavy exposure to top holdings may increase drawdown risk.';
    } else if (hhi >= 1500) {
      rating = 'MODERATE_CONCENTRATION';
      description = 'Portfolio displays moderate concentration (HHI 1500-2500). Top positions should be monitored against risk limits.';
    }

    return {
      hhi,
      rating,
      description,
      total_holdings_weight: Math.round(sumWeights * 10) / 10
    };
  }

  /**
   * Calculates weighted portfolio Beta relative to broad market index (e.g. S&P 500)
   */
  calculatePortfolioBeta(holdings) {
    if (!holdings || holdings.length === 0) return 1.0;

    let totalWeight = 0;
    let weightedBetaSum = 0;

    holdings.forEach(h => {
      const weight = typeof h.weight_num === 'number'
        ? h.weight_num
        : parseFloat(String(h.weight || 0).replace('%', ''));
      const beta = typeof h.beta === 'number' ? h.beta : 1.0;

      weightedBetaSum += (weight / 100) * beta;
      totalWeight += (weight / 100);
    });

    if (totalWeight === 0) return 1.0;
    const portfolioBeta = weightedBetaSum / totalWeight;
    return Math.round(portfolioBeta * 100) / 100;
  }

  /**
   * Computes Parametric 95% 1-Day Value-at-Risk (VaR)
   * Formula: VaR = 1.645 * daily_sigma * portfolio_value
   * Where daily_sigma = annualized_volatility / sqrt(252)
   */
  calculateVaR(portfolioValue, annualizedVol = 0.2305, confidenceZ = 1.645) {
    const dailySigma = annualizedVol / Math.sqrt(252);
    const varAmount = portfolioValue * dailySigma * confidenceZ;
    const varPct = (varAmount / portfolioValue) * 100;

    return {
      portfolio_value: portfolioValue,
      var_95_amount: Math.round(varAmount * 100) / 100,
      var_95_amount_formatted: `$${(Math.round(varAmount * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      var_95_pct: `${varPct.toFixed(2)}%`,
      daily_volatility: `${(dailySigma * 100).toFixed(2)}%`,
      annualized_volatility: `${(annualizedVol * 100).toFixed(1)}%`,
      confidence: '95%',
      horizon: '1-Day'
    };
  }

  /**
   * Dynamically derives aggregate technology & semiconductor sector exposure strictly from actual holdings
   * @param {Array<object>} holdings
   * @returns {{ tech_exposure_pct: string, tech_exposure_num: number, tech_holdings: Array<string> }}
   */
  calculateTechExposure(holdings) {
    if (!Array.isArray(holdings) || holdings.length === 0) {
      return { tech_exposure_pct: '0.0%', tech_exposure_num: 0, tech_holdings: [] };
    }

    let techWeight = 0;
    const techHoldings = [];

    holdings.forEach(h => {
      const sector = String(h.sector || '').toLowerCase();
      const weight = typeof h.weight_num === 'number'
        ? h.weight_num
        : parseFloat(String(h.weight || 0).replace('%', ''));

      // Check if holding belongs to technology, software, semiconductors, hardware, or cloud
      if (/tech|software|semiconductor|cloud|electronics|digital|internet/i.test(sector)) {
        techWeight += weight;
        techHoldings.push(h.symbol);
      }
    });

    const roundedWeight = Math.round(techWeight * 10) / 10;
    return {
      tech_exposure_pct: `${roundedWeight.toFixed(1)}%`,
      tech_exposure_num: roundedWeight,
      tech_holdings: techHoldings
    };
  }

  /**
   * Dynamically groups and calculates sector allocations derived from holdings
   */
  calculateSectorWeights(holdings) {
    if (!Array.isArray(holdings) || holdings.length === 0) return [];

    const map = new Map();
    holdings.forEach(h => {
      const sector = h.sector || 'Unclassified';
      const weight = typeof h.weight_num === 'number'
        ? h.weight_num
        : parseFloat(String(h.weight || 0).replace('%', ''));
      map.set(sector, (map.get(sector) || 0) + weight);
    });

    return Array.from(map.entries()).map(([sector, weight]) => ({
      sector,
      weight: Math.round(weight * 10) / 10
    }));
  }

  /**
   * Simulates custom stress test scenario on the active holdings
   */
  simulateStress(holdings, totalValue, shocks = {}) {
    let projectedValue = totalValue;
    let delta = 0;
    const assetImpacts = [];

    holdings.forEach(h => {
      const sym = h.symbol;
      const weight = ((typeof h.weight_num === 'number' ? h.weight_num : parseFloat(h.weight)) || 0) / 100;
      const posValue = totalValue * weight;

      const shockPct = shocks[sym] !== undefined ? shocks[sym] : (shocks['DEFAULT'] || 0);
      const impact = posValue * (shockPct / 100);

      delta += impact;
      assetImpacts.push({
        symbol: sym,
        shock_pct: `${shockPct >= 0 ? '+' : ''}${shockPct}%`,
        impact_usd: Math.round(impact * 100) / 100
      });
    });

    projectedValue = totalValue + delta;

    return {
      initial_value: totalValue,
      projected_value: Math.round(projectedValue * 100) / 100,
      delta_amount: Math.round(delta * 100) / 100,
      delta_pct: `${((delta / totalValue) * 100).toFixed(2)}%`,
      asset_impacts: assetImpacts
    };
  }

  /**
   * Comprehensive portfolio risk snapshot with verified calculations and statistical limitations
   */
  getRiskSnapshot(holdings = portfolioData.holdings, totalValue = portfolioData.summary.portfolio_value) {
    const hhiInfo = this.calculateHHI(holdings);
    const beta = this.calculatePortfolioBeta(holdings);
    const varInfo = this.calculateVaR(totalValue);
    const techExp = this.calculateTechExposure(holdings);
    const sectorWeights = this.calculateSectorWeights(holdings);

    return {
      portfolio_value: totalValue,
      portfolio_beta: beta,
      hhi: hhiInfo.hhi,
      hhi_rating: hhiInfo.rating,
      hhi_description: hhiInfo.description,
      var_95: varInfo,
      tech_exposure_pct: techExp.tech_exposure_pct,
      tech_exposure_num: techExp.tech_exposure_num,
      tech_holdings: techExp.tech_holdings,
      sector_weights: sectorWeights,
      asset_weights: holdings.map(h => ({
        symbol: h.symbol,
        name: h.name,
        weight: h.weight,
        beta: h.beta
      })),
      assumptions_and_limitations: [
        'Parametric VaR assumes standard normal return distribution (Z = 1.645 at 95% confidence).',
        'Parametric VaR does not capture non-linear derivatives skew, slippage, or tail-risk illiquidity.',
        'Portfolio Beta assumes linear regression relationship against the benchmark index.',
        'HHI treats all assets independently and does not model intra-industry covariance matrix.'
      ]
    };
  }
}

module.exports = new RiskCalculator();
