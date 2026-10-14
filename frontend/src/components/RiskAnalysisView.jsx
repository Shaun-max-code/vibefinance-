import { useState, useEffect } from 'react'
import {
  ShieldCheck, AlertTriangle, Activity, TrendingDown,
  BarChart2, Zap, ArrowDownRight, ArrowUpRight, Sparkles, Sliders
} from 'lucide-react'

const initialRiskData = {
  metrics: {
    portfolio_value: 24392.50,
    portfolio_beta: 1.25,
    hhi: {
      score: 2085,
      rating: 'MODERATE_CONCENTRATION',
      description: 'HHI between 1,500 and 2,500 indicates moderate concentration. Top holding AAPL represents 24.5% of allocation.'
    },
    var_95: {
      amount_formatted: '$582.40',
      percentage: '2.39%',
      time_horizon: '1 Day',
      confidence: '95%'
    },
    max_drawdown_1y: '8.4%',
    sharpe_ratio: 1.82,
    annualized_volatility: '16.8%'
  },
  sector_weights: [
    { sector: 'Consumer Electronics & Services', weight: 24.5, symbol: 'AAPL', color: '#94a3b8' },
    { sector: 'Enterprise Software & Cloud', weight: 18.2, symbol: 'MSFT', color: '#60a5fa' },
    { sector: 'Semiconductors & AI Compute', weight: 16.8, symbol: 'NVDA', color: '#a3e635' },
    { sector: 'Digital Advertising & Search', weight: 12.6, symbol: 'GOOGL', color: '#fbbf24' },
    { sector: 'Cash & Liquidity', weight: 13.3, symbol: 'CASH', color: '#34d399' },
    { sector: 'Diversified / Crypto / ETFs', weight: 14.6, symbol: 'MIXED', color: '#a78bfa' }
  ],
  scenarios: [
    {
      id: 'tech-pullback',
      name: 'Tech Sector Multiple Contraction',
      trigger: '15% drawdown in high-multiple semiconductor & hyperscaler equities',
      estimated_pnl: -2410.00,
      estimated_pct: '-9.88%',
      projected_value: '$21,982.50',
      primary_impacted_assets: ['NVDA', 'MSFT', 'AAPL'],
      recommendation: 'Maintain cash buffer of 13.3% and stagger limit orders at 200-day EMA support levels.'
    },
    {
      id: 'rate-hike-shock',
      name: 'Yield Curve Spike (+50 bps Shock)',
      trigger: 'Unanticipated inflation print drives 10-year US Treasury yield up 50 basis points',
      estimated_pnl: -1280.00,
      estimated_pct: '-5.25%',
      projected_value: '$23,112.50',
      primary_impacted_assets: ['MSFT', 'GOOGL'],
      recommendation: 'High cash-generative balance sheets in Apple & Microsoft mitigate terminal default risk.'
    },
    {
      id: 'broad-market-correction',
      name: 'Broad Market Pullback (-5% S&P 500)',
      trigger: 'Macro liquidity drain leading to synchronized 5% decline across major benchmarks',
      estimated_pnl: -1512.00,
      estimated_pct: '-6.20%',
      projected_value: '$22,880.50',
      primary_impacted_assets: ['AAPL', 'MSFT', 'NVDA', 'GOOGL'],
      recommendation: 'Portfolio Beta of 1.25 implies roughly 1.25x amplification of broader index moves.'
    },
    {
      id: 'ai-expansion-supercycle',
      name: 'Hyperscaler Capex Surprise (+20% Expansion)',
      trigger: 'Big tech earnings declare increased infrastructure budgets and accelerated inferencing',
      estimated_pnl: 2180.00,
      estimated_pct: '+8.94%',
      projected_value: '$26,572.50',
      primary_impacted_assets: ['NVDA', 'MSFT'],
      recommendation: 'Consider harvesting partial gains if position weight in NVDA exceeds 20% to manage concentration risk.'
    }
  ]
}

export default function RiskAnalysisView({ onNavigateToResearch }) {
  const [riskData, setRiskData] = useState(initialRiskData)
  const [activeScenario, setActiveScenario] = useState(initialRiskData.scenarios[0])
  const [customShock, setCustomShock] = useState(-10)

  useEffect(() => {
    fetch('http://localhost:5000/api/risk')
      .then(res => res.json())
      .then(data => {
        if (data && data.metrics) {
          setRiskData(prev => ({
            ...prev,
            metrics: data.metrics,
            sector_weights: data.sector_weights || prev.sector_weights,
            scenarios: data.predefined_scenarios || prev.scenarios
          }))
        }
      })
      .catch(() => {})
  }, [])

  const customLoss = (24392.50 * (customShock / 100)).toFixed(2)
  const customProjected = (24392.50 * (1 + customShock / 100)).toFixed(2)

  return (
    <div className="view-container">
      {/* View Header */}
      <div className="view-header">
        <div>
          <div className="eyebrow">
            <span className="live-dot" /> DOWNSIDE & SENSITIVITY FRAMEWORK
          </div>
          <h1>Risk Analysis<span className="brand-accent">.</span></h1>
          <p>Herfindahl concentration index, parametric Value-at-Risk, and macro scenario stress testing.</p>
        </div>
      </div>

      {/* Core Risk Metrics Grid */}
      <div className="metrics-grid">
        <article className="metric-card">
          <div className="metric-heading">
            <span>Concentration (HHI)</span>
            <ShieldCheck size={17} />
          </div>
          <div className="metric-value">{riskData.metrics.hhi.score}</div>
          <div className="metric-change" style={{ color: '#fbbf24' }}>
            <AlertTriangle size={14} /> Moderate Concentration
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-heading">
            <span>Portfolio Beta</span>
            <Activity size={17} />
          </div>
          <div className="metric-value">{riskData.metrics.portfolio_beta}</div>
          <div className="metric-change">
            1.25x market sensitivity
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-heading">
            <span>95% 1-Day VaR</span>
            <TrendingDown size={17} />
          </div>
          <div className="metric-value">{riskData.metrics.var_95.amount_formatted}</div>
          <div className="metric-change negative">
            {riskData.metrics.var_95.percentage} daily boundary
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-heading">
            <span>Max Drawdown (1Y)</span>
            <BarChart2 size={17} />
          </div>
          <div className="metric-value">{riskData.metrics.max_drawdown_1y}</div>
          <div className="metric-change">
            Sharpe: {riskData.metrics.sharpe_ratio}
          </div>
        </article>
      </div>

      {/* Concentration & HHI Detail Grid */}
      <div className="risk-layout-grid">
        {/* Left: HHI Concentration Gauge & Sector Stack */}
        <div className="panel risk-hhi-panel">
          <div className="section-heading">
            <div>
              <h2>Herfindahl-Hirschman Concentration (HHI)</h2>
              <p>Measures single-asset and sector portfolio concentration risk</p>
            </div>
            <span className="subtle-badge">HHI: {riskData.metrics.hhi.score}</span>
          </div>

          {/* HHI Visual Meter */}
          <div className="hhi-meter-wrap">
            <div className="hhi-meter-bar">
              <div className="hhi-zone zone-safe" style={{ width: '30%' }}><span>Diversified (&lt;1500)</span></div>
              <div className="hhi-zone zone-warn" style={{ width: '40%' }}><span>Moderate (1500-2500)</span></div>
              <div className="hhi-zone zone-danger" style={{ width: '30%' }}><span>High (&gt;2500)</span></div>
              <div
                className="hhi-needle"
                style={{ left: `${Math.min(Math.max((riskData.metrics.hhi.score / 3500) * 100, 5), 95)}%` }}
              />
            </div>
            <p className="hhi-explanation">{riskData.metrics.hhi.description}</p>
          </div>

          <h3 className="sub-heading">Sector Exposure Breakdown</h3>
          <div className="sector-weights-list">
            {riskData.sector_weights.map(sw => (
              <div key={sw.sector} className="sector-row">
                <div className="sector-info">
                  <div className="sector-dot" style={{ background: sw.color }} />
                  <span>{sw.sector}</span>
                </div>
                <div className="sector-bar-wrap">
                  <div className="sector-bar" style={{ width: `${sw.weight * 3}%`, background: sw.color }} />
                  <strong>{sw.weight}%</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Macro Scenario Stress Testing Simulator */}
        <div className="panel stress-testing-panel">
          <div className="section-heading">
            <div>
              <h2>Scenario Stress Simulator</h2>
              <p>Simulate hypothetical factor shocks across active holdings</p>
            </div>
            <span className="ai-badge"><Sparkles size={12} /> AI Stress Model</span>
          </div>

          <div className="scenarios-selector">
            {riskData.scenarios.map(s => {
              const isSelected = activeScenario.id === s.id
              const isPos = String(s.estimated_pct).startsWith('+')

              return (
                <button
                  key={s.id}
                  className={`scenario-card-btn ${isSelected ? 'scenario-active' : ''}`}
                  onClick={() => setActiveScenario(s)}
                >
                  <div className="scenario-card-top">
                    <strong>{s.name}</strong>
                    <span className={isPos ? 'positive' : 'negative'}>{s.estimated_pct}</span>
                  </div>
                  <small>{s.trigger}</small>
                </button>
              )
            })}
          </div>

          {/* Active Scenario Detailed Breakdown */}
          {activeScenario && (
            <div className="active-scenario-detail">
              <div className="scenario-impact-header">
                <div>
                  <small>ESTIMATED P&L IMPACT</small>
                  <div className={String(activeScenario.estimated_pct).startsWith('+') ? 'positive big-text' : 'negative big-text'}>
                    ${activeScenario.estimated_pnl.toLocaleString()} ({activeScenario.estimated_pct})
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <small>PROJECTED PORTFOLIO</small>
                  <div className="big-text" style={{ color: '#f1f5f9' }}>
                    {activeScenario.projected_value}
                  </div>
                </div>
              </div>

              <div className="scenario-assets">
                <span>Impacted Assets:</span>
                <div className="asset-chips">
                  {activeScenario.primary_impacted_assets.map(a => (
                    <span key={a} className="asset-chip">{a}</span>
                  ))}
                </div>
              </div>

              <div className="scenario-recommendation">
                <ShieldCheck size={16} />
                <p><strong>Risk Agent Mandate:</strong> {activeScenario.recommendation}</p>
              </div>

              {onNavigateToResearch && (
                <button
                  className="research-button"
                  onClick={() => onNavigateToResearch(`How should I hedge against ${activeScenario.name}?`)}
                >
                  <Sparkles size={15} /> Consult Risk Agent on Hedging Strategy
                </button>
              )}
            </div>
          )}

          {/* Custom Sensitivity Slider */}
          <div className="custom-shock-block">
            <div className="shock-label">
              <span><Sliders size={14} /> Custom Market Shock Simulation:</span>
              <strong>{customShock}%</strong>
            </div>
            <input
              type="range"
              min="-30"
              max="20"
              value={customShock}
              onChange={e => setCustomShock(Number(e.target.value))}
              className="shock-slider"
            />
            <div className="custom-result">
              <span>Projected Change: <strong className={customShock >= 0 ? 'positive' : 'negative'}>{customLoss} USD</strong></span>
              <span>Projected Value: <strong>${customProjected}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
