# ✅ Memora Local & AWS Amplify Setup - Quick Start

## 🚀 Yes, this will work both locally and with AWS Amplify!

Here's exactly how to set it up:

## 📍 **STEP 1: Local Development Setup**

### Option A: Quick Test (Immediate)
1. **Edit the local config file:**
   ```bash
   nano src/amplify-config-inject.js
   ```

2. **Replace the placeholder key:**
   ```javascript
   STRIPE_PUBLISHABLE_KEY: 'pk_test_your_actual_stripe_test_key_here',
   ```

3. **Open in browser:**
   ```bash
   open index.html
   # or
   python -m http.server 8000
   # then visit http://localhost:8000
   ```

### Option B: Proper Local Development
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create local environment file:**
   ```bash
   cp .env.template .env.local
   # Edit .env.local with your actual keys
   ```

3. **Generate config and start:**
   ```bash
   npm run dev
   ```

## 🌐 **STEP 2: AWS Amplify Setup**

### 1. Set Environment Variables in Amplify Console

Go to: **AWS Amplify Console → Your App → App Settings → Environment Variables**

Add these variables:

#### For Development Branch (`dev`):
```
STRIPE_PUBLISHABLE_KEY = pk_test_51234567890abcdef...
API_BASE_URL = https://your-dev-api-id.execute-api.region.amazonaws.com/dev/api
DEBUG = true
```

#### For Production Branch (`main`):
```
STRIPE_PUBLISHABLE_KEY = pk_live_51234567890abcdef...
API_BASE_URL = https://your-prod-api-id.execute-api.region.amazonaws.com/prod/api  
DEBUG = false
```

### 2. Deploy to Amplify
```bash
git add .
git commit -m "Add Stripe integration"
git push origin main    # or dev
```

## 🧪 **STEP 3: Test Both Environments**

### Test Local Setup:
1. **Visit test page:** `http://localhost:8000/test-config.html`
2. **Check console:** Should show "Local development config loaded"
3. **Test Stripe:** Click "Test Stripe Initialization" button

### Test Amplify Setup:
1. **Visit deployed site:** `https://yourapp.amplifyapp.com/test-config.html`
2. **Check console:** Should show environment detection
3. **Verify config:** Environment variables should be loaded from Amplify

## 📋 **Current File Structure**

Your setup now includes:

```
/Users/nathan/Development/Memora/us/
├── index.html                      # ✅ Updated with config system
├── src/
│   ├── config-amplify.js          # ✅ Main config system
│   ├── amplify-config-inject.js   # ✅ Environment variable injection
│   └── payment.js                 # ✅ Updated to use config
├── scripts/
│   └── amplify-build.sh           # ✅ Amplify build script
├── amplify.yml                    # ✅ Amplify build specification
├── test-config.html               # ✅ Test page
└── .env.local                     # ✅ Local environment variables
```

## 🔄 **How It Works**

### Local Development:
```
Browser loads index.html
    ↓
amplify-config-inject.js runs (local fallback)
    ↓
config-amplify.js loads configuration
    ↓
payment.js uses MemoraConfig
    ↓
Stripe checkout works with test keys
```

### AWS Amplify Production:
```
Amplify build starts
    ↓
amplify-build.sh injects environment variables
    ↓
Browser loads index.html with injected config
    ↓
config-amplify.js loads Amplify configuration
    ↓
payment.js uses MemoraConfig
    ↓
Stripe checkout works with production keys
```

## ✅ **Verification Checklist**

### Local Development:
- [ ] `npm run dev` starts server successfully
- [ ] Browser console shows "Local development config loaded"
- [ ] Buy buttons trigger Stripe checkout
- [ ] Test page shows correct configuration

### AWS Amplify:
- [ ] Environment variables set in Amplify Console
- [ ] Build completes successfully
- [ ] Deployed site shows correct environment
- [ ] Payment flow works with appropriate keys

## 🎯 **Summary**

**YES, this setup will work for both:**

✅ **Local Development:**
- Uses fallback configuration in `amplify-config-inject.js`
- Easy to update with your test Stripe keys
- Works with or without npm/node setup

✅ **AWS Amplify:**
- Automatically injects environment variables during build
- Branch-specific configurations (dev/staging/prod)
- Secure handling of keys
- No manual configuration needed after initial setup

**Next Steps:**
1. Update `src/amplify-config-inject.js` with your test Stripe key
2. Open `test-config.html` to verify local setup
3. Set environment variables in AWS Amplify Console
4. Deploy and test production setup

You're all set! 🚀
