import { useState } from 'react'
import {
  Wallet, ArrowUpRight, ArrowDownRight, Plus, RefreshCw,
  Clock, CheckCircle, ShieldCheck, PieChart as PieIcon, ArrowRightLeft, Sparkles, Activity
} from 'lucide-react'
import { useRealtime } from '../context/RealtimeContext'

const initialAllocation = [
  { name: 'Equities', value: 62.4, color: '#10b981', amount: '$15,220.92' },
  { name: 'ETFs', value: 18.7, color: '#38bdf8', amount: '$4,561.40' },
  { name: 'Crypto', value: 8.3, color: '#a78bfa', amount: '$2,024.58' },
  { name: 'Cash', value: 6.1, color: '#fbbf24', amount: '$1,487.94' },
  { name: 'Others', value: 4.5, color: '#64748b', amount: '$1,097.66' }
]

export default function PortfolioView({ onNavigateToResearch }) {
  const {
    holdings,
    portfolioValueFormatted,
    dailyPnLFormatted,
    dailyPnLChange,
    dailyPnLIsPositive,
    totalReturnFormatted,
    totalReturnPct,
    cashBalanceFormatted,
    cashWeight,
    transactions,
    executeTrade,
    portfolioTickDir,
  } = useRealtime()

  const [allocation] = useState(initialAllocation)
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [tradeForm, setTradeForm] = useState({ symbol: 'NVDA', type: 'BUY', shares: 2 })
  const [tradeFeedback, setTradeFeedback] = useState(null)

  function handleTradeSubmit(e) {
    e.preventDefault()
    const sharesNum = parseFloat(tradeForm.shares) || 1
    const res = executeTrade({
      symbol: tradeForm.symbol,
      type: tradeForm.type,
      shares: sharesNum
    })

    if (res.success) {
      setTradeFeedback(`Simulated ${tradeForm.type} order for ${sharesNum} shares of ${tradeForm.symbol} executed in real time.`)
    } else {
      setTradeFeedback(res.error || 'Trade could not be executed.')
    }

    setShowTradeModal(false)
    setTimeout(() => setTradeFeedback(null), 5000)
  }

  return (
    <div className="view-container">
      {/* View Header */}
      <div className="view-header">
        <div>
          <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="live-badge-stream">
              <span className="live-beacon-dot" /> LIVE TICK STREAM · REAL TIME
            </span>
            <span>CAPITAL ASSETS & ALLOCATION</span>
          </div>
          <h1>Portfolio Holdings<span className="brand-accent">.</span></h1>
          <p>Real-time valuation, cost basis tracking, and simulated trade execution.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '10px' }}>
          {onNavigateToResearch && (
            <button
              className="trade-quick-btn"
              style={{ padding: '8px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              onClick={() => onNavigateToResearch('Perform full multi-agent risk and concentration audit of active portfolio positions')}
            >
              <Sparkles size={14} /> Ask AI Portfolio Audit
            </button>
          )}
          <button className="ask-button" onClick={() => setShowTradeModal(true)}>
            <Plus size={15} /> Simulate Trade
          </button>
        </div>
      </div>

      {/* Trade Feedback Alert */}
      {tradeFeedback && (
        <div className="feedback-banner">
          <CheckCircle size={17} />
          <span>{tradeFeedback}</span>
        </div>
      )}

      {/* Real-Time Live Portfolio Metrics Grid */}
      <div className="metrics-grid">
        <article className="metric-card">
          <div className="metric-heading">
            <span>Portfolio value</span>
            <Wallet size={17} />
          </div>
          <div className={`metric-value ${portfolioTickDir ? (portfolioTickDir === 'up' ? 'tick-flash-up' : 'tick-flash-down') : ''}`}>
            {portfolioValueFormatted}
          </div>
          <div className="metric-change positive">
            <ArrowUpRight size={14} /> Live Real-Time
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-heading">
            <span>Daily P&L</span>
            <ArrowUpRight size={17} />
          </div>
          <div className="metric-value">
            {dailyPnLFormatted}
          </div>
          <div className={`metric-change ${dailyPnLIsPositive ? 'positive' : 'negative'}`}>
            <ArrowUpRight size={14} /> {dailyPnLChange}
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-heading">
            <span>Total return</span>
            <Sparkles size={17} />
          </div>
          <div className="metric-value">{totalReturnPct}</div>
          <div className="metric-change positive">
            <ArrowUpRight size={14} /> {totalReturnFormatted} all time
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-heading">
            <span>Cash balance</span>
            <ShieldCheck size={17} />
          </div>
          <div className="metric-value">{cashBalanceFormatted}</div>
          <div className="metric-change">
            {cashWeight}
          </div>
        </article>
      </div>

      {/* Holdings & Asset Breakdown Grid */}
      <div className="portfolio-content-grid">
        {/* Holdings Table */}
        <div className="panel holdings-full-panel">
          <div className="section-heading">
            <div>
              <h2>Active Positions</h2>
              <p>Equity holdings sorted by portfolio weight</p>
            </div>
            <span className="subtle-badge">4 Assets</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ASSET</th>
                  <th>PRICE</th>
                  <th>24H</th>
                  <th>SHARES</th>
                  <th>AVG COST</th>
                  <th>MARKET VALUE</th>
                  <th>UNREALIZED P&L</th>
                  <th>WEIGHT</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map(h => {
                  const tickClass = h.lastTick === 'up' ? 'tick-flash-up' : h.lastTick === 'down' ? 'tick-flash-down' : ''

                  return (
                    <tr key={h.symbol}>
                      <td>
                        <div className="asset-cell">
                          <span className="asset-icon" style={{ color: h.color }}>{h.symbol[0]}</span>
                          <div>
                            <strong>{h.symbol}</strong>
                            <small>{h.name}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={tickClass}>
                          <strong>{h.price_formatted}</strong>
                        </span>
                      </td>
                      <td className={h.change_is_positive ? 'positive' : 'negative'}>
                        {h.change_formatted}
                      </td>
                      <td>{h.shares}</td>
                      <td>${h.avg_cost.toFixed(2)}</td>
                      <td>
                        <strong className={tickClass}>{h.market_value_formatted}</strong>
                      </td>
                      <td className={h.unrealized_pnl_num >= 0 ? 'positive' : 'negative'}>
                        {h.unrealized_pnl_formatted}
                      </td>
                      <td>
                        <div className="weight-cell">
                          <span>{h.weight_formatted}</span>
                          <div className="weight-bar">
                            <div style={{ width: h.weight_formatted, background: h.color }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <button
                          className="trade-quick-btn"
                          onClick={() => {
                            setTradeForm({ symbol: h.symbol, type: 'BUY', shares: 1 })
                            setShowTradeModal(true)
                          }}
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Asset Class Allocation Panel */}
        <div className="panel allocation-details-panel">
          <div className="section-heading">
            <div>
              <h2>Target Allocation</h2>
              <p>Multi-asset distribution</p>
            </div>
          </div>

          <div className="allocation-list" style={{ marginTop: '16px' }}>
            {allocation.map(item => (
              <div className="allocation-card-row" key={item.name}>
                <div className="alloc-header">
                  <span>
                    <i style={{ background: item.color }} />
                    {item.name}
                  </span>
                  <strong>{item.value}%</strong>
                </div>
                <div className="alloc-bar-bg">
                  <div className="alloc-bar-fill" style={{ width: `${item.value}%`, background: item.color }} />
                </div>
                <small className="alloc-amount">{item.amount || `$${((24392.50 * item.value) / 100).toFixed(2)}`}</small>
              </div>
            ))}
          </div>

          <div className="portfolio-tip">
            <ShieldCheck size={16} />
            <span>Target cash buffer of 10% is maintained to preserve liquidity for dip accumulation.</span>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="panel transactions-panel" style={{ marginTop: '20px' }}>
        <div className="section-heading">
          <div>
            <h2>Transaction Log</h2>
            <p>Executed simulated orders and dividend accruals</p>
          </div>
          <span className="subtle-badge"><Clock size={12} /> Recent History</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>DATE</th>
                <th>TYPE</th>
                <th>ASSET</th>
                <th>SHARES</th>
                <th>PRICE</th>
                <th>TOTAL</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.date}</td>
                  <td>
                    <span className={`tx-badge ${tx.type === 'BUY' ? 'tx-buy' : tx.type === 'SELL' ? 'tx-sell' : 'tx-div'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td><strong>{tx.symbol}</strong></td>
                  <td>{tx.shares}</td>
                  <td>${typeof tx.price === 'number' ? tx.price.toFixed(2) : tx.price}</td>
                  <td>${typeof tx.total === 'number' ? tx.total.toFixed(2) : tx.total}</td>
                  <td>
                    <span className="status-pill pill-green">
                      <CheckCircle size={11} /> {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated Trade Modal */}
      {showTradeModal && (
        <div className="modal-backdrop" onClick={() => setShowTradeModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="eyebrow"><ArrowRightLeft size={13} /> SIMULATED EXECUTION</div>
              <h2>Order Ticket</h2>
              <p>Simulate placing an order against live synthetic liquidity.</p>
            </div>

            <form onSubmit={handleTradeSubmit} className="trade-modal-form">
              <div className="form-group">
                <label>Select Asset</label>
                <select
                  value={tradeForm.symbol}
                  onChange={e => setTradeForm({ ...tradeForm, symbol: e.target.value })}
                >
                  {holdings.map(h => (
                    <option key={h.symbol} value={h.symbol}>{h.symbol} - {h.name} (${h.price})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Order Action</label>
                <div className="action-toggle-group">
                  <button
                    type="button"
                    className={`toggle-btn ${tradeForm.type === 'BUY' ? 'active-buy' : ''}`}
                    onClick={() => setTradeForm({ ...tradeForm, type: 'BUY' })}
                  >
                    BUY
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn ${tradeForm.type === 'SELL' ? 'active-sell' : ''}`}
                    onClick={() => setTradeForm({ ...tradeForm, type: 'SELL' })}
                  >
                    SELL
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Number of Shares</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={tradeForm.shares}
                  onChange={e => setTradeForm({ ...tradeForm, shares: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowTradeModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="ask-button">
                  Confirm Simulated Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
