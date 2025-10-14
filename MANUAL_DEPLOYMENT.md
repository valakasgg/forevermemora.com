# 🚀 Manual AWS Amplify Deployment Guide

Complete step-by-step guide for manually deploying Memora to AWS Amplify.

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

- [ ] AWS Account with admin access
- [ ] GitHub repository with your code pushed
- [ ] Stripe test account with API keys
- [ ] All local changes committed and pushed to GitHub
- [ ] Stripe price IDs for your three packages

---

## Part 1: Prepare Your Code (5 minutes)

### Step 1: Commit and Push All Changes

```bash
# Check what needs to be committed
git status

# Add all changes
git add .

# Commit
git commit -m "Prepare for AWS Amplify deployment with Stripe integration"

# Push to GitHub
git push origin main
```

### Step 2: Verify Files Are Ready

Ensure these files exist:
- ✅ `amplify.yml` - Build configuration
- ✅ `amplify/backend.ts` - Backend configuration
- ✅ `amplify/functions/` - Lambda functions
- ✅ `package.json` - Dependencies
- ✅ `index.html` - Frontend
- ✅ `.gitignore` - Excludes `.env.development`

---

## Part 2: Create Amplify App (10 minutes)

### Step 1: Go to AWS Amplify Console

1. **Login to AWS Console:** https://console.aws.amazon.com
2. **Search for "Amplify"** in the search bar
3. Click **"AWS Amplify"**
4. Click **"Get Started"** or **"New app"**

### Step 2: Connect Your Repository

1. Select **"Host web app"**
2. Choose **GitHub** (or your Git provider)
3. Click **"Continue"**
4. **Authorize AWS Amplify** to access your GitHub (one-time)
5. Select your **repository** from the dropdown
6. Select your **branch** (usually `main` or `master`)
7. Click **"Next"**

### Step 3: Configure Build Settings

1. **App name:** Enter `memora` (or your preferred name)
2. **Environment name:** Enter `dev` (for testing) or `prod` (for production)
3. **Build and test settings:**
   - Amplify should auto-detect `amplify.yml`
   - If not, click **"Edit"** and paste the contents from your `amplify.yml` file
4. **Service role:**
   - If you have one, select it
   - If not, select **"Create new role"** and follow the prompts
5. Click **"Next"**

### Step 4: Review and Create

1. **Review all settings**
2. Uncheck **"Enable full-stack CI/CD"** for now (we'll set up manually)
3. Click **"Save and deploy"**
4. **Wait for deployment** (~5-10 minutes)

⚠️ **Expected:** First deployment will **FAIL** - this is normal! We haven't set environment variables yet.

---

## Part 3: Set Environment Variables (5 minutes)

### Step 1: Navigate to Environment Variables

1. In Amplify Console, click on your app
2. Go to **"Hosting environments"** (left sidebar)
3. Click on your branch (e.g., `main`)
4. Click **"Environment variables"** (left sidebar)
5. Click **"Manage variables"**

### Step 2: Add Stripe Variables (Test Mode)

Click **"Add variable"** for each:

| Variable Name | Value | Example |
|--------------|-------|---------|
| `STRIPE_PUBLISHABLE_KEY` | Your test publishable key | `pk_test_51PcdRsRxjeA...` |
| `STRIPE_SECRET_KEY` | Your test secret key | `sk_test_51PcdRsRxjeA...` |
| `BASIC_PRICE_ID` | Basic package price ID | `price_1SGhjVRxjeA5v92yEoHzIWpQ` |
| `PREMIUM_PRICE_ID` | Premium package price ID | `price_1SGhjVRxjeA5v92yEoHzIWpQ` |
| `DELUXE_PRICE_ID` | Deluxe package price ID | `price_1SGhjVRxjeA5v92yEoHzIWpQ` |
| `DEBUG` | Enable debug logging | `true` |

**Important:** For initial testing, you can use the **same price ID** for all three packages.

### Step 3: Save Variables

1. Click **"Save"**
2. Variables are now set for your environment

---

## Part 4: Redeploy with Environment Variables (5 minutes)

### Step 1: Trigger Redeploy

1. Go back to **"Hosting environments"**
2. Click on your branch
3. In the deployment history, find the failed deployment
4. Click **"Redeploy this version"**
5. Wait for deployment (~5-10 minutes)

### Step 2: Monitor Build Progress

Watch the build logs:
1. **Provision** - Sets up build environment ✅
2. **Build** - Runs `amplify.yml` commands ✅
3. **Deploy** - Deploys frontend ✅
4. **Backend deployment** - Deploys Lambda functions ✅

All should show green checkmarks ✅

---

## Part 5: Get Lambda Function URLs (10 minutes)

Your Lambda functions need URLs for the frontend to call them.

### Step 1: Find Your Lambda Functions

1. **Open AWS Console** in a new tab
2. Search for **"Lambda"**
3. Click **"Lambda"**
4. In the functions list, find:
   - `amplify-memora-dev-create-checkout-session` (or similar)
   - `amplify-memora-dev-stripe-webhook` (or similar)

### Step 2: Get create-checkout-session URL

1. Click on the **create-checkout-session** function
2. Go to **"Configuration"** tab
3. Click **"Function URL"** (left sidebar)
4. **Copy the Function URL** (looks like: `https://abc123.lambda-url.us-east-1.on.aws`)
5. Save this URL somewhere (you'll need it)

### Step 3: Get stripe-webhook URL

1. Go back to Lambda functions list
2. Click on the **stripe-webhook** function
3. Go to **"Configuration"** tab
4. Click **"Function URL"** (left sidebar)
5. **Copy the Function URL**
6. Save this URL somewhere

### Step 4: Update Frontend Configuration

**Option A: Add API_BASE_URL Environment Variable (Recommended)**

1. Go back to Amplify Console
2. Go to **Environment variables**
3. Add new variable:
   - **Name:** `API_BASE_URL`
   - **Value:** Your `create-checkout-session` URL (without any path)
   - Example: `https://abc123.lambda-url.us-east-1.on.aws`
4. Save and **redeploy**

**Option B: Update amplify-build.sh Script**

The script at `scripts/amplify-build.sh` will inject the `API_BASE_URL` environment variable into the frontend config during build.

---

## Part 6: Configure Stripe Webhooks (10 minutes)

### Step 1: Create Webhook Endpoint in Stripe

1. Go to **Stripe Dashboard:** https://dashboard.stripe.com/test/webhooks
2. Click **"Add endpoint"**
3. **Endpoint URL:** Paste your `stripe-webhook` Lambda Function URL
   - Example: `https://xyz789.lambda-url.us-east-1.on.aws`
4. **Description:** `Memora Payment Webhooks`
5. **Listen to:** Select **"Events on your account"**

### Step 2: Select Events

Click **"Select events"** and choose:
- ✅ `checkout.session.completed`
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`

Click **"Add events"**

### Step 3: Get Webhook Signing Secret

1. Click **"Add endpoint"** to create the webhook
2. Click on the newly created endpoint
3. Click **"Reveal"** next to **"Signing secret"**
4. **Copy the secret** (starts with `whsec_`)

### Step 4: Add Webhook Secret to Amplify

1. Go back to Amplify Console
2. Go to **Environment variables**
3. Find `STRIPE_WEBHOOK_SECRET` (or add it)
4. Update value with your webhook secret
5. Click **"Save"**
6. **Redeploy** the app

---

## Part 7: Test Your Deployment (10 minutes)

### Step 1: Access Your Live Site

1. In Amplify Console, find your **domain URL**
   - Looks like: `https://main.d123abc456.amplifyapp.com`
2. **Copy the URL** and open in your browser

### Step 2: Test Payment Flow

1. **Click "Buy Now"** on any package
2. Should redirect to **Stripe Checkout** ✅
3. Use test card:
   - **Card:** `4242 4242 4242 4242`
   - **Expiry:** Any future date (e.g., `12/34`)
   - **CVC:** Any 3 digits (e.g., `123`)
   - **ZIP:** Any 5 digits (e.g., `12345`)
4. Click **"Pay"**
5. Should redirect to your **success page** ✅

### Step 3: Verify Webhook Delivery

1. Go to **Stripe Dashboard** → **Webhooks**
2. Click on your webhook endpoint
3. Check **"Events"** tab
4. Should see `checkout.session.completed` with **200 OK** status ✅

### Step 4: Check Lambda Logs

1. Go to **AWS Lambda Console**
2. Click on **create-checkout-session** function
3. Go to **"Monitor"** → **"Logs"** → **"View CloudWatch logs"**
4. Should see successful checkout session creation logs ✅

---

## Part 8: Going Live with Real Payments (When Ready)

### Step 1: Create Live Stripe Products

1. Switch Stripe to **Live Mode**
2. Go to **Products:** https://dashboard.stripe.com/products
3. Create three products:
   - **Basic Memory Package** - $89
   - **Premium Memory Package** - $189
   - **Deluxe Memory Package** - $269
4. Copy all three **Price IDs**

### Step 2: Get Live API Keys

1. Go to **API Keys:** https://dashboard.stripe.com/apikeys
2. Copy your **Live Publishable key** (pk_live_...)
3. Reveal and copy your **Live Secret key** (sk_live_...)

### Step 3: Update Environment Variables

In Amplify Console → Environment variables:

| Variable | Update To |
|----------|-----------|
| `STRIPE_PUBLISHABLE_KEY` | Your **live** publishable key |
| `STRIPE_SECRET_KEY` | Your **live** secret key |
| `BASIC_PRICE_ID` | Live Basic price ID |
| `PREMIUM_PRICE_ID` | Live Premium price ID |
| `DELUXE_PRICE_ID` | Live Deluxe price ID |
| `DEBUG` | `false` |

### Step 4: Create Live Webhook

1. Go to **Live Webhooks:** https://dashboard.stripe.com/webhooks
2. Create new endpoint with your Lambda URL
3. Select same events as before
4. Copy the **live webhook secret**
5. Update `STRIPE_WEBHOOK_SECRET` in Amplify
6. **Redeploy**

### Step 5: Test with Small Real Payment

1. Make a small test purchase (can refund later)
2. Verify everything works
3. Check webhook delivery
4. You're live! 🎉

---

## 🐛 Troubleshooting

### Build Fails

**Check:**
- Environment variables are set correctly
- `amplify.yml` syntax is correct
- Node.js version is 18+ (set in build settings)

**Solution:**
1. View build logs in Amplify Console
2. Fix any errors
3. Commit and push changes
4. Redeploy

### Lambda Functions Not Created

**Check:**
- Backend deployment succeeded
- TypeScript compiled without errors

**Solution:**
1. Check CloudFormation stack in AWS Console
2. Look for any errors in stack events
3. Verify `amplify/backend.ts` syntax

### CORS Errors

**Check:**
- Function URLs are public (authType: 'NONE')
- CORS headers are set in `backend.ts`

**Solution:**
1. Verify `backend.ts` has proper CORS config
2. Redeploy backend

### Webhooks Not Working

**Check:**
- Webhook URL matches Lambda Function URL exactly
- Webhook secret is correct in environment variables
- Events are selected in Stripe

**Solution:**
1. Test webhook manually in Stripe Dashboard
2. Check Lambda CloudWatch logs for errors
3. Verify signature verification in webhook handler

### Payment Fails

**Check:**
- Price IDs are correct
- Price IDs are for **one-time payments** (not subscriptions)
- Stripe keys match the mode (test/live)

**Solution:**
1. Verify price IDs in Stripe Dashboard
2. Check Lambda logs for specific error
3. Ensure prices are one-time, not recurring

---

## 📊 Monitoring Your Deployment

### CloudWatch Logs

**View Lambda execution logs:**
1. AWS Console → CloudWatch
2. Log groups → `/aws/lambda/amplify-[your-app]-[function-name]`
3. View real-time logs

### Stripe Dashboard

**Monitor payments and webhooks:**
- **Payments:** https://dashboard.stripe.com/payments
- **Webhooks:** https://dashboard.stripe.com/webhooks
- **Customers:** https://dashboard.stripe.com/customers

### Amplify Metrics

**View app performance:**
1. Amplify Console → Your app
2. **Monitoring** tab
3. View traffic, errors, build history

---

## ✅ Deployment Complete Checklist

- [ ] Code pushed to GitHub
- [ ] Amplify app created and connected to repo
- [ ] Environment variables set
- [ ] App deployed successfully (green checkmark)
- [ ] Lambda functions created
- [ ] Function URLs obtained
- [ ] Frontend configured with API URLs
- [ ] Stripe webhooks configured
- [ ] Webhook secret added to environment
- [ ] Test payment completed successfully
- [ ] Webhook delivered successfully
- [ ] CloudWatch logs show no errors
- [ ] Success/cancel pages work
- [ ] Ready for production (or staying in test mode)

---

## 🎉 You're Deployed!

Your Memora site is now live on AWS Amplify with Stripe payments!

**Next Steps:**
- Monitor CloudWatch logs
- Check Stripe webhook deliveries
- Test all three packages
- When ready, switch to live mode
- Set up custom domain (optional)

**Your Site URL:** https://[your-app].amplifyapp.com

**Support:** See `AMPLIFY_DEPLOYMENT_GUIDE.md` for detailed troubleshooting.

