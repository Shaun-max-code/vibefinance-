import React, { createContext, useContext, useState, useEffect, useRef } from 'react'

const RealtimeContext = createContext(null)

const INITIAL_HOLDINGS = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 245.50,
    prev_close: 240.45,
    shares: 24.3,
    avg_cost: 212.40,
    sector: 'Consumer Electronics & Services',
    color: '#94a3b8',
    lastTick: null,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft',
    price: 521.40,
    prev_close: 514.20,
    shares: 8.5,
    avg_cost: 465.00,
    sector: 'Enterprise Software & Cloud',
    color: '#60a5fa',
    lastTick: null,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA',
    price: 188.20,
    prev_close: 181.30,
    shares: 21.8,
    avg_cost: 142.10,
    sector: 'Semiconductors & AI Compute',
    color: '#a3e635',
    lastTick: null,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet',
    price: 245.10,
    prev_close: 246.08,
    shares: 12.5,
    avg_cost: 220.80,
    sector: 'Digital Advertising & Cloud',
    color: '#fbbf24',
    lastTick: null,
  },
]

const INITIAL_MARKETS = [
  { id: 'sp500', name: 'S&P 500', value_num: 6742.18, prev_close: 6666.78, category: 'US large-cap', lastTick: null },
  { id: 'nasdaq', name: 'NASDAQ', value_num: 23016.32, prev_close: 22837.82, category: 'US technology', lastTick: null },
  { id: 'nifty50', name: 'NIFTY 50', value_num: 24716.30, prev_close: 24940.80, category: 'Indian equities', lastTick: null },
  { id: 'btcusd', name: 'BTC / USD', value_num: 112420, prev_close: 109785, category: 'Digital asset', lastTick: null },
]

const INITIAL_TRANSACTIONS = [
  { id: 'tx-101', date: '2026-10-14', symbol: 'NVDA', type: 'BUY', shares: 5, price: 182.40, total: 912.00, status: 'COMPLETED' },
  { id: 'tx-102', date: '2026-10-04', symbol: 'AAPL', type: 'DIVIDEND', shares: 24.3, price: 0.25, total: 6.08, status: 'CREDITED' },
  { id: 'tx-103', date: '2026-09-28', symbol: 'MSFT', type: 'BUY', shares: 2.5, price: 508.10, total: 1270.25, status: 'COMPLETED' }
]

export function RealtimeProvider({ children }) {
  const [holdings, setHoldings] = useState(INITIAL_HOLDINGS)
  const [cashBalance, setCashBalance] = useState(3250.00)
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS)
  const [markets, setMarkets] = useState(INITIAL_MARKETS)
  const [isLiveStreaming, setIsLiveStreaming] = useState(true)
  const [lastTickTime, setLastTickTime] = useState(new Date())
  const [tickCounter, setTickCounter] = useState(0)
  const [portfolioTickDir, setPortfolioTickDir] = useState(null)

  // Other assets (ETFs & Crypto holdings in portfolio)
  const otherAssetsBasis = 3578.44

  // Recalculate dynamic portfolio values live
  const equitiesValue = holdings.reduce((sum, h) => sum + (h.shares * h.price), 0)
  const totalCostBasis = holdings.reduce((sum, h) => sum + (h.shares * h.avg_cost), 0) + cashBalance + otherAssetsBasis
  const portfolioValue = equitiesValue + cashBalance + otherAssetsBasis

  const dailyEquitiesPnL = holdings.reduce((sum, h) => sum + (h.shares * (h.price - h.prev_close)), 0)
  const dailyPnL = dailyEquitiesPnL + 64.20 // Daily pnl including other assets
  const dailyPnLPct = ((dailyPnL / (portfolioValue - dailyPnL)) * 100).toFixed(2)

  const totalReturnDollar = portfolioValue - totalCostBasis + 3200 // Accounting for historical capital appreciation
  const totalReturnPct = ((totalReturnDollar / (totalCostBasis - 3200)) * 100).toFixed(1)

  const cashWeight = ((cashBalance / portfolioValue) * 100).toFixed(1)

  // Enriched holdings with calculated live values
  const liveHoldings = holdings.map(h => {
    const marketValue = h.shares * h.price
    const unrealizedDollar = marketValue - (h.shares * h.avg_cost)
    const unrealizedPct = (((h.price - h.avg_cost) / h.avg_cost) * 100).toFixed(1)
    const dayChangeDollar = h.price - h.prev_close
    const dayChangePct = ((dayChangeDollar / h.prev_close) * 100).toFixed(2)
    const weightPct = ((marketValue / equitiesValue) * 100).toFixed(1)

    return {
      ...h,
      price_num: h.price,
      price_formatted: `$${h.price.toFixed(2)}`,
      market_value_num: marketValue,
      market_value_formatted: `$${marketValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change_formatted: `${dayChangeDollar >= 0 ? '+' : ''}${dayChangePct}%`,
      change_is_positive: dayChangeDollar >= 0,
      unrealized_pnl_num: unrealizedDollar,
      unrealized_pnl_formatted: `${unrealizedDollar >= 0 ? '+' : ''}$${Math.abs(unrealizedDollar).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${unrealizedDollar >= 0 ? '+' : ''}${unrealizedPct}%)`,
      weight_num: parseFloat(weightPct),
      weight_formatted: `${weightPct}%`,
    }
  })

  // Enriched markets with calculated live values
  const liveMarkets = markets.map(m => {
    const diff = m.value_num - m.prev_close
    const pct = ((diff / m.prev_close) * 100).toFixed(2)
    const formattedVal = m.id === 'btcusd'
      ? `$${m.value_num.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
      : m.value_num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    return {
      ...m,
      value: formattedVal,
      change: `${pct >= 0 ? '+' : ''}${pct}%`,
      change_is_positive: pct >= 0,
    }
  })

  // Real-time continuous tick simulator (every 1.8 seconds)
  useEffect(() => {
    if (!isLiveStreaming) return

    const interval = setInterval(() => {
      setTickCounter(c => c + 1)
      setLastTickTime(new Date())

      // 1. Pick a random holding to tick
      const holdingIdx = Math.floor(Math.random() * holdings.length)
      const targetHolding = holdings[holdingIdx]

      // Realistic tick delta between -0.4% and +0.45%
      const deltaFactor = (Math.random() * 0.009) - 0.0042
      const rawNewPrice = targetHolding.price * (1 + deltaFactor)
      const newPrice = Math.round(rawNewPrice * 100) / 100
      const tickDir = newPrice >= targetHolding.price ? 'up' : 'down'

      setHoldings(prev => prev.map((item, idx) => {
        if (idx === holdingIdx) {
          return {
            ...item,
            price: newPrice,
            lastTick: tickDir,
          }
        }
        return item
      }))

      // Reset tick indicator on holding after 900ms
      setTimeout(() => {
        setHoldings(prev => prev.map((item, idx) => {
          if (idx === holdingIdx) return { ...item, lastTick: null }
          return item
        }))
      }, 900)

      // 2. Also occasionally tick a market benchmark (S&P 500, NASDAQ, BTC)
      if (Math.random() > 0.4) {
        const mktIdx = Math.floor(Math.random() * markets.length)
        const targetMkt = markets[mktIdx]
        const mktFactor = (Math.random() * 0.004) - 0.0019
        const rawMktVal = targetMkt.value_num * (1 + mktFactor)
        const newMktVal = targetMkt.id === 'btcusd'
          ? Math.round(rawMktVal)
          : Math.round(rawMktVal * 100) / 100
        const mktTickDir = newMktVal >= targetMkt.value_num ? 'up' : 'down'

        setMarkets(prev => prev.map((m, idx) => {
          if (idx === mktIdx) {
            return { ...m, value_num: newMktVal, lastTick: mktTickDir }
          }
          return m
        }))

        setTimeout(() => {
          setMarkets(prev => prev.map((m, idx) => {
            if (idx === mktIdx) return { ...m, lastTick: null }
            return m
          }))
        }, 900)
      }

      // Flash overall portfolio direction
      setPortfolioTickDir(tickDir)
      setTimeout(() => setPortfolioTickDir(null), 900)

    }, 1800)

    return () => clearInterval(interval)
  }, [holdings, markets, isLiveStreaming])

  // Execute a simulated trade in real time (BUY or SELL)
  function executeTrade({ symbol, type, shares }) {
    const tradeShares = parseFloat(shares) || 1
    const holding = liveHoldings.find(h => h.symbol === symbol)
    const currentPrice = holding ? holding.price : 188.20
    const totalAmount = tradeShares * currentPrice

    if (type === 'BUY') {
      if (cashBalance < totalAmount) {
        return { success: false, error: 'Insufficient cash balance for this simulated buy order.' }
      }

      setCashBalance(prev => Math.round((prev - totalAmount) * 100) / 100)
      setHoldings(prev => {
        const existing = prev.find(h => h.symbol === symbol)
        if (existing) {
          const newShares = Math.round((existing.shares + tradeShares) * 100) / 100
          const newAvgCost = Math.round((((existing.shares * existing.avg_cost) + totalAmount) / newShares) * 100) / 100
          return prev.map(h => h.symbol === symbol ? { ...h, shares: newShares, avg_cost: newAvgCost } : h)
        }
        return [
          ...prev,
          {
            symbol,
            name: `${symbol} Holding`,
            price: currentPrice,
            prev_close: currentPrice * 0.98,
            shares: tradeShares,
            avg_cost: currentPrice,
            sector: 'Technology & Growth',
            color: '#38bdf8',
            lastTick: 'up'
          }
        ]
      })
    } else if (type === 'SELL') {
      const existing = holdings.find(h => h.symbol === symbol)
      if (!existing || existing.shares < tradeShares) {
        return { success: false, error: 'You cannot sell more shares than currently active in position.' }
      }

      setCashBalance(prev => Math.round((prev + totalAmount) * 100) / 100)
      setHoldings(prev => {
        return prev.map(h => {
          if (h.symbol === symbol) {
            const newShares = Math.round((h.shares - tradeShares) * 100) / 100
            return { ...h, shares: newShares }
          }
          return h
        }).filter(h => h.shares > 0)
      })
    }

    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      symbol,
      type,
      shares: tradeShares,
      price: currentPrice,
      total: Math.round(totalAmount * 100) / 100,
      status: 'COMPLETED'
    }

    setTransactions(prev => [newTx, ...prev])

    // Try sending to backend for persistence
    
fetch(`${import.meta.env.VITE_API_URL}/api/portfolio/trade`, {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, type, shares: tradeShares, price: currentPrice })
    }).catch(() => {})

    return { success: true, transaction: newTx }
  }

  const value = {
    // Holdings & Active Positions
    holdings: liveHoldings,
    // Real-Time Portfolio Summary Values
    portfolioValue,
    portfolioValueFormatted: `$${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    dailyPnL,
    dailyPnLFormatted: `${dailyPnL >= 0 ? '+' : ''}$${Math.abs(dailyPnL).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    dailyPnLChange: `${dailyPnL >= 0 ? '+' : ''}${dailyPnLPct}% today`,
    dailyPnLIsPositive: dailyPnL >= 0,
    totalReturnDollar,
    totalReturnFormatted: `${totalReturnDollar >= 0 ? '+' : ''}$${Math.abs(totalReturnDollar).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    totalReturnPct: `+${totalReturnPct}%`,
    totalReturnChange: `+${totalReturnPct}% all time`,
    cashBalance,
    cashBalanceFormatted: `$${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    cashWeight: `${cashWeight}% of portfolio`,
    // Market Benchmarks
    markets: liveMarkets,
    // Transactions
    transactions,
    executeTrade,
    // Realtime Stream Status
    isLiveStreaming,
    setIsLiveStreaming,
    lastTickTime,
    tickCounter,
    portfolioTickDir,
  }

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  )
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
}
