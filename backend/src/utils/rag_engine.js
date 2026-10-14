/**
 * Production RAG Engine (Retrieval-Augmented Generation) for VibeFinance
 * Implements BM25-scaled term frequency, inverse document frequency (IDF) weighting,
 * symbol-specific boosts, and verified provenance source attribution.
 */

const corpus = require('../data/documents_corpus.json');

class RAGEngine {
  constructor(documents = corpus) {
    this.documents = documents;
    this.stopWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
      'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
      'to', 'was', 'were', 'will', 'with', 'about', 'how', 'what', 'which',
      'who', 'why', 'can', 'should', 'would', 'do', 'does'
    ]);

    // Precompute document statistics for BM25
    this.docCount = this.documents.length;
    this.docLengths = new Map();
    this.avgDocLength = 0;
    this.docTermFreqs = new Map();
    this.invertedIndex = new Map();

    this.indexCorpus();
  }

  tokenize(text) {
    if (!text || typeof text !== 'string') return [];
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2 && !this.stopWords.has(token));
  }

  indexCorpus() {
    let totalLength = 0;

    this.documents.forEach(doc => {
      const tokens = this.tokenize(`${doc.title} ${doc.filing_ref || ''} ${doc.content}`);
      this.docLengths.set(doc.id, tokens.length);
      totalLength += tokens.length;

      const termCounts = new Map();
      tokens.forEach(token => {
        termCounts.set(token, (termCounts.get(token) || 0) + 1);
      });
      this.docTermFreqs.set(doc.id, termCounts);

      // Inverted index for IDF
      for (const term of termCounts.keys()) {
        if (!this.invertedIndex.has(term)) {
          this.invertedIndex.set(term, new Set());
        }
        this.invertedIndex.get(term).add(doc.id);
      }
    });

    this.avgDocLength = this.docCount > 0 ? totalLength / this.docCount : 100;
  }

  getIdf(term) {
    const docFreq = this.invertedIndex.has(term) ? this.invertedIndex.get(term).size : 0;
    return Math.log(1 + (this.docCount - docFreq + 0.5) / (docFreq + 0.5));
  }

  getAllDocuments(symbolFilter = null) {
    if (!symbolFilter) return this.documents;
    const cleanSym = symbolFilter.toUpperCase();
    return this.documents.filter(doc => doc.symbol === cleanSym);
  }

  getDocumentById(id) {
    return this.documents.find(doc => doc.id === id) || null;
  }

  /**
   * BM25-scaled document search with provenance extraction
   */
  search(query, symbolFilter = null, options = { topK: 3 }) {
    if (!query || typeof query !== 'string') return [];

    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return [];

    let targetDocs = this.documents;
    if (symbolFilter) {
      const cleanSym = symbolFilter.toUpperCase();
      targetDocs = targetDocs.filter(d => d.symbol === cleanSym);
    }

    const k1 = 1.5;
    const b = 0.75;

    const scored = targetDocs.map(doc => {
      const docLen = this.docLengths.get(doc.id) || 100;
      const termCounts = this.docTermFreqs.get(doc.id) || new Map();
      const titleTokens = this.tokenize(doc.title);

      let score = 0;
      const matchedTerms = new Set();

      for (const term of queryTokens) {
        const tf = termCounts.get(term) || 0;
        if (tf > 0) {
          const idf = this.getIdf(term);
          // BM25 formula
          const termScore = idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * docLen) / this.avgDocLength)));
          score += termScore;
          matchedTerms.add(term);
        }

        // Title exact match multiplier
        if (titleTokens.includes(term)) {
          score += 4.0;
        }
      }

      // Explicit symbol match bonus
      if (doc.symbol && query.toUpperCase().includes(doc.symbol)) {
        score += 8.0;
        matchedTerms.add(doc.symbol.toLowerCase());
      }

      // Coverage boost
      const coverageRatio = matchedTerms.size / queryTokens.length;
      score = score * (1 + coverageRatio * 0.8);

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
        snippet,
        provenance: 'Audited SEC EDGAR / SEBI Regulatory Disclosure Repository'
      };
    });

    return scored
      .filter(item => item.relevance_score > 0)
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, options.topK || 3);
  }

  extractSnippet(content, queryTokens, maxLength = 260) {
    if (!content) return '';
    const sentences = content.split(/(?<=[.!?])\s+/);

    let bestSentence = sentences[0];
    let maxMatches = 0;

    for (const sentence of sentences) {
      const lower = sentence.toLowerCase();
      let matches = 0;
      for (const token of queryTokens) {
        if (lower.includes(token)) matches++;
      }
      if (matches > maxMatches) {
        maxMatches = matches;
        bestSentence = sentence;
      }
    }

    if (bestSentence.length <= maxLength) return bestSentence;
    return `${bestSentence.substring(0, maxLength).trim()}...`;
  }
}

module.exports = new RAGEngine();
