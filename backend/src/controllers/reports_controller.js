/**
 * Reports Controller
 * Manages financial reports, multi-agent intelligence summaries, and on-demand report generation.
 */

const reportsData = require('../data/reports.json');
const portfolioData = require('../data/portfolio.json');

let activeReports = JSON.parse(JSON.stringify(reportsData));

class ReportsController {
  /**
   * Get all reports
   */
  getReports(req, res) {
    const { category } = req.query;
    let list = activeReports;

    if (category) {
      list = list.filter(r => r.category.toLowerCase() === category.toLowerCase());
    }

    res.json({
      success: true,
      total: list.length,
      reports: list
    });
  }

  /**
   * Get report by ID
   */
  getReportById(req, res) {
    const report = activeReports.find(r => r.id === req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, error: `Report ${req.params.id} not found.` });
    }

    res.json({
      success: true,
      report
    });
  }

  /**
   * Generate an on-demand report
   */
  generateReport(req, res) {
    const { topic, category } = req.body;

    const newReport = {
      id: `REP-${Date.now()}`,
      title: topic || 'Custom Multi-Agent Portfolio Intelligence Review',
      date: new Date().toISOString().split('T')[0],
      period: 'On-Demand Evaluation',
      category: category || 'On-Demand Intelligence',
      author: 'VibeFinance Multi-Agent Synthesis Engine',
      status: 'PUBLISHED',
      summary: `Automated analysis synthesized for Shaun Mathew covering portfolio allocation ($${portfolioData.summary.portfolio_value_formatted}) and prevailing market dynamics.`,
      key_takeaways: [
        `Portfolio total return sits at ${portfolioData.summary.total_return_pct} (${portfolioData.summary.total_return_formatted}).`,
        `Top position in AAPL constitutes 24.5% of total portfolio equity.`,
        `Risk posture remains aligned with a balanced compounder profile.`
      ],
      metrics_snapshot: {
        portfolio_value: portfolioData.summary.portfolio_value_formatted,
        daily_pnl: portfolioData.summary.daily_pnl_formatted,
        cash_balance: portfolioData.summary.cash_balance_formatted
      }
    };

    activeReports.unshift(newReport);

    res.json({
      success: true,
      message: 'Report generated successfully.',
      report: newReport
    });
  }
}

module.exports = new ReportsController();
