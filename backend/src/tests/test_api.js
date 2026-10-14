/**
 * Automated Verification Script for VibeFinance Backend API
 * Validates agent responses, synthetic datasets, and API endpoints.
 */

const assert = require('assert');
const orchestrator = require('../agents/synthesis_orchestrator');
const ragEngine = require('../utils/rag_engine');
const riskCalculator = require('../utils/risk_calculator');
const portfolioData = require('../data/portfolio.json');
const marketsData = require('../data/markets.json');

async function runTests() {
  console.log('--- Starting VibeFinance Backend Test Suite ---');
  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (e) {
      console.error(`  ✗ ${name}`);
      console.error(`    ${e.message}`);
    }
  }

  async function testAsync(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (e) {
      console.error(`  ✗ ${name}`);
      console.error(`    ${e.message}`);
    }
  }

  // 1. Synthetic Datasets Integrity
  test('Portfolio summary has required frontend fields', () => {
    assert.strictEqual(portfolioData.summary.portfolio_value_formatted, '$24,392.50');
    assert.strictEqual(portfolioData.summary.daily_pnl_formatted, '+$588.20');
    assert.strictEqual(portfolioData.summary.total_return_pct, '+18.6%');
    assert.strictEqual(portfolioData.summary.cash_balance_formatted, '$3,250.00');
  });

  test('Portfolio performance contains all 5 periods', () => {
    assert(Array.isArray(portfolioData.performance['1D']));
    assert(Array.isArray(portfolioData.performance['1W']));
    assert(Array.isArray(portfolioData.performance['1M']));
    assert(Array.isArray(portfolioData.performance['3M']));
    assert(Array.isArray(portfolioData.performance['1Y']));
    assert.strictEqual(portfolioData.performance['1M'].length, 9);
  });

  test('Holdings contains AAPL, MSFT, NVDA, GOOGL', () => {
    const symbols = portfolioData.holdings.map(h => h.symbol);
    assert(symbols.includes('AAPL'));
    assert(symbols.includes('MSFT'));
    assert(symbols.includes('NVDA'));
    assert(symbols.includes('GOOGL'));
  });

  test('Markets overview contains 4 major indices', () => {
    assert.strictEqual(marketsData.market_overview.length, 4);
    const names = marketsData.market_overview.map(m => m.name);
    assert(names.includes('S&P 500'));
    assert(names.includes('NASDAQ'));
    assert(names.includes('NIFTY 50'));
    assert(names.includes('BTC / USD'));
  });

  // 2. Risk Calculator & HHI Math
  test('Risk calculator computes accurate HHI and Beta', () => {
    const rawHhi = riskCalculator.calculateHHI(portfolioData.holdings, false);
    assert(rawHhi.hhi > 1000 && rawHhi.hhi < 2000, `Raw HHI ${rawHhi.hhi} should be ~1372`);
    const normHhi = riskCalculator.calculateHHI(portfolioData.holdings, true);
    assert(normHhi.hhi >= 2500, `Normalized HHI ${normHhi.hhi} indicates concentration in tech basket`);
    const beta = riskCalculator.calculatePortfolioBeta(portfolioData.holdings);
    assert(beta > 1.0 && beta < 1.5, `Beta ${beta} should be roughly 1.24`);
    const var95 = riskCalculator.calculateVaR(portfolioData.summary.portfolio_value);
    assert(var95.var_95_amount > 500, `VaR ${var95.var_95_amount} should be ~582`);
  });

  // 3. RAG Engine Search
  test('RAG engine retrieves documents by keyword', () => {
    const results = ragEngine.search('Blackwell and Data Center', 'NVDA');
    assert(results.length > 0, 'Should return NVDA 10-Q filing');
    assert(results[0].id.includes('NVDA'));
    assert(results[0].snippet.length > 0);
  });

  // 4. Research Agents Output Structure
  await testAsync('Market Agent produces frontend-compatible response', async () => {
    const res = await orchestrator.execute('market', 'How is the momentum for NVDA?');
    assert(res.title && typeof res.title === 'string');
    assert(res.summary && typeof res.summary === 'string');
    assert(Array.isArray(res.findings) && res.findings.length > 0);
    assert(Array.isArray(res.findings[0]) && res.findings[0].length === 2);
    assert(res.caveat && typeof res.caveat === 'string');
    assert(Array.isArray(res.sources));
  });

  await testAsync('Research Agent produces grounded RAG response', async () => {
    const res = await orchestrator.execute('research', 'What are Apple gross margins and services revenue?');
    assert(res.title && typeof res.title === 'string');
    assert(res.sources.length > 0, 'Research agent should have citations');
    assert(res.sources[0].id.includes('AAPL') || res.sources[0].id.includes('SEC'));
  });

  await testAsync('Risk Agent answers suggestion prompt accurately', async () => {
    const res = await orchestrator.execute('risk', 'Explain the difference between volatility and drawdown.');
    assert(res.title.includes('Volatility vs Drawdown'));
    assert(res.findings.length >= 3);
  });

  await testAsync('Synthesis Orchestrator combines all 3 agents', async () => {
    const res = await orchestrator.execute(null, 'What risks should I investigate in a tech-heavy portfolio?');
    assert.strictEqual(res.agent_id, 'orchestrator');
    assert(res.agent_outputs.market);
    assert(res.agent_outputs.research);
    assert(res.agent_outputs.risk);
    assert(res.timing_metrics.total_pipeline_latency_ms >= 0);
  });

  // 5. Auth Controller
  test('Auth controller handles login and signup', () => {
    const authController = require('../controllers/auth_controller');
    let loginData = null;
    authController.login(
      { body: { email: 'shaunmathew@example.com', password: 'password123' } },
      { json: (d) => { loginData = d; }, status: () => ({ json: (d) => { loginData = d; } }) }
    );
    assert(loginData.success, 'Login should succeed for default user');
    assert.strictEqual(loginData.user.name, 'Shaun Mathew');

    let signupData = null;
    authController.signup(
      { body: { name: 'Priya Sharma', email: 'priya@example.com', password: 'securePass123', risk_profile: 'Aggressive' } },
      { json: (d) => { signupData = d; }, status: () => ({ json: (d) => { signupData = d; } }) }
    );
    assert(signupData.success, 'Signup should succeed for new user');
    assert.strictEqual(signupData.user.name, 'Priya Sharma');
  });

  console.log(`\nTest results: ${passed}/${total} passed.`);
  if (passed === total) {
    console.log('✓ All tests passed successfully!');
    process.exit(0);
  } else {
    console.error('✗ Some tests failed.');
    process.exit(1);
  }
}

runTests();
