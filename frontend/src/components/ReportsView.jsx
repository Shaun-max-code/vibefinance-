import { useState, useEffect } from 'react'
import {
  FileText, Sparkles, Download, CheckCircle, Clock,
  ArrowUpRight, Plus, Eye, ChevronRight, X, ShieldCheck
} from 'lucide-react'

const initialReports = [
  {
    id: 'REP-2026-W41',
    title: 'Weekly Multi-Agent Intelligence Digest: Big Tech Capex & Options Skew',
    date: '2026-10-14',
    period: 'Week 41, 2026',
    category: 'Weekly Intelligence',
    author: 'VibeFinance Multi-Agent Synthesis Engine',
    status: 'PUBLISHED',
    summary: 'Synthesizes momentum across US tech megacaps, shifts in put-call ratios, and corporate disclosure trends from recent SEC 10-Q filings.',
    key_takeaways: [
      'Semiconductor momentum continues with NVDA testing resistance near $188, supported by low Put-Call Ratio (0.72).',
      'Microsoft and Apple maintain solid gross margin expansion driven by enterprise cloud and high-margin services.',
      'Portfolio concentration (HHI 2085) remains within acceptable bounds but warrants monitoring as NVDA weight climbs.'
    ],
    metrics_snapshot: {
      portfolio_return_week: '+2.4%',
      portfolio_value: '$24,392.50',
      top_contributor: 'NVDA (+3.8%)',
      laggard: 'GOOGL (-0.4%)'
    }
  },
  {
    id: 'REP-2026-M09',
    title: 'Monthly Portfolio Risk & Concentration Audit',
    date: '2026-09-30',
    period: 'September 2026',
    category: 'Risk Audit',
    author: 'Risk Agent (HHI & VaR Analyzer)',
    status: 'ARCHIVED',
    summary: 'Comprehensive assessment of portfolio drawdown exposure, asset diversification across equities, ETFs, crypto, and cash buffers.',
    key_takeaways: [
      '95% 1-Day Value at Risk stood at $582.40 (2.39% of capital).',
      'Cash reserve of $3,250.00 provides ample dry powder for tactical dollar-cost averaging.',
      'No breach of 12.5% maximum drawdown threshold occurred during the September consolidation.'
    ],
    metrics_snapshot: {
      monthly_net_pnl: '+$1,840.50',
      sharpe_ratio: '1.82',
      beta: '1.25'
    }
  },
  {
    id: 'REP-2026-EQ-AAPL',
    title: 'Equity Deep Dive: Apple Inc. (AAPL) Services Moat & Ecosystem Valuation',
    date: '2026-10-08',
    period: 'Q4 2026',
    category: 'Equity Research',
    author: 'Research Agent (SEC Filing Corpus)',
    status: 'PUBLISHED',
    summary: 'Fundamental evaluation of Apple\'s 2.2B+ active installed base, high 74% Services gross margin, and Apple Intelligence compute rollout.',
    key_takeaways: [
      'Services business has reached $96B run rate with 74% gross margin.',
      'On-device neural engine deployments limit data center capex requirements compared to cloud peers.',
      'Antitrust regulatory proceedings represent the primary non-financial valuation headwind.'
    ],
    metrics_snapshot: {
      current_price: '$245.50',
      target_price: '$270.00',
      conviction: 'OVERWEIGHT'
    }
  }
]

export default function ReportsView({ onNavigateToResearch }) {
  const [reports, setReports] = useState(initialReports)
  const [selectedReport, setSelectedReport] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationSuccess, setGenerationSuccess] = useState(false)

  useEffect(() => {
    
fetch(`${import.meta.env.VITE_API_URL}/api/reports`)

      .then(res => res.json())
      .then(data => {
        if (data && data.reports && Array.isArray(data.reports)) {
          setReports(data.reports)
        }
      })
      .catch(() => {})
  }, [])

  function handleGenerateReport() {
    setIsGenerating(true)

    // Attempt backend API
    
fetch(`${import.meta.env.VITE_API_URL}/api/reports/generate`, {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: 'Real-Time Multi-Agent Risk & Equity Valuation Audit',
        category: 'Autonomous Synthesis'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.report) {
          setReports(prev => [data.report, ...prev])
        }
      })
      .catch(() => {})

    setTimeout(() => {
      const generated = {
        id: `REP-${Date.now()}`,
        title: 'Real-Time Multi-Agent Risk & Equity Valuation Audit',
        date: new Date().toISOString().split('T')[0],
        period: 'Live Session Evaluation',
        category: 'Autonomous Synthesis',
        author: 'VibeFinance Multi-Agent Synthesis Engine',
        status: 'PUBLISHED',
        summary: 'Synchronous cross-agent analysis reconciling technical breakout momentum with portfolio concentration boundaries and regulatory disclosures.',
        key_takeaways: [
          'Portfolio total equity stands calibrated at $24,392.50 (+18.6% cumulative return).',
          'Technology sector exposure (72.1%) verified against Herfindahl concentration index (HHI 2085).',
          'All four equity holdings (AAPL, MSFT, NVDA, GOOGL) continue trading comfortably above 50-day EMAs.'
        ],
        metrics_snapshot: {
          portfolio_value: '$24,392.50',
          daily_pnl: '+$588.20',
          var_95: '$582.40'
        }
      }

      setReports(prev => [generated, ...prev])
      setIsGenerating(false)
      setGenerationSuccess(true)
      setTimeout(() => setGenerationSuccess(false), 5000)
    }, 1200)
  }

  return (
    <div className="view-container">
      {/* View Header */}
      <div className="view-header">
        <div>
          <div className="eyebrow">
            <span className="live-dot" /> MULTI-AGENT SYNTHESIS DOSSIERS
          </div>
          <h1>Financial Intelligence Reports<span className="brand-accent">.</span></h1>
          <p>Institutional-grade analysis dossiers generated by coordinated AI research agents.</p>
        </div>
        <div className="header-actions">
          <button
            className="ask-button"
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            <Sparkles size={15} />
            {isGenerating ? 'Synthesizing...' : 'Generate On-Demand Audit'}
          </button>
        </div>
      </div>

      {generationSuccess && (
        <div className="feedback-banner">
          <CheckCircle size={17} />
          <span>New Multi-Agent Intelligence Audit successfully generated and added to dossier catalog!</span>
        </div>
      )}

      {/* Reports Grid */}
      <div className="reports-catalog-grid">
        {reports.map(report => (
          <div key={report.id} className="panel report-card">
            <div className="report-card-top">
              <span className="subtle-badge">{report.category}</span>
              <span className="status-pill pill-green">{report.status}</span>
            </div>

            <h3 className="report-title">{report.title}</h3>
            <p className="report-summary">{report.summary}</p>

            <div className="takeaways-list">
              <div className="takeaways-header">KEY TAKEAWAYS</div>
              {report.key_takeaways.map((takeaway, idx) => (
                <div key={idx} className="takeaway-item">
                  <CheckCircle size={13} className="takeaway-icon" />
                  <span>{takeaway}</span>
                </div>
              ))}
            </div>

            <div className="report-footer">
              <div className="report-author-block">
                <small>AUTHOR</small>
                <strong>{report.author}</strong>
                <span>{report.date} · {report.period}</span>
              </div>
              <button
                className="view-report-btn"
                onClick={() => setSelectedReport(report)}
              >
                <Eye size={14} /> View Dossier <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Report Modal */}
      {selectedReport && (
        <div className="modal-backdrop" onClick={() => setSelectedReport(null)}>
          <div className="modal-content report-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="report-modal-top">
                <span className="subtle-badge">{selectedReport.category}</span>
                <button className="icon-button" onClick={() => setSelectedReport(null)}>
                  <X size={16} />
                </button>
              </div>
              <h2>{selectedReport.title}</h2>
              <p>Prepared by {selectedReport.author} on {selectedReport.date} ({selectedReport.period})</p>
            </div>

            <div className="report-modal-body">
              <div className="modal-section">
                <h4>EXECUTIVE SUMMARY</h4>
                <p>{selectedReport.summary}</p>
              </div>

              <div className="modal-section">
                <h4>SYNTHESIS FINDINGS & EVIDENCE</h4>
                <div className="modal-findings">
                  {selectedReport.key_takeaways.map((t, idx) => (
                    <div key={idx} className="finding-box">
                      <span className="finding-num">{idx + 1}</span>
                      <p>{t}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedReport.metrics_snapshot && (
                <div className="modal-section">
                  <h4>BENCHMARK SNAPSHOT</h4>
                  <div className="metrics-snapshot-grid">
                    {Object.entries(selectedReport.metrics_snapshot).map(([k, v]) => (
                      <div key={k} className="snapshot-box">
                        <small>{k.replace(/_/g, ' ').toUpperCase()}</small>
                        <strong>{v}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="report-disclaimer">
                <ShieldCheck size={16} />
                <span>Simulated intelligence report generated for informational purposes within the VibeFinance workspace.</span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setSelectedReport(null)}>
                Close
              </button>
              {onNavigateToResearch && (
                <button
                  className="ask-button"
                  onClick={() => {
                    setSelectedReport(null)
                    onNavigateToResearch(`Explore key takeaways from report: ${selectedReport.title}`)
                  }}
                >
                  <Sparkles size={14} /> Deep-Dive in AI Research
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
