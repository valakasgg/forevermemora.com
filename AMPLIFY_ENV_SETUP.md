# AWS Amplify Environment Variables Setup for Memora

## 🎯 Overview

AWS Amplify provides a robust environment variable system that works seamlessly with branch-based deployments. Here's how to set up environment variables for your Memora Stripe integration.

## 🔧 AWS Amplify Environment Variables Setup

### 1. In AWS Amplify Console

1. **Go to your Amplify app** → App settings → Environment variables

2. **Add these environment variables:**

#### For Development/Staging Branch:
```
STRIPE_PUBLISHABLE_KEY = pk_test_51234567890abcdef...
API_BASE_URL = https://your-dev-api-id.execute-api.region.amazonaws.com/dev/api
DEBUG = true
```

#### For Production/Main Branch:
```
STRIPE_PUBLISHABLE_KEY = pk_live_51234567890abcdef...  
API_BASE_URL = https://your-prod-api-id.execute-api.region.amazonaws.com/prod/api
DEBUG = false
```

### 2. Backend Lambda Functions

The Lambda functions need these environment variables (set in Amplify backend):

```
STRIPE_SECRET_KEY = sk_test_... (or sk_live_... for production)
STRIPE_WEBHOOK_SECRET = whsec_...
BASIC_PRICE_ID = price_...
PREMIUM_PRICE_ID = price_...
DELUXE_PRICE_ID = price_...
```

## 🌐 Branch-Based Environment Management

### Automatic Environment Detection

Amplify automatically sets these variables:
- `AWS_BRANCH` - Current branch name (main, dev, staging, etc.)
- `AWS_COMMIT_ID` - Git commit ID
- `AWS_APP_ID` - Amplify App ID

### Branch Configuration Examples:

#### Main Branch (Production):
```bash
AWS_BRANCH=main
STRIPE_PUBLISHABLE_KEY=pk_live_...
API_BASE_URL=https://prod-api.execute-api.us-east-1.amazonaws.com/prod/api
DEBUG=false
```

#### Dev Branch (Development):
```bash
AWS_BRANCH=dev  
STRIPE_PUBLISHABLE_KEY=pk_test_...
API_BASE_URL=https://dev-api.execute-api.us-east-1.amazonaws.com/dev/api
DEBUG=true
```

## 🏗️ Build Process Integration

### How It Works:

1. **Amplify Build Starts** → Environment variables are available
2. **preBuild Phase** → `amplify-build.sh` runs and creates `amplify-config-inject.js`
3. **Build Phase** → Static files are processed
4. **Deploy** → Configuration is injected into the frontend

### Build Script Process:

```bash
# During Amplify build:
AMPLIFY_ENV=${AWS_BRANCH:-development}
# Creates: src/amplify-config-inject.js with injected variables
```

### Generated Config File:
```javascript
window.AWS_AMPLIFY_CONFIG = {
  STRIPE_PUBLISHABLE_KEY: 'pk_test_...',
  API_BASE_URL: 'https://api.../dev/api',
  DEBUG: true,
  BUILD_TIME: '2025-10-10T14:30:00Z',
  BUILD_COMMIT: 'abc123def'
};
```

## 🔐 Security Best Practices

### ✅ Frontend Variables (Safe to expose):
- `STRIPE_PUBLISHABLE_KEY` (pk_test_ or pk_live_)
- `API_BASE_URL`
- `DEBUG` flag
- Build metadata

### ❌ Backend Variables (Keep secret):
- `STRIPE_SECRET_KEY` (sk_test_ or sk_live_)
- `STRIPE_WEBHOOK_SECRET`
- Database credentials
- API secrets

### Branch Security:
- **Development branches** → Use test keys only
- **Production branch** → Use live keys only
- **Feature branches** → Inherit from development

## 🚀 Deployment Workflow

### 1. Set Environment Variables in Amplify Console

```bash
# In Amplify Console → Environment Variables
STRIPE_PUBLISHABLE_KEY_DEV=pk_test_development_key
STRIPE_PUBLISHABLE_KEY_PROD=pk_live_production_key
API_BASE_URL_DEV=https://dev-api.execute-api.region.amazonaws.com/dev/api  
API_BASE_URL_PROD=https://prod-api.execute-api.region.amazonaws.com/prod/api
```

### 2. Configure Branch-Specific Variables

In Amplify Console → App settings → Environment variables → Manage variables:

**For `main` branch:**
```
STRIPE_PUBLISHABLE_KEY = $STRIPE_PUBLISHABLE_KEY_PROD
API_BASE_URL = $API_BASE_URL_PROD
DEBUG = false
```

**For `dev` branch:**
```
STRIPE_PUBLISHABLE_KEY = $STRIPE_PUBLISHABLE_KEY_DEV  
API_BASE_URL = $API_BASE_URL_DEV
DEBUG = true
```

### 3. Deploy

```bash
git push origin main    # Triggers production build
git push origin dev     # Triggers development build
```

## 🧪 Testing Configuration

### 1. Check Build Logs
In Amplify Console → Build history → View logs:
```
📦 Building for environment: main
🔍 Available Amplify environment variables:
  AWS_BRANCH: main
  STRIPE_PUBLISHABLE_KEY: pk_live_...
  API_BASE_URL: https://prod-api...
✅ Memora Amplify build process completed
```

### 2. Test Frontend Config
Open browser console on deployed site:
```javascript
// Should show correct environment
console.log(window.AWS_AMPLIFY_ENV);           // "main" or "dev"
console.log(window.AWS_AMPLIFY_CONFIG);        // Full config object
console.log(window.MemoraConfig.environment);  // Detected environment
```

### 3. Test Payment Flow
- Development: Use test card `4242 4242 4242 4242`
- Production: Use real payment methods

## 🔄 Local Development

### Option 1: Use .env.local (for local testing)
```bash
# Create .env.local
STRIPE_PUBLISHABLE_KEY_DEV=pk_test_...
API_BASE_URL_DEV=http://localhost:3000/api

# Run build script
npm run config
npm run dev
```

### Option 2: Edit amplify-config-inject.js directly
```javascript
window.AWS_AMPLIFY_CONFIG = {
  STRIPE_PUBLISHABLE_KEY: 'pk_test_your_local_key',
  API_BASE_URL: 'http://localhost:3000/api',
  DEBUG: true
};
```

## 🐛 Troubleshooting

### "Environment variables not found"
1. Check Amplify Console → Environment variables
2. Verify branch-specific configurations
3. Check build logs for errors
4. Ensure variables are set for the correct branch

### "Wrong API URL being used"
1. Check `API_BASE_URL` environment variable
2. Verify branch detection in browser console
3. Check build logs for correct environment detection

### "Stripe key not working"
1. Verify key format (`pk_test_` vs `pk_live_`)
2. Check Stripe dashboard for key validity
3. Ensure development uses test keys, production uses live keys

## 📚 Environment Variable Reference

### Amplify Built-in Variables:
- `AWS_BRANCH` - Current branch
- `AWS_COMMIT_ID` - Git commit
- `AWS_APP_ID` - Amplify app ID
- `AWS_REGION` - AWS region

### Memora Custom Variables:
- `STRIPE_PUBLISHABLE_KEY` - Stripe frontend key
- `API_BASE_URL` - Backend API endpoint
- `DEBUG` - Enable debug logging

### Configuration Flow:
```
Amplify Console Variables
         ↓
    Build Process
         ↓
  amplify-config-inject.js
         ↓
    config-amplify.js
         ↓
     Frontend App
```

This setup gives you full control over environment-specific configurations while leveraging AWS Amplify's built-in environment management!
