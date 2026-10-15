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
- [1. Overview & Vision](#1-overview--vision)
- [2. Advanced Visual & Interactive Experience](#2-advanced-visual--interactive-experience)
- [3. Multi-Agent Reasoning Architecture](#3-multi-agent-reasoning-architecture)
- [4. Core Workspace Views](#4-core-workspace-views)
- [5. System Architecture & Diagram](#5-system-architecture--diagram)
- [6. Directory Structure](#6-directory-structure)
- [7. Getting Started](#7-getting-started)
- [8. Production Build & Verification](#8-production-build--verification)

---

## 1. Overview & Vision

Most retail screeners look only at share prices in isolation. **VibeFinance** introduces an institutional-grade intelligence pipeline that correlates price momentum, corporate regulatory disclosures, and quantitative risk limits simultaneously:

1. **Grounded RAG Corpus:** Every fundamental claim is verified with direct citations to SEC 10-K, 10-Q reports, and earnings call transcripts.
2. **Mathematical Risk Guardrails:** Computes portfolio concentration using the **Herfindahl-Hirschman Index (HHI)**, weighted portfolio Beta, and **95% Parametric 1-Day Value-at-Risk (VaR)**.
3. **Macro Scenario Stress Tests:** Interactive simulation of factor shocks (Tech Pullback, Yield Curve +50 bps Spike, Capex Supercycle) before trade execution.

---

## 2. Advanced Visual & Interactive Experience

VibeFinance is engineered with a state-of-the-art visual design system featuring 10 custom interactive and physics-driven effects:

### 3D Depth & Perspective Tilt (`Tilt3DCard`)
- **Physically Raised Surface:** Cards tilt smoothly in 3D based on pointer coordinates (`perspective(1100px) rotateX(...) rotateY(...) scale3d(1.02, 1.02, 1.02)`).
- **Dynamic Specular Glare:** A radiant specular reflection moves dynamically across the card opposite to the angle of inclination.
- **Counter-Directional Shifting Shadows:** Drop shadows shift away in real time, creating the optical illusion of physical elevation under an overhead light source.
- **Parallax 3D Layering:** Child elements with `.depth-layer-1` (`translateZ(18px)`), `.depth-layer-2` (`translateZ(32px)`), and `.depth-layer-3` (`translateZ(48px)`) physically float above the card base.

### Self-Drawing System Architecture (`SelfDrawingArchitectureDiagram`)
- **Progressive SVG Vector Paths:** Connection lines draw themselves progressively from left to right across 4 neural layers using `@keyframes drawSvgPath` with animated `stroke-dasharray` and `stroke-dashoffset`.
- **Live Data Telemetry Packets:** Animated glowing pulses stream continuously along connection lines.
- **Interactive Exploration:** Hovering or clicking any node illuminates incoming data sources and outgoing downstream outputs while updating the real-time telemetry inspector.
- **Playback Controls:** Includes a **Redraw Flow** replay button and a **Telemetry Flow ON/OFF** toggle.

### Live Data-Reactive Threat Radar (`RiskThreatRadar`)
- **Continuous 360° Sweep:** Rotating tactical radar beam (`@keyframes radarBeamSweep 4.5s linear infinite`) sweeping across 3 range rings (Guarded, Moderate, High Exposure).
- **Live Threat Blips:** Projects portfolio risk factors (HHI Concentration 2,085, Portfolio Beta 1.25, 95% 1-Day VaR $582, Tech Allocation 59.5%, Yield Spike -$1,280).
- **Radiating Sonar Pulses:** Threat nodes flash with expanding ping halos (`@keyframes pingRadarRing`) upon sweep detection.
- **Interactive Reaction:** Clicking any threat node auto-activates and simulates the matching macro stress scenario in the Risk Engine.

### Smooth Page & Tab Transitions (`SmoothTransition`)
- Hardware-accelerated transitions (`@keyframes pageSlideFadeIn`, `cubic-bezier(0.16, 1, 0.3, 1)`) prevent abrupt screen flashes when navigating between the Landing Page and Terminal, or switching workspace views.

### Magnetic Cursor & Ambient Spotlight (`GlobalCursorSpotlight`, `MagneticButton`)
- **Ambient Cursor Spotlight:** A soft luminous aura floats smoothly behind the mouse across the entire application with fluid linear interpolation.
- **Magnetic Buttons:** Primary CTAs (`Launch Terminal`, `Ask AI`, `Open Research Studio`) physically follow the cursor within their hover boundary, snapping back with a spring bounce on mouse leave.

### Interactive Card Spotlights (`SpotlightCard`)
- Tracks pointer `(x, y)` relative to card boundaries, projecting dynamic radial gradient lighting (`radial-gradient(450px circle at var(--mouse-x) var(--mouse-y), ...)`) across the surface and illuminating border edges.

### Multi-Plane Parallax Scrolling (`useParallaxScroll`)
- Background glowing aurora blobs drift at `0.16x` scroll velocity, the cybernetic perspective grid translates at `0.10x`, and foreground floating badges translate in reverse at `-0.09x` to `-0.13x`.

### Glassmorphism & Levitating Floating Cards
- Frosted glass cards use `backdrop-filter: blur(20px) saturate(180%)`, specular `inset 0 1px 0 rgba(255, 255, 255, 0.08)` borders, and multi-tier ambient shadows.
- Continuous harmonic floating animations (`@keyframes floatGentle1`, `floatGentle2`, `floatGentle3`) applied to status pills and badges.

### Interactive Hover Micro-Animations
- Cards lift smoothly (`hover-lift` &rarr; `translateY(-5px) scale(1.01)`), shadows deepen with emerald/cyan glows, icons rotate and bounce (`hover-icon-rotate` &rarr; `rotate(12deg) scale(1.18)`), and buttons sweep with a shiny light reflection.

### Animated Hero Section (`HeroCanvas`)
- Organic animated aurora mesh, interactive 60fps micro-particle canvas with mouse repulsion, animated shimmering gradient text (`@keyframes textShimmer`), and live financial metrics ticker.

---

## 3. Multi-Agent Reasoning Architecture

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

1. **Market Agent (`market` · Green · `TrendingUp`):**
   - Analyzes price action, 20/50/200 EMAs, RSI(14) divergences, volume surges, and options Put-Call Ratio (PCR).
2. **Research Agent (`research` · Blue · `BrainCircuit`):**
   - Indexes regulatory SEC 10-K/10-Q filings, tracks gross margins, and produces verifiable citations (e.g. `[SEC-AAPL-2024-10K]`).
3. **Risk Agent (`risk` · Purple · `ShieldCheck`):**
   - Quantifies portfolio concentration (HHI), calculates parametric 95% 1-Day VaR, and stress-tests macro factor shocks.
4. **Neural Arbiter / Orchestrator:**
   - Coordinates agents in parallel, reconciles divergent signals, and binds outputs within mathematical risk guardrails.

---

## 4. Core Workspace Views

- **Dashboard:** Portfolio summary (`$24,392.50`), interactive period charts (`1D`, `1W`, `1M`, `3M`, `1Y`), asset allocation donut, top holdings, market pulse, and quick AI prompts.
- **AI Research Studio:** Dedicated multi-agent research workspace with live 4-stage data-reactive reasoning stream, agent selection, source citations drawer, and 3D research brief cards.
- **Markets View:** Global benchmarks (S&P 500, NASDAQ, NIFTY 50, BTC/USD), equity screener, technical RSI/EMA indicators, and options PCR statistics.
- **Portfolio View:** Holdings table with cost basis, unrealized P&L, allocation breakdown, and simulated order execution module.
- **Risk Analysis View:** Herfindahl-Hirschman concentration gauge, live **Risk Threat Radar Scanner**, and macro factor shock simulator.
- **Reports View:** Published weekly intelligence dossiers, monthly portfolio risk audits, and on-demand report generation.
- **Settings View:** Investor profile, benchmark configurations, and risk tolerance constraints.

---

## 5. Directory Structure

```
vibefinance-/
├── README.md                           # Main Project Documentation
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
│   │   │   ├── SelfDrawingArchitectureDiagram.jsx # Neural architecture visualizer
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
    │   ├── utils/                      # Risk formulas (HHI, VaR, Beta)
    │   └── server.js                   # Express server entry point (Port 5000)
    ├── package.json
    └── README.md                       # Backend API & Contract Documentation
```

---

## 6. Getting Started

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
npm start
```
*API will be active at `http://localhost:5000/api`*

**Terminal 2 — Start the Frontend Development Server (Port 5174 / 5173):**
```bash
cd frontend
npm run dev
```
*Open `http://localhost:5174/` in your browser.*

---

## 7. Production Build & Verification

To validate that all code, styles, and modules build cleanly for production:

```bash
# Build frontend bundle
cd frontend
npm run build

# Run automated backend test suite
cd ../backend
npm test
```

---

## License & Disclaimer
Demo environment for illustrative and portfolio research demonstration purposes. Synthetic datasets are used; not live financial advice.
