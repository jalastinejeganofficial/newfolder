// VeritasAI - Advanced Skeleton Loading & Animation System
// Creates engaging, informative loading states with real-time progress updates

const SkeletonLoader = {
  // Configuration
  animations: {
    pulse: 'pulse-animation',
    shimmer: 'shimmer-animation',
    slide: 'slide-animation',
    fade: 'fade-animation'
  },
  
  // ===== SKELETON STRUCTURES =====
  
  // Main analysis skeleton
  createAnalysisSkeleton() {
    const container = document.createElement('div');
    container.className = 'skeleton-container';
    container.innerHTML = `
      <div class="skeleton-card header-skeleton">
        <div class="skeleton-shape rectangle large"></div>
        <div class="skeleton-shape rectangle medium"></div>
      </div>
      
      <div class="skeleton-progress-bar">
        <div class="progress-fill" id="analysis-progress"></div>
      </div>
      
      <div class="loading-status-text" id="loading-status">
        <span class="pulsing-dot">●</span>
        <span class="status-text">Initializing analysis...</span>
      </div>
      
      <div class="skeleton-grid">
        <div class="skeleton-item claim-skeleton">
          <div class="skeleton-shape circle small"></div>
          <div class="skeleton-shape rectangle full"></div>
          <div class="skeleton-shapes-group">
            <div class="skeleton-shape rectangle short"></div>
            <div class="skeleton-shape rectangle short"></div>
          </div>
        </div>
        
        <div class="skeleton-item evidence-skeleton">
          <div class="skeleton-shape rectangle medium"></div>
          <div class="skeleton-shapes-stack">
            <div class="skeleton-shape line"></div>
            <div class="skeleton-shape line"></div>
            <div class="skeleton-shape line"></div>
          </div>
        </div>
      </div>
      
      <div class="skeleton-footer">
        <div class="skeleton-shape pill"></div>
        <div class="skeleton-shape pill"></div>
      </div>
    `;
    
    return container;
  },
  
  // Claim card skeleton
  createClaimSkeleton(index = 0) {
    return `
      <div class="skeleton-claim-card" style="animation-delay: ${index * 100}ms">
        <div class="skeleton-claim-header">
          <div class="skeleton-verdict-badge"></div>
          <div class="skeleton-confidence-score"></div>
        </div>
        <div class="skeleton-claim-text">
          <div class="skeleton-line long"></div>
          <div class="skeleton-line medium"></div>
        </div>
        <div class="skeleton-claim-body">
          <div class="skeleton-section">
            <div class="skeleton-label"></div>
            <div class="skeleton-lines">
              <div class="skeleton-line full"></div>
              <div class="skeleton-line full"></div>
              <div class="skeleton-line three-quarters"></div>
            </div>
          </div>
          <div class="skeleton-section">
            <div class="skeleton-label short"></div>
            <div class="skeleton-sources">
              <div class="skeleton-source-item"></div>
              <div class="skeleton-source-item"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  
  // Sidebar history skeleton
  createHistorySkeleton() {
    return `
      <div class="skeleton-history-item">
        <div class="skeleton-history-icon"></div>
        <div class="skeleton-history-content">
          <div class="skeleton-line three-quarters"></div>
          <div class="skeleton-line half"></div>
        </div>
      </div>
    `;
  },
  
  // Stats cards skeleton
  createStatsSkeleton() {
    return `
      <div class="skeleton-stat-card">
        <div class="skeleton-stat-icon"></div>
        <div class="skeleton-stat-value"></div>
        <div class="skeleton-stat-label"></div>
      </div>
    `;
  }
};

// ===== LOADING STATUS MANAGER =====

const LoadingManager = {
  currentStage: 0,
  stages: [
    { text: 'Initializing analysis...', duration: 800 },
    { text: 'Extracting claims from text...', duration: 1500 },
    { text: 'Searching evidence databases...', duration: 2000 },
    { text: 'Verifying source credibility...', duration: 1500 },
    { text: 'Detecting bias and manipulation...', duration: 1200 },
    { text: 'Calculating confidence scores...', duration: 1000 },
    { text: 'Generating structured explanations...', duration: 1500 },
    { text: 'Compiling final report...', duration: 800 },
    { text: 'Finalizing results...', duration: 500 }
  ],
  
  startLoading() {
    this.currentStage = 0;
    this.updateStatus();
    this.startProgressAnimation();
    this.startStageRotation();
  },
  
  updateStatus() {
    const statusEl = document.getElementById('loading-status');
    if (statusEl && this.stages[this.currentStage]) {
      const stage = this.stages[this.currentStage];
      statusEl.innerHTML = `
        <span class="pulsing-dot">●</span>
        <span class="status-text">${stage.text}</span>
        <span class="loading-spinner">⟳</span>
      `;
    }
  },
  
  startStageRotation() {
    const rotateStage = () => {
      if (this.currentStage < this.stages.length - 1) {
        setTimeout(() => {
          this.currentStage++;
          this.updateStatus();
          this.updateProgressBar();
          rotateStage();
        }, this.stages[this.currentStage].duration);
      }
    };
    rotateStage();
  },
  
  startProgressAnimation() {
    const progressBar = document.getElementById('analysis-progress');
    if (progressBar) {
      let progress = 0;
      const totalDuration = this.stages.reduce((sum, stage) => sum + stage.duration, 0);
      const interval = 50;
      const increment = 100 / (totalDuration / interval);
      
      const progressInterval = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
        }
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('data-progress', Math.round(progress));
      }, interval);
    }
  },
  
  updateProgressBar() {
    const progressBar = document.getElementById('analysis-progress');
    if (progressBar) {
      const progress = ((this.currentStage + 1) / this.stages.length) * 100;
      progressBar.style.width = `${progress}%`;
    }
  },
  
  stopLoading() {
    const progressBar = document.getElementById('analysis-progress');
    const statusEl = document.getElementById('loading-status');
    
    if (progressBar) {
      progressBar.style.width = '100%';
      progressBar.classList.add('complete');
    }
    
    if (statusEl) {
      statusEl.innerHTML = '<span class="success-checkmark">✓</span><span class="status-text">Analysis complete!</span>';
      statusEl.classList.add('success');
    }
    
    setTimeout(() => {
      if (progressBar) progressBar.classList.remove('complete');
      if (statusEl) {
        statusEl.classList.remove('success');
        statusEl.innerHTML = '';
      }
    }, 1000);
  }
};

// ===== ADVANCED VISUAL EFFECTS =====

const VisualEffects = {
  // Particle background effect
  createParticles(container) {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'loading-particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: rgba(124, 58, 237, ${Math.random() * 0.5 + 0.3});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: particle-float ${Math.random() * 3 + 2}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
        pointer-events: none;
      `;
      container.appendChild(particle);
    }
  },
  
  // Ripple effect on click
  createRipple(element, event) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-expand 0.6s ease-out;
      pointer-events: none;
    `;
    
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  },
  
  // Typewriter effect for text
  typeWriter(text, element, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    type();
  },
  
  // Fade in elements sequentially
  staggeredFadeIn(elements, delay = 100) {
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.5s ease-out';
      
      setTimeout(() => {
        el.style.opacity = '1';
      }, index * delay);
    });
  }
};

// ===== AI ANALYSIS VISUALIZER =====

const AnalysisVisualizer = {
  // Animated brain/network visualization
  createNeuralNetwork(container) {
    const canvas = document.createElement('canvas');
    canvas.id = 'neural-network-canvas';
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    `;
    container.style.position = 'relative';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    
    const nodes = [];
    const connections = [];
    
    // Create nodes
    for (let i = 0; i < 15; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 2,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    
    // Animate
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 58, 237, ${node.opacity})`;
        ctx.fill();
      });
      
      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[j].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${1 - distance / 150})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    return canvas;
  },
  
  // Real-time analysis metrics
  createMetricsDisplay(container) {
    const metrics = document.createElement('div');
    metrics.className = 'analysis-metrics';
    metrics.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
      padding: 16px;
      background: rgba(124, 58, 237, 0.1);
      border-radius: 12px;
      margin: 16px 0;
    `;
    
    const metricItems = [
      { label: 'Claims Found', value: '...', icon: '📝' },
      { label: 'Sources Checked', value: '...', icon: '📚' },
      { label: 'Bias Detected', value: '...', icon: '⚖️' },
      { label: 'Confidence', value: '...', icon: '💯' }
    ];
    
    metricItems.forEach((metric, index) => {
      const item = document.createElement('div');
      item.className = 'metric-item';
      item.style.cssText = `
        text-align: center;
        padding: 12px;
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
        animation: metric-pulse 2s ease-in-out infinite;
        animation-delay: ${index * 0.3}s;
      `;
      
      item.innerHTML = `
        <div style="font-size: 1.5rem; margin-bottom: 4px;">${metric.icon}</div>
        <div class="metric-value" style="font-size: 1.5rem; font-weight: bold; color: #7c3aed;">${metric.value}</div>
        <div style="font-size: 0.85rem; opacity: 0.8;">${metric.label}</div>
      `;
      
      metrics.appendChild(item);
    });
    
    container.appendChild(metrics);
  },
  
  // Update metrics dynamically
  updateMetrics(container, data) {
    const metricValues = container.querySelectorAll('.metric-value');
    if (metricValues[0]) this.animateValue(metricValues[0], data.claims || 0);
    if (metricValues[1]) this.animateValue(metricValues[1], data.sources || 0);
    if (metricValues[2]) metricValues[2].textContent = data.bias || 'None';
    if (metricValues[3]) this.animateValue(metricValues[3], data.confidence || 0, '%');
  },
  
  // Animate numbers counting up
  animateValue(element, target, suffix = '', duration = 1000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + suffix;
    }, 16);
  }
};

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SkeletonLoader,
    LoadingManager,
    VisualEffects,
    AnalysisVisualizer
  };
}
