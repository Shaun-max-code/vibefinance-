# VibeFinance Backend & Multi-Agent Intelligence Engine

The backend service for **VibeFinance**, built to mirror and synchronize with the frontend workspace, multi-agent Research Studio, portfolio risk monitors, and synthetic financial intelligence feeds.

> **Zero Modifications to Existing Frontend**: The backend runs as a standalone service in `/backend`, exposing REST API endpoints designed to match the data contracts, holdings, charts, agents, and parameters present in the frontend.

---

## 1. System Architecture

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
                              Calibrated Confidence Scoring)
                                           │
                                           ▼
                                 [ Express REST API ]
                             (CORS-enabled on Port 5000)
```

---

## 2. Synthetic Datasets Catalog

All synthetic datasets are situated in [`src/data/`](file:///c:/Users/DELL/Desktop/vibefinance-/backend/src/data):

| File | Purpose | Key Fields |
|---|---|---|
| [`portfolio.json`](file:///c:/Users/DELL/Desktop/vibefinance-/backend/src/data/portfolio.json) | User holdings & balance | `$24,392.50` value, `+$588.20` daily P&L, `+18.6%` total return, `$3,250.00` cash, AAPL, MSFT, NVDA, GOOGL holdings, 1D/1W/1M/3M/1Y series |
| [`markets.json`](file:///c:/Users/DELL/Desktop/vibefinance-/backend/src/data/markets.json) | Market indices & quotes | S&P 500 (6,742.18), NASDAQ (23,016.32), NIFTY 50 (24,716.30), BTC/USD ($112,420), technical indicators (RSI, EMAs, MACD, PCR) |
| [`documents_corpus.json`](file:///c:/Users/DELL/Desktop/vibefinance-/backend/src/data/documents_corpus.json) | Corporate disclosure corpus | SEC 10-K/10-Q filings, Q3/Q4 earnings call transcripts, SEBI Reg 30 disclosures for RAG retrieval and citation grounding |
| [`risk_data.json`](file:///c:/Users/DELL/Desktop/vibefinance-/backend/src/data/risk_data.json) | Quantitative risk metrics | HHI concentration score, Portfolio Beta 1.25, 1-Day 95% VaR ($582.40), stress test definitions (Tech Contraction, Yield Curve Spike, etc.) |
| [`reports.json`](file:///c:/Users/DELL/Desktop/vibefinance-/backend/src/data/reports.json) | Periodic intelligence briefs | Weekly digests, monthly portfolio risk audits, equity deep dives |
| [`user_profile.json`](file:///c:/Users/DELL/Desktop/vibefinance-/backend/src/data/user_profile.json) | Workspace state | Shaun Mathew profile, risk tolerance score, benchmark settings, notification feed |

---

## 3. Specialized AI Agents

Implemented in [`src/agents/`](file:///c:/Users/DELL/Desktop/vibefinance-/backend/src/agents):

1. **Market Agent (`market`)**:
   - Focus: Price action, 20/50/200 EMA trends, RSI(14), MACD divergence, and Put-Call Ratio (PCR).
   - Color / Icon: `green` / `TrendingUp`
2. **Research Agent (`research`)**:
   - Focus: Corporate filings, gross margin progression, RAG semantic search across audited disclosures.
   - Grounding: Attaches verifiable document citations (e.g. `[SEC-AAPL-2024-10K]`, `[TRANS-NVDA-2025-Q2]`).
   - Color / Icon: `blue` / `BrainCircuit`
3. **Risk Agent (`risk`)**:
   - Focus: Herfindahl-Hirschman Index (HHI), Portfolio Beta, Parametric 95% 1-Day Value-at-Risk (VaR), drawdown scenarios.
   - Color / Icon: `purple` / `ShieldCheck`
4. **Synthesis Orchestrator (`orchestrator`)**:
   - Coordinates the 3 agents in parallel, reconciles divergent signals, and compiles unified multi-agent thesis reports.

---

## 4. API Endpoints Reference

All routes are mounted under `/api` with CORS enabled:

### Dashboard & Analytics
- `GET /api/dashboard` - Complete dashboard data (metrics, allocation, holdings, markets, insights).
- `GET /api/dashboard/performance/:period` - Performance series for `1D`, `1W`, `1M`, `3M`, or `1Y`.
- `GET /api/dashboard/allocation` - Asset allocation breakdown.

### Markets & Stock Registry
- `GET /api/markets` - Real-time market pulse for major indices.
- `GET /api/markets/stocks` - List of tracked equities with current quotes, changes, and sparklines.
- `GET /api/markets/stocks/:symbol` - Detailed ticker statistics, EMAs, RSI, and options Max Pain.
- `GET /api/markets/search?q={query}` - Search equities and benchmarks.

### AI Research Studio
- `GET /api/research/agents` - List of active research agents matching frontend specifications.
- `GET /api/research/suggestions` - Starter research prompt suggestions.
- `POST /api/research/ask` - Submit a question to an agent or orchestrator.
  - Body: `{ "question": "What risks should I investigate in a tech-heavy portfolio?", "agent_id": "risk" }`
  - Output contract directly matches `frontend/src/ResearchStudio.jsx` messages state:
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
- `GET /api/user/profile` - Shaun Mathew workspace profile and alert configurations.
- `PUT /api/user/preferences` - Update risk tolerance, benchmarks, or themes.

---

## 5. Getting Started

### Prerequisites
- Node.js (v18+ or v24+)
- npm (v9+)

### Installation
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

### Running the Server
```bash
# Production mode (Port 5000)
npm start

# Development mode (with live file watching)
npm run dev
```

The server will be available at:
- Interactive API Explorer: `http://localhost:5000/`
- API Root: `http://localhost:5000/api`

### Running Automated Verification Tests
```bash
npm test
```
Validates synthetic dataset integrity, RAG engine retrieval, HHI concentration math, parametric VaR, and multi-agent contracts.
