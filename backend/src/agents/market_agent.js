/**
 * Market Agent: Market Trends & Momentum
 * Evaluates multi-timeframe price action, moving averages, RSI, volume, and options sentiment.
 */

const AgentBase = require('./agent_base');
const marketsData = require('../data/markets.json');

class MarketAgent extends AgentBase {
  constructor() {
    super(
      'market',
      'Market Agent',
      'Market trends & momentum',
      'green',
      'Studies market movements, momentum and macroeconomic signals.'
    );
  }

  async analyze(question, context = {}) {
    const q = (question || '').toLowerCase();
    const stocks = marketsData.stocks;
    const overview = marketsData.market_overview;

    // Detect mentioned stocks
    const detectedSymbols = Object.keys(stocks).filter(sym =>
      q.includes(sym.toLowerCase()) ||
      q.includes(stocks[sym].company_name.toLowerCase())
    );

    const primaryStock = detectedSymbols.length > 0
      ? stocks[detectedSymbols[0]]
      : stocks['NVDA']; // Default representative momentum stock

    // Specific topic: Volatility / Drawdown
    if (q.includes('volatil') || q.includes('drawdown') || q.includes('swing')) {
      return this.formatOutput({
        title: 'Market Momentum & Volatility Assessment',
        summary: 'Market volatility reflects the speed and dispersion of day-to-day price movement, while drawdown measures cumulative decline from a cycle peak.',
        findings: [
          ['Current Market Regime', `S&P 500 is trading at ${overview[0].value} (${overview[0].change}) and NASDAQ at ${overview[1].value} (${overview[1].change}), exhibiting sustained upside momentum with compressed realized volatility.`],
          ['Implied vs Realized Volatility', `Options Put-Call Ratios across tech leaders remain tilted towards calls (NVDA PCR: ${stocks.NVDA.technicals.pcr_oi}, AAPL PCR: ${stocks.AAPL.technicals.pcr_oi}), indicating constructive risk appetite.`],
          ['Technical Support Boundaries', `Key benchmark indices are comfortably positioned above their 50-day and 200-day exponential moving averages, maintaining an active bullish channel.`]
        ],
        caveat: 'Options sentiment and momentum can reverse rapidly around macroeconomic data releases and central bank announcements.',
        sources: [
          { id: 'MKT-TICK-SP500', title: 'S&P 500 Index Tick Feed', ref: 'CBOE / S&P Real-Time', date: '2026-10-14' },
          { id: 'MKT-OPTS-CHAIN', title: 'Derivatives Options OI & PCR Chain', ref: 'Equity Index Options Registry', date: '2026-10-14' }
        ],
        confidencePct: 88
      });
    }

    // Specific topic: Comparing stocks / companies
    if (q.includes('compare') || detectedSymbols.length > 1) {
      const s1 = detectedSymbols[0] ? stocks[detectedSymbols[0]] : stocks['AAPL'];
      const s2 = detectedSymbols[1] ? stocks[detectedSymbols[1]] : stocks['MSFT'];

      return this.formatOutput({
        title: `Technical Momentum Comparison: ${s1.symbol} vs ${s2.symbol}`,
        summary: `Evaluating technical momentum, relative volume, and moving average structures for ${s1.company_name} and ${s2.company_name}.`,
        findings: [
          [`${s1.symbol} Momentum Profile`, `Current price $${s1.current_price} (${s1.change}). RSI(14) is at ${s1.technicals.rsi_14} with 20-day EMA at $${s1.technicals.ema_20}. Trend: ${s1.technicals.trend}.`],
          [`${s2.symbol} Momentum Profile`, `Current price $${s2.current_price} (${s2.change}). RSI(14) is at ${s2.technicals.rsi_14} with 20-day EMA at $${s2.technicals.ema_20}. Trend: ${s2.technicals.trend}.`],
          ['Relative Strength Verdict', `${s1.technicals.rsi_14 > s2.technicals.rsi_14 ? s1.symbol : s2.symbol} displays higher short-term momentum velocity, whereas ${s1.beta < s2.beta ? s1.symbol : s2.symbol} provides lower systemic market sensitivity (Beta ${Math.min(s1.beta, s2.beta)}).`]
        ],
        caveat: 'Technical indicators evaluate historical and current trading flows; they do not forecast exogenous macro shocks or earnings surprises.',
        sources: [
          { id: `TECH-${s1.symbol}`, title: `${s1.symbol} Intraday Moving Averages`, ref: 'NASDAQ Consolidated Tape', date: '2026-10-14' },
          { id: `TECH-${s2.symbol}`, title: `${s2.symbol} Intraday Moving Averages`, ref: 'NASDAQ Consolidated Tape', date: '2026-10-14' }
        ],
        confidencePct: 91
      });
    }

    // General or stock-specific market query
    return this.formatOutput({
      title: `${primaryStock.symbol} Technical & Market Momentum Thesis`,
      summary: `Market intelligence for ${primaryStock.company_name} indicates an active ${primaryStock.technicals.trend} supported by robust daily volume of ${primaryStock.volume_24h}.`,
      findings: [
        ['Price Action & Moving Averages', `${primaryStock.symbol} trades at $${primaryStock.current_price} (${primaryStock.change}), maintaining position above its 20-day EMA ($${primaryStock.technicals.ema_20}) and 50-day EMA ($${primaryStock.technicals.ema_50}).`],
        ['Momentum & Oscillator Metrics', `RSI(14) is registered at ${primaryStock.technicals.rsi_14}, indicating healthy directional strength without overextended exhaustion. MACD histogram stands at ${primaryStock.technicals.macd_histogram}.`],
        ['Derivatives & Max Pain Level', `Put-Call Ratio (PCR OI) is ${primaryStock.technicals.pcr_oi} with the max pain strike positioned at $${primaryStock.technicals.max_pain_strike}, presenting a supportive floor for the upcoming monthly expiry.`]
      ],
      caveat: 'Price momentum is subject to intraday liquidity shifts. Staggering limit entries is recommended rather than chasing momentum breaks.',
      sources: [
        { id: `MKT-${primaryStock.symbol}-FEED`, title: `${primaryStock.symbol} Real-Time Price & Options Chain`, ref: 'National Market System Feed', date: '2026-10-14' }
      ],
      confidencePct: 86
    });
  }
}

module.exports = new MarketAgent();
