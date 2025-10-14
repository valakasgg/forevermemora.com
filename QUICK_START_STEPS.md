# ⚡ Quick Start: Get Memora Running in 30 Minutes

## 🎯 Goal
Get your Memora website with Stripe payments working locally, then deploy to AWS Amplify.

---

## Part 1: Local Testing (15 minutes)

### Step 1: Install Dependencies (2 min)
```bash
cd /Users/nathan/Development/Memora/us
npm install
```

### Step 2: Get Stripe Test Keys (5 min)

1. **Sign up/Login:** https://dashboard.stripe.com
2. **Switch to Test Mode** (toggle in top-right corner)
3. **Get API Keys:** https://dashboard.stripe.com/test/apikeys
   - Copy **Publishable key** (pk_test_...)
   - Reveal and copy **Secret key** (sk_test_...)

### Step 3: Create Stripe Products (5 min)

Go to: https://dashboard.stripe.com/test/products

Create 3 products:
1. **Basic Memory Package**
   - Price: $89
   - Copy the **Price ID** (price_...)

2. **Premium Memory Package**
   - Price: $189
   - Copy the **Price ID** (price_...)

3. **Deluxe Memory Package**
   - Price: $269
   - Copy the **Price ID** (price_...)

### Step 4: Configure Local Environment (3 min)

1. Copy the template:
   ```bash
   cp env.development.example .env.development
   ```

2. Edit `.env.development` and add your keys:
   ```bash
   STRIPE_MODE=test
   STRIPE_SECRET_KEY_TEST=sk_test_YOUR_KEY_HERE
   STRIPE_PUBLISHABLE_KEY_TEST=pk_test_YOUR_KEY_HERE
   BASIC_PRICE_ID_TEST=price_YOUR_ID_HERE
   PREMIUM_PRICE_ID_TEST=price_YOUR_ID_HERE
   DELUXE_PRICE_ID_TEST=price_YOUR_ID_HERE
   ```

3. Update `src/amplify-config-inject.js` line 10:
   ```javascript
   STRIPE_PUBLISHABLE_KEY: 'pk_test_YOUR_ACTUAL_KEY_HERE',
   ```

### Step 5: Start Local Servers (1 min)

```bash
npm run dev:full
```

This starts:
- Frontend: http://localhost:8000
- API: http://localhost:3001

### Step 6: Test Payment (2 min)

1. Open: http://localhost:8000
2. Click any "Buy Now" button
3. Use test card: `4242 4242 4242 4242`
4. Expiry: Any future date (e.g., 12/34)
5. CVC: Any 3 digits (e.g., 123)
6. Complete checkout
7. You should see the success page ✅

---

## Part 2: Deploy to AWS Amplify (15 minutes)

### Step 1: Commit Code (2 min)

```bash
git add .
git commit -m "Add Stripe payment integration"
git push origin main
```

### Step 2: Connect to Amplify (3 min)

1. Go to: https://console.aws.amazon.com/amplify
2. Click **New app** → **Host web app**
3. Choose **GitHub** (or your Git provider)
4. Authorize AWS Amplify
5. Select your repository and branch (`main`)
6. Click **Next**

### Step 3: Review Build Settings (1 min)

- Amplify should auto-detect `amplify.yml`
- Click **Next** → **Save and deploy**
- ⚠️ First deploy will fail (expected - no env vars yet)

### Step 4: Set Environment Variables (3 min)

1. In Amplify Console, go to: **Environment variables**
2. Click **Manage variables**
3. Add these variables:

   | Variable | Value |
   |----------|-------|
   | STRIPE_PUBLISHABLE_KEY | pk_test_... (from Step 2) |
   | STRIPE_SECRET_KEY | sk_test_... (from Step 2) |
   | BASIC_PRICE_ID | price_... (from Step 3) |
   | PREMIUM_PRICE_ID | price_... (from Step 3) |
   | DELUXE_PRICE_ID | price_... (from Step 3) |
   | DEBUG | true |

4. Click **Save**

### Step 5: Redeploy (2 min)

1. In Amplify Console, click **Redeploy this version**
2. Wait for deployment (~5 minutes)
3. Should see green checkmark ✅

### Step 6: Get Lambda URLs (2 min)

1. Go to: https://console.aws.amazon.com/lambda
2. Find: `amplify-[your-app]-create-checkout-session`
3. Click **Configuration** → **Function URL**
4. Copy the URL
5. Also find and copy URL for: `amplify-[your-app]-stripe-webhook`

### Step 7: Configure Stripe Webhook (2 min)

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click **Add endpoint**
3. **Endpoint URL:** Paste the `stripe-webhook` Lambda URL
4. **Events:** Select:
   - checkout.session.completed
   - payment_intent.succeeded  
   - payment_intent.payment_failed
5. Click **Add endpoint**
6. Copy the **Signing secret** (whsec_...)
7. Go back to Amplify Console → Environment variables
8. Add: `STRIPE_WEBHOOK_SECRET` = whsec_...
9. Click **Save** and redeploy

### Step 8: Test Live Site (1 min)

1. Go to your Amplify URL (shown in console)
2. Click "Buy Now"
3. Use test card: 4242 4242 4242 4242
4. Complete checkout
5. Check success page ✅
6. Verify webhook in Stripe Dashboard ✅

---

## 🎉 You're Done!

Your Memora site is now live with Stripe payments!

### ✅ What You Have Now:
- Local development environment
- AWS Amplify hosted site
- Stripe payment integration
- Webhook processing
- Test mode (safe to play with)

### 🚀 Next Steps:

**When ready for production:**
1. Create products in Stripe **Live Mode**
2. Get live API keys
3. Update Amplify environment variables with live keys
4. Test with a real small payment
5. Go live! 🎊

### 📚 Need More Details?

- **Local Testing:** Read `LOCAL_TESTING_GUIDE.md`
- **AWS Deployment:** Read `AMPLIFY_DEPLOYMENT_GUIDE.md`
- **Full Checklist:** See `SETUP_CHECKLIST.md`
- **Architecture Review:** Check `REVIEW_SUMMARY.md`

### 🆘 Troubleshooting

**Issue: "Stripe key not configured"**
- Check `.env.development` has correct keys
- Update `src/amplify-config-inject.js`
- Restart servers

**Issue: "Failed to create checkout session"**
- Verify API server is running (port 3001)
- Check price IDs match Stripe products
- Look at terminal for error messages

**Issue: Amplify build fails**
- Check environment variables are set
- Verify `amplify.yml` exists
- Check CloudFormation logs in AWS Console

**Issue: Webhooks not working**
- Verify webhook URL is correct
- Check signing secret in environment variables
- Look at CloudWatch logs

---

## 💡 Pro Tips

1. **Keep Test Mode:** Always develop with test keys
2. **Use Stripe CLI:** Install for better webhook testing
3. **Monitor CloudWatch:** Check logs after each deployment
4. **Test All Packages:** Verify all three pricing tiers work
5. **Check Webhooks:** Ensure they deliver successfully in Stripe Dashboard

---

**Total Time:** ~30 minutes  
**Difficulty:** Beginner-friendly  
**Cost:** $0 (AWS/Stripe free tiers)  

Happy coding! 🚀

