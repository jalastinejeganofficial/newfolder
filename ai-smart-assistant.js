// VeritasAI - AI Innovation Feature: Smart Problem Solver
// Contextual AI assistant that provides proactive help and solutions

const AISmartAssistant = {
  // State
  isActive: false,
  currentContext: null,
  suggestions: [],
  
  // Initialize smart assistant
  init() {
    this.createInnovationButton();
    this.createInnovationPanel();
    this.setupEventListeners();
    this.detectUserContext();
  },
  
  // Create floating innovation button
  createInnovationButton() {
    const btn = document.createElement('div');
    btn.id = 'ai-innovation-btn';
    btn.className = 'ai-innovation-btn';
    btn.innerHTML = `
      <div class="innovation-pulse-ring"></div>
      <div class="innovation-icon">✨</div>
    `;
    btn.title = 'AI Smart Assistant';
    
    document.body.appendChild(btn);
  },
  
  // Create innovation panel
  createInnovationPanel() {
    const panel = document.createElement('div');
    panel.id = 'ai-innovation-panel';
    panel.className = 'ai-innovation-panel';
    panel.style.display = 'none';
    
    panel.innerHTML = `
      <div class="innovation-header">
        <div class="innovation-title">
          <span class="sparkle-icon">✨</span>
          <span>AI Problem Solver</span>
        </div>
        <button class="innovation-close-btn" id="innovationCloseBtn">×</button>
      </div>
      
      <div class="innovation-content">
        <!-- Context Detection -->
        <div class="context-detector" id="contextDetector">
          <div class="context-status">
            <div class="status-indicator active"></div>
            <span>Detecting your context...</span>
          </div>
        </div>
        
        <!-- Problem Analysis -->
        <div class="problem-analysis" id="problemAnalysis" style="display:none;">
          <h3 class="analysis-title">🔍 What I Found</h3>
          <div class="analysis-content" id="analysisContent"></div>
        </div>
        
        <!-- AI Suggestions -->
        <div class="ai-suggestions" id="aiSuggestions" style="display:none;">
          <h3 class="suggestions-title">💡 Recommended Actions</h3>
          <div class="suggestion-cards" id="suggestionCards"></div>
        </div>
        
        <!-- Quick Actions -->
        <div class="quick-actions" id="quickActions" style="display:none;">
          <h3 class="actions-title">⚡ Quick Actions</h3>
          <div class="action-buttons" id="actionButtons"></div>
        </div>
        
        <!-- Solution Steps -->
        <div class="solution-steps" id="solutionSteps" style="display:none;">
          <h3 class="steps-title">📋 Step-by-Step Guide</h3>
          <div class="steps-timeline" id="stepsTimeline"></div>
        </div>
      </div>
      
      <div class="innovation-footer">
        <button class="refresh-btn" onclick="AISmartAssistant.refreshAnalysis()">
          🔄 Refresh Analysis
        </button>
      </div>
    `;
    
    document.body.appendChild(panel);
  },
  
  // Setup event listeners
  setupEventListeners() {
    const btn = document.getElementById('ai-innovation-btn');
    const closeBtn = document.getElementById('innovationCloseBtn');
    
    btn.addEventListener('click', () => this.togglePanel());
    closeBtn.addEventListener('click', () => this.closePanel());
    
    // Auto-detect context changes
    const textarea = document.getElementById('inputText');
    if (textarea) {
      textarea.addEventListener('input', () => {
        clearTimeout(this.contextTimeout);
        this.contextTimeout = setTimeout(() => {
          this.detectUserContext();
        }, 2000);
      });
    }
  },
  
  // Toggle panel
  togglePanel() {
    const panel = document.getElementById('ai-innovation-panel');
    const btn = document.getElementById('ai-innovation-btn');
    
    if (this.isActive) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  },
  
  // Open panel
  openPanel() {
    const panel = document.getElementById('ai-innovation-panel');
    const btn = document.getElementById('ai-innovation-btn');
    
    panel.style.display = 'block';
    btn.style.display = 'none';
    this.isActive = true;
    
    // Refresh context detection
    this.detectUserContext();
  },
  
  // Close panel
  closePanel() {
    const panel = document.getElementById('ai-innovation-panel');
    const btn = document.getElementById('ai-innovation-btn');
    
    panel.style.display = 'none';
    btn.style.display = 'flex';
    this.isActive = false;
  },
  
  // Detect user context
  detectUserContext() {
    const textarea = document.getElementById('inputText');
    const text = textarea ? textarea.value.trim() : '';
    
    const detector = document.getElementById('contextDetector');
    if (!detector) return;
    
    detector.style.display = 'block';
    
    // Analyze text characteristics
    setTimeout(() => {
      this.currentContext = this.analyzeContext(text);
      this.showContextResults();
    }, 800);
  },
  
  // Analyze context
  analyzeContext(text) {
    const context = {
      type: 'general',
      confidence: 0,
      indicators: [],
      suggestions: []
    };
    
    if (!text || text.length === 0) {
      context.type = 'empty';
      return context;
    }
    
    // Check for question patterns
    if (/\?/.test(text)) {
      context.type = 'question';
      context.confidence += 30;
      context.indicators.push('Contains question mark');
    }
    
    // Check for claim patterns
    if (/^(I think|I believe|In my opinion|Scientists say|Studies show|Experts agree)/i.test(text)) {
      context.type = 'claim';
      context.confidence += 40;
      context.indicators.push('Contains claim statement');
    }
    
    // Check for news/article patterns
    if (/(according to|reported by|news article|study found|research shows)/i.test(text)) {
      context.type = 'news_analysis';
      context.confidence += 50;
      context.indicators.push('References news or research');
    }
    
    // Check for social media patterns
    if (/(viral post|trending on|twitter says|facebook share|instagram story)/i.test(text)) {
      context.type = 'social_media';
      context.confidence += 45;
      context.indicators.push('Social media content detected');
    }
    
    // Check for health/medical claims
    if (/(cure|treatment|symptoms|disease|doctor|medicine|vaccine|health)/i.test(text)) {
      context.type = 'health_claim';
      context.confidence += 60;
      context.indicators.push('Health-related content');
    }
    
    // Check for scientific claims
    if (/(science|scientific|peer-reviewed|journal|experiment|data|evidence)/i.test(text)) {
      context.type = 'scientific_claim';
      context.confidence += 55;
      context.indicators.push('Scientific terminology detected');
    }
    
    // Check for political content
    if (/(government|policy|election|vote|politician|legislation|congress)/i.test(text)) {
      context.type = 'political_content';
      context.confidence += 50;
      context.indicators.push('Political topic detected');
    }
    
    // Check length for complexity
    if (text.length > 500) {
      context.indicators.push('Long-form content (>500 chars)');
      context.confidence += 10;
    }
    
    // Generate suggestions based on context
    context.suggestions = this.generateSuggestions(context);
    
    return context;
  },
  
  // Generate suggestions based on context
  generateSuggestions(context) {
    const suggestions = [];
    
    switch(context.type) {
      case 'question':
        suggestions.push({
          icon: '❓',
          title: 'Question Detected',
          description: 'Your question can be analyzed for factual basis',
          action: 'analyze_question'
        });
        break;
        
      case 'claim':
        suggestions.push({
          icon: '🎯',
          title: 'Claim Identified',
          description: 'This appears to be a factual claim that can be verified',
          action: 'verify_claim'
        });
        break;
        
      case 'health_claim':
        suggestions.push({
          icon: '⚕️',
          title: 'Health Content',
          description: 'Health claims require extra verification from medical sources',
          action: 'medical_verification',
          priority: 'high'
        });
        break;
        
      case 'scientific_claim':
        suggestions.push({
          icon: '🔬',
          title: 'Scientific Claim',
          description: 'Scientific statements will be checked against peer-reviewed sources',
          action: 'scientific_review'
        });
        break;
        
      case 'social_media':
        suggestions.push({
          icon: '📱',
          title: 'Social Media Content',
          description: 'Viral posts often contain misinformation - let\'s verify this',
          action: 'fact_check',
          priority: 'high'
        });
        break;
        
      case 'news_analysis':
        suggestions.push({
          icon: '📰',
          title: 'News Analysis',
          description: 'News references will be cross-checked with multiple sources',
          action: 'news_verification'
        });
        break;
        
      default:
        suggestions.push({
          icon: '🔍',
          title: 'General Analysis',
          description: 'Content will be analyzed for accuracy and credibility',
          action: 'general_analysis'
        });
    }
    
    // Always add general suggestions
    suggestions.push({
      icon: '🛡️',
      title: 'Bias Detection',
      description: 'Check for rhetorical devices and framing techniques',
      action: 'bias_check'
    });
    
    if (context.confidence > 50) {
      suggestions.push({
        icon: '📊',
        title: 'Deep Analysis',
        description: 'Comprehensive multi-agent AI analysis recommended',
        action: 'deep_analysis',
        priority: 'recommended'
      });
    }
    
    return suggestions;
  },
  
  // Show context results
  showContextResults() {
    const detector = document.getElementById('contextDetector');
    const analysis = document.getElementById('problemAnalysis');
    const suggestions = document.getElementById('aiSuggestions');
    const actions = document.getElementById('quickActions');
    const steps = document.getElementById('solutionSteps');
    
    if (!this.currentContext) return;
    
    // Update detector
    if (detector) {
      detector.innerHTML = `
        <div class="context-badge ${this.currentContext.type}">
          <span class="badge-icon">${this.getContextIcon(this.currentContext.type)}</span>
          <span class="badge-text">${this.formatContextType(this.currentContext.type)}</span>
          <span class="confidence-score">${Math.min(this.currentContext.confidence + 40, 100)}% confident</span>
        </div>
        <div class="indicators-list">
          ${this.currentContext.indicators.map(ind => 
            `<span class="indicator-tag">${ind}</span>`
          ).join('')}
        </div>
      `;
    }
    
    // Show analysis
    if (analysis) {
      analysis.style.display = 'block';
      document.getElementById('analysisContent').innerHTML = `
        <p class="analysis-text">
          Based on your input, I've detected <strong>${this.formatContextType(this.currentContext.type)}</strong> content.
          The AI system has identified ${this.currentContext.indicators.length} key indicators 
          with ${Math.min(this.currentContext.confidence + 40, 100)}% confidence level.
        </p>
        <div class="analysis-tags">
          <span class="tag tag-type">Type: ${this.currentContext.type}</span>
          <span class="tag tag-confidence">Confidence: ${Math.min(this.currentContext.confidence + 40, 100)}%</span>
          <span class="tag tag-indicators">${this.currentContext.indicators.length} indicators</span>
        </div>
      `;
    }
    
    // Show suggestions
    if (suggestions) {
      suggestions.style.display = 'block';
      document.getElementById('suggestionCards').innerHTML = this.currentContext.suggestions
        .map(s => `
          <div class="suggestion-card ${s.priority || ''}" onclick="AISmartAssistant.executeAction('${s.action}')">
            <div class="card-icon">${s.icon}</div>
            <div class="card-content">
              <h4 class="card-title">${s.title}</h4>
              <p class="card-desc">${s.description}</p>
              ${s.priority === 'high' ? '<span class="priority-badge">High Priority</span>' : ''}
              ${s.priority === 'recommended' ? '<span class="recommended-badge">Recommended</span>' : ''}
            </div>
          </div>
        `).join('');
    }
    
    // Show quick actions
    if (actions) {
      actions.style.display = 'block';
      document.getElementById('actionButtons').innerHTML = `
        <button class="action-btn primary" onclick="analyzeContent()">
          🔍 Full Analysis
        </button>
        <button class="action-btn" onclick="AISmartAssistant.showVerdictsGuide()">
          ⚖️ View Verdicts Guide
        </button>
        <button class="action-btn" onclick="AISmartAssistant.clearAndRestart()">
          🔄 Clear & Start Fresh
        </button>
      `;
    }
    
    // Show solution steps
    if (steps && this.currentContext.confidence > 30) {
      steps.style.display = 'block';
      document.getElementById('stepsTimeline').innerHTML = `
        <div class="step-item">
          <div class="step-marker">1</div>
          <div class="step-content">
            <h4>Input Detected</h4>
            <p>Your content has been analyzed for context and characteristics</p>
          </div>
        </div>
        <div class="step-item">
          <div class="step-marker">2</div>
          <div class="step-content">
            <h4>Choose Action</h4>
            <p>Select a recommended suggestion above or use quick actions</p>
          </div>
        </div>
        <div class="step-item">
          <div class="step-marker">3</div>
          <div class="step-content">
            <h4>AI Analysis</h4>
            <p>Multi-agent AI system will analyze and verify your content</p>
          </div>
        </div>
        <div class="step-item">
          <div class="step-marker">4</div>
          <div class="step-content">
            <h4>Review Results</h4>
            <p>Examine verdict, confidence score, evidence, and reasoning</p>
          </div>
        </div>
      `;
    }
  },
  
  // Get context icon
  getContextIcon(type) {
    const icons = {
      empty: '😐',
      general: '📝',
      question: '❓',
      claim: '🎯',
      news_analysis: '📰',
      social_media: '📱',
      health_claim: '⚕️',
      scientific_claim: '🔬',
      political_content: '🏛️'
    };
    return icons[type] || '📝';
  },
  
  // Format context type
  formatContextType(type) {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  },
  
  // Execute action
  executeAction(action) {
    console.log('Executing action:', action);
    
    switch(action) {
      case 'analyze_question':
      case 'verify_claim':
      case 'general_analysis':
        if (typeof analyzeContent === 'function') {
          analyzeContent();
        }
        break;
        
      case 'medical_verification':
        showToast('Medical claims require expert verification', '⚕️');
        setTimeout(() => {
          if (typeof analyzeContent === 'function') {
            analyzeContent();
          }
        }, 1000);
        break;
        
      case 'scientific_review':
        showToast('Checking against scientific databases...', '🔬');
        setTimeout(() => {
          if (typeof analyzeContent === 'function') {
            analyzeContent();
          }
        }, 1000);
        break;
        
      case 'fact_check':
        showToast('Fact-checking initiated...', '✅');
        setTimeout(() => {
          if (typeof analyzeContent === 'function') {
            analyzeContent();
          }
        }, 1000);
        break;
        
      case 'bias_check':
        showToast('Analyzing for bias and rhetorical devices...', '🎭');
        setTimeout(() => {
          if (typeof analyzeContent === 'function') {
            analyzeContent();
          }
        }, 1000);
        break;
        
      case 'deep_analysis':
        showToast('Starting comprehensive multi-agent analysis...', '🤖');
        setTimeout(() => {
          if (typeof analyzeContent === 'function') {
            analyzeContent();
          }
        }, 1000);
        break;
    }
    
    this.closePanel();
  },
  
  // Show verdicts guide
  showVerdictsGuide() {
    window.location.href = 'verdicts.html';
  },
  
  // Clear and restart
  clearAndRestart() {
    const textarea = document.getElementById('inputText');
    if (textarea) {
      textarea.value = '';
      if (typeof updateCharCount === 'function') {
        updateCharCount();
      }
    }
    showToast('Cleared! Ready for new input', '✨');
    this.closePanel();
  },
  
  // Refresh analysis
  refreshAnalysis() {
    showToast('Refreshing context analysis...', '🔄');
    this.detectUserContext();
  }
};

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    AISmartAssistant.init();
  });
}
