/**
 * Live HTTP Integration Test
 * Boots server on ephemeral port and tests endpoints using native fetch.
 */

process.env.PORT = '5099';
const app = require('../../server');
const assert = require('assert');

async function testLiveEndpoints() {
  // Give server brief moment to bind
  await new Promise(r => setTimeout(r, 600));

  console.log('\n--- Live HTTP Server Integration Tests (Port 5099) ---');
  const baseUrl = 'http://localhost:5099';

  const fetchOpts = (opts = {}) => ({
    ...opts,
    headers: { ...opts.headers, Connection: 'close' }
  });

  // 1. Health check
  const rootRes = await fetch(`${baseUrl}/api`, fetchOpts());
  assert.strictEqual(rootRes.status, 200);
  const rootJson = await rootRes.json();
  console.log(`  ✓ Root healthcheck: ${rootJson.service} (${rootJson.status})`);

  // 2. Dashboard
  const dashRes = await fetch(`${baseUrl}/api/dashboard?period=1M`, fetchOpts());
  assert.strictEqual(dashRes.status, 200);
  const dashJson = await dashRes.json();
  assert.strictEqual(dashJson.data.summary.portfolio_value_formatted, '$24,392.50');
  assert.strictEqual(dashJson.data.holdings.length, 4);
  console.log(`  ✓ Dashboard endpoint: 4 holdings verified, value: ${dashJson.data.summary.portfolio_value_formatted}`);

  // 3. Markets
  const mktRes = await fetch(`${baseUrl}/api/markets`, fetchOpts());
  const mktJson = await mktRes.json();
  assert.strictEqual(mktJson.markets.length, 4);
  console.log(`  ✓ Markets overview: 4 indices verified (${mktJson.markets.map(m => m.name).join(', ')})`);

  // 4. Research Agents
  const agentsRes = await fetch(`${baseUrl}/api/research/agents`, fetchOpts());
  const agentsJson = await agentsRes.json();
  assert.strictEqual(agentsJson.agents.length, 3);
  console.log(`  ✓ Research agents: ${agentsJson.agents.map(a => a.name).join(', ')}`);

  // 5. Research Query via POST
  const askRes = await fetch(`${baseUrl}/api/research/ask`, fetchOpts({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: 'What risks should I investigate in a tech-heavy portfolio?',
      agent_id: 'risk'
    })
  }));
  assert.strictEqual(askRes.status, 200);
  const askJson = await askRes.json();
  assert(askJson.response.title.includes('Technology Sector Concentration'));
  assert(askJson.response.findings.length > 0);
  console.log(`  ✓ Research query: "${askJson.question}" -> [${askJson.agent}] "${askJson.response.title}"`);

  // 6. Risk Engine
  const riskRes = await fetch(`${baseUrl}/api/risk`, fetchOpts());
  const riskJson = await riskRes.json();
  assert(riskJson.metrics.portfolio_beta > 1.0);
  console.log(`  ✓ Risk metrics: Beta=${riskJson.metrics.portfolio_beta}, 1-Day VaR=${riskJson.metrics.var_95.var_95_amount_formatted}`);

  // 7. Portfolio Trade simulation
  const tradeRes = await fetch(`${baseUrl}/api/portfolio/trade`, fetchOpts({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      symbol: 'AAPL',
      type: 'BUY',
      shares: 2
    })
  }));
  assert.strictEqual(tradeRes.status, 200);
  const tradeJson = await tradeRes.json();
  console.log(`  ✓ Simulated trade: ${tradeJson.message}`);

  // 8. User Profile
  const userRes = await fetch(`${baseUrl}/api/user/profile`, fetchOpts());
  const userJson = await userRes.json();
  assert.strictEqual(userJson.user.name, 'Shaun Mathew');
  console.log(`  ✓ User profile verified: ${userJson.user.name} (${userJson.user.workspace})`);

  console.log('\n✓ All 8 live HTTP integration tests passed successfully!\n');
  if (app.server) {
    app.server.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

testLiveEndpoints().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
