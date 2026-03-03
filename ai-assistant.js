// VeritasAI - AI Assistant Chat Module
// Floating circular AI assistant for user questions and program details

const AIAssistant = {
  // State
  isOpen: false,
  messages: [],

  // Initialize assistant
  init() {
    this.createAssistantButton();
    this.createChatWindow();
    this.setupEventListeners();
    this.addWelcomeMessage();
  },

  // Create floating button
  createAssistantButton() {
    const btn = document.createElement('div');
    btn.id = 'ai-assistant-btn';
    btn.className = 'ai-assistant-btn';
    btn.innerHTML = '<img src="ai-assistant-avatar.png" alt="AI Assistant" style="width:100%;height:100%;object-fit:cover;border-radius:50%;filter:brightness(1.1) saturate(1.3);">';
    btn.title = 'AI Assistant';

    document.body.appendChild(btn);
  },

  // Create chat window
  createChatWindow() {
    const chatWindow = document.createElement('div');
    chatWindow.id = 'ai-chat-window';
    chatWindow.className = 'ai-chat-window';
    chatWindow.style.display = 'none';

    chatWindow.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-title">
          <span class="chat-icon"><img src="ai-assistant-avatar.png" alt="AI" style="width:32px;height:32px;border-radius:50%;object-fit:cover;filter:brightness(1.1) saturate(1.3);vertical-align:middle;"></span>
          <span>AI Assistant</span>
        </div>
        <button class="chat-close-btn" id="chatCloseBtn">×</button>
      </div>
      
      <div class="chat-messages" id="chatMessages">
        <!-- Messages will be added here -->
      </div>
      
      <div class="chat-input-container">
        <input 
          type="text" 
          id="chatInput" 
          class="chat-input" 
          placeholder="Ask me anything about VeritasAI..."
          onkeypress="if(event.key === 'Enter') AIAssistant.sendMessage()"
        />
        <button class="chat-send-btn" id="chatSendBtn" onclick="AIAssistant.sendMessage()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(chatWindow);
  },

  // Setup event listeners
  setupEventListeners() {
    const btn = document.getElementById('ai-assistant-btn');
    const closeBtn = document.getElementById('chatCloseBtn');

    btn.addEventListener('click', () => this.toggleChat());
    closeBtn.addEventListener('click', () => this.closeChat());
  },

  // Toggle chat visibility
  toggleChat() {
    const chatWindow = document.getElementById('ai-chat-window');
    const btn = document.getElementById('ai-assistant-btn');

    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  },

  // Open chat
  openChat() {
    const chatWindow = document.getElementById('ai-chat-window');
    const btn = document.getElementById('ai-assistant-btn');

    chatWindow.style.display = 'flex';
    btn.style.display = 'none';
    this.isOpen = true;

    // Focus input
    setTimeout(() => {
      document.getElementById('chatInput').focus();
    }, 300);
  },

  // Close chat
  closeChat() {
    const chatWindow = document.getElementById('ai-chat-window');
    const btn = document.getElementById('ai-assistant-btn');

    chatWindow.style.display = 'none';
    btn.style.display = 'flex';
    this.isOpen = false;
  },

  // Add welcome message
  addWelcomeMessage() {
    const welcomeMsg = {
      type: 'bot',
      text: `👋 Hello! I'm your AI assistant. I can help you with:
        
• Understanding how VeritasAI works
• Explaining verdicts and analysis
• Navigating the application
• Technical architecture details
• Security features

What would you like to know?`,
      timestamp: new Date()
    };

    this.messages.push(welcomeMsg);
    this.renderMessages();
  },

  // Send message
  sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();

    if (!text) return;

    // Add user message
    const userMsg = {
      type: 'user',
      text: text,
      timestamp: new Date()
    };

    this.messages.push(userMsg);
    input.value = '';

    // Render and get response
    this.renderMessages();
    this.getBotResponse(text);
  },

  // Get bot response based on keywords
  getBotResponse(userText) {
    const text = userText.toLowerCase();
    let response = '';

    // Keyword-based responses
    if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
      response = `👋 Hello! How can I assist you today? Feel free to ask me anything about VeritasAI's features, how it works, or the verdict system!`;
    }
    else if (text.includes('how it works') || text.includes('work') || text.includes('architecture')) {
      response = `🏗️ <strong>System Architecture:</strong>
      
VeritasAI uses a sophisticated multi-agent AI system:

1️⃣ <strong>Input Layer</strong> - Accepts text, images, and voice in multiple languages

2️⃣ <strong>Claim Extraction</strong> - NLP identifies factual claims from content

3️⃣ <strong>Multi-Agent Analysis</strong> - 5 specialized AI agents collaborate:
   • Research Agent - Gathers evidence
   • Analysis Agent - Evaluates credibility
   • Bias Agent - Detects rhetorical devices
   • Correction Agent - Generates fact-based corrections
   • Quality Agent - Ensures accuracy

4️⃣ <strong>Evidence Aggregation</strong> - Cross-references trusted sources

5️⃣ <strong>Verdict Classification</strong> - Assigns verdict with confidence score

6️⃣ <strong>Results Presentation</strong> - Interactive display with detailed reasoning

Want to see this visually? Check out the "How It Works" page!`;
    }
    else if (text.includes('verdict') || text.includes('true') || text.includes('false')) {
      response = `⚖️ <strong>Verdict Classification System:</strong>
      
We use four verdict types:

✅ <strong>Accurate/True</strong> - Claim is factually correct with strong evidence from trusted sources

⚠️ <strong>Partially Misleading</strong> - Contains truth but omits context or uses selective framing

❌ <strong>False</strong> - Contradicts well-established facts and authoritative evidence

❓ <strong>Unverifiable</strong> - Insufficient evidence to confirm or deny

Each verdict includes:
• Confidence percentage (0-100%)
• Detailed explanation
• Evidence sources
• Step-by-step reasoning
• Bias detection flags

Visit the "Verdicts" page for detailed examples!`;
    }
    else if (text.includes('security') || text.includes('lock') || text.includes('audit')) {
      response = `🔒 <strong>Security Features:</strong>
      
VeritasAI includes advanced audit detection:

• <strong>Multi-Vector Monitoring</strong> - Text, images, and voice input all monitored for audit-related keywords

• <strong>Persistent Lock Screen</strong> - If audit terms detected, screen locks with escalating durations:
  - 1st offense: 1 minute
  - 2nd offense: 5 minutes
  - 3rd+ offense: 24 hours

• <strong>Anti-Bypass Protection</strong> - Lock survives page refresh, browser close, and restart via localStorage persistence

• <strong>Complete Restrictions</strong> - During lock:
  ✓ Developer tools disabled
  ✓ Right-click blocked
  ✓ Inspect element prevented
  ✓ Keyboard shortcuts blocked
  ✓ Window switching prevented

This protects against inspection during sensitive operations.`;
    }
    else if (text.includes('language') || text.includes('translate')) {
      response = `🌍 <strong>Multi-Language Support:</strong>
      
VeritasAI supports 5+ languages:

🇺🇸 English
🇮🇳 Tamil (தமிழ்)
🇮🇳 Hindi (हिन्दी)
🇮🇳 Telugu (తెలుగు)
🇯🇵 Japanese (日本語)

Features:
• Real-time language switching
• Voice input in all supported languages
• Image OCR with multi-language support
• Localized UI elements
• Persistent language preference

Use the language selector in the navigation bar to switch languages instantly!`;
    }
    else if (text.includes('image') || text.includes('photo') || text.includes('upload')) {
      response = `🖼️ <strong>Image Analysis:</strong>
      
Upload images for comprehensive AI analysis:

<strong>Supported Formats:</strong>
• JPEG/JPG
• PNG
• WebP
• Max size: 10MB

<strong>Analysis Process:</strong>
1. OCR extracts visible text
2. AI identifies claims and context
3. Evidence gathered from trusted sources
4. Verdict assigned with confidence score

<strong>Examples:</strong>
• News article screenshots
• Social media posts
• Document photos
• Infographics
• Memes with claims

⚠️ Note: Images containing audit-related terms will trigger the security lock system!`;
    }
    else if (text.includes('voice') || text.includes('speak') || text.includes('microphone')) {
      response = `🎤 <strong>Voice Input:</strong>
      
Hands-free analysis via speech-to-text:

<strong>Features:</strong>
• Real-time speech recognition
• Multi-language support
• Auto-analysis option
• Clear visual feedback

<strong>How to Use:</strong>
1. Click "Start Speaking" button
2. Speak your content clearly
3. Transcript appears in text box
4. Confirm to analyze (if >50 chars)

<strong>Privacy:</strong>
• Speech processed by browser APIs only
• No audio sent to external servers
• Microphone permission required
• Standard Web Speech API used

⚠️ Speaking audit-related terms will trigger the security lock!`;
    }
    else if (text.includes('analyze') || text.includes('analysis')) {
      response = `🔍 <strong>Content Analysis:</strong>
      
VeritasAI performs deep fact-checking:

<strong>What Gets Analyzed:</strong>
• Individual factual claims
• Evidence quality and sources
• Bias and rhetorical devices
• Logical consistency
• Context and framing

<strong>Output Includes:</strong>
• Verdict (True/Misleading/False/Unverifiable)
• Confidence score (0-100%)
• Detailed explanation
• Evidence sources with links
• Step-by-step reasoning
• Detected bias flags
• Fact-based corrections
• Visual credibility indicators

<strong>To Analyze:</strong>
1. Paste text, upload image, or speak
2. Click "Analyze Now"
3. Review detailed results
4. Export report if needed`;
    }
    else if (text.includes('thank')) {
      response = `😊 You're welcome! Is there anything else you'd like to know about VeritasAI?`;
    }
    else if (text.includes('bye') || text.includes('goodbye')) {
      response = `👋 Goodbye! Feel free to come back if you have more questions. Have a great day!`;
    }
    else {
      response = `🤔 That's an interesting question! Here's what I can help you with:

• <strong>"How does it work?"</strong> - Learn about the architecture
• <strong>"Explain verdicts"</strong> - Understand the classification system
• <strong>"Security features"</strong> - Audit detection and lock system
• <strong>"Languages supported"</strong> - Multi-language capabilities
• <strong>"Image analysis"</strong> - How image uploads work
• <strong>"Voice input"</strong> - Speech-to-text features
• <strong>"How to analyze"</strong> - Step-by-step guide

Or ask about any specific feature you'd like to understand better!`;
    }

    // Add bot response with delay
    setTimeout(() => {
      const botMsg = {
        type: 'bot',
        text: response,
        timestamp: new Date()
      };

      this.messages.push(botMsg);
      this.renderMessages();
    }, 600);
  },

  // Render messages
  renderMessages() {
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';

    this.messages.forEach(msg => {
      const msgEl = document.createElement('div');
      msgEl.className = `chat-message ${msg.type}`;

      const time = msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      msgEl.innerHTML = `
        <div class="message-content">${msg.text}</div>
        <div class="message-timestamp">${time}</div>
      `;

      container.appendChild(msgEl);
    });

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
  }
};

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    AIAssistant.init();
  });
}
