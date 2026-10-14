
import { useState } from 'react'
import {
  Activity, ArrowDownRight, ArrowUpRight, BrainCircuit, Check,
  ChevronDown, CircleHelp, FileText, Globe2, Search, Send,
  ShieldCheck, Sparkles, TrendingUp, X,
} from 'lucide-react'
import './ResearchStudio.css'

const agents = [
  {
    id: 'market',
    name: 'Market Agent',
    role: 'Market trends & momentum',
    icon: TrendingUp,
    color: 'green',
    description: 'Studies market movements, momentum and macroeconomic signals.',
  },
  {
    id: 'research',
    name: 'Research Agent',
    role: 'Company & sector research',
    icon: BrainCircuit,
    color: 'blue',
    description: 'Organizes company fundamentals, sector trends and research questions.',
  },
  {
    id: 'risk',
    name: 'Risk Agent',
    role: 'Exposure & downside risk',
    icon: ShieldCheck,
    color: 'purple',
    description: 'Examines concentration, volatility and potential downside scenarios.',
  },
]

const suggestions = [
  'What risks should I investigate in a tech-heavy portfolio?',
  'How should I compare two companies before investing?',
  'Explain the difference between volatility and drawdown.',
]

function createDemoResponse(question, agent) {
  const q = question.toLowerCase()

  if (q.includes('risk') || q.includes('volatil') || q.includes('drawdown')) {
    return {
      title: 'Risk review framework',
      summary: 'A useful risk review starts with exposure, downside scenarios and the assumptions behind each position.',
      findings: [
        ['Concentration', 'Measure how much of the portfolio depends on one company, sector or market factor.'],
        ['Volatility & drawdown', 'Compare the size and duration of historical declines, not just average returns.'],
        ['Scenario analysis', 'Consider how your holdings might behave during a rate shock, earnings miss or broad sell-off.'],
      ],
      caveat: 'No portfolio holdings or live prices are connected yet. These are general analytical steps, not a measured assessment of your portfolio.',
    }
  }

  if (q.includes('company') || q.includes('compare') || q.includes('stock')) {
    return {
      title: 'Company research framework',
      summary: 'Compare businesses using consistent evidence rather than share-price movements alone.',
      findings: [
        ['Business quality', 'Examine revenue sources, competitive advantages and customer concentration.'],
        ['Financial performance', 'Review revenue growth, margins, cash flow, debt and valuation together.'],
        ['Key uncertainties', 'Identify upcoming catalysts, competitive threats and assumptions that could prove wrong.'],
      ],
      caveat: 'No company filings or current market data have been retrieved. Verify every figure against primary sources before making decisions.',
    }
  }

  return {
    title: 'Initial research brief',
    summary: `Your question has been organized for the ${agent.name}. Here is a starting framework for investigating it.`,
    findings: [
      ['Define the question', 'Identify the asset, company, market or financial assumption that needs to be investigated.'],
      ['Gather evidence', 'Look for primary sources, dated market data and relevant financial disclosures.'],
      ['Test the conclusion', 'Compare alternative explanations, identify uncertainty and document what would change the conclusion.'],
    ],
    caveat: 'This is a simulated research response. It has not searched the web, queried financial APIs or run an AI model.',
  }
}

import { useEffect } from 'react'

export default function ResearchStudio({ initialQuestion = '' }) {
  const [activeAgent, setActiveAgent] = useState('research')
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [showSources, setShowSources] = useState(false)
  const [loading, setLoading] = useState(false)

  const selectedAgent = agents.find(agent => agent.id === activeAgent) ?? agents[1]

  useEffect(() => {
    if (initialQuestion && initialQuestion.trim()) {
      setQuestion(initialQuestion)
    }
  }, [initialQuestion])

  async function submitQuestion(value = question) {
    const prompt = value.trim()
    if (!prompt) return

    setLoading(true)
    setQuestion('')
    setShowSources(false)

    try {
      const res = await fetch('http://localhost:5000/api/research/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: prompt, agent_id: selectedAgent.id })
      })
      const data = await res.json()

      if (data && data.response) {
        setMessages(previous => [
          ...previous,
          {
            id: data.id || `${Date.now()}-${previous.length}`,
            question: prompt,
            agent: data.agent || selectedAgent.name,
            response: data.response,
          },
        ])
        setLoading(false)
        return
      }
    } catch (e) {
      // Graceful fallback to local synthetic response
    }

    const fallbackResponse = createDemoResponse(prompt, selectedAgent)
    setMessages(previous => [
      ...previous,
      {
        id: `${Date.now()}-${previous.length}`,
        question: prompt,
        agent: selectedAgent.name,
        response: fallbackResponse,
      },
    ])
    setLoading(false)
  }

  return (
    <div className="research-studio">
      <div className="rs-heading">
        <div>
          <div className="rs-eyebrow"><Sparkles size={13} /> VIBEFINANCE INTELLIGENCE</div>
          <h1>Research Studio<span className="rs-title-dot">.</span></h1>
          <p>Ask better questions. Examine the evidence. Understand the risks.</p>
        </div>
        <span className="rs-demo-status"><span /> DEMO MODE</span>
      </div>

      <div className="rs-disclaimer">
        <CircleHelp size={15} />
        <span>Simulated research only. No live data, external sources or AI model is connected.</span>
      </div>

      <div className="rs-layout">
        <aside className="rs-agent-panel">
          <div className="rs-section-label">YOUR RESEARCH TEAM</div>
          <div className="rs-agent-list">
            {agents.map(agent => {
              const Icon = agent.icon
              const selected = activeAgent === agent.id

              return (
                <button
                  key={agent.id}
                  className={`rs-agent ${selected ? 'rs-agent-selected' : ''}`}
                  onClick={() => setActiveAgent(agent.id)}
                >
                  <span className={`rs-agent-icon rs-${agent.color}`}><Icon size={19} /></span>
                  <span className="rs-agent-copy">
                    <strong>{agent.name}</strong>
                    <small>{agent.role}</small>
                  </span>
                  {selected && <Check size={15} className="rs-agent-check" />}
                </button>
              )
            })}
          </div>

          <div className="rs-agent-description">
            <div className={`rs-agent-icon rs-${selectedAgent.color}`}>
              <selectedAgent.icon size={19} />
            </div>
            <strong>{selectedAgent.name}</strong>
            <p>{selectedAgent.description}</p>
            <div className="rs-capability"><Check size={13} /> Research framework</div>
            <div className="rs-capability"><Check size={13} /> Structured findings</div>
            <div className="rs-capability rs-unavailable"><X size={13} /> Live data connection</div>
          </div>

          <div className="rs-privacy-note">
            <ShieldCheck size={17} />
            <span>Responses are illustrative and are not investment advice.</span>
          </div>
        </aside>

        <section className="rs-workspace">
          <div className="rs-chat-header">
            <div className="rs-chat-heading-icon"><BrainCircuit size={19} /></div>
            <div>
              <strong>Research conversation</strong>
              <small>Working with {selectedAgent.name}</small>
            </div>
            <button
              className="rs-reset-button"
              onClick={() => { setMessages([]); setQuestion(''); setShowSources(false) }}
              title="Clear conversation"
            >
              <X size={15} /> <span>Clear</span>
            </button>
          </div>

          <div className="rs-conversation">
            {messages.length === 0 ? (
              <div className="rs-welcome">
                <div className="rs-welcome-icon"><Sparkles size={25} /></div>
                <div className="rs-welcome-kicker">YOUR RESEARCH STARTS HERE</div>
                <h2>What do you want<br />to understand?</h2>
                <p>Choose a research prompt or ask your own financial question. The current responses demonstrate the interface only.</p>

                <div className="rs-suggestions">
                  {suggestions.map((suggestion, index) => (
                    <button key={suggestion} onClick={() => submitQuestion(suggestion)}>
                      <span>{suggestion}</span>
                      {index === 0 ? <ShieldCheck size={16} /> : index === 1 ? <Search size={16} /> : <Activity size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rs-message-list">
                {messages.map(message => (
                  <article className="rs-exchange" key={message.id}>
                    <div className="rs-user-message">
                      <span className="rs-user-avatar">S</span>
                      <div><small>YOU</small><p>{message.question}</p></div>
                    </div>

                    <div className="rs-answer">
                      <div className="rs-answer-heading">
                        <span className="rs-answer-avatar"><BrainCircuit size={16} /></span>
                        <div><strong>{message.agent}</strong><small>Simulated analysis</small></div>
                        <span className="rs-illustrative-tag">DEMO</span>
                      </div>

                      <h3>{message.response.title}</h3>
                      <p className="rs-answer-summary">{message.response.summary}</p>

                      <div className="rs-findings">
                        {message.response.findings.map(([title, detail]) => (
                          <div className="rs-finding" key={title}>
                            <span className="rs-finding-dot"><Check size={12} /></span>
                            <div><strong>{title}</strong><p>{detail}</p></div>
                          </div>
                        ))}
                      </div>

                      <div className="rs-caveat"><ShieldCheck size={16} /><p>{message.response.caveat}</p></div>

                      <button className="rs-source-toggle" onClick={() => setShowSources(!showSources)}>
                        <FileText size={15} /> Source status & citations <ChevronDown size={14} />
                      </button>
                      {showSources && (
                        <div className="rs-source-detail">
                          {message.response.sources && message.response.sources.length > 0 ? (
                            <div style={{ display: 'grid', gap: '8px' }}>
                              {message.response.sources.map(s => (
                                <div key={s.id || s.title} style={{ borderLeft: '2px solid #34d399', paddingLeft: '8px' }}>
                                  <strong style={{ color: '#e2e8f0', display: 'block', fontSize: '11px' }}>[{s.id}] {s.title}</strong>
                                  <span style={{ color: '#8492a6', fontSize: '10px' }}>Ref: {s.ref || s.category} ({s.date})</span>
                                  {s.snippet && <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '10px' }}>{s.snippet}</p>}
                                </div>
                              ))}
                            </div>
                          ) : (
                            'No external sources were retrieved. No citations are available for this simulated response.'
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <form className="rs-composer" onSubmit={event => { event.preventDefault(); submitQuestion() }}>
            <textarea
              value={question}
              onChange={event => setQuestion(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  submitQuestion()
                }
              }}
              placeholder={`Ask ${selectedAgent.name} a question...`}
              rows={2}
              aria-label="Research question"
            />
            <div className="rs-composer-footer">
              <span><Globe2 size={14} /> Demo mode · No external lookup</span>
              <button type="submit" disabled={!question.trim()}>
                Run research <Send size={15} />
              </button>
            </div>
          </form>
          <div className="rs-bottom-note">AI-generated research can be wrong. Verify information before making financial decisions.</div>
        </section>
      </div>
    </div>
  )
}
