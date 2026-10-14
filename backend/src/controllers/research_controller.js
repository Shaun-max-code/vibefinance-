/**
 * Research Controller
 * Powers the Research Studio interface and AI question dispatching.
 */

const orchestrator = require('../agents/synthesis_orchestrator');
const ragEngine = require('../utils/rag_engine');

const SUGGESTIONS = [
  'What risks should I investigate in a tech-heavy portfolio?',
  'How should I compare two companies before investing?',
  'Explain the difference between volatility and drawdown.'
];

class ResearchController {
  /**
   * Get list of research team agents
   */
  getAgents(req, res) {
    const list = orchestrator.getAllAgentsList();
    res.json({
      success: true,
      agents: list
    });
  }

  /**
   * Get starter suggestion prompts
   */
  getSuggestions(req, res) {
    res.json({
      success: true,
      suggestions: SUGGESTIONS
    });
  }

  /**
   * Ask an agent a research question
   * Returns payload directly consumable by frontend ResearchStudio
   */
  async askAgent(req, res) {
    const { question, agent_id } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Question is required.'
      });
    }

    try {
      const selectedAgentId = agent_id || 'research';
      const agentResult = await orchestrator.execute(selectedAgentId, question.trim());

      // Response structure matching frontend ResearchStudio state
      res.json({
        success: true,
        id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        question: question.trim(),
        agent: agentResult.agent_name,
        agent_id: agentResult.agent_id,
        response: {
          title: agentResult.title,
          summary: agentResult.summary,
          findings: agentResult.findings,
          caveat: agentResult.caveat,
          sources: agentResult.sources || []
        },
        confidence_pct: agentResult.confidence_pct,
        timestamp: agentResult.timestamp
      });
    } catch (error) {
      console.error('Research execution error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to execute research query',
        details: error.message
      });
    }
  }

  /**
   * Get all synthetic corporate documents in corpus
   */
  getCorpus(req, res) {
    const { symbol } = req.query;
    const docs = ragEngine.getAllDocuments(symbol);

    res.json({
      success: true,
      total: docs.length,
      documents: docs
    });
  }

  /**
   * Semantic / keyword RAG search across filings
   */
  searchCorpus(req, res) {
    const { q, symbol, topK } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, error: 'Query parameter q is required.' });
    }

    const results = ragEngine.search(q, symbol, { topK: parseInt(topK) || 3 });
    res.json({
      success: true,
      query: q,
      results_count: results.length,
      results
    });
  }
}

module.exports = new ResearchController();
