const express = require('express');
const router = express.Router();

const dashboardRoutes = require('./dashboard');
const marketsRoutes = require('./markets');
const researchRoutes = require('./research');
const portfolioRoutes = require('./portfolio');
const riskRoutes = require('./risk');
const reportsRoutes = require('./reports');
const userRoutes = require('./user');

// Mount sub-routers
router.use('/dashboard', dashboardRoutes);
router.use('/markets', marketsRoutes);
router.use('/research', researchRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/risk', riskRoutes);
router.use('/reports', reportsRoutes);
router.use('/user', userRoutes);

// Root API health check & catalog
router.get('/', (req, res) => {
  res.json({
    service: 'VibeFinance Multi-Agent Financial Intelligence API',
    version: '1.0.0',
    status: 'ONLINE',
    environment: 'Demo environment',
    timestamp: new Date().toISOString(),
    endpoints: {
      dashboard: '/api/dashboard',
      dashboard_performance: '/api/dashboard/performance/:period',
      markets: '/api/markets',
      markets_stocks: '/api/markets/stocks',
      markets_search: '/api/markets/search?q={query}',
      research_agents: '/api/research/agents',
      research_suggestions: '/api/research/suggestions',
      research_ask: 'POST /api/research/ask { question, agent_id }',
      research_corpus: '/api/research/corpus',
      research_search: '/api/research/search?q={query}',
      portfolio: '/api/portfolio',
      portfolio_holdings: '/api/portfolio/holdings',
      portfolio_trade: 'POST /api/portfolio/trade { symbol, type, shares }',
      risk: '/api/risk',
      risk_scenarios: '/api/risk/scenarios',
      risk_stress_test: 'POST /api/risk/stress-test { scenario_id }',
      reports: '/api/reports',
      user_profile: '/api/user/profile'
    }
  });
});

module.exports = router;
