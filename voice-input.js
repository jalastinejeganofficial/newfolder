// VeritasAI - AI Voice Input Module
// Speech-to-text with multi-language support for hands-free analysis

const VoiceInput = {
  // Supported languages (matches i18n)
  SUPPORTED_LANGUAGES: {
    'en': 'en-US',
    'ta': 'ta-IN',
    'hi': 'hi-IN',
    'te': 'te-IN',
    'ja': 'ja-JP'
  },
  
  // State
  isListening: false,
  recognition: null,
  finalTranscript: '',
  
  // Initialize speech recognition
  init() {
    // Check browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      this.showUnsupported();
      return false;
    }
    
    // Create recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configure recognition
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.getCurrentLanguage();
    
    // Setup event handlers
    this.recognition.onstart = () => this.onSpeechStart();
    this.recognition.onend = () => this.onSpeechEnd();
    this.recognition.onresult = (event) => this.onSpeechResult(event);
    this.recognition.onerror = (event) => this.onSpeechError(event);
    
    return true;
  },
  
  // Get current language from app
  getCurrentLanguage() {
    const savedLang = localStorage.getItem('veritasai_language') || 'en';
    return this.SUPPORTED_LANGUAGES[savedLang] || 'en-US';
  },
  
  // Start listening
  start() {
    if (!this.recognition) {
      if (!this.init()) return;
    }
    
    try {
      this.finalTranscript = '';
      this.recognition.start();
      this.isListening = true;
      this.updateUI();
    } catch (error) {
      console.error('Failed to start voice input:', error);
      this.showError('Failed to start voice recognition');
    }
  },
  
  // Stop listening
  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.updateUI();
    }
  },
  
  // Toggle listening
  toggle() {
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  },
  
  // Speech started
  onSpeechStart() {
    console.log('Voice input started');
    this.showStatus('Listening... Speak now');
  },
  
  // Speech ended
  onSpeechEnd() {
    console.log('Voice input ended');
    this.isListening = false;
    this.hideStatus();
    this.updateUI();
    
    // Process final transcript
    if (this.finalTranscript.trim().length > 0) {
      this.processTranscript(this.finalTranscript);
    }
  },
  
  // Speech results received
  onSpeechResult(event) {
    let interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      
      if (event.results[i].isFinal) {
        this.finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }
    
    // Update status with interim results
    if (interimTranscript) {
      this.showStatus(`Hearing: "${interimTranscript}"`);
    }
    
    console.log('Speech result:', {
      final: this.finalTranscript,
      interim: interimTranscript
    });
  },
  
  // Speech error
  onSpeechError(event) {
    console.error('Speech recognition error:', event.error);
    this.isListening = false;
    this.hideStatus();
    this.updateUI();
    
    if (event.error === 'no-speech') {
      this.showError('No speech detected. Please try again.');
    } else if (event.error === 'audio-capture') {
      this.showError('No microphone found. Please check permissions.');
    } else if (event.error === 'not-allowed') {
      this.showError('Microphone permission denied. Please enable in browser settings.');
    } else {
      this.showError('Voice input error: ' + event.error);
    }
  },
  
  // Process transcript and populate text area
  processTranscript(transcript) {
    const textarea = document.getElementById('inputText');
    if (textarea) {
      // Append to existing text or replace
      const currentText = textarea.value.trim();
      if (currentText) {
        textarea.value = currentText + ' ' + transcript;
      } else {
        textarea.value = transcript;
      }
      
      // Update character count
      if (typeof updateCharCount === 'function') {
        updateCharCount();
      }
      
      // Show success message
      if (typeof showToast === 'function') {
        showToast('Voice input added!', '🎤');
      }
      
      // Auto-analyze if text is long enough
      if (transcript.trim().length >= 50) {
        setTimeout(() => {
          if (confirm('Analyze spoken text now?')) {
            if (typeof analyzeContent === 'function') {
              analyzeContent();
            }
          }
        }, 500);
      }
    }
  },
  
  // Update UI based on state
  updateUI() {
    const btn = document.getElementById('voiceInputBtn');
    const btnText = document.getElementById('voiceBtnText');
    
    if (!btn) return;
    
    if (this.isListening) {
      btn.style.background = 'linear-gradient(135deg, #ef4444, #f59e0b)';
      btnText.textContent = 'Stop Speaking';
      btn.innerHTML = '<span class="pulsing-dot" style="color: white;">●</span> ' + btnText.textContent;
    } else {
      btn.style.background = 'linear-gradient(135deg, #2563eb, #7c3aed)';
      btnText.textContent = 'Start Speaking';
      btn.innerHTML = '🎤 ' + btnText.textContent;
    }
  },
  
  // Show status message
  showStatus(message) {
    const status = document.getElementById('voiceStatus');
    const statusText = document.getElementById('voiceStatusText');
    
    if (status && statusText) {
      status.style.display = 'block';
      statusText.textContent = message;
    }
  },
  
  // Hide status message
  hideStatus() {
    const status = document.getElementById('voiceStatus');
    if (status) {
      status.style.display = 'none';
    }
  },
  
  // Show error
  showError(message) {
    if (typeof showError === 'function') {
      showError(message);
    } else {
      alert(message);
    }
  },
  
  // Show unsupported message
  showUnsupported() {
    const section = document.querySelector('.voice-input-section');
    if (section) {
      section.innerHTML = `
        <div style="text-align: center; padding: 20px; opacity: 0.6;">
          <span style="font-size: 2rem;">🚫</span>
          <div style="margin-top: 12px;">Voice input not supported in this browser</div>
          <div style="font-size: 0.85rem; margin-top: 8px;">Please use Chrome, Edge, or Safari</div>
        </div>
      `;
    }
  }
};

// Global toggle function
function toggleVoiceInput() {
  VoiceInput.toggle();
}

// Initialize on page load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    VoiceInput.init();
  });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VoiceInput;
}
