
import { useState } from 'react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, PieChart, Pie, Cell,
} from 'recharts'
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, BrainCircuit,
  BriefcaseBusiness, ChartNoAxesCombined, ChevronDown, FileText,
  LayoutDashboard, Menu, Search, Settings2, ShieldCheck,
  Sparkles, Wallet, Zap,
} from 'lucide-react'
import ResearchStudio from './ResearchStudio'
import './App.css'

const performanceData = [
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

const holdings = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: '$245.50', change: '+2.1%', weight: '24.5%', color: '#94a3b8' },
  { symbol: 'MSFT', name: 'Microsoft', price: '$521.40', change: '+1.4%', weight: '18.2%', color: '#60a5fa' },
  { symbol: 'NVDA', name: 'NVIDIA', price: '$188.20', change: '+3.8%', weight: '16.8%', color: '#a3e635' },
  { symbol: 'GOOGL', name: 'Alphabet', price: '$245.10', change: '-0.4%', weight: '12.6%', color: '#fbbf24' },
]

const markets = [
  { name: 'S&P 500', value: '6,742.18', change: '+1.13%' },
  { name: 'NASDAQ', value: '23,016.32', change: '+0.78%' },
  { name: 'NIFTY 50', value: '24,716.30', change: '-0.90%' },
  { name: 'BTC / USD', value: '$112,420', change: '+2.40%' },
]

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

function Metric({ title, value, change, icon: Icon }) {
  return (
    <article className="metric-card">
      <div className="metric-heading">
        <span>{title}</span>
        <Icon size={17} />
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-change">
        <ArrowUpRight size={14} /> {change}
      </div>
    </article>
  )
}

function App() {
  const [period, setPeriod] = useState('1M')
  const [active, setActive] = useState('Dashboard')
  const [question, setQuestion] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const navigation = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Markets', icon: ChartNoAxesCombined },
    { label: 'AI Research', icon: BrainCircuit },
    { label: 'Portfolio', icon: BriefcaseBusiness },
    { label: 'Risk Analysis', icon: ShieldCheck },
    { label: 'Reports', icon: FileText },
  ]

  function askResearch(event) {
    event.preventDefault()
    if (question.trim()) {
      setActive('AI Research')
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Activity size={21} /></div>
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
          <div className="promo-card">
            <div className="promo-icon"><Zap size={17} /></div>
            <strong>Intelligence, amplified.</strong>
            <p>One question. Multiple perspectives.</p>
            <button onClick={() => setActive('AI Research')}>
              Explore AI <ArrowUpRight size={14} />
            </button>
          </div>

          <button className="nav-item" onClick={() => setActive('Settings')}>
            <Settings2 size={18} />
            <span>Settings</span>
          </button>

          <div className="profile">
            <div className="avatar">S</div>
            <div className="profile-text">
              <strong>Shaun Mathew</strong>
              <span>Personal workspace</span>
            </div>
            <ChevronDown size={15} />
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

          <div className="breadcrumbs">
            <Search size={15} />
            <span>Workspace</span>
            <span className="slash">/</span>
            <strong>{active}</strong>
          </div>

          <div className="top-actions">
            <span className="date-label">OCTOBER 14, 2026</span>
            <button className="icon-button notification" aria-label="Notifications">
              <Bell size={18} /><i />
            </button>
            <div className="avatar small-avatar">S</div>
          </div>
        </header>

        <div className="page-content">
          {active === 'Dashboard' ? (
            <>
              <section className="welcome">
                <div>
                  <div className="eyebrow">
                    <span className="live-dot" />
                    YOUR FINANCIAL COMMAND CENTER
                  </div>
                  <h1>Good afternoon, Shaun <span className="wave">✳</span></h1>
                  <p>Your money, the markets, and the bigger picture.</p>
                </div>
                <span className="market-status">
                  <span className="live-dot" /> Demo environment
                </span>
              </section>

              <form className="ai-prompt" onSubmit={askResearch}>
                <div className="prompt-icon"><Sparkles size={19} /></div>
                <input
                  value={question}
                  onChange={event => setQuestion(event.target.value)}
                  placeholder="Ask about markets, companies, or portfolio risk..."
                  aria-label="Ask VibeFinance AI"
                />
                <button type="submit" className="ask-button">
                  Ask AI <ArrowUpRight size={15} />
                </button>
              </form>

              <div className="demo-note">
                <Activity size={13} />
                DEMO DATA · NOT LIVE FINANCIAL INFORMATION
              </div>

              <section className="metrics-grid">
                <Metric title="Portfolio value" value="$24,392.50" change="+2.4% today" icon={Wallet} />
                <Metric title="Daily P&L" value="+$588.20" change="+2.47% today" icon={Activity} />
                <Metric title="Total return" value="+18.6%" change="+$3,832.20 all time" icon={ChartNoAxesCombined} />
                <Metric title="Cash balance" value="$3,250.00" change="13.3% of portfolio" icon={BriefcaseBusiness} />
              </section>

              <section className="primary-grid">
                <article className="panel performance-panel">
                  <div className="section-heading">
                    <div>
                      <h2>Portfolio performance</h2>
                      <p>Track how your portfolio moves over time</p>
                    </div>
                    <span className="subtle-badge">Illustrative</span>
                  </div>

                  <div className="chart-summary">
                    <div>
                      <div className="chart-total">$24,392.50</div>
                      <div className="positive">
                        <ArrowUpRight size={15} /> +$3,832.20 (+18.6%)
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
                      <AreaChart data={performanceData} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
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
                    <span><i className="legend-dot" /> Portfolio value</span>
                    <span>Historical values · Demo only</span>
                  </div>
                </article>

                <article className="panel allocation-panel">
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
                </article>
              </section>

              <section className="lower-grid">
                <article className="panel holdings-panel">
                  <div className="section-heading">
                    <div>
                      <h2>Top holdings</h2>
                      <p>Your portfolio at a glance</p>
                    </div>
                    <button className="text-action" onClick={() => setActive('Portfolio')}>
                      View all <ArrowUpRight size={14} />
                    </button>
                  </div>

                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>ASSET</th><th>PRICE</th><th>24H</th><th>WEIGHT</th></tr>
                      </thead>
                      <tbody>
                        {holdings.map(item => (
                          <tr key={item.symbol}>
                            <td>
                              <div className="asset-cell">
                                <span className="asset-icon" style={{ color: item.color }}>{item.symbol[0]}</span>
                                <div><strong>{item.symbol}</strong><small>{item.name}</small></div>
                              </div>
                            </td>
                            <td>{item.price}</td>
                            <td className={item.change.startsWith('+') ? 'positive' : 'negative'}>{item.change}</td>
                            <td>{item.weight}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>

                <article className="panel market-panel">
                  <div className="section-heading">
                    <div>
                      <h2>Market pulse</h2>
                      <p>Selected market indicators</p>
                    </div>
                    <button className="icon-button" onClick={() => setActive('Markets')} aria-label="Open markets">
                      <ArrowUpRight size={16} />
                    </button>
                  </div>

                  <div className="market-list">
                    {markets.map((item, index) => (
                      <div className="market-row" key={item.name}>
                        <span className={`market-icon market-${index}`}>{item.name[0]}</span>
                        <div className="market-name">
                          <strong>{item.name}</strong>
                          <small>{['US large-cap', 'US technology', 'Indian equities', 'Digital asset'][index]}</small>
                        </div>
                        <div className="market-value">
                          <strong>{item.value}</strong>
                          <span className={item.change.startsWith('+') ? 'positive' : 'negative'}>{item.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="market-disclaimer">Illustrative values · Not live quotes</p>
                </article>

                <article className="panel insights-panel">
                  <div className="section-heading">
                    <div>
                      <h2>AI intelligence</h2>
                      <p>Signals to explore</p>
                    </div>
                    <span className="ai-badge"><Sparkles size={12} /> AI</span>
                  </div>

                  <div className="insights-list">
                    {insights.map(item => {
                      const Icon = item.icon
                      return (
                        <button key={item.title} className="insight-row" onClick={() => setActive('AI Research')}>
                          <span className="insight-icon"><Icon size={17} /></span>
                          <span className="insight-copy">
                            <small>{item.tag}</small>
                            <strong>{item.title}</strong>
                            <span>Illustrative insight</span>
                          </span>
                          <ArrowUpRight size={15} />
                        </button>
                      )
                    })}
                  </div>

                  <button className="research-button" onClick={() => setActive('AI Research')}>
                    <BrainCircuit size={16} /> Open Research Studio <ArrowUpRight size={15} />
                  </button>
                </article>
              </section>

              <footer className="footer">
                <span>VibeFinance <span className="slash">/</span> Financial intelligence, in context.</span>
                <span><span className="live-dot" /> Demo environment</span>
              </footer>
            </>
          ) : active === 'AI Research' ? (
            <ResearchStudio />
          ) : (
            <section className="panel placeholder-page">
              <div className="placeholder-icon">
                {active === 'Risk Analysis' ? <ShieldCheck size={28} /> : active === 'Portfolio' ? <Wallet size={28} /> : active === 'Settings' ? <Settings2 size={28} /> : <ChartNoAxesCombined size={28} />}
              </div>
              <span className="eyebrow">VIBEFINANCE WORKSPACE</span>
              <h1>{active}</h1>
              <p>
                {active === 'Risk Analysis'
                  ? 'Explore portfolio concentration, volatility, drawdown, and scenario analysis as risk calculations are implemented.'
                  : active === 'Portfolio'
                    ? 'Explore your holdings, allocation and performance. Demo figures are not linked to a brokerage account.'
                    : active === 'Settings'
                      ? 'Workspace settings will be implemented as the platform develops.'
                      : 'Explore market movements and selected assets as live market data integration is implemented.'}
              </p>
              <div className="placeholder-note">
                <Sparkles size={16} /> This section is part of the planned interface.
              </div>
              <button className="ask-button" onClick={() => setActive('Dashboard')}>
                Back to dashboard <ArrowUpRight size={15} />
              </button>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
