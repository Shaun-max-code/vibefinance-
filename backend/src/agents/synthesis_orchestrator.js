/**
 * Synthesis Orchestrator for VibeFinance
 * Executes multi-agent pipelines in parallel, reconciles divergent findings,
 * and compiles comprehensive intelligence briefs.
 */

const marketAgent = require('./market_agent');
const researchAgent = require('./research_agent');
const riskAgent = require('./risk_agent');

class SynthesisOrchestrator {
  constructor() {
    this.agents = {
      market: marketAgent,
      research: researchAgent,
      risk: riskAgent
    };
  }

  getAgent(agentId) {
    return this.agents[agentId] || null;
  }

  getAllAgentsList() {
    return Object.values(this.agents).map(a => ({
      id: a.id,
      name: a.name,
      role: a.role,
      color: a.color,
      description: a.description
    }));
  }

  /**
   * Dispatches question to specified agent, or synthesizes across all three
   */
  async execute(agentId, question, context = {}) {
    // If targeted at a specific agent
    if (agentId && this.agents[agentId]) {
      return await this.agents[agentId].analyze(question, context);
    }

    // Otherwise run full multi-agent orchestration
    const startTime = Date.now();
    const [marketRes, researchRes, riskRes] = await Promise.all([
      marketAgent.analyze(question, context),
      researchAgent.analyze(question, context),
      riskAgent.analyze(question, context)
    ]);
    const totalLatencyMs = Date.now() - startTime;

    // Aggregate sources and remove duplicates
    const sourceMap = new Map();
    [...marketRes.sources, ...researchRes.sources, ...riskRes.sources].forEach(src => {
      if (!sourceMap.has(src.id)) {
        sourceMap.set(src.id, src);
      }
    });

    // Synthesized findings from each specialized agent
    const combinedFindings = [
      ['Market Momentum Perspective', marketRes.findings[0] ? marketRes.findings[0][1] : marketRes.summary],
      ['Fundamental & Corporate Evidence', researchRes.findings[0] ? researchRes.findings[0][1] : researchRes.summary],
      ['Downside Risk & Exposure Constraint', riskRes.findings[0] ? riskRes.findings[0][1] : riskRes.summary]
    ];

    const calibratedConfidence = Math.round(
      (marketRes.confidence_pct * 0.3) +
      (researchRes.confidence_pct * 0.4) +
      (riskRes.confidence_pct * 0.3)
    );

    return {
      agent_id: 'orchestrator',
      agent_name: 'Synthesis Orchestrator',
      agent_role: 'Multi-Agent Autonomous Synthesis',
      title: `Multi-Agent Financial Intelligence Brief`,
      summary: `Coordinated multi-agent analysis combining technical momentum, fundamental regulatory disclosures, and portfolio concentration parameters.`,
      findings: combinedFindings,
      caveat: 'Autonomous synthesis reconciles multiple quantitative and fundamental models; individual metrics should be verified before trade execution.',
      sources: Array.from(sourceMap.values()),
      confidence_pct: calibratedConfidence,
      timing_metrics: {
        total_pipeline_latency_ms: totalLatencyMs,
        parallel_execution_count: 3
      },
      agent_outputs: {
        market: marketRes,
        research: researchRes,
        risk: riskRes
      },
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new SynthesisOrchestrator();
