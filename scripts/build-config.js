#!/usr/bin/env node

/**
 * Memora Build Script
 * Reads environment variables and generates config.js for different environments
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local file
function loadEnvFile(filePath) {
  const envVars = {};
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    content.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
  }
  
  return envVars;
}

// Generate config.js with actual environment variables
function generateConfig(environment = 'development') {
  const envVars = loadEnvFile('.env.local');
  
  const configTemplate = `// Memora Configuration - Generated automatically
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
        STRIPE_PUBLISHABLE_KEY: '${envVars.STRIPE_PUBLISHABLE_KEY_DEV || 'pk_test_your_development_key_here'}',
        API_BASE_URL: '${envVars.API_BASE_URL_DEV || 'http://localhost:3000/api'}',
        DEBUG: ${envVars.DEBUG_DEV || 'true'},
        ENVIRONMENT: 'development'
      },
      staging: {
        STRIPE_PUBLISHABLE_KEY: '${envVars.STRIPE_PUBLISHABLE_KEY_STAGING || 'pk_test_your_staging_key_here'}', 
        API_BASE_URL: '${envVars.API_BASE_URL_STAGING || 'https://your-staging-api.execute-api.region.amazonaws.com/dev/api'}',
        DEBUG: ${envVars.DEBUG_STAGING || 'true'},
        ENVIRONMENT: 'staging'
      },
      production: {
        STRIPE_PUBLISHABLE_KEY: '${envVars.STRIPE_PUBLISHABLE_KEY_PROD || 'pk_live_your_production_key_here'}',
        API_BASE_URL: '${envVars.API_BASE_URL_PROD || 'https://your-prod-api.execute-api.region.amazonaws.com/prod/api'}',
        DEBUG: ${envVars.DEBUG_PROD || 'false'},
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
      console.log(\`[Memora \${this.environment.toUpperCase()}]\`, ...args);
    }
  }
}

// Create global config instance
window.MemoraConfig = new MemoraConfig();

// Set the Stripe key globally for backward compatibility
window.STRIPE_PUBLISHABLE_KEY = window.MemoraConfig.get('STRIPE_PUBLISHABLE_KEY');

// Log current environment (only in debug mode)
window.MemoraConfig.log('Environment detected:', window.MemoraConfig.environment);
window.MemoraConfig.log('Config loaded:', window.MemoraConfig.config);`;

  fs.writeFileSync('src/config.js', configTemplate);
  console.log('✅ Config generated successfully with environment variables');
  
  // Show what was loaded
  console.log('📋 Loaded environment variables:');
  Object.keys(envVars).forEach(key => {
    console.log(`   ${key}=${envVars[key].substring(0, 20)}...`);
  });
}

// Run the script
const environment = process.argv[2] || 'development';
generateConfig(environment);
