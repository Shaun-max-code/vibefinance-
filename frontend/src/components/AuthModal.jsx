import { useState } from 'react'
import {
  X, Lock, Mail, User, ShieldCheck, ArrowRight,
  CheckCircle, AlertCircle, Sparkles, Zap
} from 'lucide-react'

export default function AuthModal({ initialMode = 'login', onClose, onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode) // 'login' or 'signup'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: 'shaunmathew@example.com',
    password: 'password123'
  })

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    risk_profile: 'Balanced Compounder',
    benchmark: 'S&P 500'
  })

  async function handleLogin(e) {
    if (e) e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      })
      const data = await res.json()

      if (data.success && data.user) {
        localStorage.setItem('vibefinance_user', JSON.stringify(data.user))
        localStorage.setItem('vibefinance_token', data.token)
        onLoginSuccess(data.user)
        onClose()
        return
      } else {
        setError(data.error || 'Authentication failed. Please check credentials.')
      }
    } catch (err) {
      // Offline fallback: Login demo account Shaun Mathew
      if (loginForm.email.toLowerCase().includes('shaun')) {
        const demoUser = {
          name: 'Shaun Mathew',
          email: loginForm.email,
          workspace: 'Personal workspace',
          initials: 'S',
          risk_profile: 'Balanced Compounder',
          benchmark: 'S&P 500'
        }
        localStorage.setItem('vibefinance_user', JSON.stringify(demoUser))
        onLoginSuccess(demoUser)
        onClose()
        return
      }
      setError('Backend server offline. Try Demo Login or start backend on :5000.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignup(e) {
    if (e) e.preventDefault()
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupForm)
      })
      const data = await res.json()

      if (data.success && data.user) {
        localStorage.setItem('vibefinance_user', JSON.stringify(data.user))
        localStorage.setItem('vibefinance_token', data.token)
        onLoginSuccess(data.user)
        onClose()
        return
      } else {
        setError(data.error || 'Registration failed.')
      }
    } catch (err) {
      // Local fallback for new user
      const newUser = {
        name: signupForm.name.trim(),
        email: signupForm.email.trim(),
        workspace: `${signupForm.name.trim()}'s Workspace`,
        initials: signupForm.name.trim()[0].toUpperCase(),
        risk_profile: signupForm.risk_profile,
        benchmark: signupForm.benchmark
      }
      localStorage.setItem('vibefinance_user', JSON.stringify(newUser))
      onLoginSuccess(newUser)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  function handleQuickDemoLogin() {
    setLoginForm({ email: 'shaunmathew@example.com', password: 'password123' })
    const demoUser = {
      name: 'Shaun Mathew',
      email: 'shaunmathew@example.com',
      workspace: 'Personal workspace',
      initials: 'S',
      risk_profile: 'Balanced Compounder',
      benchmark: 'S&P 500'
    }
    localStorage.setItem('vibefinance_user', JSON.stringify(demoUser))
    onLoginSuccess(demoUser)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="auth-modal-card" onClick={e => e.stopPropagation()}>
        <div className="auth-header">
          <div className="brand">
            <div className="brand-mark"><Lock size={18} /></div>
            <span>Vibe<span className="brand-accent">Finance</span></span>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'auth-tab-active' : ''}`}
            onClick={() => { setMode('login'); setError(null) }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${mode === 'signup' ? 'auth-tab-active' : ''}`}
            onClick={() => { setMode('signup'); setError(null) }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={15} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={loginForm.email}
                  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={15} />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="ask-button full-width" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Workspace'} <ArrowRight size={15} />
            </button>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="quick-demo-btn"
              onClick={handleQuickDemoLogin}
            >
              <Zap size={14} /> Quick Demo Login (Shaun Mathew)
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={15} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={signupForm.name}
                  onChange={e => setSignupForm({ ...signupForm, name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={15} />
                <input
                  type="email"
                  required
                  placeholder="priya@example.com"
                  value={signupForm.email}
                  onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={15} />
                <input
                  type="password"
                  required
                  placeholder="Create secure password"
                  value={signupForm.password}
                  onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Investor Risk Archetype</label>
              <select
                value={signupForm.risk_profile}
                onChange={e => setSignupForm({ ...signupForm, risk_profile: e.target.value })}
              >
                <option value="Conservative Retiree">Conservative (Capital preservation, low drawdown)</option>
                <option value="Balanced Compounder">Balanced Compounder (Medium-term growth)</option>
                <option value="Aggressive Swing Trader">Aggressive (High-beta momentum, options breakouts)</option>
              </select>
            </div>

            <button type="submit" className="ask-button full-width" disabled={loading}>
              {loading ? 'Creating Account...' : 'Complete Registration & Enter'} <ArrowRight size={15} />
            </button>
          </form>
        )}

        <div className="auth-footer-note">
          <ShieldCheck size={14} />
          <span>VibeFinance securely stores your preferences locally and synchronizes with your personal workspace.</span>
        </div>
      </div>
    </div>
  )
}
