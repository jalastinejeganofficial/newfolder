// ===== LOGGING SERVICE FOR VERITAS AI =====
// Centralized logging for tracking user actions, API calls, errors, and analytics

const Logger = {
  logs: [],
  maxLogs: 1000, // Keep last 1000 logs
  
  // Log levels
  LEVELS: {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    DEBUG: 'DEBUG',
    ANALYTICS: 'ANALYTICS'
  },
  
  // Initialize logger
  init() {
    // Load existing logs from localStorage
    const savedLogs = localStorage.getItem('veritasai_logs');
    if (savedLogs) {
      try {
        this.logs = JSON.parse(savedLogs);
      } catch (e) {
        this.logs = [];
      }
    }
    
    console.log('📝 Logger initialized');
  },
  
  // Add a log entry
  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // Add to logs array
    this.logs.push(logEntry);
    
    // Trim to max size
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    // Save to localStorage
    this.saveLogs();
    
    // Console output with color coding
    const color = this.getLogLevelColor(level);
    console.log(`%c[${timestamp}] ${level}: ${message}`, `color: ${color}; font-weight: bold;`, data);
    
    return logEntry;
  },
  
  // Convenience methods
  info(message, data) {
    return this.log(this.LEVELS.INFO, message, data);
  },
  
  warn(message, data) {
    return this.log(this.LEVELS.WARN, message, data);
  },
  
  error(message, data) {
    return this.log(this.LEVELS.ERROR, message, data);
  },
  
  debug(message, data) {
    return this.log(this.LEVELS.DEBUG, message, data);
  },
  
  analytics(eventType, data) {
    return this.log(this.LEVELS.ANALYTICS, `Event: ${eventType}`, data);
  },
  
  // Get color for log level
  getLogLevelColor(level) {
    switch (level) {
      case this.LEVELS.INFO: return '#3b82f6'; // Blue
      case this.LEVELS.WARN: return '#f59e0b'; // Orange
      case this.LEVELS.ERROR: return '#ef4444'; // Red
      case this.LEVELS.DEBUG: return '#6b7280'; // Gray
      case this.LEVELS.ANALYTICS: return '#10b981'; // Green
      default: return '#000000';
    }
  },
  
  // Get or create session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('veritasai_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('veritasai_session_id', sessionId);
    }
    return sessionId;
  },
  
  // Save logs to localStorage
  saveLogs() {
    try {
      localStorage.setItem('veritasai_logs', JSON.stringify(this.logs));
    } catch (e) {
      console.warn('Failed to save logs to localStorage:', e);
    }
  },
  
  // Get recent logs
  getRecent(count = 50) {
    return this.logs.slice(-count);
  },
  
  // Get logs by level
  getByLevel(level) {
    return this.logs.filter(log => log.level === level);
  },
  
  // Get logs by session
  getBySession(sessionId) {
    return this.logs.filter(log => log.sessionId === sessionId);
  },
  
  // Export logs
  exportLogs() {
    const dataStr = JSON.stringify(this.logs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `veritasai-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    this.info('Logs exported', { count: this.logs.length });
  },
  
  // Clear logs
  clear() {
    this.logs = [];
    localStorage.removeItem('veritasai_logs');
    console.log('🗑️ Logs cleared');
  },
  
  // Show logs in UI (for debugging)
  showInUI() {
    const recentLogs = this.getRecent(20);
    console.table(recentLogs.map(log => ({
      Time: new Date(log.timestamp).toLocaleTimeString(),
      Level: log.level,
      Message: log.message,
      Data: JSON.stringify(log.data)
    })));
  }
};

// Multi-Agent System
const MultiAgentSystem = {
  agents: [],
  currentAgent: null,
  
  // Agent types
  AGENT_TYPES: {
    GENERAL: 'general',
    SCIENTIFIC: 'scientific',
    POLITICAL: 'political',
    MEDICAL: 'medical',
    TECHNICAL: 'technical',
    FINANCIAL: 'financial'
  },
  
  // Agent configurations - will be initialized in init()
  AGENT_CONFIGS: {},
  
  // Initialize multi-agent system
  init() {
    this.agents = Object.values(this.AGENT_CONFIGS);
    this.currentAgent = this.AGENT_CONFIGS[this.AGENT_TYPES.GENERAL];
    
    Logger.info('Multi-Agent System initialized', { 
      agentCount: this.agents.length,
      defaultAgent: this.currentAgent.name 
    });
  },
  
  // Auto-select agent based on content
  autoSelectAgent(content) {
    const contentLower = content.toLowerCase();
    
    // Check for specialty keywords
    for (const agent of this.agents) {
      for (const specialty of agent.specialty) {
        if (contentLower.includes(specialty.toLowerCase())) {
          Logger.analytics('agent_auto_selected', {
            selectedAgent: agent.name,
            triggerWord: specialty,
            contentLength: content.length
          });
          
          this.currentAgent = agent;
          return agent;
        }
      }
    }
    
    // Default to general agent
    this.currentAgent = this.AGENT_CONFIGS[this.AGENT_TYPES.GENERAL];
    return this.currentAgent;
  },
  
  // Manually select agent
  selectAgent(agentType) {
    if (this.AGENT_CONFIGS[agentType]) {
      this.currentAgent = this.AGENT_CONFIGS[agentType];
      Logger.info('Agent manually selected', { agent: this.currentAgent.name });
      return this.currentAgent;
    }
    throw new Error(`Unknown agent type: ${agentType}`);
  },
  
  // Get current agent
  getCurrentAgent() {
    return this.currentAgent;
  },
  
  // Get all agents
  getAllAgents() {
    return this.agents;
  },
  
  // Build API request with agent context
  buildRequestParams(content, isImage = false) {
    const baseParams = {
      model: CONFIG.MODEL,
      temperature: this.currentAgent.temperature,
      max_tokens: 3000
    };
    
    if (isImage) {
      baseParams.model = CONFIG.VISION_MODEL;
    }
    
    // Add system prompt as first message
    baseParams.messages = [
      {
        role: 'system',
        content: this.currentAgent.systemPrompt
      }
    ];
    
    Logger.debug('Agent request built', {
      agent: this.currentAgent.name,
      model: baseParams.model,
      temperature: baseParams.temperature
    });
    
    return baseParams;
  },
  
  // Render agent selector UI
  renderSelector(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
      <div class="agent-selector">
        <div class="agent-selector-title">Choose Expert Agent</div>
        <div class="agent-options">
          ${this.agents.map(agent => `
            <button 
              class="agent-option ${this.currentAgent.name === agent.name ? 'active' : ''}"
              data-agent="${agent.name}"
              title="${agent.description}"
            >
              <span class="agent-icon">${agent.icon}</span>
              <span class="agent-name">${agent.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    
    // Add click handlers
    container.querySelectorAll('.agent-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const agentName = btn.dataset.agent;
        const agent = this.agents.find(a => a.name === agentName);
        if (agent) {
          this.currentAgent = agent;
          this.renderSelector(containerId);
          Logger.info('Agent changed', { agent: agent.name });
          showToast(`Switched to ${agent.icon} ${agent.name}`, '🎯');
        }
      });
    });
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Logger, MultiAgentSystem };
}
