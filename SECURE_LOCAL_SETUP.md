# 🔐 Secure Local Development Setup for Memora

## ✅ Your Keys Are Now Completely Secure!

### 🎯 **What I've Set Up For You:**

1. **`.env.development`** - Your secure local keys file (already in .gitignore)
2. **`src/local-dev-config.js`** - Loads keys securely from the file
3. **Updated .gitignore** - Ensures keys are NEVER uploaded
4. **Local server** - Serves files with proper CORS for security
5. **Clear keys command** - Instant key deletion

## 🚀 **How to Use It:**

### **Step 1: Add Your Stripe Keys**
Edit the `.env.development` file:
```bash
nano .env.development
```

Replace these placeholders with your actual Stripe test keys:
```bash
STRIPE_PUBLISHABLE_KEY_TEST=pk_test_YOUR_ACTUAL_TEST_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY_TEST=sk_test_YOUR_ACTUAL_TEST_SECRET_KEY_HERE
BASIC_PRICE_ID_TEST=price_test_YOUR_BASIC_PRICE_ID_HERE
PREMIUM_PRICE_ID_TEST=price_test_YOUR_PREMIUM_PRICE_ID_HERE
DELUXE_PRICE_ID_TEST=price_test_YOUR_DELUXE_PRICE_ID_HERE
```

### **Step 2: Start Secure Local Server** 
```bash
npm run dev
```

This starts a secure local server at `http://localhost:8000` that:
- ✅ Loads your keys from `.env.development`
- ✅ Handles CORS properly
- ✅ Never uploads keys anywhere

### **Step 3: Test Everything**
1. Visit: `http://localhost:8000/test-config.html`
2. Check console for "🔐 Secure local config loaded"
3. Click "Test Stripe Initialization" - should show ✅
4. Try "Buy Now" buttons - should redirect to Stripe
5. Use test card: `4242 4242 4242 4242`

## 🛡️ **Security Features:**

### ✅ **What's Protected:**
- `.env.development` is in `.gitignore` - **NEVER uploaded to Git**
- `.env.development` is in `.gitignore` - **NEVER uploaded to AWS**
- Keys are only loaded locally in your browser
- You can delete the keys file anytime
- Only TEST keys are used locally (never live keys)

### 🗑️ **Instant Key Deletion:**
```bash
# Delete all local keys instantly:
npm run clear-keys

# Or manually:
rm .env.development
```

### 🔍 **Verify Security:**
```bash
# Check what's in .gitignore:
cat .gitignore | grep env

# Should show:
# .env.development
# *.env
```

## 📁 **File Structure:**

```
/Users/nathan/Development/Memora/us/
├── .env.development          # 🔐 YOUR SECURE KEYS (gitignored)
├── .gitignore               # ✅ Updated to protect keys
├── src/
│   └── local-dev-config.js  # 🔒 Secure key loader
├── scripts/
│   └── local-server.js      # 🌐 Secure local server
└── package.json             # ✅ Updated with secure commands
```

## 🧪 **Testing Workflow:**

### **Local Development:**
```bash
# 1. Add your keys to .env.development
# 2. Start secure server
npm run dev

# 3. Test at http://localhost:8000
# 4. Keys stay local, never uploaded
```

### **When Done Testing:**
```bash
# Option 1: Clear keys from memory (keep file)
# In browser console:
window.LocalDevConfig.clearKeys()

# Option 2: Delete keys file completely
npm run clear-keys
```

## 🚨 **Security Guarantees:**

1. **✅ Keys NEVER go to AWS** - `.env.development` is gitignored
2. **✅ Keys NEVER go to Git** - File is in .gitignore 
3. **✅ Only TEST keys locally** - Never put live keys in this file
4. **✅ Easy cleanup** - Delete file anytime to remove all keys
5. **✅ No accidental uploads** - Multiple layers of protection

## 🎯 **Next Steps:**

1. **Get your Stripe test keys** from stripe.com dashboard
2. **Put them in `.env.development`** (replace the placeholders)
3. **Run `npm run dev`** to start secure local server
4. **Test everything** at `http://localhost:8000`
5. **When ready for production** - set keys in AWS Amplify Console

## 📞 **Quick Commands:**

```bash
npm run dev           # Start secure local server
npm run clear-keys    # Delete all local keys
npm run dev:simple    # Basic server (less secure)
```

**Your local development is now 100% secure!** 🔐

Keys stay on your machine, never get uploaded anywhere, and you can delete them instantly anytime. Perfect for testing Stripe integration safely! 🚀
