// VeritasAI - Advanced Evidence Source Verification System
// Provides accurate URL links for verified claims and "no source available" for mismatched information

const EvidenceVerifier = {
  // Trusted news and fact-checking sources database
  trustedSources: {
    fact_checking: [
      { name: 'Snopes', domain: 'snopes.com', keywords: ['fact check', 'debunk', 'claim', 'hoax', 'rumor'] },
      { name: 'PolitiFact', domain: 'politifact.com', keywords: ['political', 'politician', 'congress', 'election', 'vote'] },
      { name: 'FactCheck.org', domain: 'factcheck.org', keywords: ['misleading', 'false', 'accurate', 'verification'] },
      { name: 'Reuters Fact Check', domain: 'reuters.com/fact-check', keywords: ['news', 'report', 'investigation'] },
      { name: 'AP Fact Check', domain: 'apnews.com/ap-fact-check', keywords: ['associated press', 'news wire', 'report'] }
    ],
    news: [
      { name: 'Reuters', domain: 'reuters.com', keywords: ['news', 'business', 'finance', 'market', 'economy'] },
      { name: 'Associated Press', domain: 'apnews.com', keywords: ['breaking news', 'wire service', 'report'] },
      { name: 'BBC News', domain: 'bbc.com/news', keywords: ['world news', 'international', 'uk', 'europe'] },
      { name: 'NPR', domain: 'npr.org', keywords: ['public radio', 'podcast', 'interview'] },
      { name: 'The Conversation', domain: 'theconversation.com', keywords: ['academic', 'expert', 'research', 'analysis'] }
    ],
    science: [
      { name: 'PubMed', domain: 'pubmed.ncbi.nlm.nih.gov', keywords: ['medical', 'health', 'study', 'clinical trial', 'disease'] },
      { name: 'Nature', domain: 'nature.com', keywords: ['scientific research', 'peer-reviewed', 'journal', 'science'] },
      { name: 'Science Magazine', domain: 'science.org', keywords: ['research', 'discovery', 'experiment', 'findings'] },
      { name: 'NASA', domain: 'nasa.gov', keywords: ['space', 'climate', 'earth', 'astronomy', 'planet'] },
      { name: 'CDC', domain: 'cdc.gov', keywords: ['disease control', 'health', 'outbreak', 'vaccine', 'epidemic'] }
    ],
    government: [
      { name: 'USA.gov', domain: 'usa.gov', keywords: ['government', 'federal', 'official', 'public service'] },
      { name: 'Congress.gov', domain: 'congress.gov', keywords: ['legislation', 'bill', 'law', 'congress'] },
      { name: 'Supreme Court', domain: 'supremecourt.gov', keywords: ['court ruling', 'justice', 'legal decision'] }
    ]
  },

  // Keyword patterns for claim matching
  keywordPatterns: {
    health: ['vaccine', 'medicine', 'cure', 'treatment', 'symptoms', 'disease', 'doctor', 'hospital', 'clinical', 'pharmaceutical'],
    science: ['research', 'study', 'experiment', 'data', 'scientists', 'laboratory', 'peer-reviewed', 'findings'],
    politics: ['government', 'policy', 'election', 'vote', 'congress', 'senate', 'president', 'legislation'],
    climate: ['climate change', 'global warming', 'carbon', 'emissions', 'temperature', 'environmental'],
    technology: ['artificial intelligence', 'AI', 'machine learning', 'blockchain', 'cryptocurrency', 'tech'],
    economy: ['inflation', 'economy', 'market', 'stocks', 'gdp', 'unemployment', 'financial'],
    space: ['NASA', 'space', 'astronaut', 'rocket', 'satellite', 'planet', 'galaxy', 'universe'],
    education: ['school', 'university', 'students', 'teachers', 'curriculum', 'degree', 'academic']
  },

  // Search API endpoints (simulated - would use real APIs in production)
  searchEndpoints: {
    google: 'https://www.google.com/search?q=',
    google_news: 'https://news.google.com/search?q=',
    snopes: 'https://www.snopes.com/search/',
    politifact: 'https://www.politifact.com/search/?q=',
    reuters: 'https://www.reuters.com/site-search/?query='
  },

  // Initialize verifier
  init() {
    console.log('Evidence Verifier initialized with', Object.keys(this.trustedSources).length, 'source categories');
  },

  // Extract key terms from claim for searching
  extractKeywords(claimText) {
    const stopwords = new Set([
      'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
      'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used',
      'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into',
      'through', 'during', 'before', 'after', 'above', 'below', 'between',
      'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
      'where', 'why', 'how', 'all', 'each', 'few', 'more', 'most', 'other',
      'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
      'too', 'very', 'just', 'and', 'but', 'if', 'or', 'because', 'until', 'while'
    ]);

    // Tokenize and clean
    const words = claimText.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopwords.has(word));

    // Remove duplicates and return top keywords
    const uniqueWords = [...new Set(words)];
    return uniqueWords.slice(0, 8); // Top 8 keywords
  },

  // Detect topic category from claim
  detectCategory(claimText) {
    const text = claimText.toLowerCase();
    const scores = {};

    // Score each category
    for (const [category, keywords] of Object.entries(this.keywordPatterns)) {
      scores[category] = 0;
      keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          scores[category]++;
        }
      });
    }

    // Return highest scoring category
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return 'general';

    return Object.keys(scores).find(key => scores[key] === maxScore);
  },

  // Find relevant sources based on category and keywords
  findRelevantSources(category, keywords) {
    const relevantSources = [];

    // Get sources for this category
    if (category === 'health' || category === 'science') {
      relevantSources.push(...this.trustedSources.science);
      relevantSources.push(...this.trustedSources.fact_checking);
    } else if (category === 'politics') {
      relevantSources.push(...this.trustedSources.fact_checking);
      relevantSources.push(...this.trustedSources.news);
    } else {
      relevantSources.push(...this.trustedSources.news);
      relevantSources.push(...this.trustedSources.fact_checking);
    }

    // Filter by keyword matching
    const filteredSources = relevantSources.filter(source => {
      return keywords.some(keyword => 
        source.keywords.some(sourceKeyword => 
          keyword.includes(sourceKeyword) || sourceKeyword.includes(keyword)
        )
      );
    });

    // If no filtered results, return all relevant sources
    return filteredSources.length > 0 ? filteredSources : relevantSources;
  },

  // Generate search URLs for sources
  generateSearchURLs(claimText, sources) {
    const urls = [];
    const primaryKeywords = this.extractKeywords(claimText);
    const searchQuery = encodeURIComponent(primaryKeywords.slice(0, 5).join(' '));

    sources.forEach(source => {
      urls.push({
        name: source.name,
        domain: source.domain,
        url: `https://${source.domain}` + (source.search ? `/search/?q=${searchQuery}` : ''),
        type: 'source',
        relevance: 'high'
      });
    });

    // Add general search engines
    urls.push({
      name: 'Google News Search',
      domain: 'news.google.com',
      url: this.searchEndpoints.google_news + searchQuery,
      type: 'search_engine',
      relevance: 'medium'
    });

    urls.push({
      name: 'Snopes Fact Check',
      domain: 'snopes.com',
      url: this.searchEndpoints.snopes + searchQuery,
      type: 'fact_check',
      relevance: 'high'
    });

    return urls;
  },

  // Simulate online verification (would use real API in production)
  async verifyClaimOnline(claimText) {
    // In production, this would call real fact-checking APIs
    // For now, we'll simulate based on claim patterns
    
    const knownFalseClaims = [
      { pattern: 'moon landing.*fake', verdict: 'debunked', source: 'NASA' },
      { pattern: 'vaccines.*autism', verdict: 'debunked', source: 'CDC' },
      { pattern: 'climate change.*hoax', verdict: 'debunked', source: 'IPCC' },
      { pattern: 'earth.*flat', verdict: 'debunked', source: 'Scientific Consensus' },
      { pattern: 'bleach.*cure', verdict: 'dangerous_misinformation', source: 'FDA Warning' }
    ];

    const text = claimText.toLowerCase();
    
    for (const claim of knownFalseClaims) {
      const regex = new RegExp(claim.pattern);
      if (regex.test(text)) {
        return {
          found: true,
          verdict: claim.verdict,
          source: claim.source,
          confidence: 95,
          url: `https://example.com/fact-check/${encodeURIComponent(claim.pattern)}`
        };
      }
    }

    // Default: No exact match found
    return {
      found: false,
      message: 'No direct fact-check found in databases'
    };
  },

  // Main verification function - analyzes claim and provides sources
  async analyzeClaimWithSources(claimText) {
    console.log('🔍 Analyzing claim for evidence sources:', claimText.substring(0, 100) + '...');

    // Step 1: Extract keywords
    const keywords = this.extractKeywords(claimText);
    console.log('Keywords extracted:', keywords);

    // Step 2: Detect category
    const category = this.detectCategory(claimText);
    console.log('Detected category:', category);

    // Step 3: Find relevant sources
    const sources = this.findRelevantSources(category, keywords);
    console.log('Found sources:', sources.length);

    // Step 4: Generate search URLs
    const searchURLs = this.generateSearchURLs(claimText, sources);

    // Step 5: Attempt online verification
    const onlineResult = await this.verifyClaimOnline(claimText);

    // Step 6: Build evidence report
    const evidenceReport = {
      keywords: keywords,
      category: category,
      onlineVerification: onlineResult,
      hasSourceMatch: onlineResult.found,
      sources: {
        direct: onlineResult.found ? [{
          name: onlineResult.source,
          url: onlineResult.url,
          type: 'verification',
          verdict: onlineResult.verdict,
          confidence: onlineResult.confidence
        }] : [],
        suggested: searchURLs.map(url => ({
          name: url.name,
          url: url.url,
          domain: url.domain,
          type: url.type,
          relevance: url.relevance
        }))
      },
      summary: onlineResult.found 
        ? `Direct verification found from ${onlineResult.source} with ${onlineResult.confidence}% confidence`
        : `No direct source match found. Suggested sources for manual verification provided.`
    };

    console.log('Evidence Report:', evidenceReport);
    return evidenceReport;
  },

  // Format sources for display
  formatSourcesForDisplay(evidenceReport) {
    if (!evidenceReport.hasSourceMatch) {
      return {
        status: 'no_source_available',
        message: '⚠️ No direct source available online for this claim.',
        suggestedActions: [
          'Check the suggested fact-checking websites below',
          'Search Google News with the extracted keywords',
          'Consult subject matter experts',
          'Look for peer-reviewed research on this topic'
        ],
        keywords: evidenceReport.keywords.join(', '),
        category: evidenceReport.category
      };
    }

    const directSource = evidenceReport.sources.direct[0];
    return {
      status: 'source_found',
      message: `✅ Direct source found: ${directSource.name}`,
      url: directSource.url,
      verdict: directSource.verdict,
      confidence: directSource.confidence,
      suggestedSources: evidenceReport.sources.suggested
    };
  },

  // Get confidence score based on evidence
  calculateConfidenceScore(evidenceReport) {
    let score = 50; // Base score

    if (evidenceReport.hasSourceMatch) {
      score += 30; // Direct match bonus
      if (evidenceReport.sources.direct[0].confidence > 90) {
        score += 15;
      }
    }

    // Category-specific adjustments
    const highConfidenceCategories = ['science', 'health'];
    if (highConfidenceCategories.includes(evidenceReport.category)) {
      score += 5;
    }

    // Keyword quality adjustment
    if (evidenceReport.keywords.length >= 5) {
      score += 5;
    }

    return Math.min(score, 100);
  }
};

// Initialize when module loads
EvidenceVerifier.init();
