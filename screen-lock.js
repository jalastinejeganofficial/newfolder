// VeritasAI - Screen Lock Security Feature
// Locks screen when audit-related keywords are detected

const ScreenLock = {
  // Comprehensive audit keywords that trigger lock
  AUDIT_KEYWORDS: [
    // Audit-related terms
    'audit',
    'auditing',
    'audited',
    'auditor',
    'auditors',
    'audit trail',
    'audit log',
    'audit report',
    'audit committee',
    'audit firm',
    'audit process',
    'audit procedure',
    'audit evidence',
    'audit finding',
    'audit observation',
    'audit recommendation',
    
    // Compliance and regulatory terms
    'compliance audit',
    'regulatory audit',
    'internal audit',
    'external audit',
    'financial audit',
    'operational audit',
    'performance audit',
    'forensic audit',
    'tax audit',
    'irs audit',
    'statutory audit',
    'independent audit',
    'management audit',
    'environmental audit',
    'social audit',
    'technical audit',
    'security audit',
    'it audit',
    'information systems audit',
    'quality audit',
    'risk audit',
    'due diligence',
    'inspection',
    'investigation',
    'review process',
    'accountability',
    'transparency',
    'governance',
    'oversight',
    'scrutiny',
    'examination',
    'assessment',
    'evaluation',
    'verification',
    'validation'
  ],
  
  // Lock durations
  LOCK_TIMES: {
    FIRST_OFFENSE: 60000,        // 1 minute
    SECOND_OFFENSE: 300000,      // 5 minutes
    THIRD_OFFENSE: 86400000      // 1 day (24 hours)
  },
  
  // State
  isLocked: false,
  lockTimer: null,
  unlockTime: null,
  offenseCount: 0,
  lastLockTime: null,
  currentLockDuration: 60000,
  
  // Initialize screen lock monitoring
  init() {
    this.setupTextMonitoring();
    this.checkPersistentLock(); // Check if lock should persist after refresh
    console.log('Screen Lock initialized');
  },
  
  // Check for persistent lock state (survives page refresh)
  checkPersistentLock() {
    try {
      const lockData = localStorage.getItem('veritasai_lock_state');
      
      if (lockData) {
        const parsed = JSON.parse(lockData);
        const now = Date.now();
        
        // Check if lock time has expired
        if (parsed.unlockTime && now < parsed.unlockTime) {
          console.log('Persistent lock detected! Remaining time:', 
            Math.round((parsed.unlockTime - now) / 1000), 'seconds');
          
          // Restore lock state
          this.isLocked = true;
          this.unlockTime = parsed.unlockTime;
          this.offenseCount = parsed.offenseCount || 1;
          this.currentLockDuration = parsed.duration || 60000;
          this.lastLockTime = parsed.lastLockTime || now;
          
          // Re-create lock overlay immediately
          setTimeout(() => {
            this.createLockOverlay(['audit content detected'], true);
            this.startCountdown();
            this.enableMaximumSecurity();
          }, 500); // Small delay to ensure DOM is ready
        } else if (parsed.unlockTime && now >= parsed.unlockTime) {
          // Lock expired, clear it
          console.log('Lock expired, clearing state');
          localStorage.removeItem('veritasai_lock_state');
          this.offenseCount = 0; // Reset on successful completion
        }
      }
    } catch (error) {
      console.error('Error checking persistent lock:', error);
    }
  },
  
  // Save lock state to localStorage (persists through refresh)
  saveLockState() {
    try {
      const lockState = {
        isLocked: this.isLocked,
        unlockTime: this.unlockTime,
        offenseCount: this.offenseCount,
        duration: this.currentLockDuration,
        lastLockTime: this.lastLockTime,
        timestamp: Date.now()
      };
      
      localStorage.setItem('veritasai_lock_state', JSON.stringify(lockState));
      console.log('Lock state saved to localStorage');
    } catch (error) {
      console.error('Failed to save lock state:', error);
    }
  },
  
  // Clear lock state from localStorage
  clearLockState() {
    try {
      localStorage.removeItem('veritasai_lock_state');
      console.log('Lock state cleared from localStorage');
    } catch (error) {
      console.error('Failed to clear lock state:', error);
    }
  },
  
  // Monitor text input for audit keywords
  setupTextMonitoring() {
    const inputText = document.getElementById('inputText');
    if (!inputText) {
      console.warn('ScreenLock: inputText element not found');
      return;
    }
    
    // Check on input
    inputText.addEventListener('input', (e) => {
      const text = e.target.value.toLowerCase();
      this.checkForAuditKeywords(text);
    });
    
    // Also check on paste
    inputText.addEventListener('paste', (e) => {
      setTimeout(() => {
        const text = inputText.value.toLowerCase();
        this.checkForAuditKeywords(text);
      }, 100);
    });
  },
  
  // Check if text contains audit keywords
  checkForAuditKeywords(text) {
    if (this.isLocked) return;
    
    const foundKeywords = this.AUDIT_KEYWORDS.filter(keyword => 
      text.includes(keyword.toLowerCase())
    );
    
    if (foundKeywords.length > 0) {
      console.log('Audit keywords detected:', foundKeywords);
      this.incrementOffenseAndLock(foundKeywords);
    }
  },
  
  // Increment offense count and apply appropriate lock
  incrementOffenseAndLock(keywords) {
    const now = Date.now();
    
    // Reset offense count if more than 1 hour since last offense
    if (this.lastLockTime && (now - this.lastLockTime) > 3600000) {
      this.offenseCount = 0;
      console.log('Offense count reset (time elapsed > 1 hour)');
    }
    
    this.offenseCount++;
    this.lastLockTime = now;
    
    // Determine lock duration based on offense count
    if (this.offenseCount === 1) {
      this.currentLockDuration = this.LOCK_TIMES.FIRST_OFFENSE;
      console.log('First offense - 1 minute lock');
    } else if (this.offenseCount === 2) {
      this.currentLockDuration = this.LOCK_TIMES.SECOND_OFFENSE;
      console.log('Second offense - 5 minute lock');
    } else {
      this.currentLockDuration = this.LOCK_TIMES.THIRD_OFFENSE;
      console.log('Third+ offense - 1 day lock');
    }
    
    this.triggerLock(keywords);
  },
  
  // Trigger screen lock
  triggerLock(keywords) {
    this.isLocked = true;
    this.unlockTime = Date.now() + this.currentLockDuration;
    
    const durationInMinutes = Math.round(this.currentLockDuration / 60000);
    const durationText = durationInMinutes >= 1440 
      ? `${Math.round(durationInMinutes / 1440)} day(s)` 
      : `${durationInMinutes} minute(s)`;
    
    console.log(`Screen locked for ${durationText} due to audit keywords:`, keywords);
    console.log(`Offense count: ${this.offenseCount}`);
    
    // CRITICAL: Save lock state to localStorage (persists through refresh)
    this.saveLockState();
    
    // Create lock overlay
    this.createLockOverlay(keywords);
    
    // Start countdown timer
    this.startCountdown();
    
    // Enable maximum security mode
    this.enableMaximumSecurity();
    
    // Log security event
    if (typeof Logger !== 'undefined') {
      Logger.analytics('security_lock', {
        action: 'screen_locked',
        keywords: keywords,
        timestamp: new Date().toISOString(),
        duration: this.currentLockDuration,
        offenseCount: this.offenseCount,
        persistent: true
      });
    }
  },
  
  // Enable maximum security measures
  enableMaximumSecurity() {
    // Disable right-click
    document.addEventListener('contextmenu', this.preventContextMenu, true);
    
    // Disable keyboard shortcuts
    document.addEventListener('keydown', this.preventKeyboardShortcuts, true);
    
    // Disable text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    
    // Disable developer tools attempts
    this.detectDevTools();
    
    // Prevent window focus loss
    window.addEventListener('blur', this.preventWindowSwitch, true);
  },
  
  // Disable maximum security measures
  disableMaximumSecurity() {
    // Re-enable right-click
    document.removeEventListener('contextmenu', this.preventContextMenu, true);
    
    // Re-enable keyboard shortcuts
    document.removeEventListener('keydown', this.preventKeyboardShortcuts, true);
    
    // Re-enable text selection
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    document.body.style.mozUserSelect = '';
    
    // Stop devtools detection
    if (this.devToolsInterval) {
      clearInterval(this.devToolsInterval);
    }
    
    // Remove window blur listener
    window.removeEventListener('blur', this.preventWindowSwitch, true);
  },
  
  // Prevent context menu (right-click)
  preventContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  },
  
  // Prevent keyboard shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, etc.)
  preventKeyboardShortcuts(e) {
    // Block F12
    if (e.key === 'F12') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Block Ctrl+Shift+I (DevTools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Block Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Block Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Block Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'U') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Block Ctrl+S (Save Page)
    if (e.ctrlKey && e.key === 'S') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Block Alt+Ctrl+I
    if (e.altKey && e.ctrlKey && e.key === 'I') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  },
  
  // Detect developer tools
  detectDevTools() {
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;
    
    this.devToolsInterval = setInterval(() => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      
      // Detect if DevTools is opened (significant size change)
      if (Math.abs(currentWidth - lastWidth) > 50 || Math.abs(currentHeight - lastHeight) > 50) {
        console.warn('DevTools detection: Window resize detected');
        showToast('Developer tools are disabled during lock', '⚠️');
        lastWidth = currentWidth;
        lastHeight = currentHeight;
      }
      
      // Additional detection methods
      if (this.isDevToolsOpen()) {
        console.warn('DevTools detected');
      }
    }, 500);
  },
  
  // Check if DevTools is open
  isDevToolsOpen() {
    const threshold = 160;
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    
    return widthDiff > threshold || heightDiff > threshold;
  },
  
  // Prevent window switch
  preventWindowSwitch(e) {
    e.preventDefault();
    window.focus();
    return false;
  },
  
  // Create lock screen overlay
  createLockOverlay(keywords) {
    // Remove existing overlay if any
    const existing = document.getElementById('screen-lock-overlay');
    if (existing) existing.remove();
    
    // Calculate duration display
    const durationInMinutes = Math.round(this.currentLockDuration / 60000);
    const durationText = durationInMinutes >= 1440 
      ? `${Math.round(durationInMinutes / 1440)} day(s)` 
      : `${durationInMinutes} minute(s)`;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'screen-lock-overlay';
    overlay.className = 'screen-lock-overlay';
    
    overlay.innerHTML = `
      <div class="lock-container">
        <div class="lock-icon">🔒</div>
        <h2 class="lock-title">Screen Locked - Audit Context Detected</h2>
        
        <div class="lock-message">
          <p><strong>Audit-related content detected:</strong></p>
          <div class="detected-keywords">
            ${keywords.map(k => `<span class="keyword-tag">${k}</span>`).join('')}
          </div>
        </div>
        
        <div class="offense-indicator">
          <div class="offense-level">Offense Level: ${this.offenseCount}</div>
          <div class="offense-warning">
            ${this.offenseCount === 1 ? '⚠️ First Warning' : ''}
            ${this.offenseCount === 2 ? '⚠️⚠️ Second Warning - Extended Lock' : ''}
            ${this.offenseCount >= 3 ? '🚨 Maximum Security Lock Activated' : ''}
          </div>
        </div>
        
        <div class="lock-timer-section">
          <div class="timer-label">Unlocking in:</div>
          <div class="countdown-timer" id="lock-countdown">${Math.round(this.currentLockDuration / 1000)}</div>
          <div class="timer-unit">seconds (${durationText})</div>
        </div>
        
        <div class="lock-progress-bar-wrap">
          <div class="lock-progress-bar"></div>
        </div>
        
        <div class="lock-info">
          <div class="info-box">
            <div class="info-icon">ℹ️</div>
            <div class="info-text">
              <p>This screen is temporarily locked due to detection of audit-related content.</p>
              <p>The screen will automatically unlock after the countdown completes.</p>
              <p style="margin-top: 12px; font-weight: 600; color: #ef4444;">⛔ Developer tools, inspect element, and keyboard shortcuts are disabled during lock.</p>
            </div>
          </div>
        </div>
        
        <div class="lock-footer">
          <div class="security-notice">
            🔒 Maximum Security Mode Active | 
            ⏱️ Auto-unlock: <span id="unlock-time"></span>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Prevent interaction with page content
    document.body.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'none';
    
    // Set unlock time display
    const unlockDate = new Date(this.unlockTime);
    document.getElementById('unlock-time').textContent = 
      unlockDate.toLocaleTimeString();
  },
  
  // Start countdown timer
  startCountdown() {
    const countdownEl = document.getElementById('lock-countdown');
    if (!countdownEl) return;
    
    this.lockTimer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((this.unlockTime - Date.now()) / 1000));
      
      if (countdownEl) {
        countdownEl.textContent = remaining;
      }
      
      // Update progress bar
      this.updateProgressBar(remaining);
      
      // Check if time is up
      if (remaining <= 0) {
        this.unlock();
      }
    }, 1000);
  },
  
  // Update progress bar
  updateProgressBar(remaining) {
    const progressBar = document.querySelector('.lock-progress-bar');
    if (!progressBar) return;
    
    const percentage = (remaining / (this.currentLockDuration / 1000)) * 100;
    progressBar.style.width = `${percentage}%`;
  },
  
  // Unlock screen
  unlock() {
    clearInterval(this.lockTimer);
    this.isLocked = false;
    this.unlockTime = null;
    
    // CRITICAL: Clear persistent lock state
    this.clearLockState();
    
    // Disable maximum security
    this.disableMaximumSecurity();
    
    // Remove overlay
    const overlay = document.getElementById('screen-lock-overlay');
    if (overlay) {
      overlay.remove();
    }
    
    // Restore body styles
    document.body.style.overflow = '';
    document.body.style.pointerEvents = '';
    
    console.log('Screen unlocked');
    
    // Log unlock event
    if (typeof Logger !== 'undefined') {
      Logger.analytics('security_unlock', {
        action: 'screen_unlocked',
        timestamp: new Date().toISOString()
      });
    }
    
    // Show unlock notification
    showToast('Screen unlocked - You can now continue using the application', '🔓');
  },
  
  // Manual override (for testing/emergency)
  forceUnlock() {
    if (confirm('Are you sure you want to manually override the security lock?')) {
      this.unlock();
      showToast('Manual override - Screen unlocked', '⚠️');
    }
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScreenLock;
}
