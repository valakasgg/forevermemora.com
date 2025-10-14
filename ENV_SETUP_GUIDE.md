# Environment Variables Setup for Memora

## 🎯 Overview

Since Memora is a static HTML website, we can't use traditional `.env` files directly in the browser. Instead, we use a configuration system that detects the environment and loads appropriate settings.

## 🔧 Setup Methods

### Method 1: Using .env.local + Build Script (Recommended)

1. **Copy the template:**
   ```bash
   cp .env.template .env.local
   ```

2. **Update `.env.local` with your actual keys:**
   ```bash
   # Development Stripe Keys
   STRIPE_PUBLISHABLE_KEY_DEV=pk_test_51234567890abcdef...
   API_BASE_URL_DEV=http://localhost:3000/api
   DEBUG_DEV=true

   # Staging Keys (if you have staging environment)
   STRIPE_PUBLISHABLE_KEY_STAGING=pk_test_staging_key...
   API_BASE_URL_STAGING=https://staging-api.execute-api.region.amazonaws.com/dev/api
   DEBUG_STAGING=true

   # Production Keys
   STRIPE_PUBLISHABLE_KEY_PROD=pk_live_production_key...
   API_BASE_URL_PROD=https://prod-api.execute-api.region.amazonaws.com/prod/api
   DEBUG_PROD=false
   ```

3. **Generate config file:**
   ```bash
   npm run config
   # or for specific environment:
   npm run build:staging
   npm run build
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

### Method 2: Direct Configuration (Quick Start)

Edit `src/config.js` directly:

```javascript
development: {
  STRIPE_PUBLISHABLE_KEY: 'pk_test_your_actual_dev_key',
  API_BASE_URL: 'http://localhost:3000/api',
  DEBUG: true,
  ENVIRONMENT: 'development'
},
```

## 🌐 Environment Detection

The system automatically detects your environment based on the URL:

- **Development**: `localhost`, `127.0.0.1`, or any URL containing `local`
- **Staging**: URLs containing `amplifyapp.com` or `staging`
- **Production**: All other domains

## 📝 Available Scripts

```bash
# Development (generates config and starts server)
npm run dev

# Generate config for specific environments
npm run config                    # development
npm run build:staging            # staging
npm run build                    # production

# Deploy with proper config
npm run amplify:deploy           # builds production config first
```

## 🔐 Security Best Practices

### ✅ Do:
- Keep `.env.local` in `.gitignore` (already configured)
- Use different keys for development/staging/production
- Use `pk_test_` keys for development and staging
- Use `pk_live_` keys only for production

### ❌ Don't:
- Commit `.env.local` to version control
- Use production keys in development
- Share secret keys (only publishable keys go in frontend)

## 🧪 Testing Your Setup

1. **Check console logs:**
   ```javascript
   // Open browser console, you should see:
   [Memora DEVELOPMENT] Environment detected: development
   [Memora DEVELOPMENT] Config loaded: {...}
   [Memora DEVELOPMENT] Payments initialized successfully
   ```

2. **Verify keys are loaded:**
   ```javascript
   // In browser console:
   console.log(window.MemoraConfig.get('STRIPE_PUBLISHABLE_KEY'));
   console.log(window.MemoraConfig.get('API_BASE_URL'));
   ```

3. **Test payment flow:**
   - Click any "Buy Now" button
   - Should redirect to Stripe checkout
   - Use test card: `4242 4242 4242 4242`

## 🚀 Deployment Configurations

### AWS Amplify Environment Variables

In your Amplify console, set these environment variables for the **backend functions**:

```bash
# Backend Environment Variables (AWS Lambda)
STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)
STRIPE_WEBHOOK_SECRET=whsec_...
BASIC_PRICE_ID=price_...
PREMIUM_PRICE_ID=price_...
DELUXE_PRICE_ID=price_...
```

### Frontend Configuration

The frontend config is handled by the build process:

```bash
# Before deploying to staging
npm run build:staging

# Before deploying to production  
npm run build
```

## 🔄 Environment Flow

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   .env.local    │───▶│ build-config │───▶│   src/config.js │
│ (not committed) │    │    script    │    │   (committed)   │
└─────────────────┘    └──────────────┘    └─────────────────┘
                                                     │
                                                     ▼
                                           ┌─────────────────┐
                                           │   index.html    │
                                           │ loads config.js │
                                           └─────────────────┘
```

## 🐛 Troubleshooting

### "Stripe publishable key not configured properly"
- Check if `.env.local` exists and has correct keys
- Run `npm run config` to regenerate config
- Verify key starts with `pk_test_` or `pk_live_`

### "MemoraConfig not loaded"
- Ensure `config.js` is loaded before `payment.js` in HTML
- Check browser console for JavaScript errors
- Verify `src/config.js` file exists

### Environment not detected correctly
- Check `window.location.hostname` in browser console
- Modify detection logic in `detectEnvironment()` if needed
- Use debug mode to see environment detection: `DEBUG_DEV=true`

## 🎭 Multiple Environments

You can create separate config files for different environments:

```bash
# Create environment-specific configs
node scripts/build-config.js development > src/config.dev.js
node scripts/build-config.js staging > src/config.staging.js
node scripts/build-config.js production > src/config.prod.js
```

Then manually include the appropriate one in your HTML.

## 📚 Configuration Reference

### Available Configuration Keys:
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (pk_test_ or pk_live_)
- `API_BASE_URL` - Base URL for API calls to your Lambda functions
- `DEBUG` - Enable/disable debug logging
- `ENVIRONMENT` - Current environment name

### Methods:
- `MemoraConfig.get(key)` - Get configuration value
- `MemoraConfig.isDevelopment()` - Check if in development
- `MemoraConfig.isProduction()` - Check if in production  
- `MemoraConfig.log(...)` - Debug logging (only if DEBUG=true)

This setup gives you the flexibility of environment variables while working within the constraints of a static HTML website!
