// AWS Amplify Configuration Injection - Local Development Fallback
// This file is used when developing locally (not auto-generated)

(function() {
  // Only inject if not already set (Amplify build process takes precedence)
  if (!window.AWS_AMPLIFY_ENV) {
    window.AWS_AMPLIFY_ENV = 'development';
    
    window.AWS_AMPLIFY_CONFIG = {
      STRIPE_PUBLISHABLE_KEY: 'pk_test_51PcdRsRxjeA5v92yApzypK2TllczZFLH0XJRmE1udOUd1g6BoqV86M1aAXKlJoydYZ9IWyp6LP2TFqaQXtkhtIjw00zimcQR6p',
      API_BASE_URL: 'http://localhost:3001/api',
      DEBUG: true,
      BUILD_TIME: new Date().toISOString(),
      BUILD_COMMIT: 'local-dev'
    };
    
    console.log('🔧 Local development config loaded');
  }
})();
