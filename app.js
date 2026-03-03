// VeritasAI — Main Application Logic

// ===== STATE MANAGEMENT =====
let analysisHistory = [];
let currentAnalysis = null;

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
  initSamplePills();
  initCharCounter();
  console.log('VeritasAI initialized');
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
  showToast('Sample loaded', '📋');
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

// ===== CLEAR INPUT =====
function clearInput() {
  elements.inputText.value = '';
  updateCharCount();
  hideResults();
  hideError();
  showToast('Input cleared', '🗑️');
}

// ===== ANALYZE CONTENT =====
async function analyzeContent() {
  const text = elements.inputText.value.trim();
  
  if (!text) {
    showError('Please enter some text to analyze');
    return;
  }
  
  if (text.length < 10) {
    showError('Please enter at least 10 characters');
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
    
    // Process and display results
    displayResults(result);
    
    // Add to history
    addToHistory(text, result);
    
    showToast('Analysis complete!', '✅');
  } catch (error) {
    console.error('Analysis error:', error);
    showError(error.message || 'Failed to analyze content. Please try again.');
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
          max_tokens: 2000
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
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

// ===== DISPLAY RESULTS =====
function displayResults(data) {
  currentAnalysis = data;
  
  // Overall credibility score
  const overallCredibility = data.overall_credibility || 0;
  elements.overallScore.textContent = overallCredibility;
  elements.overallSummary.textContent = data.summary || '';
  
  // Update ring fill (circumference = 2 * PI * 45 ≈ 283)
  const circumference = 283;
  const offset = circumference - (overallCredibility / 100) * circumference;
  elements.ringFill.style.strokeDasharray = circumference;
  elements.ringFill.style.strokeDashoffset = offset;
  
  // Set ring color based on score
  let ringColor = '#ef4444'; // false
  if (overallCredibility >= 75) ringColor = '#22c55e'; // true
  else if (overallCredibility >= 50) ringColor = '#f59e0b'; // misleading
  else if (overallCredibility >= 25) ringColor = '#6366f1'; // unverifiable
  
  elements.ringFill.style.stroke = ringColor;
  
  // Claims list
  renderClaims(data.claims);
  
  // Update claim count
  elements.claimCount.textContent = `${data.claims.length} claim${data.claims.length !== 1 ? 's' : ''} analyzed`;
  
  // Show results section
  elements.resultsSection.classList.add('visible');
  
  // Scroll to results
  setTimeout(() => {
    elements.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
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
function addToHistory(inputText, result) {
  const item = {
    id: Date.now(),
    text: inputText.substring(0, 80) + (inputText.length > 80 ? '...' : ''),
    credibility: result.overall_credibility,
    claims: result.claims.length,
    timestamp: new Date()
  };
  
  analysisHistory.unshift(item);
  
  // Keep only last 10 items
  if (analysisHistory.length > 10) {
    analysisHistory = analysisHistory.slice(0, 10);
  }
  
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
  const item = analysisHistory.find(i => i.id === id);
  if (!item) return;
  
  elements.inputText.value = item.text;
  updateCharCount();
  showToast('History item loaded', '📜');
  
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
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
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
  
  showToast('Report exported!', '📄');
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

// ===== NEW ANALYSIS =====
function newAnalysis() {
  elements.inputText.value = '';
  updateCharCount();
  hideResults();
  hideError();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast('Ready for new analysis', '🔄');
}
