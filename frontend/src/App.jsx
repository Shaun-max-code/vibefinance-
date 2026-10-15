
import { useState, useEffect, useRef } from 'react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, PieChart, Pie, Cell,
} from 'recharts'
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, BrainCircuit,
  BriefcaseBusiness, ChartNoAxesCombined, ChevronDown, FileText,
  LayoutDashboard, Menu, Search, Settings2, ShieldCheck,
  Sparkles, Wallet, Zap, Globe, Home, LogOut, LogIn, X, Check, CheckCircle, Clock
} from 'lucide-react'
import ResearchStudio from './ResearchStudio'
import MarketsView from './components/MarketsView'
import PortfolioView from './components/PortfolioView'
import RiskAnalysisView from './components/RiskAnalysisView'
import ReportsView from './components/ReportsView'
import SettingsView from './components/SettingsView'
import LandingPage from './components/LandingPage'
import AuthModal from './components/AuthModal'
import SpotlightCard from './effects/SpotlightCard'
import MagneticButton from './effects/MagneticButton'
import ScrollReveal from './effects/ScrollReveal'
import SmoothTransition from './effects/SmoothTransition'
import Tilt3DCard from './effects/Tilt3DCard'
import { useRealtime } from './context/RealtimeContext'
import './components/LandingAuth.css'
import './components/Views.css'
import './App.css'

const performanceDataByPeriod = {
  '1D': {
    summary: '$24,392.50',
    change: '+$588.20 (+2.47%)',
    data: [
      { date: '09:30', value: 23804 },
      { date: '10:30', value: 24020 },
      { date: '11:30', value: 23950 },
      { date: '12:30', value: 24110 },
      { date: '13:30', value: 24080 },
      { date: '14:30', value: 24250 },
      { date: '15:30', value: 24310 },
      { date: '16:00', value: 24392 },
    ]
  },
  '1W': {
    summary: '$24,392.50',
    change: '+$1,240.10 (+5.36%)',
    data: [
      { date: 'Oct 08', value: 23152 },
      { date: 'Oct 09', value: 23410 },
      { date: 'Oct 10', value: 23100 },
      { date: 'Oct 11', value: 23680 },
      { date: 'Oct 12', value: 23900 },
      { date: 'Oct 13', value: 24150 },
      { date: 'Oct 14', value: 24392 },
    ]
  },
  '1M': {
    summary: '$24,392.50',
    change: '+$3,832.20 (+18.6%)',
    data: [
      { date: 'Sep 14', value: 18200 },
      { date: 'Sep 18', value: 19400 },
      { date: 'Sep 22', value: 18800 },
      { date: 'Sep 26', value: 21100 },
      { date: 'Sep 30', value: 20500 },
      { date: 'Oct 03', value: 22400 },
      { date: 'Oct 07', value: 21800 },
      { date: 'Oct 10', value: 23100 },
      { date: 'Oct 14', value: 24392 },
    ]
  },
  '3M': {
    summary: '$24,392.50',
    change: '+$5,120.40 (+26.6%)',
    data: [
      { date: 'Jul 15', value: 19272 },
      { date: 'Aug 01', value: 19850 },
      { date: 'Aug 15', value: 18900 },
      { date: 'Sep 01', value: 20400 },
      { date: 'Sep 15', value: 21500 },
      { date: 'Oct 01', value: 22800 },
      { date: 'Oct 14', value: 24392 },
    ]
  },
  '1Y': {
    summary: '$24,392.50',
    change: '+$7,890.00 (+47.8%)',
    data: [
      { date: 'Nov 25', value: 16500 },
      { date: 'Jan 26', value: 17200 },
      { date: 'Mar 26', value: 18100 },
      { date: 'May 26', value: 19400 },
      { date: 'Jul 26', value: 20800 },
      { date: 'Sep 26', value: 22500 },
      { date: 'Oct 26', value: 24392 },
    ]
  }
}

const allocation = [
  { name: 'Equities', value: 62.4, color: '#10b981' },
  { name: 'ETFs', value: 18.7, color: '#38bdf8' },
  { name: 'Crypto', value: 8.3, color: '#a78bfa' },
  { name: 'Cash', value: 6.1, color: '#fbbf24' },
  { name: 'Others', value: 4.5, color: '#64748b' },
]

const insights = [
  { tag: 'MARKET SIGNAL', title: 'Technology momentum is strengthening', icon: Activity },
  { tag: 'PORTFOLIO', title: 'Review your largest holding exposure', icon: Wallet },
  { tag: 'RISK ALERT', title: 'Growth stocks may increase concentration risk', icon: ShieldCheck },
]

const searchCatalog = [
  { type: 'view', title: 'Dashboard', desc: 'Financial command center & key metrics', icon: LayoutDashboard },
  { type: 'view', title: 'Markets', desc: 'Global benchmarks, equity screener & technicals', icon: ChartNoAxesCombined },
  { type: 'view', title: 'AI Research', desc: 'Multi-agent intelligence synthesis studio', icon: BrainCircuit },
  { type: 'view', title: 'Portfolio', desc: 'Active positions, allocation & order simulation', icon: BriefcaseBusiness },
  { type: 'view', title: 'Risk Analysis', desc: 'Herfindahl concentration & macro stress tests', icon: ShieldCheck },
  { type: 'view', title: 'Reports', desc: 'Institutional dossiers & executive memos', icon: FileText },
  { type: 'view', title: 'Settings', desc: 'Investor profile & risk constraints', icon: Settings2 },
  { type: 'stock', symbol: 'AAPL', name: 'Apple Inc.', price: '$245.50', change: '+2.1%', sector: 'Tech' },
  { type: 'stock', symbol: 'MSFT', name: 'Microsoft Corp', price: '$521.40', change: '+1.4%', sector: 'Tech' },
  { type: 'stock', symbol: 'NVDA', name: 'NVIDIA Corp', price: '$188.20', change: '+3.8%', sector: 'Semiconductors' },
  { type: 'stock', symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$245.10', change: '-0.4%', sector: 'Tech' },
  { type: 'stock', symbol: 'TSLA', name: 'Tesla Inc.', price: 'Live Feed', change: '+1.8%', sector: 'Clean Energy / EV' },
  { type: 'stock', symbol: 'AMZN', name: 'Amazon.com Inc.', price: 'Live Feed', change: '+1.2%', sector: 'Cloud / Retail' },
  { type: 'stock', symbol: 'META', name: 'Meta Platforms Inc.', price: 'Live Feed', change: '+2.3%', sector: 'Digital Ads / AI' },
  { type: 'stock', symbol: 'AMD', name: 'Advanced Micro Devices', price: 'Live Feed', change: '+3.1%', sector: 'Semiconductors' },
  { type: 'stock', symbol: 'PLTR', name: 'Palantir Technologies', price: 'Live Feed', change: '+4.5%', sector: 'Enterprise AI' },
  { type: 'stock', symbol: 'NFLX', name: 'Netflix Inc.', price: 'Live Feed', change: '+0.9%', sector: 'Streaming' },
  { type: 'stock', symbol: 'BTC', name: 'Bitcoin (BTC / USD)', price: '$112,420', change: '+2.4%', sector: 'Crypto' },
  { type: 'stock', symbol: 'ETH', name: 'Ethereum (ETH / USD)', price: '$3,890', change: '+3.2%', sector: 'Crypto' },
  { type: 'stock', symbol: 'SPY', name: 'S&P 500 ETF', price: '6,742.18', change: '+1.13%', sector: 'Index' },
]

const initialNotifications = [
  { id: 1, title: 'Fed Rate Scenario Assessed', body: 'Risk agent estimated 50 bps shock impact at -$1,280.', time: '10m ago', unread: true, target: 'Risk Analysis' },
  { id: 2, title: 'NVDA Momentum Breakout', body: 'RSI(14) stretched to 71.8 with high call volume.', time: '35m ago', unread: true, target: 'Markets' },
  { id: 3, title: 'Concentration Guardrail Alert', body: 'HHI index registered at 2085 (moderate threshold).', time: '2h ago', unread: false, target: 'Risk Analysis' },
  { id: 4, title: 'Weekly Intelligence Published', body: 'Dossier REP-2026-W41 is ready for inspection.', time: '1d ago', unread: false, target: 'Reports' },
]

function Metric({ title, value, change, icon: Icon, variant = 'green' }) {
  return (
    <Tilt3DCard maxTilt={8} variant={variant} className="metric-card glass-panel hover-lift">
      <div className="metric-heading depth-layer-1">
        <span>{title}</span>
        <Icon size={17} className="hover-icon-rotate" />
      </div>
      <div className="metric-value depth-layer-2">{value}</div>
      <div className="metric-change depth-layer-1">
        <ArrowUpRight size={14} className="hover-icon-rotate" /> {change}
      </div>
    </Tilt3DCard>
  )
}

function App() {
  const {
    holdings: liveHoldings,
    markets: liveMarkets,
    portfolioValueFormatted,
    dailyPnLFormatted,
    dailyPnLChange,
    dailyPnLIsPositive,
    totalReturnFormatted,
    totalReturnPct,
    cashBalanceFormatted,
    cashWeight,
    portfolioTickDir,
  } = useRealtime()

  const [period, setPeriod] = useState('1M')
  const [active, setActive] = useState('Dashboard')
  const [question, setQuestion] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [viewMode, setViewMode] = useState('landing') // 'landing' | 'terminal'
  const [authModal, setAuthModal] = useState(null) // 'login' | 'signup' | null
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)

  const searchRef = useRef(null)
  const searchInputRef = useRef(null)
  const notifRef = useRef(null)

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vibefinance_user')
      return saved ? JSON.parse(saved) : null
    } catch (e) {
      return null
    }
  })

  const navigation = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Markets', icon: ChartNoAxesCombined },
    { label: 'AI Research', icon: BrainCircuit },
    { label: 'Portfolio', icon: BriefcaseBusiness },
    { label: 'Risk Analysis', icon: ShieldCheck },
    { label: 'Reports', icon: FileText },
  ]

  // Global keydown listener for search shortcut '/' or 'Ctrl+K'
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) && document.activeElement !== searchInputRef.current) {
        if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          e.preventDefault()
          searchInputRef.current?.focus()
          setSearchOpen(true)
        }
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setNotificationsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleLogout() {
    localStorage.removeItem('vibefinance_user')
    localStorage.removeItem('vibefinance_token')
    setCurrentUser(null)
    setViewMode('landing')
    setActive('Dashboard')
    setMenuOpen(false)
  }

  function askResearch(event, customQuestion) {
    if (event && event.preventDefault) event.preventDefault()
    const q = (customQuestion !== undefined ? customQuestion : question).trim()
    if (q) {
      setQuestion(q)
    }
    setActive('AI Research')
  }

  function handleAskInsight(item) {
    const q = `Analyze market signal: ${item.title} (${item.tag})`
    setQuestion(q)
    setActive('AI Research')
  }

  function handleSelectSearchItem(item) {
    setSearchOpen(false)
    setSearchQuery('')
    if (item.type === 'view') {
      setActive(item.title)
    } else if (item.type === 'stock') {
      setQuestion(`Analyze real-time market momentum, financial fundamentals, and downside risk for ${item.symbol}`)
      setActive('AI Research')
    }
  }

  function handleSearchAskAI(prompt) {
    setSearchOpen(false)
    setSearchQuery('')
    setQuestion(prompt)
    setActive('AI Research')
  }

  function handleNotifClick(notif) {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n))
    setNotificationsOpen(false)
    if (notif.target) {
      setActive(notif.target)
    }
  }

  function handleClearNotifications() {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const unreadCount = notifications.filter(n => n.unread).length

  // Filter search catalog with dynamic ticker creation for universal search
  const filteredSearchItems = searchCatalog.filter(item => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    if (item.type === 'view') {
      return item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
    }
    if (item.type === 'stock') {
      return item.symbol.toLowerCase().includes(q) || item.name.toLowerCase().includes(q) || item.sector.toLowerCase().includes(q)
    }
    return false
  })

  const trimmedQ = searchQuery.trim()
  if (trimmedQ && !filteredSearchItems.some(i => i.symbol && i.symbol.toLowerCase() === trimmedQ.toLowerCase()) && !['dashboard', 'markets', 'portfolio', 'risk', 'reports', 'settings'].includes(trimmedQ.toLowerCase())) {
    filteredSearchItems.unshift({
      type: 'stock',
      symbol: trimmedQ.toUpperCase(),
      name: `${trimmedQ.toUpperCase()} · Global Asset & AI Research`,
      price: 'Live Feed',
      change: 'Real-time',
      sector: 'Universal Search'
    })
  }

  return (
    <>
      <SmoothTransition viewKey={viewMode}>
        {viewMode === 'landing' ? (
          <LandingPage
            onLaunchTerminal={() => setViewMode('terminal')}
            onOpenLogin={() => setAuthModal('login')}
            onOpenSignup={() => setAuthModal('signup')}
            onLogout={handleLogout}
            currentUser={currentUser}
          />
        ) : (
          <div className="app-shell">
            <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''} glass-panel`}>
              <div
                className="brand"
                onClick={() => setViewMode('landing')}
                style={{ cursor: 'pointer' }}
                title="Return to Home"
              >
                <div className="brand-mark hover-icon-rotate"><Activity size={21} /></div>
                <span>Vibe<span className="brand-accent">Finance</span></span>
              </div>

        <div className="workspace-label">
          WORKSPACE <ChevronDown size={14} />
        </div>

        <nav className="navigation">
          {navigation.map(item => {
            const Icon = item.icon

            return (
              <button
                key={item.label}
                className={`nav-item ${active === item.label ? 'nav-active' : ''}`}
                onClick={() => {
                  setActive(item.label)
                  setMenuOpen(false)
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.label === 'AI Research' && (
                  <span className="ai-label">AI</span>
                )}
              </button>
            )
          })}
        </nav>

          <div className="sidebar-bottom">
            <SpotlightCard className="promo-card glass-panel hover-lift" variant="green">
              <div className="promo-icon hover-icon-rotate"><Zap size={17} /></div>
              <strong>Intelligence, amplified.</strong>
              <p>One question. Multiple perspectives.</p>
              <button onClick={() => { setQuestion(''); setActive('AI Research'); }}>
                Explore AI <ArrowUpRight size={14} className="hover-icon-rotate" />
              </button>
            </SpotlightCard>

            <button className="nav-item" onClick={() => setViewMode('landing')}>
              <Home size={18} />
              <span>Home</span>
            </button>

            <button className="nav-item" onClick={() => setActive('Settings')}>
              <Settings2 size={18} />
              <span>Settings</span>
            </button>

            <button
              className="nav-item sidebar-logout-btn"
              onClick={handleLogout}
              title="Log Out from workspace"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>

            <div
              className="profile"
              onClick={() => setActive('Settings')}
              style={{ cursor: 'pointer' }}
              title="Account Settings"
            >
              <div className="avatar">{currentUser ? (currentUser.initials || currentUser.name[0]) : 'S'}</div>
              <div className="profile-text">
                <strong>{currentUser ? currentUser.name : 'Shaun Mathew'}</strong>
                <span>{currentUser ? currentUser.workspace : 'Personal workspace'}</span>
              </div>
              <button
                className="profile-action-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  handleLogout()
                }}
                title="Log Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </aside>

      {menuOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu icon-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>

          <div
            className="breadcrumbs"
            onClick={() => setActive('Dashboard')}
            style={{ cursor: 'pointer' }}
            title="Go to Dashboard"
          >
            <Activity size={15} />
            <span>Workspace</span>
            <span className="slash">/</span>
            <strong>{active}</strong>
          </div>

          {/* Interactive Workspace Search Bar */}
          <div className="topbar-center" ref={searchRef}>
            <div className="workspace-search-bar">
              <Search size={14} style={{ color: '#64748b', flexShrink: 0 }} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleSearchAskAI(searchQuery.trim())
                  }
                }}
                placeholder="Search workspace, stocks (AAPL, NVDA), or ask AI... (Press /)"
                aria-label="Search workspace"
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
                >
                  <X size={13} />
                </button>
              )}
              <span className="search-hotkey-badge">/</span>
            </div>

            {searchOpen && (
              <div className="search-dropdown">
                {searchQuery.trim() && (
                  <button
                    className="search-item search-ai-action"
                    onClick={() => handleSearchAskAI(searchQuery.trim())}
                  >
                    <div className="search-item-left">
                      <div className="search-item-icon">
                        <Sparkles size={14} />
                      </div>
                      <div className="search-item-title">
                        <strong>Ask AI Agent: "{searchQuery.trim()}"</strong>
                        <small>Execute autonomous multi-agent research synthesis</small>
                      </div>
                    </div>
                    <ArrowUpRight size={14} style={{ color: '#34d399' }} />
                  </button>
                )}

                <div className="search-section-label">WORKSPACE VIEWS</div>
                {filteredSearchItems.filter(i => i.type === 'view').map(v => {
                  const Icon = v.icon
                  return (
                    <button
                      key={v.title}
                      className="search-item"
                      onClick={() => handleSelectSearchItem(v)}
                    >
                      <div className="search-item-left">
                        <div className="search-item-icon">
                          <Icon size={14} />
                        </div>
                        <div className="search-item-title">
                          <strong>{v.title}</strong>
                          <small>{v.desc}</small>
                        </div>
                      </div>
                      <ChevronDown size={13} style={{ transform: 'rotate(-90deg)', color: '#64748b' }} />
                    </button>
                  )
                })}

                <div className="search-section-label" style={{ marginTop: '6px' }}>TRACKED ASSETS & EQUITIES</div>
                {filteredSearchItems.filter(i => i.type === 'stock').map(s => (
                  <button
                    key={s.symbol}
                    className="search-item"
                    onClick={() => handleSelectSearchItem(s)}
                  >
                    <div className="search-item-left">
                      <div className="search-item-icon" style={{ fontWeight: 800, fontSize: '11px' }}>
                        {s.symbol[0]}
                      </div>
                      <div className="search-item-title">
                        <strong>{s.symbol} · {s.name}</strong>
                        <small>{s.sector}</small>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#e2e8f0', fontSize: '11px', fontWeight: 600 }}>{s.price}</div>
                      <span className={s.change.startsWith('+') ? 'positive' : 'negative'} style={{ fontSize: '10px' }}>{s.change}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="top-actions">
            <span className="date-label">OCTOBER 14, 2026</span>
            <MagneticButton strength={0.2} maxOffset={6}>
              <button
                className="landing-login-btn magnetic-btn hover-lift"
                style={{ fontSize: '11px', padding: '5px 11px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                onClick={() => setViewMode('landing')}
                title="Return to Home"
              >
                <Home size={13} className="hover-icon-rotate" /> Home
              </button>
            </MagneticButton>

            {/* Prominent Log Out button always available */}
            <MagneticButton strength={0.2} maxOffset={6}>
              <button
                className="topbar-logout-btn magnetic-btn hover-lift"
                onClick={handleLogout}
                title="Log Out from workspace"
              >
                <LogOut size={13} className="hover-icon-rotate" /> Log Out
              </button>
            </MagneticButton>

            {/* Notifications with interactive popover */}
            <div className="notifications-wrap" ref={notifRef}>
              <button
                className="icon-button notification"
                aria-label="Notifications"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell size={18} />
                {unreadCount > 0 && <i />}
              </button>

              {notificationsOpen && (
                <div className="notifications-dropdown">
                  <div className="notif-header">
                    <strong>Alerts & Intelligence</strong>
                    {unreadCount > 0 && (
                      <button className="notif-clear-btn" onClick={handleClearNotifications}>
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="notif-list">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={`notif-item ${n.unread ? 'notif-unread' : ''}`}
                        onClick={() => handleNotifClick(n)}
                      >
                        <div className="notif-top">
                          <span className="notif-title">{n.title}</span>
                          <span className="notif-time">{n.time}</span>
                        </div>
                        <p className="notif-body">{n.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              className="avatar small-avatar"
              onClick={() => setActive('Settings')}
              style={{ cursor: 'pointer' }}
              title="User Account & Settings"
            >
              {currentUser ? (currentUser.initials || currentUser.name[0]) : 'S'}
            </div>
          </div>
        </header>

        <div className="page-content">
          <SmoothTransition viewKey={active}>
            {active === 'Dashboard' ? (
              <>
                <section className="welcome">
                  <div>
                    <div className="eyebrow">
                      <span className="live-dot radar-dot" />
                      YOUR FINANCIAL COMMAND CENTER
                    </div>
                    <h1>Good afternoon, Shaun <span className="wave">✳</span></h1>
                    <p>Your money, the markets, and the bigger picture.</p>
                  </div>
                  <span className="market-status glass-panel">
                    <span className="live-badge-stream">
                      <span className="live-beacon-dot" /> LIVE TICK STREAM · REAL TIME
                    </span>
                  </span>
                </section>

                <form className="ai-prompt glass-panel" onSubmit={askResearch}>
                  <div className="prompt-icon"><Sparkles size={19} className="hover-icon-rotate" /></div>
                  <input
                    value={question}
                    onChange={event => setQuestion(event.target.value)}
                    placeholder="Search any stock (TSLA, AMZN, NVDA, BTC) or ask AI..."
                    aria-label="Ask VibeFinance AI"
                  />
                  <MagneticButton strength={0.25} maxOffset={8}>
                    <button type="submit" className="ask-button magnetic-btn">
                      Ask AI <ArrowUpRight size={15} className="hover-icon-rotate" />
                    </button>
                  </MagneticButton>
                </form>

                <div className="demo-note" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="live-beacon-dot" />
                  <span>CONTINUOUS REAL-TIME MARKET TICK STREAM ACTIVE</span>
                </div>

                <ScrollReveal direction="up">
                  <section className="metrics-grid">
                    <Metric
                      title="Portfolio value"
                      value={portfolioValueFormatted}
                      change="+2.4% today"
                      icon={Wallet}
                      variant="green"
                    />
                    <Metric
                      title="Daily P&L"
                      value={dailyPnLFormatted}
                      change={dailyPnLChange}
                      icon={Activity}
                      variant="blue"
                    />
                    <Metric
                      title="Total return"
                      value={totalReturnPct}
                      change={`${totalReturnFormatted} all time`}
                      icon={ChartNoAxesCombined}
                      variant="purple"
                    />
                    <Metric
                      title="Cash balance"
                      value={cashBalanceFormatted}
                      change={cashWeight}
                      icon={BriefcaseBusiness}
                      variant="amber"
                    />
                  </section>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={1}>
                  <section className="primary-grid">
                    <SpotlightCard className="panel performance-panel glass-panel hover-lift">
                      <div className="section-heading">
                        <div>
                          <h2>Portfolio performance</h2>
                          <p>Track how your portfolio moves over time</p>
                        </div>
                        <span className="subtle-badge">Illustrative</span>
                      </div>

                      <div className="chart-summary">
                        <div>
                          <div className="chart-total">
                            {performanceDataByPeriod[period]?.summary || '$24,392.50'}
                          </div>
                          <div className="positive">
                            <ArrowUpRight size={15} /> {performanceDataByPeriod[period]?.change || '+$3,832.20 (+18.6%)'}
                          </div>
                        </div>
                        <div className="periods">
                          {['1D', '1W', '1M', '3M', '1Y'].map(value => (
                            <button
                              key={value}
                              type="button"
                              className={period === value ? 'period-active' : ''}
                              onClick={() => setPeriod(value)}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={performanceDataByPeriod[period]?.data || performanceDataByPeriod['1M'].data}
                            margin={{ top: 12, right: 8, left: -18, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="fillPortfolio" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid stroke="#1e293b" strokeDasharray="3 5" vertical={false} />
                            <XAxis dataKey="date" tick={{ fill: '#8492a6', fontSize: 10 }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={{ fill: '#8492a6', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={value => `$${Math.round(value / 1000)}k`} />
                            <Tooltip
                              contentStyle={{ background: '#101a2a', border: '1px solid #26364b', borderRadius: 10, color: '#f1f5f9' }}
                              formatter={value => [`$${Number(value).toLocaleString()}`, 'Portfolio']}
                            />
                            <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} fill="url(#fillPortfolio)" activeDot={{ r: 5, fill: '#34d399' }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="chart-footer">
                        <span><i className="legend-dot" /> Portfolio value ({period})</span>
                        <span>Historical values · Demo only</span>
                      </div>
                    </SpotlightCard>

                    <SpotlightCard className="panel allocation-panel glass-panel hover-lift" variant="blue">
                      <div className="section-heading">
                        <div>
                          <h2>Asset allocation</h2>
                          <p>How your assets are distributed</p>
                        </div>
                      </div>

                      <div className="donut-container">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={allocation} dataKey="value" nameKey="name" innerRadius={64} outerRadius={87} paddingAngle={4} stroke="none">
                              {allocation.map(item => (
                                <Cell key={item.name} fill={item.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ background: '#101a2a', border: '1px solid #26364b', borderRadius: 10, color: '#f1f5f9' }}
                              formatter={value => [`${value}%`, 'Allocation']}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="donut-center">
                          <strong>$24.4k</strong>
                          <span>Total assets</span>
                        </div>
                      </div>

                      <div className="allocation-list">
                        {allocation.map(item => (
                          <div className="allocation-row" key={item.name}>
                            <span><i style={{ background: item.color }} />{item.name}</span>
                            <strong>{item.value}%</strong>
                          </div>
                        ))}
                      </div>
                    </SpotlightCard>
                  </section>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={2}>
                  <section className="lower-grid">
                    <SpotlightCard className="panel holdings-panel glass-panel hover-lift">
                      <div className="section-heading">
                        <div>
                          <h2>Top holdings</h2>
                          <p>Your portfolio at a glance</p>
                        </div>
                        <button className="text-action" onClick={() => setActive('Portfolio')}>
                          View all <ArrowUpRight size={14} className="hover-icon-rotate" />
                        </button>
                      </div>

                      <div className="table-wrap">
                        <table>
                          <thead>
                            <tr><th>ASSET</th><th>PRICE</th><th>24H</th><th>WEIGHT</th></tr>
                          </thead>
                          <tbody>
                            {liveHoldings.map(item => (
                              <tr key={item.symbol}>
                                <td>
                                  <div className="asset-cell">
                                    <span className="asset-icon hover-icon-rotate" style={{ color: item.color }}>{item.symbol[0]}</span>
                                    <div><strong>{item.symbol}</strong><small>{item.name}</small></div>
                                  </div>
                                </td>
                                <td>
                                  <span className={item.lastTick === 'up' ? 'tick-flash-up' : item.lastTick === 'down' ? 'tick-flash-down' : ''}>
                                    <strong>{item.price_formatted}</strong>
                                  </span>
                                </td>
                                <td className={item.change_is_positive ? 'positive' : 'negative'}>{item.change_formatted}</td>
                                <td>{item.weight_formatted}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </SpotlightCard>

                    <SpotlightCard className="panel market-panel glass-panel hover-lift" variant="amber">
                      <div className="section-heading">
                        <div>
                          <h2>Market pulse</h2>
                          <p>Selected market indicators</p>
                        </div>
                        <button className="icon-button" onClick={() => setActive('Markets')} aria-label="Open markets">
                          <ArrowUpRight size={16} className="hover-icon-rotate" />
                        </button>
                      </div>

                      <div className="market-list">
                        {liveMarkets.map((item, index) => (
                          <div className="market-row" key={item.name}>
                            <span className={`market-icon market-${index}`}>{item.name[0]}</span>
                            <div className="market-name">
                              <strong>{item.name}</strong>
                              <small>{['US large-cap', 'US technology', 'Indian equities', 'Digital asset'][index]}</small>
                            </div>
                            <div className="market-value">
                              <strong className={item.lastTick === 'up' ? 'tick-flash-up' : item.lastTick === 'down' ? 'tick-flash-down' : ''}>
                                {item.value}
                              </strong>
                              <span className={item.change_is_positive ? 'positive' : 'negative'}>{item.change}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="market-disclaimer" style={{ color: '#34d399' }}>Live Real-Time Market Feed Active</p>
                    </SpotlightCard>

                    <SpotlightCard className="panel insights-panel glass-panel hover-lift" variant="purple">
                      <div className="section-heading">
                        <div>
                          <h2>AI intelligence</h2>
                          <p>Signals to explore</p>
                        </div>
                        <span className="ai-badge glass-badge"><Sparkles size={12} className="hover-icon-rotate" /> AI</span>
                      </div>

                      <div className="insights-list">
                        {insights.map(item => {
                          const Icon = item.icon
                          return (
                            <button
                              key={item.title}
                              className="insight-row hover-lift glass-panel"
                              onClick={() => handleAskInsight(item)}
                              title="Click to analyze with AI"
                            >
                              <span className="insight-icon hover-icon-rotate"><Icon size={17} /></span>
                              <span className="insight-copy">
                                <small>{item.tag}</small>
                                <strong>{item.title}</strong>
                                <span>Click to analyze in AI Research</span>
                              </span>
                              <ArrowUpRight size={15} className="hover-icon-rotate" />
                            </button>
                          )
                        })}
                      </div>

                      <MagneticButton strength={0.2} maxOffset={8} style={{ width: '100%', marginTop: '12px' }}>
                        <button className="research-button magnetic-btn hover-lift" onClick={() => { setQuestion(''); setActive('AI Research'); }}>
                          <BrainCircuit size={16} className="hover-icon-rotate" /> Open Research Studio <ArrowUpRight size={15} />
                        </button>
                      </MagneticButton>
                    </SpotlightCard>
                  </section>
                </ScrollReveal>

                <footer className="footer">
                  <span>VibeFinance <span className="slash">/</span> Financial intelligence, in context.</span>
                  <span><span className="live-dot radar-dot" /> Demo environment</span>
                </footer>
              </>
            ) : active === 'AI Research' ? (
              <ResearchStudio initialQuestion={question} />
            ) : active === 'Markets' ? (
              <MarketsView onNavigateToResearch={q => { setQuestion(q); setActive('AI Research'); }} />
            ) : active === 'Portfolio' ? (
              <PortfolioView onNavigateToResearch={q => { setQuestion(q); setActive('AI Research'); }} />
            ) : active === 'Risk Analysis' ? (
              <RiskAnalysisView onNavigateToResearch={q => { setQuestion(q); setActive('AI Research'); }} />
            ) : active === 'Reports' ? (
              <ReportsView onNavigateToResearch={q => { setQuestion(q); setActive('AI Research'); }} />
            ) : active === 'Settings' ? (
              <SettingsView onLogout={handleLogout} />
            ) : (
              <SpotlightCard className="panel placeholder-page glass-panel">
                <div className="placeholder-icon hover-icon-rotate">
                  <LayoutDashboard size={28} />
                </div>
                <span className="eyebrow">VIBEFINANCE WORKSPACE</span>
                <h1>{active}</h1>
                <p>Workspace section.</p>
                <MagneticButton strength={0.25} maxOffset={8}>
                  <button className="ask-button magnetic-btn" onClick={() => setActive('Dashboard')}>
                    Back to dashboard <ArrowUpRight size={15} />
                  </button>
                </MagneticButton>
              </SpotlightCard>
            )}
          </SmoothTransition>
        </div>
      </main>
    </div>
      )}
    </SmoothTransition>

      {authModal && (
        <AuthModal
          initialMode={authModal}
          onClose={() => setAuthModal(null)}
          onLoginSuccess={(user) => {
            setCurrentUser(user)
            setViewMode('terminal')
          }}
        />
      )}
    </>
  )
}

export default App
