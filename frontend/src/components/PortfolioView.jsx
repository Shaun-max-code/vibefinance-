import { useState, useEffect } from 'react'
import {
  Wallet, ArrowUpRight, ArrowDownRight, Plus, RefreshCw,
  Clock, CheckCircle, ShieldCheck, PieChart as PieIcon, ArrowRightLeft, Sparkles
} from 'lucide-react'

const initialHoldings = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: '$245.50', price_num: 245.50, change: '+2.1%', weight: '24.5%', shares: 24.3, avg_cost: '$212.40', market_value: '$5,965.65', unrealized_pnl: '+$804.33 (+15.6%)', sector: 'Consumer Electronics & Services', color: '#94a3b8' },
  { symbol: 'MSFT', name: 'Microsoft', price: '$521.40', price_num: 521.40, change: '+1.4%', weight: '18.2%', shares: 8.5, avg_cost: '$465.00', market_value: '$4,431.90', unrealized_pnl: '+$479.40 (+12.1%)', sector: 'Enterprise Software & Cloud', color: '#60a5fa' },
  { symbol: 'NVDA', name: 'NVIDIA', price: '$188.20', price_num: 188.20, change: '+3.8%', weight: '16.8%', shares: 21.8, avg_cost: '$142.10', market_value: '$4,102.76', unrealized_pnl: '+$1,004.98 (+32.4%)', sector: 'Semiconductors & AI Compute', color: '#a3e635' },
  { symbol: 'GOOGL', name: 'Alphabet', price: '$245.10', price_num: 245.10, change: '-0.4%', weight: '12.6%', shares: 12.5, avg_cost: '$220.80', market_value: '$3,063.75', unrealized_pnl: '+$303.75 (+11.0%)', sector: 'Digital Advertising & Cloud', color: '#fbbf24' }
]

const initialAllocation = [
  { name: 'Equities', value: 62.4, color: '#10b981', amount: '$15,220.92' },
  { name: 'ETFs', value: 18.7, color: '#38bdf8', amount: '$4,561.40' },
  { name: 'Crypto', value: 8.3, color: '#a78bfa', amount: '$2,024.58' },
  { name: 'Cash', value: 6.1, color: '#fbbf24', amount: '$1,487.94' },
  { name: 'Others', value: 4.5, color: '#64748b', amount: '$1,097.66' }
]

const initialTransactions = [
  { id: 'tx-101', date: '2026-10-12', symbol: 'NVDA', type: 'BUY', shares: 5, price: 182.40, total: 912.00, status: 'COMPLETED' },
  { id: 'tx-102', date: '2026-10-04', symbol: 'AAPL', type: 'DIVIDEND', shares: 24.3, price: 0.25, total: 6.08, status: 'CREDITED' },
  { id: 'tx-103', date: '2026-09-28', symbol: 'MSFT', type: 'BUY', shares: 2.5, price: 508.10, total: 1270.25, status: 'COMPLETED' }
]

export default function PortfolioView({ onNavigateToResearch }) {
  const [holdings, setHoldings] = useState(initialHoldings)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [allocation, setAllocation] = useState(initialAllocation)
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [tradeForm, setTradeForm] = useState({ symbol: 'NVDA', type: 'BUY', shares: 2 })
  const [tradeFeedback, setTradeFeedback] = useState(null)
  const [dataSource, setDataSource] = useState('LOCAL_SYNC')

  useEffect(() => {
    fetch('http://localhost:5000/api/portfolio')
      .then(res => res.json())
      .then(data => {
        if (data && data.holdings) {
          setHoldings(data.holdings)
          setDataSource('LIVE_BACKEND_API')
        }
        if (data && data.recent_transactions) {
          setTransactions(data.recent_transactions)
        }
        if (data && data.allocation) {
          setAllocation(data.allocation)
        }
      })
      .catch(() => {
        setDataSource('LOCAL_SYNC')
      })
  }, [])

  function handleTradeSubmit(e) {
    e.preventDefault()
    const targetSymbol = tradeForm.symbol
    const sharesNum = parseFloat(tradeForm.shares) || 1
    const targetStock = holdings.find(h => h.symbol === targetSymbol)
    const priceNum = targetStock?.price_num || 188.20
    const totalCost = (sharesNum * priceNum).toFixed(2)

    // Attempt backend trade API
    fetch('http://localhost:5000/api/portfolio/trade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbol: targetSymbol,
        type: tradeForm.type,
        shares: sharesNum,
        price: priceNum
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.transaction) {
          setTransactions(prev => [data.transaction, ...prev])
        }
      })
      .catch(() => {})

    // Optimistic UI update
    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      symbol: targetSymbol,
      type: tradeForm.type,
      shares: sharesNum,
      price: priceNum,
      total: parseFloat(totalCost),
      status: 'COMPLETED'
    }

    setTransactions(prev => [newTx, ...prev])
    setTradeFeedback(`Simulated ${tradeForm.type} order for ${sharesNum} shares of ${targetSymbol} ($${totalCost}) executed.`)
    setShowTradeModal(false)
    setTimeout(() => setTradeFeedback(null), 5000)
  }

  return (
    <div className="view-container">
      {/* View Header */}
      <div className="view-header">
        <div>
          <div className="eyebrow">
            <span className="live-dot" /> CAPITAL ASSETS & ALLOCATION
          </div>
          <h1>Portfolio Holdings<span className="brand-accent">.</span></h1>
          <p>Real-time valuation, cost basis tracking, and simulated trade execution.</p>
        </div>
        <div className="header-actions">
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

      {/* Portfolio Metrics Grid */}
      <div className="metrics-grid">
        <article className="metric-card">
          <div className="metric-heading">
            <span>Portfolio value</span>
            <Wallet size={17} />
          </div>
          <div className="metric-value">$24,392.50</div>
          <div className="metric-change">
            <ArrowUpRight size={14} /> +2.4% today
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-heading">
            <span>Daily P&L</span>
            <ArrowUpRight size={17} />
          </div>
          <div className="metric-value">+$588.20</div>
          <div className="metric-change">
            <ArrowUpRight size={14} /> +2.47% today
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-heading">
            <span>Total return</span>
            <Sparkles size={17} />
          </div>
          <div className="metric-value">+18.6%</div>
          <div className="metric-change">
            <ArrowUpRight size={14} /> +$3,832.20 all time
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-heading">
            <span>Cash balance</span>
            <ShieldCheck size={17} />
          </div>
          <div className="metric-value">$3,250.00</div>
          <div className="metric-change">
            13.3% of portfolio
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
                  const isPos = String(h.change).startsWith('+')

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
                      <td>{h.price}</td>
                      <td className={isPos ? 'positive' : 'negative'}>{h.change}</td>
                      <td>{h.shares}</td>
                      <td>{h.avg_cost}</td>
                      <td><strong>{h.market_value}</strong></td>
                      <td className="positive">{h.unrealized_pnl}</td>
                      <td>
                        <div className="weight-cell">
                          <span>{h.weight}</span>
                          <div className="weight-bar">
                            <div style={{ width: h.weight, background: h.color }} />
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
