# vibefinance- · Multi-Agent Autonomous Financial Intelligence

[![React 19](https://img.shields.io/badge/React-19.2-61dafb?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff?style=flat&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat&logo=express)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.3-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

> **Institutional financial research, democratized for retail investors.**  
> VibeFinance synthesizes conflicting price momentum feeds, options chain skew, regulatory SEC filings, and parametric risk mathematics into a unified, evidence-grounded investment thesis.

---

## Table of Contents
- [1. Executive Summary & Core Pillars](#1-executive-summary--core-pillars)
- [2. Multi-Agent Reasoning Engine](#2-multi-agent-reasoning-engine)
- [3. Frontend Architecture & Visual Effects](#3-frontend-architecture--visual-effects)
- [4. Backend Architecture & REST API Reference](#4-backend-architecture--rest-api-reference)
- [5. Synthetic Financial Datasets](#5-synthetic-financial-datasets)
- [6. Security & Cryptographic Authentication](#6-security--cryptographic-authentication)
- [7. Complete Repository Structure](#7-complete-repository-structure)
- [8. Getting Started & Setup Guide](#8-getting-started--setup-guide)
- [9. Automated Verification & Testing](#9-automated-verification--testing)

---

## 1. Executive Summary & Core Pillars

Most retail screeners look only at share prices in isolation. **VibeFinance** introduces an institutional-grade intelligence pipeline that correlates price momentum, corporate regulatory disclosures, and quantitative risk limits simultaneously:

1. **Grounded RAG Corpus:** Every fundamental claim is verified with direct citations to SEC 10-K, 10-Q reports, and earnings conference call transcripts.
2. **Mathematical Risk Guardrails:** Computes portfolio concentration using the **Herfindahl-Hirschman Index (HHI)**, weighted portfolio Beta, and **95% Parametric 1-Day Value-at-Risk (VaR)**.
3. **Macro Scenario Stress Tests:** Interactive simulation of factor shocks (Tech Pullback, Yield Curve +50 bps Spike, Capex Supercycle) before trade execution.

---

## 2. Multi-Agent Reasoning Engine

```
                                [ Synthetic Data Layer ]
                    ┌──────────────────────┬──────────────────────┐
                    ▼                      ▼                      ▼
           portfolio.json             markets.json       documents_corpus.json
           (Holdings, PnL,            (S&P, NASDAQ,      (SEC 10-Ks, 10-Qs,
            1D-1Y History)             NIFTY, BTC)        Call Transcripts)
                    │                      │                      │
                    └──────────────────────┼──────────────────────┘
                                           ▼
                              [ Multi-Agent System ]
                    ┌──────────────────────┼──────────────────────┐
                    ▼                      ▼                      ▼
             Market Agent           Research Agent           Risk Agent
           (Momentum, RSI,         (Semantic RAG,          (HHI, Beta,
            Moving Averages)        SEC Citations)          VaR 95%, Stress)
                    │                      │                      │
                    └──────────────────────┼──────────────────────┘
                                           ▼
                              [ Synthesis Orchestrator ]
                             (Parallel Promise.all Execution,
                              Consensus Matrix, Arbiter Bounds)
                                           │
                                           ▼
                                [ Express REST API / UI ]
```

### Specialized Agents

1. **Market Agent (`market` · Green · `TrendingUp`):**
   - Focus: Price action, 20/50/200 EMAs, RSI(14) divergences, volume surges, and options Put-Call Ratio (PCR).
2. **Research Agent (`research` · Blue · `BrainCircuit`):**
   - Focus: Corporate filings, gross margin progression, RAG semantic search across audited disclosures.
   - Grounding: Attaches verifiable document citations (e.g. `[SEC-AAPL-2024-10K]`, `[TRANS-NVDA-2025-Q2]`).
3. **Risk Agent (`risk` · Purple · `ShieldCheck`):**
   - Focus: Herfindahl-Hirschman Index (HHI), Portfolio Beta, Parametric 95% 1-Day Value-at-Risk (VaR), drawdown scenarios.
4. **Synthesis Orchestrator (`orchestrator`):**
   - Coordinates the 3 agents in parallel, reconciles divergent signals, and binds outputs within mathematical risk guardrails.

---

## 3. Frontend Architecture & Visual Effects

VibeFinance is engineered with a state-of-the-art visual design system featuring 10 custom interactive and physics-driven effects:

### 1. 3D Depth & Perspective Tilt (`Tilt3DCard`, `useTilt3D`)
- **Physically Raised Surface:** Cards tilt smoothly in 3D based on normalized cursor position (`perspective(1100px) rotateX(...) rotateY(...) scale3d(1.02, 1.02, 1.02)`).
- **Dynamic Specular Glare:** A radiant specular reflection moves dynamically across the card opposite to the angle of inclination (`radial-gradient(420px circle at ${glareX}% ${glareY}%)`).
- **Counter-Directional Shifting Shadows:** Drop shadows shift away in real time (`box-shadow: ${-tiltY * 3.5}px ${tiltX * 3.5 + 18}px ${blur}px`), creating the optical illusion of physical elevation under an overhead light source.
- **Parallax 3D Layering:** Child elements with `.depth-layer-1` (`translateZ(18px)`), `.depth-layer-2` (`translateZ(32px)`), and `.depth-layer-3` (`translateZ(48px)`) physically float above the card base.

### 2. Self-Drawing System Architecture (`SelfDrawingArchitectureDiagram`)
- **Progressive SVG Vector Paths:** Connection lines draw themselves progressively from left to right across 4 neural layers using `@keyframes drawSvgPath` with animated `stroke-dasharray` and `stroke-dashoffset`.
- **Live Data Telemetry Packets:** Animated glowing pulses stream continuously along connection lines.
- **Interactive Exploration:** Hovering or clicking any node illuminates incoming data sources and outgoing downstream outputs while updating the real-time telemetry inspector.
- **Playback Controls:** Includes a **Redraw Flow** replay button and a **Telemetry Flow ON/OFF** toggle.

### 3. Live Data-Reactive Threat Radar (`RiskThreatRadar`)
- **Continuous 360° Sweep:** Rotating tactical radar beam (`@keyframes radarBeamSweep 4.5s linear infinite`) sweeping across 3 range rings (Guarded, Moderate, High Exposure).
- **Live Threat Blips:** Projects portfolio risk factors (HHI Concentration 2,085, Portfolio Beta 1.25, 95% 1-Day VaR $582, Tech Allocation 59.5%, Yield Spike -$1,280).
- **Radiating Sonar Pulses:** Threat nodes flash with expanding ping halos (`@keyframes pingRadarRing`) upon sweep detection.
- **Interactive Reaction:** Clicking any threat node auto-activates and simulates the matching macro stress scenario in the Risk Engine.

### 4. Smooth Page & Tab Transitions (`SmoothTransition`)
- Hardware-accelerated transitions (`@keyframes pageSlideFadeIn`, `cubic-bezier(0.16, 1, 0.3, 1)`) prevent abrupt screen flashes when navigating between the Landing Page and Terminal, or switching workspace views.

### 5. Magnetic Cursor & Ambient Spotlight (`GlobalCursorSpotlight`, `MagneticButton`)
- **Ambient Cursor Spotlight:** A soft luminous aura floats smoothly behind the mouse across the entire application with fluid linear interpolation.
- **Magnetic Buttons:** Primary CTAs (`Launch Terminal`, `Ask AI`, `Open Research Studio`) physically follow the cursor within their hover boundary, snapping back with a spring bounce on mouse leave.

### 6. Interactive Card Spotlights (`SpotlightCard`)
- Tracks pointer `(x, y)` relative to card boundaries, projecting dynamic radial gradient lighting (`radial-gradient(450px circle at var(--mouse-x) var(--mouse-y), ...)`) across the surface and illuminating border edges.

### 7. Multi-Plane Parallax Scrolling (`useParallaxScroll`)
- Background glowing aurora blobs drift at `0.16x` scroll velocity, the cybernetic perspective grid translates at `0.10x`, and foreground floating badges translate in reverse at `-0.09x` to `-0.13x`.

### 8. Glassmorphism & Levitating Floating Cards
- Frosted glass cards use `backdrop-filter: blur(20px) saturate(180%)`, specular `inset 0 1px 0 rgba(255, 255, 255, 0.08)` borders, and multi-tier ambient shadows.
- Continuous harmonic floating animations (`@keyframes floatGentle1`, `floatGentle2`, `floatGentle3`) applied to status pills and badges.

### 9. Interactive Hover Micro-Animations
- Cards lift smoothly (`hover-lift` &rarr; `translateY(-5px) scale(1.01)`), shadows deepen with emerald/cyan glows, icons rotate and bounce (`hover-icon-rotate` &rarr; `rotate(12deg) scale(1.18)`), and buttons sweep with a shiny light reflection.

### 10. Animated Hero Section (`HeroCanvas`)
- Organic animated aurora mesh, interactive 60fps micro-particle canvas with mouse repulsion, animated shimmering gradient text (`@keyframes textShimmer`), and live financial metrics ticker.

---

## 4. Backend Architecture & REST API Reference

The backend is built as a standalone service in `backend/`, exposing CORS-enabled REST API endpoints on port `5000`:

### Dashboard & Analytics
- `GET /api/dashboard` - Complete dashboard snapshot (metrics, allocation, holdings, markets, insights).
- `GET /api/dashboard/performance/:period` - Performance time series for `1D`, `1W`, `1M`, `3M`, or `1Y`.
- `GET /api/dashboard/allocation` - Asset allocation breakdown across asset classes.

### Markets & Stock Registry
- `GET /api/markets` - Real-time market pulse for major indices (S&P 500, NASDAQ, NIFTY 50, BTC/USD).
- `GET /api/markets/stocks` - List of tracked equities with quotes, changes, and sparklines.
- `GET /api/markets/stocks/:symbol` - Detailed ticker statistics, EMAs, RSI, and options Max Pain.
- `GET /api/markets/search?q={query}` - Search equities and benchmarks.

### AI Research Studio
- `GET /api/research/agents` - List of active research agents matching frontend specifications.
- `GET /api/research/suggestions` - Starter research prompt suggestions.
- `POST /api/research/ask` - Submit a question to an agent or orchestrator.
  - Body: `{ "question": "What risks should I investigate in a tech-heavy portfolio?", "agent_id": "risk" }`
  - Output contract directly matches `ResearchStudio.jsx` messages state:
    ```json
    {
      "id": "1728900000000-12",
      "question": "What risks should I investigate in a tech-heavy portfolio?",
      "agent": "Risk Agent",
      "response": {
        "title": "Technology Sector Concentration & Downside Review",
        "summary": "...",
        "findings": [
          ["Finding Title", "Detailed explanation..."]
        ],
        "caveat": "...",
        "sources": [
          { "id": "RISK-HHI-METRICS", "title": "...", "ref": "...", "date": "..." }
        ]
      },
      "confidence_pct": 93
    }
    ```
- `GET /api/research/corpus` - Browse synthetic SEC/SEBI filings.
- `GET /api/research/search?q={query}` - Semantic / keyword search across filings.

### Portfolio & Simulated Trading
- `GET /api/portfolio` - Complete portfolio snapshot and recent transaction log.
- `GET /api/portfolio/holdings` - List of current positions with cost basis and unrealized gain/loss.
- `POST /api/portfolio/trade` - Execute a simulated buy/sell order.
  - Body: `{ "symbol": "AAPL", "type": "BUY", "shares": 2 }`
- `POST /api/portfolio/reset` - Reset portfolio state to initial defaults.

### Risk & Stress Testing
- `GET /api/risk` - HHI rating, weighted Beta, 95% 1-Day VaR, annualized volatility.
- `GET /api/risk/scenarios` - Predefined stress scenarios (Tech Pullback, Rate Shock, etc.).
- `POST /api/risk/stress-test` - Run scenario simulation.

### Reports & Workspace
- `GET /api/reports` - Published weekly digests and monthly audits.
- `POST /api/reports/generate` - Generate on-demand multi-agent portfolio audit.
- `GET /api/user/profile` - User workspace profile and alert configurations.
- `PUT /api/user/preferences` - Update risk tolerance, benchmarks, or themes.

### Authentication & Sessions
- `POST /api/auth/register` - Create account with scrypt password hashing.
- `POST /api/auth/login` - Authenticate and issue cryptographic JWT token.
- `GET /api/auth/me` - Validate session and retrieve current user profile.
- `POST /api/auth/logout` - Invalidate session.

---

## 5. Synthetic Financial Datasets

All synthetic datasets are located in `backend/src/data/`:

| File | Purpose | Key Metrics |
|---|---|---|
| `portfolio.json` | Holdings & cash balance | `$24,392.50` value, `+$588.20` daily P&L, `+18.6%` total return, `$3,250.00` cash, AAPL, MSFT, NVDA, GOOGL holdings, 1D-1Y series |
| `markets.json` | Indices & technicals | S&P 500 (6,742.18), NASDAQ (23,016.32), NIFTY 50 (24,716.30), BTC/USD ($112,420), RSI, EMAs, MACD, PCR |
| `documents_corpus.json` | Corporate disclosures | SEC 10-K/10-Q filings, Q3/Q4 earnings call transcripts, SEBI Reg 30 disclosures for RAG retrieval and citation grounding |
| `risk_data.json` | Quantitative risk metrics | HHI concentration score (2,085), Portfolio Beta 1.25, 1-Day 95% VaR ($582.40), stress test definitions |
| `reports.json` | Published intelligence briefs | Weekly dossiers, monthly portfolio risk audits, equity deep dives |
| `user_profile.json` | Workspace state | User profile, risk tolerance score, benchmark settings, notification feed |
| `users_store.json` | Auth storage | Scrypt-hashed credentials, salt, and session records |

---

## 6. Security & Cryptographic Authentication

- **Password Hashing:** Passwords hashed using Node's native `crypto.scrypt` with unique cryptographically random salts.
- **JWT Authentication:** Cryptographic HMAC SHA-256 JWT tokens with expiration and validation middleware.
- **Rate Limiting:** Sliding-window rate limiter protecting authentication and research endpoints against brute-force and resource exhaustion.
- **Input Sanitization:** Strict payload validation and sanitization on all incoming requests.

---

## 7. Complete Repository Structure

```
vibefinance-/
├── README.md                           # Master Project Documentation
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.jsx         # Landing page with hero, ticker, & previews
│   │   │   ├── SelfDrawingArchitectureDiagram.jsx # Progressive SVG neural diagram
│   │   │   ├── RiskThreatRadar.jsx     # Live data-reactive circular threat scanner
│   │   │   ├── MarketsView.jsx         # Markets screener & benchmarks
│   │   │   ├── PortfolioView.jsx       # Positions, allocation & order simulation
│   │   │   ├── RiskAnalysisView.jsx    # HHI concentration & scenario testing
│   │   │   ├── ReportsView.jsx         # Intelligence dossiers & executive memos
│   │   │   ├── SettingsView.jsx        # Account settings & risk parameters
│   │   │   ├── AuthModal.jsx           # Sign In / Sign Up modal
│   │   │   ├── LandingAuth.css         # Landing & auth modal styling
│   │   │   └── Views.css               # Terminal workspace views styling
│   │   ├── effects/
│   │   │   ├── Tilt3DCard.jsx          # 3D perspective card with glare & shadow
│   │   │   ├── useTilt3D.js            # 3D tilt & glare physics hook
│   │   │   ├── GlobalCursorSpotlight.jsx # Ambient cursor follower
│   │   │   ├── SpotlightCard.jsx       # Card mouse spotlight tracking
│   │   │   ├── MagneticButton.jsx      # Magnetic cursor button wrapper
│   │   │   ├── HeroCanvas.jsx          # Interactive floating particle canvas
│   │   │   ├── ScrollReveal.jsx        # Viewport intersection scroll reveal
│   │   │   ├── useScrollReveal.js      # IntersectionObserver hook
│   │   │   ├── SmoothTransition.jsx    # Animated page & tab transitions
│   │   │   ├── useParallax.js          # Multi-plane parallax scroll listener
│   │   │   └── animations.css          # Master keyframes, glassmorphism & styles
│   │   ├── ResearchStudio.jsx          # Multi-agent chat & evidence studio
│   │   ├── ResearchStudio.css          # Research Studio styling
│   │   ├── App.jsx                     # Root application container & navigation
│   │   ├── App.css                     # App shell styling
│   │   ├── index.css                   # Core tokens & global design system
│   │   └── main.jsx                    # Application entry point
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── src/
    │   ├── agents/                     # Market, Research, Risk, & Orchestrator
    │   ├── controllers/                # Route controllers
    │   ├── routes/                     # REST API endpoints
    │   ├── data/                       # Synthetic financial datasets & SEC corpus
    │   ├── utils/                      # Risk formulas, RAG, & security helpers
    │   └── server.js                   # Express server entry point (Port 5000)
    ├── package.json
    └── .env.example
```

---

## 8. Getting Started & Setup Guide

### Prerequisites
- **Node.js** (v18+ or v24+)
- **npm** (v9+)

### Installation

Clone the repository and install dependencies for both frontend and backend:

```bash
# Clone the repository
git clone https://github.com/Shaun-max-code/vibefinance-.git
cd vibefinance-

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Running Locally

**Terminal 1 — Start the Backend API (Port 5000):**
```bash
cd backend
npm start        # Production mode
# or
npm run dev      # Development mode with live reload
```
- **Interactive API Explorer & Documentation:** `http://localhost:5000/`
- **REST API Endpoints:** `http://localhost:5000/api`

**Terminal 2 — Start the Frontend Development Server (Port 5174 / 5173):**
```bash
cd frontend
npm run dev
```
- **Web Application:** `http://localhost:5174/` (or `http://localhost:5173/`)

---

## 9. Automated Verification & Testing

To validate the codebase, run production builds and the automated test suite:

```bash
# Validate frontend production build
cd frontend
npm run build

# Run automated backend test suite (validates RAG, risk math, & API contracts)
cd ../backend
npm test
```

---

## License & Disclaimer
Demo environment for illustrative and portfolio research demonstration purposes. Synthetic datasets are used; not live financial advice.
