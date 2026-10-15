import { useState, useEffect } from 'react'
import {
  Settings2, User, ShieldCheck, Bell, Database,
  CheckCircle, ArrowUpRight, Sparkles, RefreshCw, LogOut
} from 'lucide-react'

export default function SettingsView({ onLogout }) {
  const [profile, setProfile] = useState({
    name: 'Shaun Mathew',
    email: 'shaunmathew@example.com',
    workspace: 'Personal workspace',
    risk_profile: 'Balanced Compounder',
    benchmark: 'S&P 500',
    cash_target: 10,
    max_drawdown: 12.5,
    notifications_risk: true,
    notifications_market: true,
    notifications_ai: true
  })
  const [backendStatus, setBackendStatus] = useState('CHECKING')
  const [saveMessage, setSaveMessage] = useState(null)

  useEffect(() => {
    
fetch(`${import.meta.env.VITE_API_URL}/api`)

      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'ONLINE') {
          setBackendStatus('ONLINE (Render)')
        } else {
          setBackendStatus('OFFLINE')
        }
      })
      .catch(() => {
        setBackendStatus('STANDALONE_DEMO')
      })
  }, [])

  function handleSave(e) {
    e.preventDefault()
    setSaveMessage('Workspace settings and risk parameters updated successfully.')
    setTimeout(() => setSaveMessage(null), 4000)
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <div className="eyebrow">
            <span className="live-dot" /> WORKSPACE CONFIGURATION
          </div>
          <h1>Settings & Preferences<span className="brand-accent">.</span></h1>
          <p>Personalize investor persona, risk constraints, alert thresholds, and backend connectivity.</p>
        </div>
      </div>

      {saveMessage && (
        <div className="feedback-banner">
          <CheckCircle size={17} />
          <span>{saveMessage}</span>
        </div>
      )}

      <div className="settings-grid">
        {/* User Profile Card */}
        <div className="panel settings-panel">
          <div className="section-heading">
            <div>
              <h2>Investor Identity</h2>
              <p>Workspace ownership and credentials</p>
            </div>
            <User size={18} />
          </div>

          <div className="profile-hero">
            <div className="avatar big-avatar">S</div>
            <div>
              <h3>Shaun Mathew</h3>
              <p>shaunmathew@example.com</p>
              <span className="status-pill pill-green">VibeFinance Intelligence Pro</span>
            </div>
          </div>

          <div className="settings-field">
            <label>Workspace Name</label>
            <input
              type="text"
              value={profile.workspace}
              onChange={e => setProfile({ ...profile, workspace: e.target.value })}
            />
          </div>

          <div className="settings-field">
            <label>Selected Benchmark</label>
            <select
              value={profile.benchmark}
              onChange={e => setProfile({ ...profile, benchmark: e.target.value })}
            >
              <option value="S&P 500">S&P 500 (US Large-Cap Equity)</option>
              <option value="NASDAQ">NASDAQ 100 (Technology / Growth)</option>
              <option value="NIFTY 50">NIFTY 50 (Indian Equities)</option>
            </select>
          </div>

          {onLogout && (
            <button
              type="button"
              className="topbar-logout-btn"
              style={{ marginTop: '16px', width: '100%', justifyContent: 'center', padding: '10px' }}
              onClick={onLogout}
            >
              <LogOut size={14} /> Sign Out of Workspace
            </button>
          )}
        </div>

        {/* Risk & Mandate Preferences */}
        <div className="panel settings-panel">
          <div className="section-heading">
            <div>
              <h2>Risk Profile & Mandate</h2>
              <p>Personalized weighting applied by Synthesis Orchestrator</p>
            </div>
            <ShieldCheck size={18} />
          </div>

          <div className="settings-field">
            <label>Investor Archetype</label>
            <select
              value={profile.risk_profile}
              onChange={e => setProfile({ ...profile, risk_profile: e.target.value })}
            >
              <option value="Conservative Retiree">Conservative (Capital preservation, low beta, max dividend)</option>
              <option value="Balanced Compounder">Balanced Compounder (Medium-term earnings growth, moderate risk)</option>
              <option value="Aggressive Swing Trader">Aggressive (High beta momentum, options breakouts)</option>
            </select>
          </div>

          <div className="settings-field">
            <label>Target Cash Allocation (% of Portfolio)</label>
            <input
              type="number"
              min="0"
              max="50"
              value={profile.cash_target}
              onChange={e => setProfile({ ...profile, cash_target: Number(e.target.value) })}
            />
            <small className="field-hint">Current actual cash balance is 13.3% ($3,250.00)</small>
          </div>

          <div className="settings-field">
            <label>Max Drawdown Tolerance (%)</label>
            <input
              type="number"
              min="5"
              max="35"
              value={profile.max_drawdown}
              onChange={e => setProfile({ ...profile, max_drawdown: Number(e.target.value) })}
            />
          </div>

          <div className="settings-field">
            <label>Backend API Service Status</label>
            <div className="backend-status-box">
              <Database size={15} />
              <span>{backendStatus}</span>
            </div>
          </div>

          <button className="ask-button" style={{ marginTop: '14px' }} onClick={handleSave}>
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  )
}
