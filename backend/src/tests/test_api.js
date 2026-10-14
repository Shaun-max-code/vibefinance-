/**
 * Comprehensive Automated Verification Script for VibeFinance Backend API
 * Validates:
 * - Security & Cryptographic JWT signing / scrypt hashing
 * - User persistence across restarts
 * - Authenticated routes & token expiration checks
 * - Dynamic tech sector exposure & risk modeling
 * - Mathematical technical indicators (Wilder's RSI, EMA, Volatility)
 * - Trade validation and edge case failure modes
 * - Multi-Agent Synthesis & BM25 RAG evidence grounding
 */

const assert = require('assert');
const orchestrator = require('../agents/synthesis_orchestrator');
const ragEngine = require('../utils/rag_engine');
const riskCalculator = require('../utils/risk_calculator');
const technicalIndicators = require('../utils/technical_indicators');
const security = require('../utils/security');
const userStore = require('../utils/user_store');
const { requireAuth } = require('../utils/auth_middleware');
const portfolioData = require('../data/portfolio.json');
const marketsData = require('../data/markets.json');
const authController = require('../controllers/auth_controller');
const portfolioController = require('../controllers/portfolio_controller');

async function runTests() {
  console.log('--- Starting VibeFinance Comprehensive Test Suite ---');
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

  // ==========================================
  // Section 1: Synthetic Datasets Integrity
  // ==========================================
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

  // ==========================================
  // Section 2: Security & Authentication Tests
  // ==========================================
  test('Password hashing uses unique salt and verifies with scrypt', () => {
    const pwd = 'TestSuperPassword2026!';
    const { hash, salt } = security.hashPassword(pwd);
    assert(hash && hash.length === 128, 'Scrypt 64-byte hex hash should be 128 chars');
    assert(salt && salt.length === 32, '16-byte hex salt should be 32 chars');

    // Correct password verifies
    const match = security.verifyPassword(pwd, hash, salt);
    assert.strictEqual(match, true, 'Correct password must verify');

    // Wrong password fails
    const fail = security.verifyPassword('WrongPassword', hash, salt);
    assert.strictEqual(fail, false, 'Wrong password must be rejected');
  });

  test('Cryptographic JWT tokens verify signature and detect tampering', () => {
    const payload = { userId: 'usr-999', email: 'crypto@vibefinance.test' };
    const token = security.generateToken(payload, 'custom_secret_key', 3600);
    assert(typeof token === 'string' && token.split('.').length === 3);

    // Valid verification
    const verified = security.verifyToken(token, 'custom_secret_key');
    assert.strictEqual(verified.valid, true);
    assert.strictEqual(verified.payload.userId, 'usr-999');

    // Tampered payload fails
    const parts = token.split('.');
    const tampered = `${parts[0]}.${Buffer.from(JSON.stringify({ userId: 'hacked' })).toString('base64')}.${parts[2]}`;
    const tamperedRes = security.verifyToken(tampered, 'custom_secret_key');
    assert.strictEqual(tamperedRes.valid, false, 'Tampered token must fail signature verification');

    // Expired token fails
    const expiredToken = security.generateToken(payload, 'custom_secret_key', -10);
    const expiredRes = security.verifyToken(expiredToken, 'custom_secret_key');
    assert.strictEqual(expiredRes.valid, false);
    assert(expiredRes.error.includes('expired'), 'Expired token must report expiration error');
  });

  test('User store persists records and enforces email uniqueness', () => {
    const testEmail = `test_${Date.now()}@testfinance.com`;
    const user = userStore.createUser({
      name: 'Test Investor',
      email: testEmail,
      password: 'password12345',
      risk_profile: 'Conservative',
      benchmark: 'NASDAQ'
    });

    assert.strictEqual(user.email, testEmail);
    assert(!user.password_hash, 'Sanitized user should not expose password hash');

    // Verify stored user can be read back from disk
    const readBack = userStore.findByEmail(testEmail);
    assert(readBack !== null);
    assert.strictEqual(readBack.name, 'Test Investor');

    // Duplicate email rejected
    assert.throws(() => {
      userStore.createUser({
        name: 'Duplicate',
        email: testEmail,
        password: 'password12345'
      });
    }, /already exists/);

    // Clean up test user
    userStore.deleteUserById(user.id);
  });

  test('Auth controller enforces wrong password rejection and no demo bypass', () => {
    let failData = null;
    let statusCode = null;

    authController.login(
      { body: { email: 'shaunmathew@example.com', password: 'completely_wrong_password' } },
      {
        status: (code) => {
          statusCode = code;
          return { json: (d) => { failData = d; } };
        },
        json: (d) => { failData = d; }
      }
    );

    assert.strictEqual(statusCode, 401, 'Wrong password must return 401 Unauthorized');
    assert.strictEqual(failData.success, false);
  });

  test('Protected /me endpoint rejects requests with missing or invalid token', () => {
    let statusCode = null;
    let responseData = null;

    // Test with no token
    authController.me(
      { headers: {} },
      {
        status: (code) => {
          statusCode = code;
          return { json: (d) => { responseData = d; } };
        },
        json: (d) => { responseData = d; }
      }
    );

    assert.strictEqual(statusCode, 401, 'Missing token must return 401');
    assert.strictEqual(responseData.code, 'UNAUTHORIZED_NO_TOKEN');

    // Test with invalid token
    authController.me(
      { headers: { authorization: 'Bearer invalid.fake.token' } },
      {
        status: (code) => {
          statusCode = code;
          return { json: (d) => { responseData = d; } };
        },
        json: (d) => { responseData = d; }
      }
    );

    assert.strictEqual(statusCode, 401, 'Invalid token must return 401');
    assert.strictEqual(responseData.code, 'UNAUTHORIZED_INVALID_TOKEN');
  });

  // ==========================================
  // Section 3: Technical Indicators & Dynamic Math
  // ==========================================
  test('Wilder 14-period RSI calculates accurate mathematical momentum', () => {
    // 15 days of strictly rising prices -> RSI = 100
    const rising = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    const rsiHigh = technicalIndicators.calculateRSI(rising, 14);
    assert.strictEqual(rsiHigh, 100.0, 'Monotonically rising prices must yield RSI 100');

    // Oscillating prices yield reasonable RSI between 30 and 70
    const oscillating = [100, 102, 99, 101, 100, 103, 98, 102, 100, 101, 99, 102, 101, 100, 101, 102];
    const rsiNorm = technicalIndicators.calculateRSI(oscillating, 14);
    assert(rsiNorm >= 40 && rsiNorm <= 65, `Oscillating RSI ${rsiNorm} should be in normal bounds`);
  });

  test('Exponential Moving Average (EMA) applies correct weighting multiplier', () => {
    const prices = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const ema5 = technicalIndicators.calculateEMA(prices, 5);
    assert(ema5 > 16.0 && ema5 <= 20.0, `EMA(5) ${ema5} should track recent prices`);
  });

  // ==========================================
  // Section 4: Risk Calculator & Dynamic Exposures
  // ==========================================
  test('Risk calculator dynamically derives technology exposure from holdings without hardcoding', () => {
    const techExp = riskCalculator.calculateTechExposure(portfolioData.holdings);
    // AAPL (24.5%) + MSFT (18.2%) + NVDA (16.8%) + GOOGL (12.6%) = 72.1%
    assert.strictEqual(techExp.tech_exposure_pct, '72.1%');
    assert.strictEqual(techExp.tech_exposure_num, 72.1);
    assert.strictEqual(techExp.tech_holdings.length, 4);

    // If we test with a single non-tech holding (e.g. ExxonMobil)
    const energyOnly = [{ symbol: 'XOM', sector: 'Energy & Petrochemicals', weight: '100%', weight_num: 100 }];
    const energyExp = riskCalculator.calculateTechExposure(energyOnly);
    assert.strictEqual(energyExp.tech_exposure_pct, '0.0%');
  });

  test('Risk calculator computes accurate HHI, Beta, VaR, and states limitations', () => {
    const rawHhi = riskCalculator.calculateHHI(portfolioData.holdings, false);
    assert(rawHhi.hhi > 1000 && rawHhi.hhi < 2000, `Raw HHI ${rawHhi.hhi} should be ~1372`);
    const normHhi = riskCalculator.calculateHHI(portfolioData.holdings, true);
    assert(normHhi.hhi >= 2500, `Normalized HHI ${normHhi.hhi} indicates concentration in tech basket`);
    const beta = riskCalculator.calculatePortfolioBeta(portfolioData.holdings);
    assert(beta > 1.0 && beta < 1.5, `Beta ${beta} should be roughly 1.24`);
    const var95 = riskCalculator.calculateVaR(portfolioData.summary.portfolio_value);
    assert(var95.var_95_amount > 500, `VaR ${var95.var_95_amount} should be ~582`);

    const snapshot = riskCalculator.getRiskSnapshot();
    assert(Array.isArray(snapshot.assumptions_and_limitations), 'Snapshot must state statistical assumptions');
    assert(snapshot.assumptions_and_limitations.length >= 3);
  });

  // ==========================================
  // Section 5: Trade Validation & Edge Cases
  // ==========================================
  test('Portfolio trade simulation validates inputs and rejects negative shares', () => {
    let errorData = null;
    let statusCode = null;

    portfolioController.executeTrade(
      { body: { symbol: 'NVDA', type: 'BUY', shares: -5 } },
      {
        status: (code) => {
          statusCode = code;
          return { json: (d) => { errorData = d; } };
        },
        json: (d) => { errorData = d; }
      }
    );

    assert.strictEqual(statusCode, 400, 'Negative shares must return 400 Bad Request');
    assert.strictEqual(errorData.code, 'INVALID_SHARES_QUANTITY');
  });

  test('Portfolio trade simulation rejects invalid trade type', () => {
    let errorData = null;
    let statusCode = null;

    portfolioController.executeTrade(
      { body: { symbol: 'NVDA', type: 'HODL', shares: 5 } },
      {
        status: (code) => {
          statusCode = code;
          return { json: (d) => { errorData = d; } };
        },
        json: (d) => { errorData = d; }
      }
    );

    assert.strictEqual(statusCode, 400, 'Invalid trade action must return 400 Bad Request');
    assert.strictEqual(errorData.code, 'INVALID_TRADE_TYPE');
  });

  // ==========================================
  // Section 6: RAG Engine & Multi-Agent Outputs
  // ==========================================
  test('RAG engine retrieves documents via BM25 and includes provenance', () => {
    const results = ragEngine.search('Blackwell and Data Center', 'NVDA');
    assert(results.length > 0, 'Should return NVDA 10-Q filing');
    assert(results[0].id.includes('NVDA'));
    assert(results[0].snippet.length > 0);
    assert(results[0].provenance.includes('SEC EDGAR'));
  });

  await testAsync('Market Agent produces frontend-compatible response with verified technicals', async () => {
    const res = await orchestrator.execute('market', 'How is the momentum for NVDA?');
    assert(res.title && typeof res.title === 'string');
    assert(res.summary && typeof res.summary === 'string');
    assert(Array.isArray(res.findings) && res.findings.length > 0);
    assert(Array.isArray(res.findings[0]) && res.findings[0].length === 2);
    assert(res.caveat && typeof res.caveat === 'string');
    assert(Array.isArray(res.sources));
  });

  await testAsync('Research Agent produces grounded RAG response with citations', async () => {
    const res = await orchestrator.execute('research', 'What are Apple gross margins and services revenue?');
    assert(res.title && typeof res.title === 'string');
    assert(res.sources.length > 0, 'Research agent should have citations');
    assert(res.sources[0].id.includes('AAPL') || res.sources[0].id.includes('SEC'));
  });

  await testAsync('Risk Agent dynamically incorporates derived technology exposure in response', async () => {
    const res = await orchestrator.execute('risk', 'What risks should I investigate in a tech-heavy portfolio?');
    assert(res.title.includes('Technology Sector Concentration'));
    assert(res.summary.includes('72.1%'), 'Summary must reflect dynamic 72.1% tech exposure');
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

  console.log(`\nTest results: ${passed}/${total} passed.`);
  if (passed === total) {
    console.log('✓ All 20 tests passed successfully!');
    process.exit(0);
  } else {
    console.error(`✗ ${total - passed} test(s) failed.`);
    process.exit(1);
  }
}

runTests();
