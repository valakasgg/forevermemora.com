// Local Development Configuration Loader
// This file reads from .env.development (which is gitignored) and loads your keys securely

class LocalDevConfig {
  constructor() {
    this.keys = {};
    // Only load in development environment
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      this.loadFromFile();
    }
  }

  // Load environment variables from .env.development file
  async loadFromFile() {
    try {
      // Try to fetch the .env.development file
      const response = await fetch('./.env.development');
      if (response.ok) {
        const content = await response.text();
        this.parseEnvFile(content);
        this.injectConfig();
        if (this.keys.DEBUG_LOCAL === 'true') {
          console.log('🔐 Secure local config loaded from .env.development');
        }
      } else {
        this.loadFallbackConfig();
      }
    } catch (error) {
      if (this.keys.DEBUG_LOCAL === 'true') {
        console.log('📁 .env.development not found, using manual config');
      }
      this.loadFallbackConfig();
    }
  }

  parseEnvFile(content) {
    const lines = content.split('\n');
    lines.forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          this.keys[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
  }

  loadFallbackConfig() {
    // Manual configuration if .env.development doesn't exist
    this.keys = {
      STRIPE_PUBLISHABLE_KEY_TEST: 'pk_test_REPLACE_WITH_YOUR_ACTUAL_KEY',
      STRIPE_SECRET_KEY_TEST: 'sk_test_REPLACE_WITH_YOUR_ACTUAL_KEY',
      BASIC_PRICE_ID_TEST: 'price_test_REPLACE_WITH_BASIC_PRICE_ID',
      PREMIUM_PRICE_ID_TEST: 'price_test_REPLACE_WITH_PREMIUM_PRICE_ID',
      DELUXE_PRICE_ID_TEST: 'price_test_REPLACE_WITH_DELUXE_PRICE_ID',
      API_BASE_URL_LOCAL: 'http://localhost:3000/api',
      DEBUG_LOCAL: 'true'
    };
    this.injectConfig();
    if (this.keys.DEBUG_LOCAL === 'true') {
      console.log('🔧 Using fallback local config - edit .env.development for your keys');
    }
  }

  injectConfig() {
    // Only inject if not already set by Amplify
    if (!window.AWS_AMPLIFY_ENV) {
      window.AWS_AMPLIFY_ENV = 'development';
      
      // Determine which keys to use based on STRIPE_MODE
      const mode = this.keys.STRIPE_MODE || 'test';
      const isLiveMode = mode === 'live';
      
      // Select appropriate keys based on mode
      const publishableKey = isLiveMode ? 
        this.keys.STRIPE_PUBLISHABLE_KEY_LIVE : 
        this.keys.STRIPE_PUBLISHABLE_KEY_TEST;
      
      const secretKey = isLiveMode ? 
        this.keys.STRIPE_SECRET_KEY_LIVE : 
        this.keys.STRIPE_SECRET_KEY_TEST;
      
      const basicPriceId = isLiveMode ? 
        this.keys.BASIC_PRICE_ID_LIVE : 
        this.keys.BASIC_PRICE_ID_TEST;
      
      const premiumPriceId = isLiveMode ? 
        this.keys.PREMIUM_PRICE_ID_LIVE : 
        this.keys.PREMIUM_PRICE_ID_TEST;
      
      const deluxePriceId = isLiveMode ? 
        this.keys.DELUXE_PRICE_ID_LIVE : 
        this.keys.DELUXE_PRICE_ID_TEST;
      
      const webhookSecret = isLiveMode ? 
        this.keys.STRIPE_WEBHOOK_SECRET_LIVE : 
        this.keys.STRIPE_WEBHOOK_SECRET_TEST;
      
      window.AWS_AMPLIFY_CONFIG = {
        STRIPE_PUBLISHABLE_KEY: publishableKey,
        API_BASE_URL: this.keys.API_BASE_URL_LOCAL,
        DEBUG: this.keys.DEBUG_LOCAL === 'true',
        BUILD_TIME: new Date().toISOString(),
        BUILD_COMMIT: 'local-dev',
        STRIPE_MODE: mode,
        // Store all keys for local testing (including backend keys)
        LOCAL_KEYS: {
          STRIPE_SECRET_KEY: secretKey,
          BASIC_PRICE_ID: basicPriceId,
          PREMIUM_PRICE_ID: premiumPriceId,
          DELUXE_PRICE_ID: deluxePriceId,
          STRIPE_WEBHOOK_SECRET: webhookSecret
        }
      };
      
      // Log current mode for clarity
      const modeEmoji = isLiveMode ? '🔴' : '🧪';
      const modeText = isLiveMode ? 'LIVE' : 'TEST';
      if (this.keys.DEBUG_LOCAL === 'true') {
        console.log(`${modeEmoji} Stripe ${modeText} mode activated`);
      }
      
      if (isLiveMode && this.keys.DEBUG_LOCAL === 'true') {
        console.warn('⚠️ WARNING: Live mode enabled - real payments will be processed!');
      }
    }
  }

  // Method to verify all keys are configured
  verifyKeys() {
    const mode = this.keys.STRIPE_MODE || 'test';
    const isLiveMode = mode === 'live';
    
    // Check required keys based on mode
    const requiredKeys = isLiveMode ? [
      'STRIPE_PUBLISHABLE_KEY_LIVE',
      'STRIPE_SECRET_KEY_LIVE', 
      'BASIC_PRICE_ID_LIVE',
      'PREMIUM_PRICE_ID_LIVE',
      'DELUXE_PRICE_ID_LIVE'
    ] : [
      'STRIPE_PUBLISHABLE_KEY_TEST',
      'STRIPE_SECRET_KEY_TEST', 
      'BASIC_PRICE_ID_TEST',
      'PREMIUM_PRICE_ID_TEST',
      'DELUXE_PRICE_ID_TEST'
    ];

    const missing = requiredKeys.filter(key => 
      !this.keys[key] || 
      this.keys[key].includes('YOUR_ACTUAL_') || 
      this.keys[key].includes('REPLACE_WITH_') ||
      this.keys[key].includes('YOUR_') ||
      this.keys[key].includes('_HERE')
    );

    const modeEmoji = isLiveMode ? '🔴' : '🧪';
    const modeText = isLiveMode ? 'LIVE' : 'TEST';

    if (missing.length > 0) {
      if (this.keys.DEBUG_LOCAL === 'true') {
        console.warn(`⚠️ Missing or unconfigured ${modeText} keys:`, missing);
        console.log('📝 Edit .env.development file with your actual Stripe keys');
      }
      return false;
    }

    if (this.keys.DEBUG_LOCAL === 'true') {
      console.log(`✅ All ${modeText} keys configured correctly ${modeEmoji}`);
    }
    
    // Show which keys are being used
          const activeKeys = window.AWS_AMPLIFY_CONFIG;
    if (activeKeys) {
      console.log(`🔑 Active publishable key: ${activeKeys.STRIPE_PUBLISHABLE_KEY?.substring(0, 20)}...`);
      
      const basicId = activeKeys.LOCAL_KEYS?.BASIC_PRICE_ID || 'not configured';
      const premiumId = activeKeys.LOCAL_KEYS?.PREMIUM_PRICE_ID || 'not configured';  
      const deluxeId = activeKeys.LOCAL_KEYS?.DELUXE_PRICE_ID || 'not configured';
      
      console.log(`🏷️ Active price IDs:`);
      console.log(`   Basic: ${basicId.substring(0, 15)}...`);
      console.log(`   Premium: ${premiumId.substring(0, 15)}...`);
      console.log(`   Deluxe: ${deluxeId.substring(0, 15)}...`);
      
      if (basicId === premiumId || basicId === deluxeId || premiumId === deluxeId) {
        console.warn('⚠️ WARNING: Some price IDs are identical. Each package should have a unique price ID in Stripe.');
      }
    }    return true;
  }

  // Method to get a specific key
  get(key) {
    return this.keys[key];
  }

  // Method to clear all keys (for security)
  clearKeys() {
    this.keys = {};
    if (window.AWS_AMPLIFY_CONFIG && window.AWS_AMPLIFY_CONFIG.LOCAL_KEYS) {
      delete window.AWS_AMPLIFY_CONFIG.LOCAL_KEYS;
    }
    console.log('🗑️ All local keys cleared from memory');
  }
}

// Initialize local config
window.LocalDevConfig = new LocalDevConfig();

// Verify configuration after a short delay
setTimeout(() => {
  if (window.LocalDevConfig) {
    window.LocalDevConfig.verifyKeys();
  }
}, 500);
