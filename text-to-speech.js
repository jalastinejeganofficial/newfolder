// VeritasAI - Multi-Language Text-to-Speech Module
// Converts analysis results to spoken audio in user's language

const TextToSpeech = {
  // Supported languages (matches i18n)
  SUPPORTED_LANGUAGES: {
    'en': 'en-US',
    'ta': 'ta-IN',
    'hi': 'hi-IN',
    'te': 'te-IN',
    'ja': 'ja-JP'
  },
  
  // State
  isSpeaking: false,
  synthesis: null,
  currentUtterance: null,
  
  // Initialize speech synthesis
  init() {
    // Check browser support
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return false;
    }
    
    this.synthesis = window.speechSynthesis;
    return true;
  },
  
  // Speak analysis results
  speakResults(analysisResult) {
    if (!this.init()) {
      this.showError('Text-to-speech not supported in this browser');
      return;
    }
    
    // Cancel any ongoing speech
    this.stop();
    
    // Get current language
    const lang = localStorage.getItem('veritasai_language') || 'en';
    const voiceLang = this.SUPPORTED_LANGUAGES[lang] || 'en-US';
    
    // Build speech text from analysis
    const speechText = this.buildSpeechText(analysisResult, lang);
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = voiceLang;
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Event handlers
    utterance.onstart = () => {
      this.isSpeaking = true;
      this.updateSpeakingUI(true);
    };
    
    utterance.onend = () => {
      this.isSpeaking = false;
      this.updateSpeakingUI(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.isSpeaking = false;
      this.updateSpeakingUI(false);
    };
    
    // Start speaking
    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
  },
  
  // Build natural speech text from analysis
  buildSpeechText(analysis, lang) {
    const t = I18N.translations[lang] || I18N.translations.en;
    
    let speech = '';
    
    // Opening
    speech += `${t.results.overallAssessment || 'Overall Assessment'}. `;
    
    // Overall credibility
    speech += `${t.results.credibility || 'Credibility'}: ${analysis.overall_credibility}%. `;
    
    // Summary
    if (analysis.summary) {
      speech += `${analysis.summary}. `;
    }
    
    // Claims summary
    speech += `${analysis.claims.length} ${analysis.claims.length === 1 ? 'claim' : 'claims'} analyzed. `;
    
    // First claim details
    if (analysis.claims.length > 0) {
      const firstClaim = analysis.claims[0];
      
      speech += `${t.claimAnalysis || 'Claim Analysis'}: `;
      speech += `${firstClaim.claim.substring(0, 100)}. `;
      
      // Verdict
      const verdictLabel = t.verdicts[firstClaim.verdict] || firstClaim.verdict;
      speech += `Verdict: ${verdictLabel}. `;
      
      // Confidence
      speech += `${t.confidence.high || 'Confidence'}: ${firstClaim.confidence}%. `;
      
      // Brief explanation
      if (firstClaim.explanation) {
        speech += `${firstClaim.explanation.substring(0, 150)}. `;
      }
    }
    
    // More claims indicator
    if (analysis.claims.length > 1) {
      speech += `And ${analysis.claims.length - 1} more ${analysis.claims.length - 1 === 1 ? 'claim' : 'claims'}. `;
    }
    
    // Closing
    speech += `${t.toast.analysisComplete || 'Analysis complete'}.`;
    
    return speech;
  },
  
  // Speak custom text
  speakText(text) {
    if (!this.init()) {
      this.showError('Text-to-speech not supported');
      return;
    }
    
    this.stop();
    
    const lang = localStorage.getItem('veritasai_language') || 'en';
    const voiceLang = this.SUPPORTED_LANGUAGES[lang] || 'en-US';
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLang;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => {
      this.isSpeaking = true;
    };
    
    utterance.onend = () => {
      this.isSpeaking = false;
    };
    
    this.synthesis.speak(utterance);
  },
  
  // Stop speaking
  stop() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeaking = false;
      this.updateSpeakingUI(false);
    }
  },
  
  // Toggle speaking
  toggle(text) {
    if (this.isSpeaking) {
      this.stop();
    } else {
      this.speakText(text);
    }
  },
  
  // Update UI based on speaking state
  updateSpeakingUI(isSpeaking) {
    const speakButtons = document.querySelectorAll('.speak-btn');
    
    speakButtons.forEach(btn => {
      if (isSpeaking && btn.classList.contains('active-speaker')) {
        btn.innerHTML = '<span class="pulsing-dot" style="color: #ef4444;">●</span> Stop';
        btn.style.background = 'linear-gradient(135deg, #ef4444, #f59e0b)';
      } else {
        btn.innerHTML = '🔊 Read Aloud';
        btn.style.background = 'linear-gradient(135deg, #2563eb, #7c3aed)';
      }
    });
  },
  
  // Add speak button to element
  addSpeakButton(container, textToSpeak) {
    if (!container) return;
    
    const speakBtn = document.createElement('button');
    speakBtn.className = 'speak-btn';
    speakBtn.innerHTML = '🔊 Read Aloud';
    speakBtn.style.cssText = `
      padding: 8px 16px;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      margin-top: 12px;
      transition: all 0.3s;
    `;
    
    speakBtn.onmouseover = () => {
      if (!this.isSpeaking) {
        speakBtn.style.transform = 'translateY(-2px)';
        speakBtn.style.boxShadow = '0 4px 12px rgba(37,99,235,0.3)';
      }
    };
    
    speakBtn.onmouseout = () => {
      speakBtn.style.transform = '';
      speakBtn.style.boxShadow = '';
    };
    
    speakBtn.onclick = (e) => {
      e.stopPropagation();
      
      if (this.isSpeaking) {
        this.stop();
      } else {
        // Mark as active speaker
        document.querySelectorAll('.speak-btn').forEach(b => b.classList.remove('active-speaker'));
        speakBtn.classList.add('active-speaker');
        
        if (typeof textToSpeak === 'string') {
          this.speakText(textToSpeak);
        } else {
          this.speakResults(textToSpeak);
        }
      }
    };
    
    container.appendChild(speakBtn);
  },
  
  // Show error
  showError(message) {
    if (typeof showError === 'function') {
      showError(message);
    } else {
      console.error(message);
    }
  },
  
  // Get available voices
  getVoices() {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  },
  
  // List available voices for debugging
  listVoices() {
    const voices = this.getVoices();
    console.log('Available voices:', voices.map(v => ({
      name: v.name,
      lang: v.lang,
      default: v.default,
      localService: v.localService
    })));
    return voices;
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TextToSpeech;
}
