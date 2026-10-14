/**
 * RAG Engine (Retrieval-Augmented Generation) for VibeFinance
 * Tokenizes, indexes, and queries the synthetic SEC/SEBI filings and conference call corpus.
 */

const corpus = require('../data/documents_corpus.json');

class RAGEngine {
  constructor(documents = corpus) {
    this.documents = documents;
    this.stopWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
      'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
      'to', 'was', 'were', 'will', 'with'
    ]);
  }

  tokenize(text) {
    if (!text || typeof text !== 'string') return [];
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2 && !this.stopWords.has(token));
  }

  getAllDocuments(symbolFilter = null) {
    if (!symbolFilter) return this.documents;
    const cleanSym = symbolFilter.toUpperCase();
    return this.documents.filter(doc => doc.symbol === cleanSym);
  }

  getDocumentById(id) {
    return this.documents.find(doc => doc.id === id) || null;
  }

  search(query, symbolFilter = null, options = { topK: 3 }) {
    if (!query || typeof query !== 'string') return [];

    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return [];

    let targetDocs = this.documents;
    if (symbolFilter) {
      const cleanSym = symbolFilter.toUpperCase();
      targetDocs = targetDocs.filter(d => d.symbol === cleanSym);
    }

    const scored = targetDocs.map(doc => {
      const titleTokens = this.tokenize(doc.title);
      const contentTokens = this.tokenize(doc.content);
      const refTokens = this.tokenize(doc.filing_ref || '');

      let score = 0;
      const matchedTerms = new Set();

      for (const token of queryTokens) {
        let termMatches = 0;

        // Title matches have highest weight
        const titleCount = titleTokens.filter(t => t === token).length;
        if (titleCount > 0) {
          score += titleCount * 5;
          termMatches += titleCount;
        }

        // Ref/category matches
        const refCount = refTokens.filter(t => t === token).length;
        if (refCount > 0) {
          score += refCount * 3;
          termMatches += refCount;
        }

        // Content matches (TF scaling)
        const contentCount = contentTokens.filter(t => t === token).length;
        if (contentCount > 0) {
          score += Math.log(1 + contentCount) * 2;
          termMatches += contentCount;
        }

        if (termMatches > 0) {
          matchedTerms.add(token);
        }
      }

      // Symbol exact match bonus
      if (doc.symbol && query.toUpperCase().includes(doc.symbol)) {
        score += 8;
        matchedTerms.add(doc.symbol.toLowerCase());
      }

      // Coverage multiplier
      const coverage = matchedTerms.size / queryTokens.length;
      score = score * (1 + coverage);

      // Extract best snippet
      const snippet = this.extractSnippet(doc.content, queryTokens);

      return {
        id: doc.id,
        symbol: doc.symbol,
        company: doc.company,
        title: doc.title,
        category: doc.category,
        date: doc.date,
        filing_ref: doc.filing_ref,
        key_metrics: doc.key_metrics,
        relevance_score: Math.round(score * 10) / 10,
        matched_terms: Array.from(matchedTerms),
        snippet
      };
    });

    return scored
      .filter(item => item.relevance_score > 0)
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, options.topK || 3);
  }

  extractSnippet(text, queryTokens, maxLength = 220) {
    if (!text) return '';
    const sentences = text.split(/(?<=[.?!])\s+/);

    let bestSentence = sentences[0];
    let maxHits = -1;

    for (const sentence of sentences) {
      const lower = sentence.toLowerCase();
      let hits = 0;
      for (const token of queryTokens) {
        if (lower.includes(token)) hits++;
      }
      if (hits > maxHits) {
        maxHits = hits;
        bestSentence = sentence;
      }
    }

    if (bestSentence.length <= maxLength) return bestSentence;
    return bestSentence.slice(0, maxLength).trim() + '...';
  }
}

module.exports = new RAGEngine();
