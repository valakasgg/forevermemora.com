#!/bin/bash

# AWS Amplify Build Script for Memora
# This script runs during Amplify build and injects environment variables

echo "🚀 Starting Memora Amplify build process..."

# Get the current Amplify environment
AMPLIFY_ENV=${AWS_BRANCH:-development}
echo "📦 Building for environment: $AMPLIFY_ENV"

# Create the config injection script
cat > src/amplify-config-inject.js << EOF
// AWS Amplify Configuration Injection
// This file is auto-generated during build process

(function() {
  // Inject AWS Amplify environment
  window.AWS_AMPLIFY_ENV = '$AMPLIFY_ENV';
  
  // Inject configuration based on environment variables
  window.AWS_AMPLIFY_CONFIG = {
    STRIPE_PUBLISHABLE_KEY: '$STRIPE_PUBLISHABLE_KEY',
    API_BASE_URL: '$API_BASE_URL',
    DEBUG: $DEBUG,
    BUILD_TIME: '$(date -u +"%Y-%m-%dT%H:%M:%SZ")',
    BUILD_COMMIT: '$AWS_COMMIT_ID'
  };
  
  console.log('🔧 Amplify config injected for environment: $AMPLIFY_ENV');
})();
EOF

echo "✅ Config injection script created"

# List available environment variables for debugging
echo "🔍 Available Amplify environment variables:"
echo "  AWS_BRANCH: $AWS_BRANCH"
echo "  AWS_COMMIT_ID: $AWS_COMMIT_ID"
echo "  STRIPE_PUBLISHABLE_KEY: ${STRIPE_PUBLISHABLE_KEY:0:12}..."
echo "  API_BASE_URL: $API_BASE_URL"

echo "✅ Memora Amplify build process completed"
