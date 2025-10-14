# Where to Put Your Stripe Keys - Complete Guide

## 🎯 **Key Placement Summary:**

```
FRONTEND (Safe - Publishable Keys Only):
├── Local Development: src/amplify-config-inject.js
├── AWS Amplify Dev Branch: Environment Variables  
└── AWS Amplify Prod Branch: Environment Variables

BACKEND (Secret - Lambda Functions Only):
├── create-checkout-session function: Environment Variables
└── stripe-webhook function: Environment Variables
```

## 🏠 **LOCAL DEVELOPMENT SETUP:**

### 1. Edit Frontend Config (for testing):
**File:** `src/amplify-config-inject.js`
```javascript
STRIPE_PUBLISHABLE_KEY: 'pk_test_YOUR_ACTUAL_TEST_KEY_HERE',
API_BASE_URL: 'http://localhost:3000/api',
```

### 2. Backend Functions (when you deploy):
**Files:** `amplify/functions/*/resource.ts`
- These will use AWS Amplify environment variables
- Set in AWS console after deployment

## ☁️ **AWS AMPLIFY SETUP:**

### 1. Frontend Environment Variables:
**Location:** AWS Amplify Console → App Settings → Environment Variables

#### For DEV branch:
```
STRIPE_PUBLISHABLE_KEY = pk_test_51234567890abcdef...
API_BASE_URL = https://your-dev-api-id.execute-api.region.amazonaws.com/dev/api
DEBUG = true
```

#### For MAIN branch (production):
```
STRIPE_PUBLISHABLE_KEY = pk_live_51234567890abcdef...  
API_BASE_URL = https://your-prod-api-id.execute-api.region.amazonaws.com/prod/api
DEBUG = false
```

### 2. Backend Lambda Environment Variables:
**Location:** AWS Amplify Console → Backend environments → Functions

#### For create-checkout-session function:
```bash
# Development
STRIPE_SECRET_KEY=sk_test_51234567890abcdef...
BASIC_PRICE_ID=price_test_1A2B3C...
PREMIUM_PRICE_ID=price_test_4D5E6F...
DELUXE_PRICE_ID=price_test_7G8H9I...

# Production  
STRIPE_SECRET_KEY=sk_live_51234567890abcdef...
BASIC_PRICE_ID=price_live_1A2B3C...
PREMIUM_PRICE_ID=price_live_4D5E6F...
DELUXE_PRICE_ID=price_live_7G8H9I...
```

#### For stripe-webhook function:
```bash
# Development
STRIPE_SECRET_KEY=sk_test_51234567890abcdef...
STRIPE_WEBHOOK_SECRET=whsec_test_...

# Production
STRIPE_SECRET_KEY=sk_live_51234567890abcdef...
STRIPE_WEBHOOK_SECRET=whsec_live_...
```

## 🔄 **Setup Workflow:**

### Phase 1: Get Keys from Stripe
1. ✅ Create Stripe account
2. ✅ Get test & live API keys
3. ✅ Create 6 products (3 test + 3 live)
4. ✅ Set up 2 webhooks (test + live)
5. ✅ Copy all keys to secure notes

### Phase 2: Test Locally
1. ✅ Put test publishable key in `src/amplify-config-inject.js`
2. ✅ Open `test-config.html` to verify config loads
3. ✅ Test "Buy Now" button with test card: 4242 4242 4242 4242

### Phase 3: Deploy Backend  
1. ✅ Deploy Amplify functions: `amplify push`
2. ✅ Set backend environment variables in AWS console
3. ✅ Get API Gateway URLs from deployment output

### Phase 4: Deploy Frontend
1. ✅ Set frontend environment variables in Amplify console
2. ✅ Push code: `git push origin dev` (test) or `git push origin main` (prod)
3. ✅ Test deployed site with appropriate keys

## 🧪 **Testing Checklist:**

### Local Development:
- [ ] Config loads without errors
- [ ] Stripe initializes successfully  
- [ ] "Buy Now" redirects to Stripe checkout
- [ ] Test card completes successfully
- [ ] Redirects to success page

### AWS Amplify Dev:
- [ ] Environment variables set correctly
- [ ] Uses test keys (pk_test_, sk_test_)
- [ ] API endpoints work
- [ ] Webhook receives events
- [ ] Test payments work

### AWS Amplify Production:
- [ ] Environment variables set correctly
- [ ] Uses live keys (pk_live_, sk_live_)
- [ ] Real payments process
- [ ] Webhook receives events
- [ ] Email instructions sent to customers

## 🔐 **Security Reminder:**

**✅ SAFE for frontend:**
- `pk_test_...` and `pk_live_...` (publishable keys)
- API endpoint URLs
- Debug flags

**❌ NEVER in frontend:**
- `sk_test_...` and `sk_live_...` (secret keys)
- `whsec_...` (webhook secrets)
- Price IDs (these go in backend functions)

**🔒 NEVER commit to git:**
- Any actual key values
- .env files with real keys
- Hardcoded keys in source code
