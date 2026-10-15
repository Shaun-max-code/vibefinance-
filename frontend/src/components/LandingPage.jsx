import { useState } from 'react'
import {
  Activity, ArrowUpRight, BrainCircuit, ShieldCheck,
  TrendingUp, Sparkles, ChevronRight, Lock, CheckCircle,
  BarChart3, Globe, Zap, ArrowRight, User
} from 'lucide-react'

import GlobalCursorSpotlight from '../effects/GlobalCursorSpotlight'
import SpotlightCard from '../effects/SpotlightCard'
import MagneticButton from '../effects/MagneticButton'
import HeroCanvas from '../effects/HeroCanvas'
import ScrollReveal from '../effects/ScrollReveal'
import { useParallaxScroll, use3DTilt } from '../effects/useParallax'

export default function LandingPage({ onLaunchTerminal, onOpenLogin, onOpenSignup, onLogout, currentUser }) {
  const scrollY = useParallaxScroll()
  const { tiltProps } = use3DTilt(4)

  return (
    <div className="landing-page">
      {/* Soft Ambient Spotlight Following Cursor */}
      <GlobalCursorSpotlight />

      {/* Navigation Bar */}
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
            <div className="brand-mark hover-icon-rotate"><Activity size={21} /></div>
            <span>Vibe<span className="brand-accent">Finance</span></span>
          </div>

          <nav className="landing-links">
            <a href="#features">Features</a>
            <a href="#agents">AI Agents</a>
            <a href="#terminal">Terminal Preview</a>
            <a href="#risk">Risk Engine</a>
          </nav>

          <div className="landing-nav-actions">
            {currentUser ? (
              <div className="user-logged-box">
                <span className="user-greeting">Welcome, <strong>{currentUser.name}</strong></span>
                <MagneticButton strength={0.25} maxOffset={8}>
                  <button className="ask-button magnetic-btn" onClick={onLaunchTerminal}>
                    Open Terminal <ArrowUpRight size={14} className="hover-icon-rotate" />
                  </button>
                </MagneticButton>
                <MagneticButton strength={0.2} maxOffset={6}>
                  <button
                    className="landing-login-btn magnetic-btn"
                    onClick={onLogout}
                    title="Sign Out"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '7px 12px' }}
                  >
                    <Lock size={13} /> Sign Out
                  </button>
                </MagneticButton>
              </div>
            ) : (
              <>
                <MagneticButton strength={0.2} maxOffset={6}>
                  <button className="landing-login-btn magnetic-btn" onClick={onOpenLogin}>
                    Sign In
                  </button>
                </MagneticButton>
                <MagneticButton strength={0.25} maxOffset={8}>
                  <button className="ask-button magnetic-btn" onClick={onOpenSignup}>
                    Get Started <ArrowUpRight size={14} className="hover-icon-rotate" />
                  </button>
                </MagneticButton>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Animated Hero Section with Multi-plane Parallax */}
      <section className="landing-hero" style={{ position: 'relative' }}>
        {/* Parallax Background Glowing Aurora */}
        <div
          className="hero-aurora-container"
          style={{ transform: `translate(-50%, ${scrollY * 0.16}px)` }}
          aria-hidden="true"
        >
          <div className="hero-aurora-blob-1" />
          <div className="hero-aurora-blob-2" />
          <div className="hero-aurora-blob-3" />
        </div>

        {/* Parallax Cybernetic Perspective Grid */}
        <div
          className="hero-cyber-grid"
          style={{ transform: `translate3d(0, ${scrollY * 0.1}px, 0)` }}
          aria-hidden="true"
        />

        {/* Interactive Floating Micro-Particle Canvas */}
        <HeroCanvas />

        {/* Floating 3D Tech Badges (Foreground Parallax) */}
        <div
          className="floating-hero-badge badge-left float-slow-1 glass-badge"
          style={{ transform: `translateY(${scrollY * -0.09}px)` }}
        >
          <span className="radar-dot" />
          <span>SEC 10-K RAG GROUNDED</span>
        </div>

        <div
          className="floating-hero-badge badge-right float-slow-2 glass-badge"
          style={{ transform: `translateY(${scrollY * -0.13}px)` }}
        >
          <Zap size={14} style={{ color: '#38bdf8' }} />
          <span>3 CONCURRENT AI AGENTS</span>
        </div>

        {/* Hero Content */}
        <div className="hero-badge float-slow-3 glass-badge">
          <span className="radar-dot" /> MULTI-AGENT AUTONOMOUS FINANCIAL INTELLIGENCE
        </div>

        <h1 className="hero-headline">
          Institutional research,<br />
          <span className="gradient-text gradient-text-animated">
            democratized for retail investors.
          </span>
        </h1>

        <p className="hero-subline">
          Synthesize conflicting market feeds, options chain skew, and regulatory filings into
          evidence-grounded, personalized investment intelligence.
        </p>

        <div className="hero-ctas">
          <MagneticButton strength={0.3} maxOffset={12}>
            <button className="ask-button hero-main-btn magnetic-btn hover-lift" onClick={onLaunchTerminal}>
              <Zap size={16} className="hover-icon-rotate" /> Launch Terminal (Demo Mode) <ArrowRight size={16} />
            </button>
          </MagneticButton>

          {!currentUser && (
            <MagneticButton strength={0.25} maxOffset={10}>
              <button className="hero-secondary-btn magnetic-btn hover-lift glass-panel" onClick={onOpenSignup}>
                Create Free Account <ChevronRight size={16} />
              </button>
            </MagneticButton>
          )}
        </div>

        {/* Live Metrics Ticker Bar (Frosted Glassmorphism) */}
        <div className="hero-ticker-bar glass-panel hover-lift" style={{ position: 'relative', zIndex: 2 }}>
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

      {/* Live Terminal Preview with 3D Interactive Tilt & Magnetic Spotlight */}
      <section className="terminal-preview-section" id="terminal">
        <ScrollReveal direction="up" threshold={0.1}>
          <div className="tilt-card-container">
            <SpotlightCard
              {...tiltProps}
              className="terminal-window glass-panel-elevated tilt-card"
            >
              <div className="terminal-window-header">
                <div className="window-dots">
                  <span className="dot-red" />
                  <span className="dot-yellow" />
                  <span className="dot-green" />
                </div>
                <div className="window-title">VibeFinance Terminal · Workspace / Dashboard</div>
                <div className="window-badge">
                  <span className="radar-dot" style={{ display: 'inline-block', marginRight: '5px' }} />
                  LIVE DEMO
                </div>
              </div>

              <div className="terminal-window-body">
                <div className="preview-metrics-row">
                  <div className="preview-metric glass-panel hover-lift">
                    <small>PORTFOLIO VALUE</small>
                    <strong>$24,392.50</strong>
                    <span className="positive">+2.4% today</span>
                  </div>
                  <div className="preview-metric glass-panel hover-lift">
                    <small>DAILY P&L</small>
                    <strong>+$588.20</strong>
                    <span className="positive">+2.47%</span>
                  </div>
                  <div className="preview-metric glass-panel hover-lift">
                    <small>CONCENTRATION (HHI)</small>
                    <strong>2,085</strong>
                    <span style={{ color: '#fbbf24' }}>Moderate</span>
                  </div>
                  <div className="preview-metric glass-panel hover-lift">
                    <small>WEIGHTED BETA</small>
                    <strong>1.25</strong>
                    <span>Relative to S&P</span>
                  </div>
                </div>

                <div className="preview-agents-banner">
                  <div className="agent-pill pill-market float-slow-1">
                    <TrendingUp size={14} className="hover-icon-rotate" /> Market Agent: Momentum Breakout
                  </div>
                  <div className="agent-pill pill-research float-slow-2">
                    <BrainCircuit size={14} className="hover-icon-rotate" /> Research Agent: SEC 10-K RAG Verified
                  </div>
                  <div className="agent-pill pill-risk float-slow-3">
                    <ShieldCheck size={14} className="hover-icon-rotate" /> Risk Agent: HHI Threshold Guarded
                  </div>
                </div>

                <div className="preview-cta-overlay">
                  <MagneticButton strength={0.3} maxOffset={10}>
                    <button className="ask-button magnetic-btn hover-lift" onClick={onLaunchTerminal}>
                      Explore Full Interactive Terminal &rarr;
                    </button>
                  </MagneticButton>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </ScrollReveal>
      </section>

      {/* Pillars / Features Section with Staggered Scroll Reveal */}
      <section className="landing-features" id="features">
        <ScrollReveal direction="up">
          <div className="section-eyebrow">
            <Sparkles size={14} className="hover-icon-rotate" /> THE VIBEFINANCE ENGINE
          </div>
          <h2>Designed for retail investors who demand institutional clarity.</h2>
          <p className="features-subline">
            Most retail screeners only look at prices. VibeFinance synthesizes price momentum, regulatory disclosures,
            and risk mathematics into a unified investment thesis.
          </p>
        </ScrollReveal>

        <div className="features-grid">
          <ScrollReveal delay={1} direction="up">
            <SpotlightCard className="feature-card glass-panel hover-lift">
              <div className="feature-icon"><BrainCircuit size={22} className="hover-icon-rotate" /></div>
              <h3>Multi-Agent Reasoning</h3>
              <p>Three specialized AI agents analyze price momentum, corporate filings, and downside concentration in parallel, with automated conflict resolution.</p>
            </SpotlightCard>
          </ScrollReveal>

          <ScrollReveal delay={2} direction="up">
            <SpotlightCard className="feature-card glass-panel hover-lift" variant="blue">
              <div className="feature-icon"><Globe size={22} className="hover-icon-rotate" /></div>
              <h3>Grounded RAG Corpus</h3>
              <p>Every fundamental thesis links directly to citations in verified SEC 10-K, 10-Q reports and earnings conference call transcripts.</p>
            </SpotlightCard>
          </ScrollReveal>

          <ScrollReveal delay={3} direction="up">
            <SpotlightCard className="feature-card glass-panel hover-lift" variant="purple">
              <div className="feature-icon"><ShieldCheck size={22} className="hover-icon-rotate" /></div>
              <h3>Mathematical Risk Limits</h3>
              <p>Real-time calculation of Herfindahl-Hirschman Index (HHI), weighted portfolio Beta, and 95% Parametric 1-Day Value-at-Risk (VaR).</p>
            </SpotlightCard>
          </ScrollReveal>

          <ScrollReveal delay={4} direction="up">
            <SpotlightCard className="feature-card glass-panel hover-lift" variant="amber">
              <div className="feature-icon"><BarChart3 size={22} className="hover-icon-rotate" /></div>
              <h3>Macro Scenario Stress Tests</h3>
              <p>Simulate how rate hikes, semiconductor contraction, or broad selloffs will affect your specific portfolio before executing trades.</p>
            </SpotlightCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Meet Your AI Team Section */}
      <section className="landing-agents" id="agents">
        <ScrollReveal direction="up">
          <div className="section-eyebrow">
            <Zap size={14} className="hover-icon-rotate" /> AUTONOMOUS SQUAD
          </div>
          <h2>Your Personal Research Team.</h2>
        </ScrollReveal>

        <div className="agents-grid">
          <ScrollReveal delay={1} direction="up">
            <SpotlightCard variant="green" className="landing-agent-card agent-border-green glass-panel hover-lift">
              <div className="agent-avatar rs-green hover-icon-rotate"><TrendingUp size={20} /></div>
              <h3>Market Agent</h3>
              <span className="agent-role">Technical & Momentum Analyst</span>
              <p>Studies multi-timeframe price action, 20/50/200-day EMAs, RSI(14) divergences, volume surges, and options Put-Call Ratio (PCR).</p>
            </SpotlightCard>
          </ScrollReveal>

          <ScrollReveal delay={2} direction="up">
            <SpotlightCard variant="blue" className="landing-agent-card agent-border-blue glass-panel hover-lift">
              <div className="agent-avatar rs-blue hover-icon-rotate"><BrainCircuit size={20} /></div>
              <h3>Research Agent</h3>
              <span className="agent-role">Corporate & Sector Analyst</span>
              <p>Indexes regulatory filings, tracks gross margin trajectory, monitors capex cycles, and verifies disclosures with exact document citations.</p>
            </SpotlightCard>
          </ScrollReveal>

          <ScrollReveal delay={3} direction="up">
            <SpotlightCard variant="purple" className="landing-agent-card agent-border-purple glass-panel hover-lift">
              <div className="agent-avatar rs-purple hover-icon-rotate"><ShieldCheck size={20} /></div>
              <h3>Risk Agent</h3>
              <span className="agent-role">Downside & Exposure Analyst</span>
              <p>Quantifies portfolio concentration (HHI), stress-tests macro scenarios, calculates parametric VaR, and protects cash buffers.</p>
            </SpotlightCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Call to Action Banner with Glassmorphism & Magnetic Buttons */}
      <section className="landing-cta-banner">
        <ScrollReveal direction="up">
          <SpotlightCard className="cta-banner-inner glass-panel-elevated">
            <h2>Ready to upgrade your financial intelligence?</h2>
            <p>Experience multi-agent autonomous reasoning backed by synthetic market feeds and institutional risk analytics.</p>
            <div className="cta-btns">
              <MagneticButton strength={0.3} maxOffset={12}>
                <button className="ask-button hero-main-btn magnetic-btn hover-lift" onClick={onLaunchTerminal}>
                  Enter Workspace Now <ArrowUpRight size={15} className="hover-icon-rotate" />
                </button>
              </MagneticButton>
              {!currentUser && (
                <MagneticButton strength={0.25} maxOffset={10}>
                  <button className="landing-login-btn magnetic-btn hover-lift" onClick={onOpenSignup}>
                    Create an Account
                  </button>
                </MagneticButton>
              )}
            </div>
          </SpotlightCard>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="brand">
            <div className="brand-mark hover-icon-rotate"><Activity size={18} /></div>
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
