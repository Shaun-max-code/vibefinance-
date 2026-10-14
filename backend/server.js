/**
 * VibeFinance: Multi-Agent Financial Intelligence Platform
 * Backend API Server
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server (usually localhost:5173) and any origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Mount master API routes
app.use('/api', apiRoutes);

// Root landing route with interactive HTML API Explorer
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>VibeFinance API Server</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0b0f17;
      color: #f1f5f9;
      margin: 0;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
    }
    .container {
      max-width: 800px;
      width: 100%;
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .badge {
      display: inline-block;
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 26px;
      margin: 0 0 8px 0;
      color: #ffffff;
    }
    p {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.6;
      margin-top: 0;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
      margin: 24px 0;
    }
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 16px;
    }
    .card strong {
      display: block;
      color: #f8fafc;
      font-size: 14px;
      margin-bottom: 4px;
    }
    .card span {
      font-size: 12px;
      color: #64748b;
    }
    .card a {
      color: #38bdf8;
      text-decoration: none;
      font-weight: 500;
      display: inline-block;
      margin-top: 8px;
      font-size: 12px;
    }
    .card a:hover {
      text-decoration: underline;
    }
    pre {
      background: #0a0e17;
      border: 1px solid #1e293b;
      border-radius: 6px;
      padding: 14px;
      font-size: 13px;
      color: #38bdf8;
      overflow-x: auto;
    }
    .footer {
      border-top: 1px solid #1f2937;
      padding-top: 16px;
      margin-top: 24px;
      font-size: 12px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">● SERVER ACTIVE · PORT ${PORT}</div>
    <h1>VibeFinance Backend API</h1>
    <p>Multi-Agent Autonomous Financial Intelligence Engine. Providing synchronized REST endpoints, synthetic datasets, semantic RAG search, and portfolio risk calculations matching the frontend.</p>

    <div class="grid">
      <div class="card">
        <strong>Dashboard API</strong>
        <span>Metrics, holdings, allocation, charts</span>
        <a href="/api/dashboard" target="_blank">View /api/dashboard &rarr;</a>
      </div>
      <div class="card">
        <strong>Markets & Quotes</strong>
        <span>S&P 500, NASDAQ, NIFTY 50, BTC/USD, stocks</span>
        <a href="/api/markets" target="_blank">View /api/markets &rarr;</a>
      </div>
      <div class="card">
        <strong>Research Studio</strong>
        <span>Market, Research, & Risk AI Agents</span>
        <a href="/api/research/agents" target="_blank">View /api/research/agents &rarr;</a>
      </div>
      <div class="card">
        <strong>Risk Engine</strong>
        <span>HHI, 95% 1-Day VaR, Beta, stress tests</span>
        <a href="/api/risk" target="_blank">View /api/risk &rarr;</a>
      </div>
      <div class="card">
        <strong>Corporate Corpus</strong>
        <span>SEC/SEBI filings, 10-K, transcripts</span>
        <a href="/api/research/corpus" target="_blank">View /api/research/corpus &rarr;</a>
      </div>
      <div class="card">
        <strong>User Profile</strong>
        <span>Shaun Mathew workspace settings</span>
        <a href="/api/user/profile" target="_blank">View /api/user/profile &rarr;</a>
      </div>
    </div>

    <p style="margin-bottom: 6px;"><strong>Quick API Health Check:</strong></p>
    <pre>GET /api -> Status: ONLINE (HTTP 200)</pre>

    <div class="footer">
      <span>VibeFinance Backend &copy; 2026</span>
      <span>Synthetic Datasets Engine</span>
    </div>
  </div>
</body>
</html>
  `);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    requested_url: req.originalUrl,
    available_catalog: '/api'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start listening
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  VibeFinance Backend API Server running on port ${PORT}`);
  console.log(`  Local URL:   http://localhost:${PORT}`);
  console.log(`  API Catalog: http://localhost:${PORT}/api`);
  console.log(`=======================================================`);
});

app.server = server;
module.exports = app;
