# ⚡ AWS Amplify Manual Deployment - Quick Reference

## 🎯 Quick Steps (30 minutes total)

### 1️⃣ Push Code (2 min)
```bash
git add .
git commit -m "Deploy to AWS Amplify"
git push origin main
```

### 2️⃣ Create Amplify App (5 min)
1. Go to: https://console.aws.amazon.com/amplify
2. **New app** → **Host web app** → **GitHub**
3. Select repo & branch → **Next**
4. Auto-detect `amplify.yml` → **Next**
5. **Save and deploy** (will fail - expected)

### 3️⃣ Set Environment Variables (3 min)
**Amplify Console → Environment variables → Manage variables**

Add these (use your actual keys from .env.development):
```
STRIPE_PUBLISHABLE_KEY = pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY = sk_test_YOUR_SECRET_KEY_HERE
BASIC_PRICE_ID = price_YOUR_BASIC_PRICE_ID
PREMIUM_PRICE_ID = price_YOUR_PREMIUM_PRICE_ID
DELUXE_PRICE_ID = price_YOUR_DELUXE_PRICE_ID
DEBUG = true
```

### 4️⃣ Redeploy (5 min)
1. **Redeploy this version**
2. Wait for green checkmarks ✅

### 5️⃣ Get Lambda URLs (5 min)
1. AWS Console → **Lambda**
2. Find: `amplify-*-create-checkout-session`
3. **Configuration** → **Function URL** → Copy URL
4. Find: `amplify-*-stripe-webhook`
5. **Configuration** → **Function URL** → Copy URL

### 6️⃣ Update API URL (3 min)
**Option A (Recommended):**
- Amplify → Environment variables
- Add: `API_BASE_URL = https://[your-lambda-url]`
- Redeploy

**Option B:**
- The `scripts/amplify-build.sh` will auto-inject it

### 7️⃣ Configure Stripe Webhook (5 min)
1. https://dashboard.stripe.com/test/webhooks
2. **Add endpoint**
3. URL: Your `stripe-webhook` Lambda URL
4. Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
5. **Copy signing secret** (whsec_...)
6. Amplify → Env vars → Add `STRIPE_WEBHOOK_SECRET`
7. Redeploy

### 8️⃣ Test (2 min)
1. Open: `https://[your-app].amplifyapp.com`
2. Click **Buy Now**
3. Card: `4242 4242 4242 4242`
4. Complete checkout ✅
5. Check webhook in Stripe Dashboard ✅

---

## 🔑 Your Keys

**Important:** Get your actual keys from `.env.development` file (not stored in Git).

**Test Keys Format:**
```
STRIPE_PUBLISHABLE_KEY = pk_test_... (starts with pk_test_)
STRIPE_SECRET_KEY = sk_test_... (starts with sk_test_)
BASIC_PRICE_ID = price_... (from Stripe Dashboard)
PREMIUM_PRICE_ID = price_... (from Stripe Dashboard)
DELUXE_PRICE_ID = price_... (from Stripe Dashboard)
```

**Live Keys Format (when ready):**
```
STRIPE_PUBLISHABLE_KEY = pk_live_... (starts with pk_live_)
STRIPE_SECRET_KEY = sk_live_... (starts with sk_live_)
BASIC_PRICE_ID = price_... (live price IDs)
PREMIUM_PRICE_ID = price_... (live price IDs)
DELUXE_PRICE_ID = price_... (live price IDs)
```

**Get your keys from:**
- Stripe Dashboard: https://dashboard.stripe.com/test/apikeys
- Your local `.env.development` file

---

## 📍 Important URLs

**AWS Amplify Console:**
https://console.aws.amazon.com/amplify

**AWS Lambda Console:**
https://console.aws.amazon.com/lambda

**Stripe Test Webhooks:**
https://dashboard.stripe.com/test/webhooks

**Stripe Live Webhooks:**
https://dashboard.stripe.com/webhooks

**Stripe Test Payments:**
https://dashboard.stripe.com/test/payments

---

## 🐛 Common Issues

### "Build failed"
→ Check environment variables are set
→ View build logs in Amplify Console

### "CORS error"
→ Verify Lambda Function URLs are public
→ Check `backend.ts` CORS config

### "Payment failed"
→ Ensure price ID is **one-time** (not subscription)
→ Check CloudWatch logs for details

### "Webhook not received"
→ Verify webhook URL matches Lambda URL
→ Check webhook secret in env vars

---

## ✅ Deployment Checklist

- [ ] Code committed and pushed
- [ ] Amplify app created
- [ ] Environment variables set
- [ ] App deployed (green ✅)
- [ ] Lambda URLs obtained
- [ ] API_BASE_URL configured
- [ ] Stripe webhook created
- [ ] Webhook secret added
- [ ] Test payment successful
- [ ] Webhook delivered (200 OK)

---

## 🎉 Done!

Your site is live at: **https://[branch].[app-id].amplifyapp.com**

**Full Guide:** See `MANUAL_DEPLOYMENT.md` for detailed instructions.

