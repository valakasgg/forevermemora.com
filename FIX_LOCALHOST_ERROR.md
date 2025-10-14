# 🔧 Fix: Site Calling localhost Instead of AWS Lambda

## The Problem

Your deployed site at `https://main.d23yrnb3yjabfp.amplifyapp.com` is trying to call:
```
http://localhost:3001/api/create-checkout-session  ❌
```

This is your LOCAL development server, not AWS Lambda!

---

## Root Cause

The `API_BASE_URL` environment variable wasn't properly configured, so the frontend uses the fallback local dev config.

---

## Solution A: If Lambda Functions Exist

### 1. Find Lambda Functions

Go to: https://console.aws.amazon.com/lambda

Look for functions like:
- `amplify-*-create-checkout-session`
- `amplifyapp-*-create-checkout-session`

**Found them?** Continue below.  
**Don't see them?** Go to Solution B.

### 2. Get Lambda URL

1. Click on `*create-checkout-session` function
2. **Configuration** → **Function URL**
3. Copy the URL (e.g., `https://abc123.lambda-url.us-east-1.on.aws`)

### 3. Set Environment Variable in Amplify

1. Amplify Console → Your app
2. **Environment variables** (left menu)
3. **Manage variables**
4. **Add variable:**
   - Name: `API_BASE_URL`
   - Value: `https://abc123.lambda-url.us-east-1.on.aws` (your actual URL)
5. **Save**

### 4. Redeploy

1. **Hosting environments**
2. **Redeploy this version**
3. Wait for completion (~5 min)

### 5. Test

1. Open: `https://main.d23yrnb3yjabfp.amplifyapp.com`
2. F12 → Console
3. Should see your Lambda URL (not localhost)
4. Click "Buy Now" → Should work! ✅

---

## Solution B: If No Lambda Functions (Backend Didn't Deploy)

If you don't see Lambda functions, the backend didn't deploy from the zip file.

### Why This Happens

Manual zip deployment in Amplify might not support Amplify Gen 2 backends properly.

### Fix: Use Git-Based Deployment

#### Option 1: Connect to GitHub (Recommended)

1. **Push code to GitHub:**
   ```bash
   cd /Users/nathan/Development/Memora/us
   
   # Initialize git if needed
   git init
   git add .
   git commit -m "Deploy Memora with Stripe"
   
   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/memora.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect Amplify to GitHub:**
   - Amplify Console → New app
   - Host web app → GitHub
   - Select repository
   - Deploy!

#### Option 2: Manual Backend Fix

Update the deployment to not rely on environment variables for API URL.

**Edit `src/amplify-config-inject.js`** (before creating zip):

Replace line 11:
```javascript
API_BASE_URL: 'http://localhost:3001/api',
```

With:
```javascript
API_BASE_URL: 'REPLACE_WITH_YOUR_LAMBDA_URL_AFTER_DEPLOY',
```

Then:
1. Create new zip
2. Deploy
3. Get Lambda URL
4. Edit file again with actual URL
5. Recreate zip and redeploy

---

## Solution C: Quick Manual Fix (Temporary)

If you need it working NOW and can't wait:

### 1. Download Your Deployed Files

From Amplify, download the deployed `amplify-config-inject.js`

### 2. Edit Locally

Find this line:
```javascript
API_BASE_URL: 'http://localhost:3001/api',
```

Change to your Lambda URL:
```javascript
API_BASE_URL: 'https://YOUR_LAMBDA_URL',
```

### 3. Create New Zip With Fixed File

```bash
cd /Users/nathan/Development/Memora/us

# Update the file first
# Then create new deployment zip
./scripts/create-production-zip.sh
```

### 4. Redeploy

Upload the new zip to Amplify

---

## Verification Steps

After any fix:

### 1. Check Browser Console
```
F12 → Console tab
```

Look for:
```
🔧 Amplify config injected for environment: production
```

Check the `API_BASE_URL` value - should be your Lambda URL, not localhost.

### 2. Check Network Tab
```
F12 → Network tab
Click "Buy Now"
```

The request URL should be:
```
✅ https://your-lambda-url.lambda-url.region.on.aws
❌ http://localhost:3001/api/create-checkout-session
```

### 3. Test Payment
- Should redirect to Stripe
- No "Failed to fetch" errors

---

## Current Status Check

Run these checks:

### ✅ Amplify Deployed?
- [ ] Yes: `https://main.d23yrnb3yjabfp.amplifyapp.com` works

### ✅ Lambda Functions Created?
- [ ] Check: https://console.aws.amazon.com/lambda
- [ ] See functions named `amplify-*-create-checkout-session`?

### ✅ Environment Variable Set?
- [ ] Amplify Console → Environment variables
- [ ] See `API_BASE_URL`?

### ✅ Frontend Config Correct?
- [ ] F12 → Console
- [ ] Check what `API_BASE_URL` is being used

---

## Need Help?

Tell me:
1. ✅ Do you see Lambda functions? (YES/NO)
2. ✅ What do you see in F12 → Console?
3. ✅ Is `API_BASE_URL` set in Amplify environment variables?

I'll give you the exact next step! 🎯

