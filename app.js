// VeritasAI — Main Application Logic

// ===== STATE MANAGEMENT =====
let analysisHistory = [];
let currentAnalysis = null;

// ===== GLOBAL LANGUAGE FUNCTION =====
window.changeLanguage = function(languageCode) {
  I18N.setLanguage(languageCode);
  
  // Update language selector
  const selector = document.getElementById('languageSelector');
  if (selector) {
    selector.value = languageCode;
  }
  
  // Save to storage
  StorageManager.saveLanguage(languageCode);
  
  // Re-render sample pills
  initSamplePills();
  
  // Show toast notification
  showToast(I18N.t('toast.done'), '🌍');
};

// ===== DOM ELEMENTS =====
const elements = {
  inputText: document.getElementById('inputText'),
  charCount: document.getElementById('charCount'),
  analyzeBtn: document.getElementById('analyzeBtn'),
  clearBtn: document.getElementById('clearBtn'),
  loadingCard: document.getElementById('loadingCard'),
  loadingState: document.getElementById('loadingState'),
  errorCard: document.getElementById('errorCard'),
  errorMessage: document.getElementById('errorMessage'),
  resultsSection: document.getElementById('resultsSection'),
  overallScore: document.getElementById('overallScore'),
  overallSummary: document.getElementById('overallSummary'),
  overallTitle: document.getElementById('overallTitle'),
  ringFill: document.getElementById('ringFill'),
  claimsList: document.getElementById('claimsList'),
  claimCount: document.getElementById('claimCount'),
  historyList: document.getElementById('historyList'),
  samplePills: document.getElementById('samplePills'),
  toast: document.getElementById('toast'),
  toastMsg: document.getElementById('toastMsg'),
  toastIcon: document.getElementById('toastIcon')
};

// ===== SAMPLE DATA =====
const samples = [
  "The moon landing was faked in 1969.",
  "Vaccines cause autism in children.",
  "Climate change is a hoax created by scientists.",
  "Drinking bleach can cure diseases.",
  "The earth is flat and NASA is hiding the truth."
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize storage and i18n systems
  StorageManager.init();
  I18N.init();
  
  // Load saved language and set selector
  const savedLanguage = StorageManager.getLanguage();
  const selector = document.getElementById('languageSelector');
  if (selector) {
    selector.value = savedLanguage;
  }
  
  // Load history from storage
  loadHistoryFromStorage();
  
  // Initialize UI
  initSamplePills();
  initCharCounter();
  initImageUpload();
  initAnalyzeButton();
  initClearButton();
  
  console.log('VeritasAI initialized with language:', savedLanguage);
});

// ===== SAMPLE PILLS =====
function initSamplePills() {
  elements.samplePills.innerHTML = samples.map(sample => 
    `<button class="sample-pill" onclick="useSample('${escapeHtml(sample)}')">${escapeHtml(sample.substring(0, 50))}...</button>`
  ).join('');
}

function useSample(text) {
  elements.inputText.value = text;
  updateCharCount();
  showToast(I18N.t('toast.sampleLoaded'), '📋');
}

// ===== CHARACTER COUNTER =====
function initCharCounter() {
  elements.inputText.addEventListener('input', updateCharCount);
}

function updateCharCount() {
  const count = elements.inputText.value.length;
  elements.charCount.textContent = count;
  
  if (count > 3800) {
    elements.charCount.style.color = 'var(--false-color)';
  } else if (count > 3500) {
    elements.charCount.style.color = 'var(--miss-color)';
  } else {
    elements.charCount.style.color = 'var(--text-muted)';
  }
}

// ===== IMAGE UPLOAD HANDLER =====
let uploadedImageBase64 = null;

function initImageUpload() {
  const imageUpload = document.getElementById('imageUpload');
  const imagePreview = document.getElementById('imagePreview');
  const previewImg = document.getElementById('previewImg');
  const removeBtn = document.getElementById('removeImage');
  
  if (!imageUpload || !imagePreview) {
    Logger.warn('Image upload elements not found in DOM');
    return;
  }
  
  // Handle file selection
  imageUpload.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    Logger.info('Image selected', { 
      fileName: file.name, 
      fileSize: file.size,
      fileType: file.type 
    });
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', '⚠️');
      Logger.warn('Invalid file type selected', { type: file.type });
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image size must be less than 10MB', '⚠️');
      Logger.warn('Image too large', { size: file.size });
      return;
    }
    
    try {
      // Read and convert to base64
      const base64 = await readFileAsBase64(file);
      uploadedImageBase64 = base64;
      
      // Show preview
      previewImg.src = base64;
      imagePreview.style.display = 'block';
      
      Logger.info('Image loaded successfully', { 
        base64Length: base64.length,
        previewDisplayed: true 
      });
      
      // Auto-analyze after brief delay
      setTimeout(() => {
        analyzeImage(base64);
      }, 500);
      
    } catch (error) {
      Logger.error('Failed to read image', { error: error.message });
      showToast('Failed to load image. Please try again.', '❌');
    }
  });
  
  // Remove image
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      uploadedImageBase64 = null;
      imagePreview.style.display = 'none';
      previewImg.src = '';
      imageUpload.value = '';
      Logger.info('Image removed by user');
      showToast('Image removed', '🗑️');
    });
  }
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

async function analyzeImage(base64Image) {
  Logger.info('Starting image analysis', { 
    imageLength: base64Image.length,
    agent: MultiAgentSystem.getCurrentAgent().name 
  });
  
  // Show loading state
  showLoading();
  
  try {
    // Call vision API through ImageAnalyzer
    const result = await ImageAnalyzer.analyzeImage(base64Image);
    
    Logger.analytics('image_analysis_completed', {
      claimsCount: result.claims?.length || 0,
      overallCredibility: result.overall_credibility,
      processingTime: result.processing_time
    });
    
    // Display results
    currentAnalysis = result;
    displayResults(result);
    hideLoading();
    
    // Save to history
    saveToHistory(result);
    
    Logger.info('Image analysis completed successfully', {
      verdict: result.overall_credibility,
      claimsAnalyzed: result.claims?.length
    });
    
  } catch (error) {
    Logger.error('Image analysis failed', { 
      error: error.message, 
      stack: error.stack 
    });
    showError(`Failed to analyze image: ${error.message}`);
    hideLoading();
  }
}

// ===== CLEAR INPUT =====
function clearInput() {
  elements.inputText.value = '';
  updateCharCount();
  hideResults();
  hideError();
  showToast(I18N.t('toast.inputCleared'), '🗑️');
  Logger.info('Input cleared by user');
}

// ===== ANALYZE BUTTON INITIALIZATION =====
function initAnalyzeButton() {
  if (!elements.analyzeBtn) {
    console.error('ERROR: Analyze button element not found!');
    return;
  }
  
  elements.analyzeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    analyzeContent();
  });
  
  // Also support Enter key (Ctrl+Enter or Cmd+Enter)
  elements.inputText.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (elements.inputText.value.trim().length > 0) {
        analyzeContent();
      }
    }
  });
}

// ===== CLEAR BUTTON INITIALIZATION =====
function initClearButton() {
  if (!elements.clearBtn) {
    Logger.warn('Clear button element not found');
    return;
  }
  
  // Remove inline onclick and add proper event listener
  elements.clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    clearInput();
  });
  
  Logger.info('Clear button initialized');
}

// ===== ANALYZE CONTENT =====
async function analyzeContent() {
  const text = elements.inputText.value.trim();
  
  if (!text) {
    showError(I18N.t('error.pleaseEnterText'));
    return;
  }
  
  if (text.length < 10) {
    showError(I18N.t('error.minCharacters'));
    return;
  }
  
  // UI State: Loading
  showLoading();
  hideError();
  hideResults();
  disableAnalyzeButton(true);
  
  try {
    // Call API
    const result = await callLLMAPI(text);
    
    // Display results
    displayResults(result);
    
    // Add to history
    addToHistory(text, result);
    
    showToast(I18N.t('toast.analysisComplete'), '✅');
  } catch (error) {
    console.error('Analysis error:', error);
    showError(error.message || I18N.t('error.analysisFailedMsg'));
  } finally {
    hideLoading();
    disableAnalyzeButton(false);
  }
}

// ===== API CALL =====
async function callLLMAPI(text) {
  const { API_KEY, API_URL, MODEL, SYSTEM_PROMPT } = CONFIG;
  
  // List of fallback models
  const modelsToTry = [
    MODEL,
    "meta-llama/llama-3-8b-instruct",
    "meta-llama/llama-3.1-8b-instruct",
    "mistralai/mistral-7b-instruct"
  ];
  
  let lastError = null;
  
  for (const model of modelsToTry) {
    try {
      console.log(`Trying model: ${model}`);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': CONFIG.SITE_URL,
          'X-Title': CONFIG.SITE_NAME
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `Analyze this text:\n\n${text}` }
          ],
          temperature: 0.3,
          max_tokens: 3000
        })
      });
      
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(
          errorData.error?.message || 
          `API Error: ${response.status} ${response.statusText}`
        );
      }
      
      const data = await response.json();
      
      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error('Invalid response from API');
      }
      
      // Parse the JSON response
      try {
        const content = data.choices[0].message.content;
        const parsed = JSON.parse(content);
        
        if (!parsed.claims || !Array.isArray(parsed.claims)) {
          throw new Error('API did not return valid claims structure');
        }
        
        console.log(`Successfully used model: ${model}`);
        return parsed;
      } catch (parseError) {
        console.error('Parse error:', parseError);
        console.log('Raw response:', data.choices[0].message.content);
        throw new Error('Failed to parse AI response. Please try again.');
      }
    } catch (error) {
      console.warn(`Model ${model} failed:`, error.message);
      lastError = error;
      continue; // Try next model
    }
  }
  
  // If all models failed
  throw lastError || new Error('All AI models failed. Please try again later.');
}

// ===== DISPLAY RESULTS WITH ENHANCED ANIMATIONS AND AUDIO =====
function displayResults(data) {
  console.log('DEBUG: displayResults called with data:', JSON.stringify(data, null, 2));
  
  if (!data) {
    console.error('ERROR: No data provided to displayResults');
    showError('No analysis results received from API');
    return;
  }
  
  currentAnalysis = data;
  
  // Check if required elements exist
  console.log('DEBUG: Checking DOM elements...');
  const elementStatus = {
    overallScore: !!elements.overallScore,
    overallSummary: !!elements.overallSummary,
    claimsList: !!elements.claimsList,
    resultsSection: !!elements.resultsSection,
    ringFill: !!elements.ringFill,
    claimCount: !!elements.claimCount
  };
  console.log('DEBUG: Element status:', elementStatus);
  
  // Overall credibility score with animation
  const overallCredibility = data.overall_credibility || 0;
  console.log('DEBUG: Overall credibility:', overallCredibility);
  
  try {
    // Animate the score counting up
    if (elements.overallScore) {
      animateValue(elements.overallScore, 0, overallCredibility, 1500);
      console.log('DEBUG: Score animation started');
    }
    
    if (elements.overallSummary) {
      elements.overallSummary.textContent = data.summary || 'No summary provided';
      console.log('DEBUG: Summary set:', data.summary?.substring(0, 50));
    }
    
    // Update ring fill
    if (elements.ringFill) {
      const circumference = 283;
      const offset = circumference - (overallCredibility / 100) * circumference;
      elements.ringFill.style.strokeDasharray = circumference;
      elements.ringFill.style.strokeDashoffset = offset;
      
      let ringColor = '#ef4444';
      if (overallCredibility >= 75) ringColor = '#22c55e';
      else if (overallCredibility >= 50) ringColor = '#f59e0b';
      else if (overallCredibility >= 25) ringColor = '#6366f1';
      
      elements.ringFill.style.stroke = ringColor;
      console.log('DEBUG: Ring updated with color:', ringColor);
    }
    
    // Claims list
    if (data.claims && Array.isArray(data.claims)) {
      console.log('DEBUG: Rendering', data.claims.length, 'claims');
      renderClaims(data.claims);
    } else {
      console.error('ERROR: No claims array in data');
    }
    
    // Update claim count
    if (elements.claimCount) {
      animateValue(elements.claimCount, 0, data.claims.length, 1000, ' claims analyzed');
    }
    
    // Show results section
    if (elements.resultsSection) {
      elements.resultsSection.classList.add('visible');
      console.log('DEBUG: Results section made visible');
      
      setTimeout(() => {
        const claimCards = document.querySelectorAll('.claim-card');
        console.log('DEBUG: Found', claimCards.length, 'claim cards');
        
        if (typeof VisualEffects !== 'undefined') {
          VisualEffects.staggeredFadeIn(claimCards, 150);
        }
        
        addTextToSpeechButtons();
      }, 300);
    }
    
    // Scroll to results
    setTimeout(() => {
      if (elements.resultsSection) {
        elements.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    
    // Auto-speak
    const autoSpeak = localStorage.getItem('veritasai_auto_speak') === 'true';
    if (autoSpeak && typeof TextToSpeech !== 'undefined') {
      setTimeout(() => {
        TextToSpeech.speakResults(data);
      }, 1000);
    }
    
    console.log('DEBUG: displayResults completed successfully');
    
  } catch (error) {
    console.error('CRITICAL ERROR in displayResults:', error);
    console.error('Stack:', error.stack);
    showError('Failed to display results: ' + error.message);
  }
}

function renderClaims(claims) {
  elements.claimsList.innerHTML = claims.map((claim, index) => {
    const verdictConfig = CONFIG.VERDICT_CONFIG[claim.verdict] || CONFIG.VERDICT_CONFIG.UNVERIFIABLE;
    const confidencePercent = claim.confidence || 0;
    const hasEvidenceSources = claim.evidence_sources && claim.evidence_sources.length > 0;
    const hasImageSuggestions = claim.image_suggestions;
    
    return `
      <div class="claim-card" id="claim-${index}" onclick="toggleClaim(${index})">
        <div class="claim-header claim-left-bar-${claim.verdict}">
          <div class="verdict-badge verdict-${claim.verdict}">
            <span class="verdict-icon">${verdictConfig.icon}</span>
            <span>${verdictConfig.label}</span>
          </div>
          <div class="claim-text">${escapeHtml(claim.claim)}</div>
          <div class="confidence-mini">
            <div class="confidence-mini-val" style="color:${getConfidenceColor(confidencePercent)}">${confidencePercent}%</div>
            <div class="confidence-mini-label">Confidence</div>
          </div>
          <div class="claim-expand-icon">▼</div>
        </div>
        
        <div class="claim-detail">
          <div class="claim-detail-inner">
            <!-- Enhanced Confidence Section -->
            <div>
              <div class="detail-section-title">⚡ Confidence Level: ${getConfidenceLabel(confidencePercent)}</div>
              <div class="confidence-bar-wrap">
                <div class="confidence-bar-track">
                  <div class="confidence-bar-fill" 
                       style="width:0%;background:${getConfidenceColor(confidencePercent)}" 
                       data-width="${confidencePercent}"></div>
                </div>
              </div>
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:6px;text-align:center;">
                ${getConfidenceDescription(confidencePercent)}
              </div>
            </div>
            
            <!-- Detailed Explanation -->
            <div>
              <div class="detail-section-title">💡 Detailed Analysis</div>
              <div class="explanation-text">${escapeHtml(claim.explanation || 'No explanation provided')}</div>
            </div>
            
            <!-- Correction (if not TRUE) -->
            ${claim.correction ? `
              <div>
                <div class="detail-section-title">✅ Fact-Based Correction</div>
                <div class="correction-box">
                  <div class="correction-icon">✓</div>
                  <div class="correction-text">${escapeHtml(claim.correction)}</div>
                </div>
              </div>
            ` : ''}
            
            <!-- Evidence Sources -->
            ${hasEvidenceSources ? `
              <div>
                <div class="detail-section-title">📚 Evidence Sources</div>
                <div class="evidence-sources">
                  ${claim.evidence_sources.map((source, idx) => `
                    <div class="evidence-source-item source-type-${source.type}">
                      <div class="evidence-source-icon">${getSourceIcon(source.type)}</div>
                      <div class="evidence-source-content">
                        <div class="evidence-source-title">${escapeHtml(source.title)}</div>
                        ${source.url ? `<a href="${source.url}" target="_blank" rel="noopener noreferrer" class="evidence-source-link">Visit Source →</a>` : ''}
                        <div class="evidence-source-type">${formatSourceType(source.type)}</div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            
            <!-- Step-by-Step Reasoning -->
            ${claim.reasoning_steps && claim.reasoning_steps.length > 0 ? `
              <div>
                <div class="detail-section-title">🔍 Step-by-Step Reasoning Process</div>
                <div class="reasoning-steps">
                  ${claim.reasoning_steps.map((step, i) => `
                    <div class="reasoning-step">
                      <div class="step-num">${i + 1}</div>
                      <div class="step-text">${escapeHtml(step)}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            
            <!-- Bias Flags -->
            <div>
              <div class="detail-section-title">🏷️ Detected Bias & Rhetorical Devices</div>
              ${claim.bias_flags && claim.bias_flags.length > 0 ? `
                <div class="bias-tags">
                  ${claim.bias_flags.map(flag => `
                    <span class="bias-tag" title="${getBiasDescription(flag)}">${formatBiasFlag(flag)}</span>
                  `).join('')}
                </div>
              ` : '<div class="no-bias">✓ No significant bias detected</div>'}
            </div>
            
            <!-- Image Suggestions -->
            ${hasImageSuggestions ? `
              <div>
                <div class="detail-section-title">🖼️ Suggested Visual Evidence</div>
                <div class="image-suggestion-box">
                  <div class="image-suggestion-description">
                    <strong>Suggested:</strong> ${escapeHtml(claim.image_suggestions.description || 'Relevant diagram or image')}
                  </div>
                  ${claim.image_suggestions.search_terms ? `
                    <div class="image-search-terms">
                      <span class="icon">🔍</span>
                      <span>Search terms: <code>${escapeHtml(claim.image_suggestions.search_terms)}</code></span>
                    </div>
                  ` : ''}
                  ${claim.image_suggestions.trusted_sources ? `
                    <div class="image-trusted-sources">
                      <span class="icon">✓</span>
                      <span>Trusted sources: ${claim.image_suggestions.trusted_sources.join(', ')}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}
            
            <!-- Assumptions -->
            ${claim.assumptions && claim.assumptions.length > 0 ? `
              <div class="detail-chips assumptions">
                <div class="detail-section-title">📌 Assumptions Made in Analysis</div>
                ${claim.assumptions.map(asmpt => `
                  <div class="detail-chip">
                    <div class="detail-chip-dot"></div>
                    <span>${escapeHtml(asmpt)}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            <!-- Limitations -->
            ${claim.limitations && claim.limitations.length > 0 ? `
              <div class="detail-chips limitations">
                <div class="detail-section-title">⚠️ Analysis Limitations</div>
                ${claim.limitations.map(limit => `
                  <div class="detail-chip">
                    <div class="detail-chip-dot"></div>
                    <span>${escapeHtml(limit)}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            <!-- Methodology Note -->
            <div style="margin-top:16px;padding:14px;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:8px;">
              <div style="font-size:0.75rem;color:#818cf8;line-height:1.6;">
                <strong>📋 Methodology:</strong> This analysis uses AI-powered evidence-based reasoning with structured fact-checking protocols. Confidence scores reflect certainty levels based on available evidence and source credibility.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Animate confidence bars after render
  setTimeout(() => {
    document.querySelectorAll('.confidence-bar-fill').forEach(bar => {
      bar.style.width = bar.getAttribute('data-width') + '%';
    });
  }, 100);
}

function toggleClaim(index) {
  const claimCard = document.getElementById(`claim-${index}`);
  const isExpanded = claimCard.classList.contains('expanded');
  
  // Close all other claims
  document.querySelectorAll('.claim-card').forEach(card => {
    card.classList.remove('expanded');
  });
  
  // Toggle clicked claim
  if (!isExpanded) {
    claimCard.classList.add('expanded');
  }
}

// ===== HISTORY MANAGEMENT =====
function loadHistoryFromStorage() {
  const savedHistory = StorageManager.getHistory();
  if (savedHistory && savedHistory.length > 0) {
    analysisHistory = savedHistory;
    renderHistory();
  }
}

function addToHistory(inputText, result) {
  const item = {
    id: Date.now(),
    text: inputText.substring(0, 80) + (inputText.length > 80 ? '...' : ''),
    credibility: result.overall_credibility,
    claims: result.claims.length,
    timestamp: new Date(),
    // Store full data for caching
    fullData: result,
    inputText: inputText
  };
  
  // Add to in-memory array
  analysisHistory.unshift(item);
  
  // Keep only last 50 items in memory
  if (analysisHistory.length > 50) {
    analysisHistory = analysisHistory.slice(0, 50);
  }
  
  // Save to localStorage
  StorageManager.addToHistory({
    text: item.text,
    credibility: item.credibility,
    claims: item.claims,
    timestamp: item.timestamp.toISOString(),
    fullData: item.fullData,
    inputText: item.inputText
  });
  
  // Cache the analysis result
  StorageManager.cacheAnalysisResult(inputText, result);
  
  renderHistory();
}

function renderHistory() {
  if (analysisHistory.length === 0) {
    elements.historyList.innerHTML = '<div class="history-empty">No analyses yet. Run your first check above!</div>';
    return;
  }
  
  elements.historyList.innerHTML = analysisHistory.map(item => {
    let scoreColor = '#ef4444';
    if (item.credibility >= 75) scoreColor = '#22c55e';
    else if (item.credibility >= 50) scoreColor = '#f59e0b';
    else if (item.credibility >= 25) scoreColor = '#6366f1';
    
    return `
      <div class="history-item" onclick="loadHistoryItem(${item.id})">
        <div class="history-item-text">${escapeHtml(item.text)}</div>
        <div class="history-item-meta">
          <div class="history-item-score" style="color:${scoreColor}">
            Credibility: ${item.credibility}% · ${item.claims} claim${item.claims !== 1 ? 's' : ''}
          </div>
          <div class="history-item-time">${formatTime(item.timestamp)}</div>
        </div>
      </div>
    `;
  }).join('');
}

function loadHistoryItem(id) {
  // Try to get from storage first
  const savedItem = StorageManager.getHistoryItem(id);
  
  if (savedItem) {
    // Use cached full data if available
    if (savedItem.fullData && savedItem.inputText) {
      elements.inputText.value = savedItem.inputText;
      updateCharCount();
      displayResults(savedItem.fullData);
      showToast(I18N.t('toast.historyLoaded'), '📜');
    } else {
      // Fallback to old format
      elements.inputText.value = savedItem.text;
      updateCharCount();
      showToast(I18N.t('toast.historyLoaded'), '📜');
    }
  } else {
    // Try in-memory history
    const item = analysisHistory.find(i => i.id === id);
    if (!item) return;
    
    elements.inputText.value = item.text;
    updateCharCount();
    showToast(I18N.t('toast.historyLoaded'), '📜');
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== UTILITY FUNCTIONS =====
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatBiasFlag(flag) {
  return flag
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getBiasDescription(flag) {
  const descriptions = {
    emotional_language: 'Uses emotionally charged words to influence opinion',
    selective_framing: 'Presents only one perspective while ignoring others',
    cherry_picking: 'Selects only evidence that supports a predetermined conclusion',
    false_equivalence: 'Treats unequal positions as equally valid',
    appeal_to_fear: 'Uses fear or anxiety to persuade rather than evidence',
    overgeneralization: 'Makes broad claims based on limited examples',
    causal_oversimplification: 'Reduces complex causes to a single factor',
    confirmation_bias: 'Appeals to preexisting beliefs without critical examination'
  };
  return descriptions[flag] || 'Potential bias detected';
}

function getConfidenceColor(confidence) {
  if (confidence >= 90) return '#22c55e'; // Green - very high
  if (confidence >= 70) return '#4ade80'; // Light green - high
  if (confidence >= 50) return '#f59e0b'; // Orange - moderate
  if (confidence >= 30) return '#fb923c'; // Light orange - low
  return '#ef4444'; // Red - very low
}

function getConfidenceLabel(confidence) {
  if (confidence >= 90) return 'Very High Confidence';
  if (confidence >= 70) return 'High Confidence';
  if (confidence >= 50) return 'Moderate Confidence';
  if (confidence >= 30) return 'Low Confidence';
  return 'Very Low Confidence';
}

function getConfidenceDescription(confidence) {
  if (confidence >= 90) return 'Strong consensus with multiple credible sources supporting this verdict';
  if (confidence >= 70) return 'Substantial evidence available with minor uncertainties';
  if (confidence >= 50) return 'Some evidence exists but notable uncertainties remain';
  if (confidence >= 30) return 'Limited evidence available with significant uncertainty';
  return 'Highly speculative with minimal supporting evidence';
}

function getSourceIcon(type) {
  const icons = {
    news: '📰',
    academic: '🎓',
    government: '🏛️',
    factcheck: '✓'
  };
  return icons[type] || '📄';
}

function formatSourceType(type) {
  const types = {
    news: 'News Organization',
    academic: 'Academic/Research',
    government: 'Government Source',
    factcheck: 'Fact-Checking Organization'
  };
  return types[type] || type;
}

function formatTime(date) {
  // Ensure date is a Date object
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diff = Math.floor((now - dateObj) / 1000); // seconds
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return dateObj.toLocaleDateString();
}

function showLoading() {
  elements.loadingCard.style.display = 'block';
  elements.loadingState.classList.add('active');
  
  // Show loading steps animation
  const steps = ['Extracting claims...', 'Evaluating evidence...', 'Detecting bias...', 'Generating report...'];
  const container = document.getElementById('loadingSteps');
  container.innerHTML = '';
  
  steps.forEach((step, index) => {
    setTimeout(() => {
      const stepEl = document.createElement('div');
      stepEl.className = 'loading-step';
      stepEl.innerHTML = `
        <div class="loading-step-dot"></div>
        <span>${step}</span>
      `;
      container.appendChild(stepEl);
      
      // Activate previous step
      if (index > 0) {
        container.children[index - 1].classList.add('active');
      }
    }, index * 800);
  });
}

function hideLoading() {
  elements.loadingCard.style.display = 'none';
  elements.loadingState.classList.remove('active');
  document.getElementById('loadingSteps').innerHTML = '';
}

function showError(message) {
  elements.errorMessage.textContent = message;
  elements.errorCard.classList.add('visible');
  elements.errorCard.style.display = 'block';
}

function hideError() {
  elements.errorCard.classList.remove('visible');
  elements.errorCard.style.display = 'none';
}

function hideResults() {
  elements.resultsSection.classList.remove('visible');
  currentAnalysis = null;
}

function disableAnalyzeButton(disabled) {
  elements.analyzeBtn.disabled = disabled;
  elements.clearBtn.disabled = disabled;
}

function showToast(message, icon = '✅') {
  elements.toastMsg.textContent = message;
  elements.toastIcon.textContent = icon;
  elements.toast.classList.add('show');
  
  setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 3000);
}

// ===== EXPORT REPORT =====
function exportReport() {
  if (!currentAnalysis) {
    showError('No analysis to export');
    return;
  }
  
  const report = generateReportText();
  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `veritasai-report-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  
  showToast(I18N.t('toast.reportExported'), '📄');
}

function generateReportText() {
  if (!currentAnalysis) return '';
  
  let report = 'VERITASAI - ENHANCED FACT-CHECKING REPORT\n';
  report += '=' .repeat(60) + '\n\n';
  report += `Generated: ${new Date().toLocaleString()}\n`;
  report += `Overall Credibility Score: ${currentAnalysis.overall_credibility}%\n`;
  report += `Summary: ${currentAnalysis.summary}\n`;
  report += `Methodology: ${currentAnalysis.methodology_notes || 'AI-powered evidence-based reasoning'}\n\n`;
  report += '=' .repeat(60) + '\n';
  report += 'DETAILED CLAIM ANALYSIS\n';
  report += '=' .repeat(60) + '\n\n';
  
  currentAnalysis.claims.forEach((claim, i) => {
    const verdictConfig = CONFIG.VERDICT_CONFIG[claim.verdict] || CONFIG.VERDICT_CONFIG.UNVERIFIABLE;
    
    report += `CLAIM ${i + 1}: ${claim.claim}\n`;
    report += '-'.repeat(50) + '\n';
    report += `Verdict: ${verdictConfig.label} (${claim.verdict})\n`;
    report += `Confidence: ${claim.confidence}% (${getConfidenceLabel(claim.confidence)})\n`;
    report += `Explanation: ${claim.explanation}\n\n`;
    
    if (claim.correction) {
      report += `CORRECTION: ${claim.correction}\n\n`;
    }
    
    if (claim.evidence_sources && claim.evidence_sources.length > 0) {
      report += 'EVIDENCE SOURCES:\n';
      claim.evidence_sources.forEach((source, idx) => {
        report += `  ${idx + 1}. [${formatSourceType(source.type)}] ${source.title}`;
        if (source.url) report += ` - ${source.url}`;
        report += '\n';
      });
      report += '\n';
    }
    
    if (claim.reasoning_steps && claim.reasoning_steps.length > 0) {
      report += 'STEP-BY-STEP REASONING:\n';
      claim.reasoning_steps.forEach((step, idx) => {
        report += `  Step ${idx + 1}: ${step}\n`;
      });
      report += '\n';
    }
    
    if (claim.bias_flags && claim.bias_flags.length > 0) {
      report += 'DETECTED BIASES:\n';
      claim.bias_flags.forEach(flag => {
        report += `  - ${formatBiasFlag(flag)} (${getBiasDescription(flag)})\n`;
      });
      report += '\n';
    } else {
      report += 'BIAS DETECTION: No significant biases detected ✓\n\n';
    }
    
    if (claim.image_suggestions) {
      report += 'SUGGESTED VISUAL EVIDENCE:\n';
      report += `  Description: ${claim.image_suggestions.description || 'N/A'}\n`;
      if (claim.image_suggestions.search_terms) {
        report += `  Search Terms: ${claim.image_suggestions.search_terms}\n`;
      }
      if (claim.image_suggestions.trusted_sources) {
        report += `  Trusted Sources: ${claim.image_suggestions.trusted_sources.join(', ')}\n`;
      }
      report += '\n';
    }
    
    if (claim.assumptions && claim.assumptions.length > 0) {
      report += 'ASSUMPTIONS MADE:\n';
      claim.assumptions.forEach(assumption => {
        report += `  - ${assumption}\n`;
      });
      report += '\n';
    }
    
    if (claim.limitations && claim.limitations.length > 0) {
      report += 'ANALYSIS LIMITATIONS:\n';
      claim.limitations.forEach(limitation => {
        report += `  - ${limitation}\n`;
      });
      report += '\n';
    }
    
    report += '\n' + '=' .repeat(50) + '\n\n';
  });
  
  report += '\nDISCLAIMER:\n';
  report += 'This AI-generated analysis is for informational purposes only. \n';
  report += 'Always verify with primary sources and consult subject matter experts \n';
  report += 'for critical decisions. Confidence scores reflect model certainty, not absolute truth.\n\n';
  
  report += '=' .repeat(60) + '\n';
  report += 'End of Report\n';
  
  return report;
}

// ===== HELPER FUNCTIONS =====

// Animate value counting up
function animateValue(element, start, end, duration = 1000, suffix = '') {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current) + suffix;
  }, 16);
}

// Add text-to-speech buttons to claims
function addTextToSpeechButtons() {
  const claimCards = document.querySelectorAll('.claim-card');
  
  claimCards.forEach((card, index) => {
    // Check if button already exists
    if (card.querySelector('.speak-btn')) return;
    
    const header = card.querySelector('.claim-header');
    if (!header) return;
    
    // Create speak button
    const speakBtn = document.createElement('button');
    speakBtn.className = 'speak-claim-btn';
    speakBtn.innerHTML = '🔊';
    speakBtn.style.cssText = `
      padding: 6px 12px;
      background: rgba(37,99,235,0.1);
      border: 1px solid rgba(37,99,235,0.3);
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      margin-left: auto;
      transition: all 0.3s;
    `;
    
    speakBtn.onmouseover = () => {
      speakBtn.style.background = 'rgba(37,99,235,0.2)';
      speakBtn.style.transform = 'scale(1.05)';
    };
    
    speakBtn.onmouseout = () => {
      speakBtn.style.background = 'rgba(37,99,235,0.1)';
      speakBtn.style.transform = '';
    };
    
    speakBtn.onclick = (e) => {
      e.stopPropagation();
      
      // Get claim text
      const claimText = currentAnalysis.claims[index].claim;
      const explanation = currentAnalysis.claims[index].explanation || '';
      const verdict = currentAnalysis.claims[index].verdict;
      
      // Build speech text
      const lang = localStorage.getItem('veritasai_language') || 'en';
      const t = I18N.translations[lang] || I18N.translations.en;
      
      let speechText = `${claimText}. `;
      speechText += `${t.verdicts[verdict] || verdict}. `;
      if (explanation) {
        speechText += `${explanation.substring(0, 200)}`;
      }
      
      TextToSpeech.speakText(speechText);
    };
    
    header.appendChild(speakBtn);
  });
}

// ===== NEW ANALYSIS =====
function newAnalysis() {
  elements.inputText.value = '';
  updateCharCount();
  hideResults();
  hideError();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast(I18N.t('toast.readyForNew'), '🔄');
}
