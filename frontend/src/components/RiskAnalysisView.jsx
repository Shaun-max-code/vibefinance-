import { useState, useEffect } from 'react'
import {
  ShieldCheck, AlertTriangle, Activity, TrendingDown,
  BarChart2, Zap, ArrowDownRight, ArrowUpRight, Sparkles, Sliders,
  LayoutGrid, Crosshair, Cpu
} from 'lucide-react'
import RiskThreatRadar from './RiskThreatRadar'
import Tilt3DCard from '../effects/Tilt3DCard'
import { useRealtime } from '../context/RealtimeContext'

const initialRiskData = {
  metrics: {
    portfolio_beta: 1.25,
    hhi: {
      score: 2085,
      rating: 'MODERATE_CONCENTRATION',
      description: 'HHI between 1,500 and 2,500 indicates moderate concentration. Top holding AAPL represents 24.5% of allocation.'
    },
    var_95: {
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
      name: 'Tech Multiple Contraction',
      fullName: 'Tech Sector Multiple Contraction',
      trigger: '15% drawdown in high-multiple semiconductor & hyperscaler equities',
      pct_num: -9.88,
      estimated_pct: '-9.88%',
      primary_impacted_assets: ['NVDA', 'MSFT', 'AAPL'],
      recommendation: 'Maintain cash buffer of 13.3% and stagger limit orders at 200-day EMA support levels.'
    },
    {
      id: 'rate-hike-shock',
      name: 'Yield Curve Spike (+50 bps)',
      fullName: 'Yield Curve Spike (+50 bps Shock)',
      trigger: 'Unanticipated inflation print drives 10-year US Treasury yield up 50 basis points',
      pct_num: -5.25,
      estimated_pct: '-5.25%',
      primary_impacted_assets: ['MSFT', 'GOOGL'],
      recommendation: 'High cash-generative balance sheets in Apple & Microsoft mitigate terminal default risk.'
    },
    {
      id: 'broad-market-correction',
      name: 'Market Pullback (-5% S&P)',
      fullName: 'Broad Market Pullback (-5% S&P 500)',
      trigger: 'Macro liquidity drain leading to synchronized 5% decline across major benchmarks',
      pct_num: -6.20,
      estimated_pct: '-6.20%',
      primary_impacted_assets: ['AAPL', 'MSFT', 'NVDA', 'GOOGL'],
      recommendation: 'Portfolio Beta of 1.25 implies roughly 1.25x amplification of broader index moves.'
    },
    {
      id: 'ai-expansion-supercycle',
      name: 'Hyperscaler Capex Surge',
      fullName: 'Hyperscaler Capex Surprise (+20% Expansion)',
      trigger: 'Big tech earnings declare increased infrastructure budgets and accelerated inferencing',
      pct_num: 8.94,
      estimated_pct: '+8.94%',
      primary_impacted_assets: ['NVDA', 'MSFT'],
      recommendation: 'Consider harvesting partial gains if position weight in NVDA exceeds 20% to manage concentration risk.'
    }
  ]
}

export default function RiskAnalysisView({ onNavigateToResearch }) {
  const { portfolioValue, portfolioValueFormatted, portfolioTickDir } = useRealtime()
  const [riskData, setRiskData] = useState(initialRiskData)
  const [activeScenario, setActiveScenario] = useState(initialRiskData.scenarios[0])
  const [customShock, setCustomShock] = useState(-10)
  // View mode switcher: 'unified' (uncluttered clean view) | 'radar' (detailed polar scanner)
  const [viewMode, setViewMode] = useState('unified')

  useEffect(() => {
  
fetch(`${import.meta.env.VITE_API_URL}/api/risk`)

      .then(res => res.json())
      .then(data => {
        if (data && data.metrics) {
          setRiskData(prev => ({
            ...prev,
            metrics: { ...prev.metrics, ...data.metrics },
            sector_weights: data.sector_weights || prev.sector_weights,
          }))
        }
      })
      .catch(() => {})
  }, [])

  // Dynamic real-time calculations from live portfolio value
  const liveVaRAmount = (portfolioValue * 0.02388).toFixed(2)
  const scenarioDollarLoss = ((portfolioValue * activeScenario.pct_num) / 100).toFixed(2)
  const scenarioProjectedValue = (portfolioValue + parseFloat(scenarioDollarLoss)).toFixed(2)
  const customLoss = (portfolioValue * (customShock / 100)).toFixed(2)
  const customProjected = (portfolioValue * (1 + customShock / 100)).toFixed(2)

  return (
    <div className="view-container">
      {/* View Header with Clean View Switcher */}
      <div className="view-header">
        <div>
          <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="live-badge-stream">
              <span className="live-beacon-dot" /> REAL-TIME TAIL RISK
            </span>
            <span>DOWNSIDE & SENSITIVITY FRAMEWORK</span>
          </div>
          <h1>Risk Analysis<span className="brand-accent">.</span></h1>
          <p>Herfindahl concentration index, parametric Value-at-Risk, and macro scenario stress testing.</p>
        </div>

        <div className="header-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Segmented View Mode Toggle to eliminate clutter */}
          <div className="risk-mode-toggle-group">
            <button
              className={`risk-mode-btn ${viewMode === 'unified' ? 'risk-mode-active' : ''}`}
              onClick={() => setViewMode('unified')}
            >
              <LayoutGrid size={14} /> Executive View
            </button>
            <button
              className={`risk-mode-btn ${viewMode === 'radar' ? 'risk-mode-active' : ''}`}
              onClick={() => setViewMode('radar')}
            >
              <Crosshair size={14} /> Threat Radar
            </button>
          </div>

          {onNavigateToResearch && (
            <button
              className="ask-button"
              onClick={() => onNavigateToResearch('Evaluate portfolio tail risk, Value-at-Risk parameters, and sector concentration')}
            >
              <Sparkles size={14} /> Ask Risk Audit
            </button>
          )}
        </div>
      </div>

      {/* Core Real-Time Risk Metrics Grid with 3D Depth */}
      <div className="metrics-grid">
        <Tilt3DCard maxTilt={6} variant="amber" className="metric-card glass-panel hover-lift">
          <div className="metric-heading depth-layer-1">
            <span>Concentration (HHI)</span>
            <ShieldCheck size={16} className="hover-icon-rotate" />
          </div>
          <div className="metric-value depth-layer-2">{riskData.metrics.hhi.score}</div>
          <div className="metric-change depth-layer-1" style={{ color: '#fbbf24' }}>
            <AlertTriangle size={13} /> Moderate Concentration
          </div>
        </Tilt3DCard>

        <Tilt3DCard maxTilt={6} variant="blue" className="metric-card glass-panel hover-lift">
          <div className="metric-heading depth-layer-1">
            <span>Portfolio Beta</span>
            <Activity size={16} className="hover-icon-rotate" />
          </div>
          <div className="metric-value depth-layer-2">{riskData.metrics.portfolio_beta}</div>
          <div className="metric-change depth-layer-1">
            1.25x market sensitivity
          </div>
        </Tilt3DCard>

        <Tilt3DCard maxTilt={6} variant="green" className="metric-card glass-panel hover-lift">
          <div className="metric-heading depth-layer-1">
            <span>95% 1-Day VaR</span>
            <TrendingDown size={16} className="hover-icon-rotate" />
          </div>
          <div className={`metric-value depth-layer-2 ${portfolioTickDir ? 'tick-flash-up' : ''}`}>
            ${liveVaRAmount}
          </div>
          <div className="metric-change depth-layer-1 negative">
            {riskData.metrics.var_95.percentage} daily boundary
          </div>
        </Tilt3DCard>

        <Tilt3DCard maxTilt={6} variant="purple" className="metric-card glass-panel hover-lift">
          <div className="metric-heading depth-layer-1">
            <span>Max Drawdown (1Y)</span>
            <BarChart2 size={16} className="hover-icon-rotate" />
          </div>
          <div className="metric-value depth-layer-2">{riskData.metrics.max_drawdown_1y}</div>
          <div className="metric-change depth-layer-1">
            Sharpe: {riskData.metrics.sharpe_ratio}
          </div>
        </Tilt3DCard>
      </div>

      {/* Conditionally Render Radar or Executive View to keep the interface clean and spacious */}
      {viewMode === 'radar' ? (
        <div className="radar-view-wrap">
          <RiskThreatRadar
            onSelectScenario={(scenarioId) => {
              const s = riskData.scenarios.find(sc => sc.id === scenarioId)
              if (s) {
                setActiveScenario(s)
                setViewMode('unified')
              }
            }}
          />
        </div>
      ) : (
        /* Streamlined, Uncluttered Executive Layout */
        <div className="risk-layout-grid">
          {/* Left: Concentration Gauge & Sector Stack */}
          <div className="panel risk-hhi-panel glass-panel">
            <div className="section-heading">
              <div>
                <h2>Herfindahl Concentration (HHI)</h2>
                <p>Asset and sector concentration exposure</p>
              </div>
              <span className="subtle-badge">HHI: {riskData.metrics.hhi.score}</span>
            </div>

            {/* Clean HHI Gauge */}
            <div className="hhi-meter-wrap" style={{ margin: '12px 0 16px', padding: '12px' }}>
              <div className="hhi-meter-bar">
                <div className="hhi-zone zone-safe" style={{ width: '32%' }}><span>Diversified</span></div>
                <div className="hhi-zone zone-warn" style={{ width: '38%' }}><span>Moderate</span></div>
                <div className="hhi-zone zone-danger" style={{ width: '30%' }}><span>High Risk</span></div>
                <div
                  className="hhi-needle"
                  style={{ left: `${Math.min(Math.max((riskData.metrics.hhi.score / 3500) * 100, 5), 95)}%` }}
                />
              </div>
              <p className="hhi-explanation">{riskData.metrics.hhi.description}</p>
            </div>

            <h3 className="sub-heading" style={{ margin: '14px 0 10px', fontSize: '11px' }}>Sector Exposure Breakdown</h3>
            <div className="sector-weights-list">
              {riskData.sector_weights.map(sw => (
                <div key={sw.sector} className="sector-row">
                  <div className="sector-info">
                    <div className="sector-dot" style={{ background: sw.color }} />
                    <span style={{ fontSize: '11px' }}>{sw.sector}</span>
                  </div>
                  <div className="sector-bar-wrap">
                    <div className="sector-bar" style={{ width: `${sw.weight * 2.8}%`, background: sw.color }} />
                    <strong style={{ fontSize: '11px' }}>{sw.weight}%</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Streamlined Macro Scenario Stress Simulator */}
          <div className="panel stress-testing-panel glass-panel">
            <div className="section-heading">
              <div>
                <h2>Scenario Stress Simulator</h2>
                <p>Live factor shock projection against active holdings</p>
              </div>
              <span className="ai-badge glass-badge"><Sparkles size={12} /> AI Stress Engine</span>
            </div>

            {/* Clean Segmented Scenario Selector Pills */}
            <div className="scenario-pills-row">
              {riskData.scenarios.map(s => {
                const isSelected = activeScenario.id === s.id
                const isPos = s.pct_num >= 0

                return (
                  <button
                    key={s.id}
                    className={`scenario-pill-btn ${isSelected ? 'scenario-pill-active' : ''}`}
                    onClick={() => setActiveScenario(s)}
                  >
                    <span>{s.name}</span>
                    <strong className={isPos ? 'positive' : 'negative'}>{s.estimated_pct}</strong>
                  </button>
                )
              })}
            </div>

            {/* Active Scenario Impact Box */}
            <div className="active-scenario-detail" style={{ marginTop: '12px', padding: '14px' }}>
              <div className="scenario-impact-header">
                <div>
                  <small>ESTIMATED P&L IMPACT</small>
                  <div className={activeScenario.pct_num >= 0 ? 'positive big-text' : 'negative big-text'}>
                    {activeScenario.pct_num >= 0 ? '+' : ''}${Math.abs(scenarioDollarLoss).toLocaleString()} ({activeScenario.estimated_pct})
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <small>PROJECTED PORTFOLIO</small>
                  <div className="big-text" style={{ color: '#f1f5f9' }}>
                    ${parseFloat(scenarioProjectedValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              <div className="scenario-assets" style={{ margin: '8px 0' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Impacted Assets:</span>
                <div className="asset-chips">
                  {activeScenario.primary_impacted_assets.map(a => (
                    <span key={a} className="asset-chip">{a}</span>
                  ))}
                </div>
              </div>

              <div className="scenario-recommendation" style={{ padding: '8px 10px', fontSize: '11px' }}>
                <ShieldCheck size={15} style={{ flexShrink: 0, color: '#34d399' }} />
                <p style={{ margin: 0, lineHeight: 1.4 }}>
                  <strong>Risk Agent:</strong> {activeScenario.recommendation}
                </p>
              </div>

              {onNavigateToResearch && (
                <button
                  className="research-button hover-lift"
                  style={{ width: '100%', marginTop: '8px', padding: '8px', fontSize: '12px' }}
                  onClick={() => onNavigateToResearch(`How should I hedge against ${activeScenario.fullName}?`)}
                >
                  <Sparkles size={14} /> Consult Risk Agent on Hedging Strategy
                </button>
              )}
            </div>

            {/* Compact Sensitivity Slider */}
            <div className="custom-shock-block" style={{ marginTop: '14px', padding: '12px' }}>
              <div className="shock-label">
                <span><Sliders size={13} /> Custom Market Shock Simulation:</span>
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
              <div className="custom-result" style={{ fontSize: '11px' }}>
                <span>Impact: <strong className={customShock >= 0 ? 'positive' : 'negative'}>{customLoss} USD</strong></span>
                <span>Projected Value: <strong>${parseFloat(customProjected).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
