import React, { useState, useEffect } from 'react'
import {
  ShieldAlert, ShieldCheck, AlertTriangle, Activity,
  Sliders, ArrowUpRight, Crosshair, Radar, RefreshCw
} from 'lucide-react'

const threatNodes = [
  {
    id: 'hhi-concentration',
    name: 'HHI Concentration (2,085)',
    level: 'MODERATE',
    color: '#fbbf24',
    x: 62, // % from left
    y: 35, // % from top
    angle: 45,
    metric: '2,085 HHI',
    desc: 'Moderate concentration. Top holding AAPL at 24.5% allocation.',
    actionScenario: 'tech-pullback',
  },
  {
    id: 'tech-overweight',
    name: 'Tech Sector Allocation (59.5%)',
    level: 'HIGH_EXPOSURE',
    color: '#ef4444',
    x: 82,
    y: 72,
    angle: 310,
    metric: '59.5% Weight',
    desc: 'Tech heavy. Combined AAPL, MSFT, NVDA, GOOGL allocation.',
    actionScenario: 'tech-pullback',
  },
  {
    id: 'beta-amplification',
    name: 'Weighted Portfolio Beta (1.25)',
    level: 'MODERATE',
    color: '#fbbf24',
    x: 28,
    y: 68,
    angle: 140,
    metric: '1.25x S&P Beta',
    desc: 'Amplifies broader S&P 500 swings by roughly 25%.',
    actionScenario: 'broad-market-correction',
  },
  {
    id: 'var-downside',
    name: '95% 1-Day VaR ($582.40)',
    level: 'GUARDED',
    color: '#34d399',
    x: 42,
    y: 40,
    angle: 220,
    metric: '$582.40 Parametric',
    desc: 'Normal statistical daily drawdown boundary within 95% confidence.',
    actionScenario: 'broad-market-correction',
  },
  {
    id: 'yield-shock',
    name: 'Yield Curve Spike (+50 bps)',
    level: 'VULNERABILITY',
    color: '#f97316',
    x: 75,
    y: 24,
    angle: 350,
    metric: '-$1,280 Estimated Impact',
    desc: '10-year Treasury jump impact on multiple valuations.',
    actionScenario: 'rate-hike-shock',
  },
]

export default function RiskThreatRadar({ onSelectScenario }) {
  const [activeThreat, setActiveThreat] = useState(threatNodes[0])
  const [scanning, setScanning] = useState(true)
  const [pulseCount, setPulseCount] = useState(0)

  // Periodic heartbeat animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount(p => p + 1)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  const handleNodeClick = (threat) => {
    setActiveThreat(threat)
    if (onSelectScenario && threat.actionScenario) {
      onSelectScenario(threat.actionScenario)
    }
  }

  return (
    <div className="threat-radar-card glass-panel-elevated">
      <div className="radar-header">
        <div className="radar-header-left">
          <span className="radar-live-badge">
            <span className="radar-sweep-dot" /> LIVE THREAT RADAR
          </span>
          <h3>Continuous Portfolio Threat Scanner</h3>
          <p>Real-time polar projection of asset concentration, macro shocks, and downside VaR limits.</p>
        </div>
        <div className="radar-status-tag">
          <Activity size={13} style={{ color: '#34d399' }} />
          <span>SWEEP FREQUENCY: 4.5s</span>
        </div>
      </div>

      <div className="radar-main-layout">
        {/* Circular Radar Display with Sweeping Beam */}
        <div className="radar-screen-wrap">
          <div className="radar-screen">
            {/* Concentric distance rings */}
            <div className="radar-ring ring-outer" />
            <div className="radar-ring ring-mid" />
            <div className="radar-ring ring-inner" />

            {/* Crosshairs */}
            <div className="radar-crosshair-h" />
            <div className="radar-crosshair-v" />

            {/* Sweeping Radar Beam */}
            <div className={`radar-sweeping-beam ${scanning ? 'beam-active' : ''}`} />

            {/* Center Origin Dot */}
            <div className="radar-center-point" />

            {/* Threat Nodes / Blips */}
            {threatNodes.map(node => {
              const isSelected = activeThreat.id === node.id

              return (
                <button
                  key={node.id}
                  className={`radar-blip-point ${isSelected ? 'blip-selected' : ''}`}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    borderColor: node.color,
                  }}
                  onClick={() => handleNodeClick(node)}
                  title={`${node.name} · Click to stress test`}
                  aria-label={node.name}
                >
                  <span
                    className="blip-core"
                    style={{ background: node.color }}
                  />
                  <span
                    className="blip-ping"
                    style={{ borderColor: node.color }}
                  />
                  <span className="blip-label" style={{ color: node.color }}>
                    {node.metric}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="radar-legend-bar">
            <span><i style={{ background: '#34d399' }} /> Guarded</span>
            <span><i style={{ background: '#fbbf24' }} /> Moderate</span>
            <span><i style={{ background: '#ef4444' }} /> High Exposure</span>
          </div>
        </div>

        {/* Live Telemetry Inspector for the Threat Node */}
        <div className="radar-threat-inspector glass-panel">
          <div className="threat-inspect-header">
            <span
              className="threat-level-tag"
              style={{
                color: activeThreat.color,
                background: `${activeThreat.color}18`,
                border: `1px solid ${activeThreat.color}44`,
              }}
            >
              <AlertTriangle size={12} /> {activeThreat.level}
            </span>
            <span className="threat-time">TELEMETRY REAL-TIME</span>
          </div>

          <h4>{activeThreat.name}</h4>
          <p className="threat-desc">{activeThreat.desc}</p>

          <div className="threat-stats-row">
            <div className="threat-stat-box">
              <small>MEASURED VALUE</small>
              <strong style={{ color: activeThreat.color }}>{activeThreat.metric}</strong>
            </div>
            <div className="threat-stat-box">
              <small>MITIGATION STATUS</small>
              <strong style={{ color: '#34d399' }}>Cash Buffer (13.3%)</strong>
            </div>
          </div>

          {onSelectScenario && (
            <button
              className="radar-action-btn hover-lift"
              onClick={() => onSelectScenario(activeThreat.actionScenario)}
            >
              Simulate Macro Shock In Risk Engine <ArrowUpRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
