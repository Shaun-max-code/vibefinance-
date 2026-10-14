import { useState } from 'react'
import {
  Activity, ArrowUpRight, BrainCircuit, ShieldCheck,
  TrendingUp, Sparkles, ChevronRight, Lock, CheckCircle,
  BarChart3, Globe, Zap, ArrowRight, User
} from 'lucide-react'

export default function LandingPage({ onLaunchTerminal, onOpenLogin, onOpenSignup, currentUser }) {
  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <div className="brand">
            <div className="brand-mark"><Activity size={21} /></div>
            <span>Vibe<span className="brand-accent">Finance</span></span>
          </div>

          <nav className="landing-links">
            <a href="#features">Features</a>
            <a href="#agents">AI Agents</a>
            <a href="#risk">Risk Engine</a>
            <a href="#terminal">Terminal Preview</a>
          </nav>

          <div className="landing-nav-actions">
            {currentUser ? (
              <div className="user-logged-box">
                <span className="user-greeting">Welcome, <strong>{currentUser.name}</strong></span>
                <button className="ask-button" onClick={onLaunchTerminal}>
                  Open Terminal <ArrowUpRight size={14} />
                </button>
              </div>
            ) : (
              <>
                <button className="landing-login-btn" onClick={onOpenLogin}>
                  Sign In
                </button>
                <button className="ask-button" onClick={onOpenSignup}>
                  Get Started <ArrowUpRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-badge">
          <span className="live-dot" /> MULTI-AGENT AUTONOMOUS FINANCIAL INTELLIGENCE
        </div>

        <h1 className="hero-headline">
          Institutional research,<br />
          <span className="gradient-text">democratized for retail investors.</span>
        </h1>

        <p className="hero-subline">
          Synthesize conflicting market feeds, options chain skew, and regulatory filings into
          evidence-grounded, personalized investment intelligence.
        </p>

        <div className="hero-ctas">
          <button className="ask-button hero-main-btn" onClick={onLaunchTerminal}>
            <Zap size={16} /> Launch Terminal (Demo Mode) <ArrowRight size={16} />
          </button>
          {!currentUser && (
            <button className="hero-secondary-btn" onClick={onOpenSignup}>
              Create Free Account <ChevronRight size={16} />
            </button>
          )}
        </div>

        {/* Live Metrics Ticker Bar */}
        <div className="hero-ticker-bar">
          <div className="ticker-item">
            <small>S&P 500</small>
            <strong>6,742.18</strong>
            <span className="positive">+1.13%</span>
          </div>
          <div className="ticker-item">
            <small>NASDAQ 100</small>
            <strong>23,016.32</strong>
            <span className="positive">+0.78%</span>
          </div>
          <div className="ticker-item">
            <small>NIFTY 50</small>
            <strong>24,716.30</strong>
            <span className="negative">-0.90%</span>
          </div>
          <div className="ticker-item">
            <small>BTC / USD</small>
            <strong>$112,420</strong>
            <span className="positive">+2.40%</span>
          </div>
          <div className="ticker-item">
            <small>PORTFOLIO VaR</small>
            <strong>$582.40</strong>
            <span className="neutral-tag">95% 1-Day</span>
          </div>
        </div>
      </section>

      {/* Live Terminal Preview */}
      <section className="terminal-preview-section" id="terminal">
        <div className="terminal-window">
          <div className="terminal-window-header">
            <div className="window-dots">
              <span className="dot-red" />
              <span className="dot-yellow" />
              <span className="dot-green" />
            </div>
            <div className="window-title">VibeFinance Terminal · Workspace / Dashboard</div>
            <div className="window-badge">● LIVE DEMO</div>
          </div>

          <div className="terminal-window-body">
            <div className="preview-metrics-row">
              <div className="preview-metric">
                <small>PORTFOLIO VALUE</small>
                <strong>$24,392.50</strong>
                <span className="positive">+2.4% today</span>
              </div>
              <div className="preview-metric">
                <small>DAILY P&L</small>
                <strong>+$588.20</strong>
                <span className="positive">+2.47%</span>
              </div>
              <div className="preview-metric">
                <small>CONCENTRATION (HHI)</small>
                <strong>2,085</strong>
                <span style={{ color: '#fbbf24' }}>Moderate</span>
              </div>
              <div className="preview-metric">
                <small>WEIGHTED BETA</small>
                <strong>1.25</strong>
                <span>Relative to S&P</span>
              </div>
            </div>

            <div className="preview-agents-banner">
              <div className="agent-pill pill-market"><TrendingUp size={14} /> Market Agent: Momentum Breakout</div>
              <div className="agent-pill pill-research"><BrainCircuit size={14} /> Research Agent: SEC 10-K RAG Verified</div>
              <div className="agent-pill pill-risk"><ShieldCheck size={14} /> Risk Agent: HHI Threshold Guarded</div>
            </div>

            <div className="preview-cta-overlay">
              <button className="ask-button" onClick={onLaunchTerminal}>
                Explore Full Interactive Terminal &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars / Features Section */}
      <section className="landing-features" id="features">
        <div className="section-eyebrow">
          <Sparkles size={14} /> THE VIBEFINANCE ENGINE
        </div>
        <h2>Designed for retail investors who demand institutional clarity.</h2>
        <p className="features-subline">
          Most retail screeners only look at prices. VibeFinance synthesizes price momentum, regulatory disclosures,
          and risk mathematics into a unified investment thesis.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><BrainCircuit size={22} /></div>
            <h3>Multi-Agent Reasoning</h3>
            <p>Three specialized AI agents analyze price momentum, corporate filings, and downside concentration in parallel, with automated conflict resolution.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Globe size={22} /></div>
            <h3>Grounded RAG Corpus</h3>
            <p>Every fundamental thesis links directly to citations in verified SEC 10-K, 10-Q reports and earnings conference call transcripts.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><ShieldCheck size={22} /></div>
            <h3>Mathematical Risk Limits</h3>
            <p>Real-time calculation of Herfindahl-Hirschman Index (HHI), weighted portfolio Beta, and 95% Parametric 1-Day Value-at-Risk (VaR).</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><BarChart3 size={22} /></div>
            <h3>Macro Scenario Stress Tests</h3>
            <p>Simulate how rate hikes, semiconductor contraction, or broad selloffs will affect your specific portfolio before executing trades.</p>
          </div>
        </div>
      </section>

      {/* Meet Your AI Team Section */}
      <section className="landing-agents" id="agents">
        <div className="section-eyebrow">
          <Zap size={14} /> AUTONOMOUS SQUAD
        </div>
        <h2>Your Personal Research Team.</h2>

        <div className="agents-grid">
          <div className="landing-agent-card agent-border-green">
            <div className="agent-avatar rs-green"><TrendingUp size={20} /></div>
            <h3>Market Agent</h3>
            <span className="agent-role">Technical & Momentum Analyst</span>
            <p>Studies multi-timeframe price action, 20/50/200-day EMAs, RSI(14) divergences, volume surges, and options Put-Call Ratio (PCR).</p>
          </div>

          <div className="landing-agent-card agent-border-blue">
            <div className="agent-avatar rs-blue"><BrainCircuit size={20} /></div>
            <h3>Research Agent</h3>
            <span className="agent-role">Corporate & Sector Analyst</span>
            <p>Indexes regulatory filings, tracks gross margin trajectory, monitors capex cycles, and verifies disclosures with exact document citations.</p>
          </div>

          <div className="landing-agent-card agent-border-purple">
            <div className="agent-avatar rs-purple"><ShieldCheck size={20} /></div>
            <h3>Risk Agent</h3>
            <span className="agent-role">Downside & Exposure Analyst</span>
            <p>Quantifies portfolio concentration (HHI), stress-tests macro scenarios, calculates parametric VaR, and protects cash buffers.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="landing-cta-banner">
        <div className="cta-banner-inner">
          <h2>Ready to upgrade your financial intelligence?</h2>
          <p>Experience multi-agent autonomous reasoning backed by synthetic market feeds and institutional risk analytics.</p>
          <div className="cta-btns">
            <button className="ask-button hero-main-btn" onClick={onLaunchTerminal}>
              Enter Workspace Now <ArrowUpRight size={15} />
            </button>
            {!currentUser && (
              <button className="landing-login-btn" onClick={onOpenSignup}>
                Create an Account
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="brand">
            <div className="brand-mark"><Activity size={18} /></div>
            <span>Vibe<span className="brand-accent">Finance</span></span>
          </div>
          <span className="footer-disclaimer">
            Demo environment · Synthetic datasets · Not live financial advice
          </span>
          <span className="footer-copy">&copy; 2026 VibeFinance Platform</span>
        </div>
      </footer>
    </div>
  )
}
