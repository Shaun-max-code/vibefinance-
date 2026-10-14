import { useState, useEffect } from 'react'
import {
  TrendingUp, TrendingDown, Search, ArrowUpRight, ArrowDownRight,
  Sparkles, Filter, ChevronRight, Activity, BarChart3, ShieldCheck, RefreshCw
} from 'lucide-react'

// Default synthetic data fallback if backend is offline
const defaultMarkets = [
  { id: 'sp500', name: 'S&P 500', value: '6,742.18', change: '+1.13%', category: 'US large-cap', high_52w: '6,780.40', low_52w: '4,950.20', market_status: 'OPEN', sentiment: 'BULLISH' },
  { id: 'nasdaq', name: 'NASDAQ', value: '23,016.32', change: '+0.78%', category: 'US technology', high_52w: '23,200.00', low_52w: '15,800.00', market_status: 'OPEN', sentiment: 'BULLISH' },
  { id: 'nifty50', name: 'NIFTY 50', value: '24,716.30', change: '-0.90%', category: 'Indian equities', high_52w: '26,277.35', low_52w: '18,837.85', market_status: 'CLOSED', sentiment: 'CONSOLIDATING' },
  { id: 'btcusd', name: 'BTC / USD', value: '$112,420', change: '+2.40%', category: 'Digital asset', high_52w: '$115,800', low_52w: '$42,100', market_status: '24/7 LIVE', sentiment: 'STRONG_MOMENTUM' }
]

const defaultStocks = [
  {
    symbol: 'AAPL',
    company_name: 'Apple Inc.',
    sector: 'Consumer Electronics & Services',
    current_price: 245.50,
    change: '+2.1%',
    market_cap: '3.72T',
    pe_ratio: 33.4,
    beta: 1.12,
    technicals: { rsi_14: 62.4, ema_20: 238.10, ema_50: 231.40, ema_200: 210.80, trend: 'Bullish Uptrend', pcr_oi: 0.88, max_pain_strike: 240.00 }
  },
  {
    symbol: 'MSFT',
    company_name: 'Microsoft Corporation',
    sector: 'Enterprise Software & Cloud',
    current_price: 521.40,
    change: '+1.4%',
    market_cap: '3.88T',
    pe_ratio: 36.1,
    beta: 1.08,
    technicals: { rsi_14: 58.7, ema_20: 512.60, ema_50: 501.20, ema_200: 462.50, trend: 'Bullish Consolidation', pcr_oi: 0.94, max_pain_strike: 515.00 }
  },
  {
    symbol: 'NVDA',
    company_name: 'NVIDIA Corporation',
    sector: 'Semiconductors & AI Compute',
    current_price: 188.20,
    change: '+3.8%',
    market_cap: '4.61T',
    pe_ratio: 48.2,
    beta: 1.68,
    technicals: { rsi_14: 71.8, ema_20: 176.40, ema_50: 164.80, ema_200: 138.90, trend: 'Strong Momentum Breakout', pcr_oi: 0.72, max_pain_strike: 180.00 }
  },
  {
    symbol: 'GOOGL',
    company_name: 'Alphabet Inc.',
    sector: 'Digital Advertising & Cloud',
    current_price: 245.10,
    change: '-0.4%',
    market_cap: '3.02T',
    pe_ratio: 24.8,
    beta: 1.15,
    technicals: { rsi_14: 49.2, ema_20: 247.30, ema_50: 244.10, ema_200: 222.60, trend: 'Neutral Range-bound', pcr_oi: 1.05, max_pain_strike: 245.00 }
  },
  {
    symbol: 'RELIANCE',
    company_name: 'Reliance Industries Ltd.',
    sector: 'Diversified / Energy & Retail',
    current_price: 2984.50,
    change: '+0.76%',
    market_cap: '20.19 Lakh Cr',
    pe_ratio: 28.4,
    beta: 0.88,
    technicals: { rsi_14: 56.4, ema_20: 2940.00, ema_50: 2912.00, ema_200: 2780.00, trend: 'Moderate Uptrend', pcr_oi: 0.92, max_pain_strike: 2950.00 }
  },
  {
    symbol: 'HDFCBANK',
    company_name: 'HDFC Bank Limited',
    sector: 'Banking & Financial Services',
    current_price: 1682.30,
    change: '-0.78%',
    market_cap: '12.82 Lakh Cr',
    pe_ratio: 18.2,
    beta: 1.05,
    technicals: { rsi_14: 44.1, ema_20: 1694.00, ema_50: 1688.00, ema_200: 1620.00, trend: 'Pullback / Support Test', pcr_oi: 1.12, max_pain_strike: 1700.00 }
  }
]

export default function MarketsView({ onNavigateToResearch }) {
  const [markets, setMarkets] = useState(defaultMarkets)
  const [stocks, setStocks] = useState(defaultStocks)
  const [search, setSearch] = useState('')
  const [selectedStock, setSelectedStock] = useState(defaultStocks[0])
  const [sectorFilter, setSectorFilter] = useState('ALL')
  const [dataSource, setDataSource] = useState('LOCAL_SYNC')

  useEffect(() => {
    // Attempt fetch from backend API
    fetch('http://localhost:5000/api/markets')
      .then(res => res.json())
      .then(data => {
        if (data && data.markets) {
          setMarkets(data.markets)
          setDataSource('LIVE_BACKEND_API')
        }
      })
      .catch(() => {
        // Fallback to local sync data gracefully
        setDataSource('LOCAL_SYNC')
      })

    fetch('http://localhost:5000/api/markets/stocks')
      .then(res => res.json())
      .then(data => {
        if (data && data.stocks) {
          // Merge with detailed technicals if present
          setStocks(data.stocks)
        }
      })
      .catch(() => {})
  }, [])

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
      stock.company_name.toLowerCase().includes(search.toLowerCase()) ||
      stock.sector.toLowerCase().includes(search.toLowerCase())
    const matchesSector = sectorFilter === 'ALL' || stock.sector.toLowerCase().includes(sectorFilter.toLowerCase())
    return matchesSearch && matchesSector
  })

  return (
    <div className="view-container">
      {/* View Header */}
      <div className="view-header">
        <div>
          <div className="eyebrow">
            <span className="live-dot" /> REAL-TIME MARKET PULSE
          </div>
          <h1>Markets Overview<span className="brand-accent">.</span></h1>
          <p>Global benchmarks, high-beta equity registries, and options chain sentiment.</p>
        </div>
        <div className="view-header-badge">
          <Activity size={14} />
          <span>{dataSource === 'LIVE_BACKEND_API' ? 'BACKEND CONNECTED (:5000)' : 'SYNTHETIC REGISTRY'}</span>
        </div>
      </div>

      {/* Indices Grid */}
      <div className="markets-indices-grid">
        {markets.map(m => {
          const isPos = m.change.startsWith('+')
          return (
            <div key={m.id || m.name} className="panel market-hero-card">
              <div className="market-hero-top">
                <div>
                  <strong>{m.name}</strong>
                  <small>{m.category}</small>
                </div>
                <span className={`status-pill ${m.market_status === 'OPEN' || m.market_status === '24/7 LIVE' ? 'pill-green' : 'pill-muted'}`}>
                  {m.market_status}
                </span>
              </div>
              <div className="market-hero-price">
                <span className="price-big">{m.value}</span>
                <span className={`price-change ${isPos ? 'positive' : 'negative'}`}>
                  {isPos ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />} {m.change}
                </span>
              </div>
              <div className="market-hero-footer">
                <span>52W: {m.low_52w} – {m.high_52w}</span>
                <span className="sentiment-tag">{m.sentiment}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Equity Screener & Technical Inspection Grid */}
      <div className="markets-content-grid">
        {/* Left: Equities Registry */}
        <div className="panel equities-panel">
          <div className="section-heading">
            <div>
              <h2>Equity Screener</h2>
              <p>Key holdings & tracked assets with multi-timeframe indicators</p>
            </div>
            <div className="search-wrap">
              <Search size={14} />
              <input
                placeholder="Search symbol, name, or sector..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ASSET</th>
                  <th>PRICE</th>
                  <th>24H</th>
                  <th>BETA</th>
                  <th>P/E</th>
                  <th>RSI(14)</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map(stock => {
                  const isPos = String(stock.change).startsWith('+')
                  const isSelected = selectedStock?.symbol === stock.symbol
                  const rsi = stock.technicals?.rsi_14 || 55

                  return (
                    <tr
                      key={stock.symbol}
                      className={isSelected ? 'row-selected' : ''}
                      onClick={() => setSelectedStock(stock)}
                    >
                      <td>
                        <div className="asset-cell">
                          <span className="asset-icon">{stock.symbol[0]}</span>
                          <div>
                            <strong>{stock.symbol}</strong>
                            <small>{stock.company_name}</small>
                          </div>
                        </div>
                      </td>
                      <td>${typeof stock.current_price === 'number' ? stock.current_price.toFixed(2) : stock.current_price}</td>
                      <td className={isPos ? 'positive' : 'negative'}>
                        {stock.change}
                      </td>
                      <td>{stock.beta || 1.1}</td>
                      <td>{stock.pe_ratio ? `${stock.pe_ratio}x` : '—'}</td>
                      <td>
                        <span className={`rsi-badge ${rsi > 70 ? 'rsi-hot' : rsi < 40 ? 'rsi-cold' : 'rsi-neutral'}`}>
                          {rsi}
                        </span>
                      </td>
                      <td>
                        <button
                          className="inspect-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedStock(stock)
                          }}
                        >
                          Inspect <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Technical Detail Panel */}
        {selectedStock && (
          <div className="panel technical-detail-panel">
            <div className="tech-header">
              <div>
                <span className="subtle-badge">{selectedStock.sector}</span>
                <h2>{selectedStock.symbol} Technicals</h2>
                <small>{selectedStock.company_name}</small>
              </div>
              <div className="tech-price-block">
                <strong>${typeof selectedStock.current_price === 'number' ? selectedStock.current_price.toFixed(2) : selectedStock.current_price}</strong>
                <span className={String(selectedStock.change).startsWith('+') ? 'positive' : 'negative'}>
                  {selectedStock.change}
                </span>
              </div>
            </div>

            <div className="tech-metrics-grid">
              <div className="tech-metric-box">
                <small>20-Day EMA</small>
                <strong>${selectedStock.technicals?.ema_20 || (selectedStock.current_price * 0.98).toFixed(2)}</strong>
                <span>Short-term support</span>
              </div>
              <div className="tech-metric-box">
                <small>50-Day EMA</small>
                <strong>${selectedStock.technicals?.ema_50 || (selectedStock.current_price * 0.95).toFixed(2)}</strong>
                <span>Intermediate trend</span>
              </div>
              <div className="tech-metric-box">
                <small>RSI (14-Day)</small>
                <strong className={selectedStock.technicals?.rsi_14 > 70 ? 'positive' : ''}>
                  {selectedStock.technicals?.rsi_14 || 62.4}
                </strong>
                <span>{selectedStock.technicals?.rsi_14 > 70 ? 'Momentum Stretch' : 'Healthy Range'}</span>
              </div>
              <div className="tech-metric-box">
                <small>Put-Call Ratio (OI)</small>
                <strong>{selectedStock.technicals?.pcr_oi || 0.88}</strong>
                <span>Options Sentiment</span>
              </div>
            </div>

            <div className="tech-trend-card">
              <div className="trend-title">
                <Activity size={16} />
                <strong>Regime Assessment:</strong>
              </div>
              <p>{selectedStock.technicals?.trend || 'Strong Bullish Continuation with institutional accumulation.'}</p>
              <div className="trend-stat">
                <span>Max Pain Strike:</span>
                <strong>${selectedStock.technicals?.max_pain_strike || (Math.round(selectedStock.current_price / 5) * 5)}</strong>
              </div>
            </div>

            {onNavigateToResearch && (
              <button
                className="ask-button full-width"
                onClick={() => onNavigateToResearch(`Analyze market momentum and technical levels for ${selectedStock.symbol}`)}
              >
                <Sparkles size={15} /> Analyze in AI Research Studio <ArrowUpRight size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
