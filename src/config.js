// Memora Configuration
// This file handles environment-specific settings for the Memora website

class MemoraConfig {
  constructor() {
    this.environment = this.detectEnvironment();
    this.config = this.loadConfig();
  }

  detectEnvironment() {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('local')) {
      return 'development';
    } else if (hostname.includes('amplifyapp.com') || hostname.includes('staging')) {
      return 'staging';
    } else {
      return 'production';
    }
  }

  loadConfig() {
    const configs = {
      development: {
        STRIPE_PUBLISHABLE_KEY: 'pk_test_your_development_key_here',
        API_BASE_URL: 'http://localhost:3000/api',
        DEBUG: true,
        ENVIRONMENT: 'development'
      },
      staging: {
        STRIPE_PUBLISHABLE_KEY: 'pk_test_your_staging_key_here', 
        API_BASE_URL: 'https://your-staging-api.execute-api.region.amazonaws.com/dev/api',
        DEBUG: true,
        ENVIRONMENT: 'staging'
      },
      production: {
        STRIPE_PUBLISHABLE_KEY: 'pk_live_your_production_key_here',
        API_BASE_URL: 'https://your-prod-api.execute-api.region.amazonaws.com/prod/api',
        DEBUG: false,
        ENVIRONMENT: 'production'
      }
    };

    return configs[this.environment];
  }

  get(key) {
    return this.config[key];
  }

  isDevelopment() {
    return this.environment === 'development';
  }

  isProduction() {
    return this.environment === 'production';
  }

  log(...args) {
    if (this.config.DEBUG) {
      console.log(`[Memora ${this.environment.toUpperCase()}]`, ...args);
    }
  }
}

// Create global config instance
window.MemoraConfig = new MemoraConfig();

// Set the Stripe key globally for backward compatibility
window.STRIPE_PUBLISHABLE_KEY = window.MemoraConfig.get('STRIPE_PUBLISHABLE_KEY');

// Log current environment (only in debug mode)
window.MemoraConfig.log('Environment detected:', window.MemoraConfig.environment);
window.MemoraConfig.log('Config loaded:', window.MemoraConfig.config);
