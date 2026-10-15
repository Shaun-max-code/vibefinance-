import React, { useState, useEffect } from 'react'
import {
  BrainCircuit, ShieldCheck, TrendingUp, Database, FileText,
  Activity, Sliders, ArrowRight, RefreshCw, Layers, CheckCircle2,
  Sparkles, Zap, Lock
} from 'lucide-react'

const layersData = [
  {
    id: 'layer-input',
    title: 'LAYER 1 · DATA FEEDS & RAG CORPUS',
    nodes: [
      { id: 'in-sec', label: 'SEC 10-K / 10-Q Filings', sub: 'Indexed RAG vector embeddings', icon: FileText, color: '#38bdf8', category: 'corpus' },
      { id: 'in-market', label: 'Real-Time Market Feeds', sub: 'Tick, volume, 20/50/200 EMAs', icon: TrendingUp, color: '#34d399', category: 'market' },
      { id: 'in-options', label: 'Options Chain & PCR Skew', sub: 'Call/Put sentiment & implied vol', icon: Activity, color: '#fbbf24', category: 'options' },
      { id: 'in-macro', label: 'Macro Interest Rate Shocks', sub: 'Treasury yields & Fed scenarios', icon: Sliders, color: '#a78bfa', category: 'macro' },
    ]
  },
  {
    id: 'layer-agents',
    title: 'LAYER 2 · SPECIALIZED AI AGENTS',
    nodes: [
      { id: 'agent-market', label: 'Market Agent', sub: 'Momentum & technical breakouts', icon: TrendingUp, color: '#34d399', category: 'agent', role: 'Technical Analyst' },
      { id: 'agent-research', label: 'Research Agent', sub: 'SEC RAG citations & margin trends', icon: BrainCircuit, color: '#38bdf8', category: 'agent', role: 'Corporate Analyst' },
      { id: 'agent-risk', label: 'Risk Agent', sub: 'HHI index, VaR 95%, cash buffers', icon: ShieldCheck, color: '#a78bfa', category: 'agent', role: 'Downside Exposure' },
    ]
  },
  {
    id: 'layer-consensus',
    title: 'LAYER 3 · NEURAL ARBITER',
    nodes: [
      { id: 'arbiter', label: 'Consensus & Constraint Matrix', sub: 'Resolves agent conflicts & bounds portfolio risk', icon: BrainCircuit, color: '#10b981', category: 'arbiter' },
    ]
  },
  {
    id: 'layer-output',
    title: 'LAYER 4 · GROUNDED INTELLIGENCE',
    nodes: [
      { id: 'out-dossier', label: 'Grounded Research Dossier', sub: 'Evidence-backed thesis with citations', icon: FileText, color: '#38bdf8', category: 'output' },
      { id: 'out-risk', label: 'Mathematical Guardrails', sub: 'HHI < 2,500 & 95% 1-Day VaR limits', icon: ShieldCheck, color: '#a78bfa', category: 'output' },
      { id: 'out-trade', label: 'Actionable Execution Plan', sub: 'Staggered limit orders & conviction vector', icon: Zap, color: '#34d399', category: 'output' },
    ]
  }
]

// Explicit connections mapping for relationship discovery
const connections = [
  // Layer 1 to Layer 2
  { from: 'in-sec', to: 'agent-research', color: '#38bdf8', delay: 0.1 },
  { from: 'in-market', to: 'agent-market', color: '#34d399', delay: 0.2 },
  { from: 'in-options', to: 'agent-market', color: '#fbbf24', delay: 0.3 },
  { from: 'in-options', to: 'agent-risk', color: '#a78bfa', delay: 0.4 },
  { from: 'in-macro', to: 'agent-risk', color: '#a78bfa', delay: 0.5 },
  { from: 'in-sec', to: 'agent-risk', color: '#38bdf8', delay: 0.6 },

  // Layer 2 to Layer 3
  { from: 'agent-market', to: 'arbiter', color: '#34d399', delay: 0.7 },
  { from: 'agent-research', to: 'arbiter', color: '#38bdf8', delay: 0.8 },
  { from: 'agent-risk', to: 'arbiter', color: '#a78bfa', delay: 0.9 },

  // Layer 3 to Layer 4
  { from: 'arbiter', to: 'out-dossier', color: '#38bdf8', delay: 1.1 },
  { from: 'arbiter', to: 'out-risk', color: '#a78bfa', delay: 1.2 },
  { from: 'arbiter', to: 'out-trade', color: '#34d399', delay: 1.3 },
]

export default function SelfDrawingArchitectureDiagram() {
  const [selectedNode, setSelectedNode] = useState('arbiter')
  const [drawKey, setDrawKey] = useState(0)
  const [isDrawing, setIsDrawing] = useState(true)
  const [particlesActive, setParticlesActive] = useState(true)

  // Re-trigger progressive drawing animation
  const handleRedraw = () => {
    setIsDrawing(false)
    setDrawKey(k => k + 1)
    setTimeout(() => setIsDrawing(true), 50)
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsDrawing(false), 2400)
    return () => clearTimeout(timer)
  }, [drawKey])

  // Find all active connections for current selection
  const activeIncoming = connections.filter(c => c.to === selectedNode).map(c => c.from)
  const activeOutgoing = connections.filter(c => c.from === selectedNode).map(c => c.to)

  const activeNodeInfo = layersData
    .flatMap(l => l.nodes)
    .find(n => n.id === selectedNode) || layersData[2].nodes[0]

  return (
    <div className="architecture-diagram-wrapper">
      {/* Header & Controls */}
      <div className="diagram-header">
        <div className="diagram-header-left">
          <div className="section-eyebrow">
            <Sparkles size={14} className="hover-icon-rotate" />
            <span>PROGRESSIVE SELF-DRAWING ARCHITECTURE</span>
          </div>
          <h2>Multi-Agent Autonomous Neural Architecture</h2>
          <p>
            Explore how raw SEC filings, streaming ticks, and options chain skew flow through
            specialized reasoning agents, conflict arbiters, and mathematical constraints.
          </p>
        </div>

        <div className="diagram-controls">
          <button
            className="diagram-ctrl-btn hover-lift"
            onClick={handleRedraw}
            title="Replay progressive self-drawing flow"
          >
            <RefreshCw size={14} className={isDrawing ? 'spin-anim' : ''} />
            <span>Redraw Flow</span>
          </button>
          <button
            className={`diagram-ctrl-btn hover-lift ${particlesActive ? 'ctrl-active' : ''}`}
            onClick={() => setParticlesActive(!particlesActive)}
            title="Toggle animated live data telemetry pulses"
          >
            <Activity size={14} />
            <span>{particlesActive ? 'Telemetry Flow: ON' : 'Telemetry Flow: OFF'}</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas with Progressive Self-Drawing Paths & Animated Pulses */}
      <div className="diagram-visual-container" key={drawKey}>
        {/* Dynamic Curved SVG Lines */}
        <svg className="diagram-svg-surface" aria-hidden="true">
          <defs>
            <linearGradient id="stream-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#34d399" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="stream-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="stream-purple" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.3" />
            </linearGradient>
            <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render connection bezier curves between layers */}
          {/* Layer 1 to Layer 2 paths */}
          <path
            d="M 220 80 C 310 80, 310 200, 390 200"
            className={`self-drawing-path path-cyan ${activeIncoming.includes('in-sec') && selectedNode === 'agent-research' ? 'path-highlighted' : ''}`}
            style={{ animationDelay: '0.15s' }}
          />
          <path
            d="M 220 160 C 310 160, 310 90, 390 90"
            className={`self-drawing-path path-emerald ${activeIncoming.includes('in-market') && selectedNode === 'agent-market' ? 'path-highlighted' : ''}`}
            style={{ animationDelay: '0.25s' }}
          />
          <path
            d="M 220 240 C 310 240, 310 110, 390 100"
            className={`self-drawing-path path-amber ${activeIncoming.includes('in-options') && selectedNode === 'agent-market' ? 'path-highlighted' : ''}`}
            style={{ animationDelay: '0.35s' }}
          />
          <path
            d="M 220 240 C 310 240, 310 290, 390 300"
            className={`self-drawing-path path-amber ${activeIncoming.includes('in-options') && selectedNode === 'agent-risk' ? 'path-highlighted' : ''}`}
            style={{ animationDelay: '0.45s' }}
          />
          <path
            d="M 220 320 C 310 320, 310 310, 390 310"
            className={`self-drawing-path path-purple ${activeIncoming.includes('in-macro') && selectedNode === 'agent-risk' ? 'path-highlighted' : ''}`}
            style={{ animationDelay: '0.55s' }}
          />

          {/* Layer 2 to Layer 3 paths (to Arbiter) */}
          <path
            d="M 590 100 C 660 100, 660 200, 720 200"
            className={`self-drawing-path path-emerald ${selectedNode === 'agent-market' || selectedNode === 'arbiter' ? 'path-highlighted' : ''}`}
            style={{ animationDelay: '0.75s' }}
          />
          <path
            d="M 590 200 C 660 200, 660 200, 720 200"
            className={`self-drawing-path path-cyan ${selectedNode === 'agent-research' || selectedNode === 'arbiter' ? 'path-highlighted' : ''}`}
            style={{ animationDelay: '0.85s' }}
          />
          <path
            d="M 590 300 C 660 300, 660 200, 720 200"
            className={`self-drawing-path path-purple ${selectedNode === 'agent-risk' || selectedNode === 'arbiter' ? 'path-highlighted' : ''}`}
            style={{ animationDelay: '0.95s' }}
          />

          {/* Layer 3 to Layer 4 paths (Outputs) */}
          <path
            d="M 920 200 C 980 200, 980 100, 1040 100"
            className={`self-drawing-path path-cyan ${activeOutgoing.includes('out-dossier') && selectedNode === 'arbiter' ? 'path-highlighted' : ''}`}
            style={{ animationDelay: '1.15s' }}
          />
          <path
            d="M 920 200 C 980 200, 980 200, 1040 200"
            className={`self-drawing-path path-purple ${activeOutgoing.includes('out-risk') && selectedNode === 'arbiter' ? 'path-highlighted' : ''}`}
            style={{ animationDelay: '1.25s' }}
          />
          <path
            d="M 920 200 C 980 200, 980 300, 1040 300"
            className={`self-drawing-path path-emerald ${activeOutgoing.includes('out-trade') && selectedNode === 'arbiter' ? 'path-highlighted' : ''}`}
            style={{ animationDelay: '1.35s' }}
          />
        </svg>

        {/* 4 Interactive Columns */}
        <div className="diagram-columns-grid">
          {layersData.map((layer, colIndex) => (
            <div key={layer.id} className="diagram-layer-column">
              <div className="diagram-col-title">{layer.title}</div>
              <div className="diagram-nodes-stack">
                {layer.nodes.map(node => {
                  const Icon = node.icon
                  const isSelected = selectedNode === node.id
                  const isRelated =
                    activeIncoming.includes(node.id) ||
                    activeOutgoing.includes(node.id)

                  let borderClass = ''
                  if (isSelected) borderClass = 'node-selected'
                  else if (isRelated) borderClass = 'node-related'

                  return (
                    <div
                      key={node.id}
                      className={`diagram-node-card glass-panel hover-lift ${borderClass}`}
                      onClick={() => setSelectedNode(node.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="node-icon-wrap" style={{ color: node.color, background: `${node.color}18` }}>
                        <Icon size={18} className="hover-icon-rotate" />
                      </div>
                      <div className="node-text">
                        <strong>{node.label}</strong>
                        <small>{node.sub}</small>
                      </div>
                      {particlesActive && (
                        <span className="live-data-dot" style={{ background: node.color }} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Node Telemetry Inspector */}
      <div className="diagram-inspector glass-panel-elevated">
        <div className="inspector-left">
          <div className="inspector-icon" style={{ color: activeNodeInfo.color, background: `${activeNodeInfo.color}22` }}>
            <activeNodeInfo.icon size={22} className="hover-icon-rotate" />
          </div>
          <div className="inspector-title">
            <span className="inspector-badge" style={{ color: activeNodeInfo.color, borderColor: `${activeNodeInfo.color}44` }}>
              ● INSPECTING: {activeNodeInfo.label.toUpperCase()}
            </span>
            <h3>{activeNodeInfo.label}</h3>
            <p>{activeNodeInfo.sub}</p>
          </div>
        </div>

        <div className="inspector-telemetry">
          <div className="telemetry-item">
            <small>LATENCY</small>
            <strong>12ms</strong>
            <span className="positive">Optimal</span>
          </div>
          <div className="telemetry-item">
            <small>GROUNDING</small>
            <strong>100%</strong>
            <span>Verified SEC</span>
          </div>
          <div className="telemetry-item">
            <small>RELATIONSHIPS</small>
            <strong>{activeIncoming.length + activeOutgoing.length} Active</strong>
            <span style={{ color: activeNodeInfo.color }}>Bilateral</span>
          </div>
        </div>
      </div>
    </div>
  )
}
