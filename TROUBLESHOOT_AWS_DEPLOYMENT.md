# 🔧 Troubleshooting "Failed to fetch" Error on AWS

## Problem
Getting "Payment error: Failed to fetch. Please try again." when clicking Buy Now buttons on deployed AWS Amplify site.

## Root Cause
The frontend can't reach the Lambda API functions. Common causes:

1. ❌ Lambda functions weren't created during deployment
2. ❌ API_BASE_URL not configured in frontend
3. ❌ CORS not enabled on Lambda
4. ❌ Lambda Function URLs not public

---

## 🔍 Step 1: Check if Lambda Functions Exist

### Go to AWS Lambda Console
https://console.aws.amazon.com/lambda

### Look for these functions:
- `amplify-memora-*-create-checkout-session`
- `amplify-memora-*-stripe-webhook`

**If you DON'T see them:**
- ❌ Backend didn't deploy
- Go to Step 2

**If you DO see them:**
- ✅ Backend deployed
- Go to Step 3

---

## 🔍 Step 2: Fix Backend Deployment

The backend (Lambda functions) didn't deploy. This is usually because:

### Check Amplify Build Logs

1. Go to Amplify Console
2. Click on your app
3. Click on latest deployment
4. Expand **"Backend"** section in build logs
5. Look for errors

### Common Issues:

**A) Missing `package.json` in Lambda functions**

Check these files exist in your zip:
- `amplify/functions/create-checkout-session/package.json`
- `amplify/functions/stripe-webhook/package.json`

**B) TypeScript compilation errors**

Backend uses TypeScript. Errors in `backend.ts` will fail the build.

**Solution: Re-check your amplify/ directory structure**

Run this to verify:
```bash
cd /Users/nathan/Development/Memora/us
ls -la amplify/
ls -la amplify/functions/create-checkout-session/
ls -la amplify/functions/stripe-webhook/
```

Expected files:
```
amplify/
  backend.ts
  functions/
    create-checkout-session/
      handler.ts
      resource.ts
      package.json
    stripe-webhook/
      handler.ts
      resource.ts
      package.json
```

If files are missing, recreate the zip and redeploy.

---

## 🔍 Step 3: Get Lambda Function URLs

If Lambda functions exist but still getting "Failed to fetch":

### For Each Lambda Function:

1. **Go to AWS Lambda Console**
2. **Click on function:** `amplify-*-create-checkout-session`
3. **Check Configuration → Function URL**

**If Function URL exists:**
- ✅ Copy the URL
- Example: `https://abc123.lambda-url.us-east-1.on.aws`
- Go to Step 4

**If NO Function URL:**
- ❌ Function URL not created
- See "Fix: Create Function URL" below

### Fix: Create Function URL

If Function URL doesn't exist:

1. In Lambda Console → Your function
2. **Configuration** tab → **Function URL**
3. Click **"Create function URL"**
4. **Auth type:** `NONE` (important!)
5. **CORS settings:**
   - Allow origins: `*`
   - Allow methods: `POST, OPTIONS`
   - Allow headers: `Content-Type`
5. Click **"Save"**
6. **Copy the Function URL**

Repeat for both functions:
- `create-checkout-session`
- `stripe-webhook`

---

## 🔍 Step 4: Configure Frontend API URL

Your frontend needs to know the Lambda URL.

### Option A: Check Browser Console (Quick Debug)

1. Open your deployed site
2. Press `F12` (open DevTools)
3. Go to **Console** tab
4. Look for logs like:
   ```
   🔧 Amplify config injected for environment: production
   ```
5. Check what `API_BASE_URL` is set to

**If it shows:**
- `http://localhost:3001/api` ❌ Wrong! (local dev URL)
- `https://your-lambda-url...` ✅ Correct!

### Option B: Update Frontend Config

The frontend config comes from `scripts/amplify-build.sh` which injects environment variables.

**Check if API_BASE_URL was set during build:**

1. Go to Amplify Console → Your app
2. **Environment variables**
3. Look for: `API_BASE_URL`

**If NOT set or wrong:**

Add/Update it:
- **Variable:** `API_BASE_URL`
- **Value:** Your `create-checkout-session` Lambda URL
- Example: `https://abc123xyz.lambda-url.us-east-1.on.aws`
- **Important:** Don't include `/api` at the end, just the base URL

Then **Redeploy**.

### Manual Fix (If env var doesn't work):

Update `src/amplify-config-inject.js`:

1. Find this section (around line 23):
```javascript
API_BASE_URL: '$API_BASE_URL',
```

2. Replace with your actual Lambda URL:
```javascript
API_BASE_URL: 'https://YOUR_ACTUAL_LAMBDA_URL_HERE',
```

3. Recreate zip and redeploy

---

## 🔍 Step 5: Check CORS Configuration

If you have Function URLs and API_BASE_URL is set, but still getting errors:

### Test Lambda Function Directly

Open browser DevTools (F12) → Console, run:

```javascript
fetch('YOUR_LAMBDA_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ packageType: 'Basic Memory Package' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

Replace `YOUR_LAMBDA_URL` with your actual Lambda Function URL.

**If you get CORS error:**
- Lambda CORS not configured properly
- See "Fix CORS" below

**If you get a response:**
- ✅ Lambda works!
- Issue is with frontend config

### Fix CORS on Lambda

The `backend.ts` should have CORS configured. Check your deployed Lambda:

1. AWS Lambda Console → Your function
2. **Configuration** → **Function URL**
3. Check **CORS configuration**

Should be:
- **Allow origins:** `*` (or your specific domain)
- **Allow methods:** `POST, OPTIONS`
- **Allow headers:** `Content-Type, Authorization`

If wrong, update:
1. Click **"Edit"** on Function URL
2. Update CORS settings
3. Save

---

## 🔍 Step 6: Check Network Tab

1. Open your deployed site
2. Press `F12` (DevTools)
3. Go to **Network** tab
4. Click a "Buy Now" button
5. Look for the API request

**What to check:**

**Request URL:**
- Should be: `https://YOUR_LAMBDA_URL` (not localhost!)
- If localhost: Frontend config is wrong

**Status Code:**
- `0` or `(failed)`: CORS or network issue
- `404`: Wrong URL or Lambda doesn't exist
- `403`: Lambda permissions issue
- `500`: Lambda error (check CloudWatch logs)
- `200`: Success! (shouldn't get "Failed to fetch")

**Response Headers:**
- Look for: `access-control-allow-origin`
- Should be present with `*` or your domain

---

## ✅ Quick Fix Checklist

Try these in order:

1. **Verify Lambda functions exist**
   - [ ] AWS Lambda Console → See your functions

2. **Get Function URLs**
   - [ ] Each function has a Function URL
   - [ ] Auth type is NONE
   - [ ] CORS is configured

3. **Set API_BASE_URL**
   - [ ] Amplify → Environment variables
   - [ ] Add: `API_BASE_URL = https://your-lambda-url`
   - [ ] Redeploy

4. **Test directly**
   - [ ] Open DevTools → Console
   - [ ] Run fetch test (see Step 5)
   - [ ] Check for errors

5. **Check browser console**
   - [ ] Look for actual error messages
   - [ ] Check what API_BASE_URL is being used

---

## 🚨 Nuclear Option: Redeploy Everything

If nothing works:

1. **Delete the Amplify app**
   - Amplify Console → Your app → Actions → Delete app

2. **Recreate deployment zip**
   ```bash
   cd /Users/nathan/Development/Memora/us
   ./scripts/create-production-zip.sh
   ```

3. **Deploy fresh**
   - New app → Manual deployment
   - Upload new zip
   - Set environment variables
   - Deploy

4. **After deployment:**
   - Get Lambda URLs
   - Set `API_BASE_URL` env var
   - Redeploy once more

---

## 📋 Environment Variables Needed

Make sure ALL these are set in Amplify Console:

```
STRIPE_PUBLISHABLE_KEY = pk_live_... (or pk_test_...)
STRIPE_SECRET_KEY = sk_live_... (or sk_test_...)
BASIC_PRICE_ID = price_...
PREMIUM_PRICE_ID = price_...
DELUXE_PRICE_ID = price_...
DEBUG = false (for production) or true (for testing)
API_BASE_URL = https://your-lambda-function-url (NO /api at end!)
```

---

## 🆘 Still Not Working?

Share these details:

1. **Amplify deployment logs** (especially Backend section)
2. **Lambda function names** (from AWS Console)
3. **Browser console errors** (F12 → Console)
4. **Network tab** (F12 → Network → failed request)
5. **Environment variables** (from Amplify Console)

I can help debug further with this info!

