// VeritasAI — localStorage Integration System

const StorageManager = {
  // Storage keys
  KEYS: {
    LANGUAGE: 'veritasai_language',
    PREFERENCES: 'veritasai_preferences',
    HISTORY: 'veritasai_history',
    CACHE: 'veritasai_cache',
    THEME: 'veritasai_theme',
    SETTINGS: 'veritasai_settings'
  },

  // Initialize storage system
  init() {
    console.log('StorageManager initialized');
    this.migrateOldData();
  },

  // Migrate old data format to new format
  migrateOldData() {
    try {
      // Check if old history format exists
      const oldHistory = localStorage.getItem('analysisHistory');
      if (oldHistory) {
        try {
          const parsed = JSON.parse(oldHistory);
          this.saveHistory(parsed);
          localStorage.removeItem('analysisHistory'); // Remove old format
          console.log('Migrated old history data to new format');
        } catch (e) {
          console.error('Failed to migrate old history:', e);
        }
      }
    } catch (error) {
      console.error('Migration error:', error);
    }
  },

  // ===== LANGUAGE MANAGEMENT =====
  
  saveLanguage(languageCode) {
    try {
      localStorage.setItem(this.KEYS.LANGUAGE, languageCode);
      return true;
    } catch (error) {
      console.error('Failed to save language:', error);
      return false;
    }
  },

  getLanguage() {
    try {
      return localStorage.getItem(this.KEYS.LANGUAGE) || 'en';
    } catch (error) {
      console.error('Failed to get language:', error);
      return 'en';
    }
  },

  // ===== PREFERENCES MANAGEMENT =====
  
  savePreferences(preferences) {
    try {
      const existing = this.getPreferences();
      const merged = { ...existing, ...preferences };
      localStorage.setItem(this.KEYS.PREFERENCES, JSON.stringify(merged));
      return true;
    } catch (error) {
      console.error('Failed to save preferences:', error);
      return false;
    }
  },

  getPreferences() {
    try {
      const data = localStorage.getItem(this.KEYS.PREFERENCES);
      return data ? JSON.parse(data) : {
        autoSaveHistory: true,
        maxHistoryItems: 50,
        cacheEnabled: true,
        cacheDuration: 3600000, // 1 hour in ms
        showConfidenceDescriptions: true,
        expandFirstClaim: false,
        theme: 'dark'
      };
    } catch (error) {
      console.error('Failed to get preferences:', error);
      return {};
    }
  },

  // ===== HISTORY MANAGEMENT =====
  
  saveHistory(historyArray) {
    try {
      const preferences = this.getPreferences();
      const maxItems = preferences.maxHistoryItems || 50;
      
      // Limit history size
      const limitedHistory = historyArray.slice(0, maxItems);
      
      localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(limitedHistory));
      return true;
    } catch (error) {
      console.error('Failed to save history:', error);
      
      // Handle quota exceeded
      if (error.name === 'QuotaExceededError') {
        this.clearOldHistory();
        return this.saveHistory(historyArray.slice(0, 25)); // Save only recent 25
      }
      return false;
    }
  },

  getHistory() {
    try {
      const data = localStorage.getItem(this.KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get history:', error);
      return [];
    }
  },

  addToHistory(item) {
    try {
      const history = this.getHistory();
      const newItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...item
      };
      
      // Add to beginning
      history.unshift(newItem);
      
      // Save and limit size
      this.saveHistory(history);
      
      return newItem;
    } catch (error) {
      console.error('Failed to add to history:', error);
      return null;
    }
  },

  clearHistory() {
    try {
      localStorage.removeItem(this.KEYS.HISTORY);
      return true;
    } catch (error) {
      console.error('Failed to clear history:', error);
      return false;
    }
  },

  clearOldHistory() {
    try {
      const history = this.getHistory();
      // Keep only last 10 items
      const recentHistory = history.slice(0, 10);
      this.saveHistory(recentHistory);
      console.log('Cleared old history, kept 10 most recent items');
      return true;
    } catch (error) {
      console.error('Failed to clear old history:', error);
      return false;
    }
  },

  getHistoryItem(id) {
    try {
      const history = this.getHistory();
      return history.find(item => item.id === id) || null;
    } catch (error) {
      console.error('Failed to get history item:', error);
      return null;
    }
  },

  deleteHistoryItem(id) {
    try {
      const history = this.getHistory();
      const filtered = history.filter(item => item.id !== id);
      this.saveHistory(filtered);
      return true;
    } catch (error) {
      console.error('Failed to delete history item:', error);
      return false;
    }
  },

  // ===== CACHE MANAGEMENT =====
  
  saveCache(key, data, duration = null) {
    try {
      const preferences = this.getPreferences();
      if (!preferences.cacheEnabled) return false;
      
      const cacheDuration = duration || preferences.cacheDuration || 3600000;
      const cacheItem = {
        data: data,
        timestamp: Date.now(),
        expiry: Date.now() + cacheDuration
      };
      
      localStorage.setItem(`${this.KEYS.CACHE}:${key}`, JSON.stringify(cacheItem));
      return true;
    } catch (error) {
      console.error('Failed to save cache:', error);
      return false;
    }
  },

  getCache(key) {
    try {
      const data = localStorage.getItem(`${this.KEYS.CACHE}:${key}`);
      if (!data) return null;
      
      const cacheItem = JSON.parse(data);
      
      // Check if expired
      if (cacheItem.expiry && Date.now() > cacheItem.expiry) {
        this.clearCache(key);
        return null;
      }
      
      return cacheItem.data;
    } catch (error) {
      console.error('Failed to get cache:', error);
      return null;
    }
  },

  clearCache(key = null) {
    try {
      if (key) {
        localStorage.removeItem(`${this.KEYS.CACHE}:${key}`);
      } else {
        // Clear all cache
        const keys = Object.keys(localStorage);
        keys.forEach(k => {
          if (k.startsWith(this.KEYS.CACHE)) {
            localStorage.removeItem(k);
          }
        });
      }
      return true;
    } catch (error) {
      console.error('Failed to clear cache:', error);
      return false;
    }
  },

  // Cache analysis results for offline access
  cacheAnalysisResult(inputText, result) {
    const cacheKey = `analysis:${this.hashCode(inputText)}`;
    this.saveCache(cacheKey, {
      input: inputText,
      result: result,
      timestamp: new Date().toISOString()
    }, 86400000); // 24 hours
  },

  getCachedAnalysis(inputText) {
    const cacheKey = `analysis:${this.hashCode(inputText)}`;
    return this.getCache(cacheKey);
  },

  // Simple hash function for strings
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  },

  // ===== THEME MANAGEMENT =====
  
  saveTheme(themeName) {
    try {
      localStorage.setItem(this.KEYS.THEME, themeName);
      document.documentElement.setAttribute('data-theme', themeName);
      return true;
    } catch (error) {
      console.error('Failed to save theme:', error);
      return false;
    }
  },

  getTheme() {
    try {
      return localStorage.getItem(this.KEYS.THEME) || 'dark';
    } catch (error) {
      console.error('Failed to get theme:', error);
      return 'dark';
    }
  },

  // ===== SETTINGS MANAGEMENT =====
  
  saveSetting(key, value) {
    try {
      const settings = this.getSettings();
      settings[key] = value;
      localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Failed to save setting:', error);
      return false;
    }
  },

  getSetting(key, defaultValue = null) {
    try {
      const settings = this.getSettings();
      return key in settings ? settings[key] : defaultValue;
    } catch (error) {
      console.error('Failed to get setting:', error);
      return defaultValue;
    }
  },

  getSettings() {
    try {
      const data = localStorage.getItem(this.KEYS.SETTINGS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to get settings:', error);
      return {};
    }
  },

  resetSettings() {
    try {
      localStorage.removeItem(this.KEYS.SETTINGS);
      return true;
    } catch (error) {
      console.error('Failed to reset settings:', error);
      return false;
    }
  },

  // ===== EXPORT/IMPORT FUNCTIONALITY =====
  
  exportAllData() {
    try {
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        language: this.getLanguage(),
        preferences: this.getPreferences(),
        history: this.getHistory(),
        settings: this.getSettings(),
        theme: this.getTheme()
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return null;
    }
  },

  importAllData(jsonString) {
    try {
      const importData = JSON.parse(jsonString);
      
      if (importData.language) {
        this.saveLanguage(importData.language);
      }
      if (importData.preferences) {
        this.savePreferences(importData.preferences);
      }
      if (importData.history) {
        this.saveHistory(importData.history);
      }
      if (importData.settings) {
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(importData.settings));
      }
      if (importData.theme) {
        this.saveTheme(importData.theme);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  },

  // ===== UTILITY FUNCTIONS =====
  
  clearAllData() {
    try {
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Clear cache entries
      const keys = Object.keys(localStorage);
      keys.forEach(k => {
        if (k.startsWith('veritasai_')) {
          localStorage.removeItem(k);
        }
      });
      
      return true;
    } catch (error) {
      console.error('Failed to clear all data:', error);
      return false;
    }
  },

  getStorageUsage() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return {
      bytes: total,
      kb: (total / 1024).toFixed(2),
      mb: (total / (1024 * 1024)).toFixed(2)
    };
  },

  // Check if localStorage is available
  isAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
};

// Auto-initialize
StorageManager.init();
