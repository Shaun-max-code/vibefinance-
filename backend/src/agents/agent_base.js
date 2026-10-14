/**
 * Base Agent Class for VibeFinance
 */

class AgentBase {
  constructor(id, name, role, color, description) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.color = color;
    this.description = description;
  }

  formatOutput({ title, summary, findings, caveat, sources = [], confidencePct = 85 }) {
    return {
      agent_id: this.id,
      agent_name: this.name,
      agent_role: this.role,
      title,
      summary,
      findings,
      caveat,
      sources,
      confidence_pct: confidencePct,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = AgentBase;
