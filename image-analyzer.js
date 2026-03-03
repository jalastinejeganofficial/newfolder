// VeritasAI - Image Analysis Module
// Analyzes images uploaded by users using AI vision capabilities

const ImageAnalyzer = {
  // Supported image formats
  SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  
  // Initialize image upload functionality
  init() {
    this.setupFileUpload();
    this.setupDragDrop();
    this.setupImagePreview();
  },
  
  // Setup file input
  setupFileUpload() {
    const fileInput = document.getElementById('imageUpload');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    }
  },
  
  // Setup drag and drop
  setupDragDrop() {
    const dropZone = document.querySelector('.input-area') || document.body;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, true);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, () => {
        dropZone.classList.add('drag-over');
      }, true);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, () => {
        dropZone.classList.remove('drag-over');
      }, true);
    });
    
    dropZone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.processFile(files[0]);
      }
    }, true);
  },
  
  // Setup image preview
  setupImagePreview() {
    const fileInput = document.getElementById('imageUpload');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.showPreview(file);
        }
      });
    }
  },
  
  // Handle file selection
  handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      this.processFile(file);
    }
  },
  
  // Process uploaded file
  async processFile(file) {
    // Validate file type
    if (!this.SUPPORTED_FORMATS.includes(file.type)) {
      this.showError('Please upload a valid image (JPEG, PNG, or WebP)');
      return;
    }
    
    // Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      this.showError('Image size must be less than 10MB');
      return;
    }
    
    // Show preview
    this.showPreview(file);
    
    // Auto-analyze after preview
    setTimeout(() => {
      this.analyzeImage(file);
    }, 500);
  },
  
  // Show image preview
  showPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      let previewContainer = document.getElementById('imagePreview');
      
      if (!previewContainer) {
        // Create preview container if it doesn't exist
        const inputArea = document.querySelector('.input-area');
        if (inputArea) {
          previewContainer = document.createElement('div');
          previewContainer.id = 'imagePreview';
          previewContainer.style.cssText = `
            display: none;
            margin: 16px 0;
            padding: 16px;
            background: rgba(124, 58, 237, 0.1);
            border: 1px solid rgba(124, 58, 237, 0.3);
            border-radius: 12px;
          `;
          inputArea.appendChild(previewContainer);
        }
      }
      
      previewContainer.style.display = 'block';
      previewContainer.innerHTML = `
        <div style="display: flex; gap: 12px; align-items: center;">
          <img src="${e.target.result}" style="max-width: 200px; max-height: 200px; border-radius: 8px; object-fit: contain;" />
          <div style="flex: 1;">
            <div style="font-weight: 600; margin-bottom: 8px;">${file.name}</div>
            <div style="font-size: 0.85rem; opacity: 0.8;">
              ${(file.size / 1024).toFixed(2)} KB
            </div>
            <button onclick="ImageAnalyzer.removePreview()" 
                    style="margin-top: 8px; padding: 6px 12px; background: rgba(239,68,68,0.2); color: #ef4444; border: none; border-radius: 6px; cursor: pointer;">
              Remove
            </button>
          </div>
        </div>
      `;
      
      // Store the file for later use
      this.currentFile = file;
      this.currentImageBase64 = e.target.result;
    };
    reader.readAsDataURL(file);
  },
  
  // Remove preview
  removePreview() {
    const preview = document.getElementById('imagePreview');
    if (preview) {
      preview.style.display = 'none';
      preview.innerHTML = '';
    }
    
    const fileInput = document.getElementById('imageUpload');
    if (fileInput) {
      fileInput.value = '';
    }
    
    this.currentFile = null;
    this.currentImageBase64 = null;
  },
  
  // Analyze image using AI
  async analyzeImage(file) {
    try {
      // Show loading state
      this.showLoadingState();
      
      // Convert to base64
      const base64Image = await this.fileToBase64(file);
      
      // Call vision API
      const result = await this.callVisionAPI(base64Image);
      
      // Display results
      this.displayImageAnalysis(result);
      
      // Hide loading
      this.hideLoadingState();
      
    } catch (error) {
      console.error('Image analysis error:', error);
      this.showError('Failed to analyze image: ' + error.message);
      this.hideLoadingState();
    }
  },
  
  // Convert file to base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
  
  // Call Vision API with fallback
  async callVisionAPI(base64Image) {
    const { API_KEY, API_URL, VISION_MODELS } = CONFIG;
    
    let lastError = null;
    
    // Try each vision model in order
    for (const model of VISION_MODELS) {
      try {
        console.log(`Trying vision model: ${model}`);
        
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
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `Analyze this image comprehensively as a fact-checking expert. Look for:
1. Any text visible in the image
2. Claims or statements shown
3. People, places, or events depicted
4. Context and setting
5. Potential manipulation or editing signs

Provide your analysis in this exact JSON format:
{
  "description": "Detailed description of what's in the image",
  "claims": [
    {
      "claim": "Specific claim extracted from image",
      "verdict": "TRUE|MISLEADING|FALSE|UNVERIFIABLE",
      "confidence": 0-100,
      "explanation": "Why this verdict",
      "evidence_sources": [{"title": "Source name", "url": "https://example.com"}],
      "bias_flags": [],
      "correction": "Correction if needed"
    }
  ],
  "overall_credibility": 0-100,
  "summary": "Overall assessment",
  "manipulation_detected": false,
  "context_analysis": "Contextual information"
}`
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: base64Image
                    }
                  }
                ]
              }
            ],
            temperature: 0.3,
            max_tokens: 3000
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMsg = errorData.error?.message || `API Error: ${response.status}`;
          console.warn(`Model ${model} failed:`, errorMsg);
          
          // Check if it's a "no endpoints" error
          if (errorMsg.includes('No endpoints') || errorMsg.includes('not a valid model')) {
            console.error(`Vision model ${model} does not support image input or is not available`);
          }
          
          throw new Error(errorMsg);
        }
        
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        console.log(`Successfully used model: ${model}`);
        
        // Parse JSON response
        try {
          // Extract JSON from response (might have markdown formatting)
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          const jsonString = jsonMatch ? jsonMatch[0] : content;
          return JSON.parse(jsonString);
        } catch (parseError) {
          console.error('Parse error:', parseError);
          throw new Error('Failed to parse AI response');
        }
        
      } catch (error) {
        console.warn(`Vision model ${model} failed:`, error.message);
        lastError = error;
        continue; // Try next model
      }
    }
    
    // If all models failed
    throw lastError || new Error('All vision models failed. Please try again.');
  },
  
  // Show loading state
  showLoadingState() {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'imageAnalysisLoading';
    loadingIndicator.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: rgba(124, 58, 237, 0.1);
      border: 1px solid rgba(124, 58, 237, 0.3);
      border-radius: 12px;
      margin: 16px 0;
    `;
    loadingIndicator.innerHTML = `
      <div class="loading-spinner" style="animation: spin 1s linear infinite;">⟳</div>
      <div>
        <div style="font-weight: 600;">Analyzing image...</div>
        <div style="font-size: 0.85rem; opacity: 0.8;">AI is examining visual content, text, and context</div>
      </div>
    `;
    
    const preview = document.getElementById('imagePreview');
    if (preview) {
      preview.appendChild(loadingIndicator);
    }
  },
  
  // Hide loading state
  hideLoadingState() {
    const loading = document.getElementById('imageAnalysisLoading');
    if (loading) {
      loading.remove();
    }
  },
  
  // Display image analysis results
  displayImageAnalysis(result) {
    // Trigger the main app's display function
    if (typeof displayResults === 'function') {
      displayResults(result);
    }
    
    // Show success message
    if (typeof showToast === 'function') {
      showToast('Image analyzed successfully!', '🖼️');
    }
  },
  
  // Show error message
  showError(message) {
    if (typeof showError === 'function') {
      showError(message);
    } else {
      alert(message);
    }
  }
};

// Initialize on page load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    ImageAnalyzer.init();
  });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageAnalyzer;
}
