// Memora Configuration for AWS Amplify
// This version integrates with AWS Amplify's environment variable system

class MemoraConfig {
  constructor() {
    this.environment = this.detectEnvironment();
    this.config = this.loadConfig();
  }

  detectEnvironment() {
    const hostname = window.location.hostname;
    
    // Check for Amplify environment variables injected during build
    if (window.AWS_AMPLIFY_ENV) {
      return window.AWS_AMPLIFY_ENV;
    }
    
    // Fallback to hostname detection
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('local')) {
      return 'development';
    } else if (hostname.includes('amplifyapp.com')) {
      // Extract branch name from Amplify URL
      const match = hostname.match(/([^.]+)\.d[^.]+\.amplifyapp\.com/);
      return match ? match[1] : 'staging';
    } else {
      return 'production';
    }
  }

  loadConfig() {
    // Priority order:
    // 1. AWS Amplify injected variables (highest priority)
    // 2. Environment-specific defaults
    // 3. Fallback defaults
    
    const amplifyConfig = window.AWS_AMPLIFY_CONFIG || {};
    
    const baseConfigs = {
      development: {
        STRIPE_PUBLISHABLE_KEY: 'pk_test_51PcdRsRxjeA5v92yApzypK2TllczZFLH0XJRmE1udOUd1g6BoqV86M1aAXKlJoydYZ9IWyp6LP2TFqaQXtkhtIjw00zimcQR6p',
        API_BASE_URL: 'http://localhost:3001/api',
        DEBUG: true,
        ENVIRONMENT: 'development'
      },
      staging: {
        STRIPE_PUBLISHABLE_KEY: 'pk_test_51PcdRsRxjeA5v92yApzypK2TllczZFLH0XJRmE1udOUd1g6BoqV86M1aAXKlJoydYZ9IWyp6LP2TFqaQXtkhtIjw00zimcQR6p', 
        API_BASE_URL: 'https://staging-api.amazonaws.com/api',
        DEBUG: true,
        ENVIRONMENT: 'staging'
      },
      production: {
        STRIPE_PUBLISHABLE_KEY: 'pk_test_51PcdRsRxjeA5v92yApzypK2TllczZFLH0XJRmE1udOUd1g6BoqV86M1aAXKlJoydYZ9IWyp6LP2TFqaQXtkhtIjw00zimcQR6p',
        API_BASE_URL: 'https://atnmhac3mwwdppifxytc66q7qq0eobes.lambda-url.us-east-1.on.aws',
        DEBUG: false,
        ENVIRONMENT: 'production'
      },
      main: {
        STRIPE_PUBLISHABLE_KEY: 'pk_test_51PcdRsRxjeA5v92yApzypK2TllczZFLH0XJRmE1udOUd1g6BoqV86M1aAXKlJoydYZ9IWyp6LP2TFqaQXtkhtIjw00zimcQR6p',
        API_BASE_URL: 'https://atnmhac3mwwdppifxytc66q7qq0eobes.lambda-url.us-east-1.on.aws',
        DEBUG: false,
        ENVIRONMENT: 'main'
      }
    };

    const baseConfig = baseConfigs[this.environment] || baseConfigs.development;
    
    // Merge with Amplify-provided config (Amplify config takes precedence)
    return {
      ...baseConfig,
      ...amplifyConfig,
      ENVIRONMENT: this.environment
    };
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

  isStaging() {
    return this.environment === 'staging';
  }

  log(...args) {
    if (this.config.DEBUG && this.environment !== 'production') {
      console.log('[Memora ' + this.environment.toUpperCase() + ']', ...args);
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
