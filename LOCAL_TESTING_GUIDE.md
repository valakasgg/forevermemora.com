# 🧪 Local Testing Guide for Memora with Stripe Payments

This guide will help you test the Memora website with Stripe payments on your local machine before deploying to AWS Amplify.

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **Stripe Account** (free test account)
3. **Code Editor** (VS Code recommended)

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Stripe Test Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Create a free account
3. Switch to **Test Mode** (toggle in the top right)

### Step 3: Get Your Stripe Test Keys

#### A. API Keys

1. Go to [Test API Keys](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Reveal and copy your **Secret key** (starts with `sk_test_`)

#### B. Create Products and Get Price IDs

1. Go to [Test Products](https://dashboard.stripe.com/test/products)
2. Click **+ Add product** for each package:

   **Basic Memory Package:**
   - Name: `Basic Memory Package`
   - Description: `For 1 person's voice. Up to 10 minutes of recording.`
   - Price: `$89.00` USD
   - Click **Save product**
   - Copy the **Price ID** (starts with `price_`)

   **Premium Memory Package:**
   - Name: `Premium Memory Package`
   - Description: `For 1 person's voice. Up to 30 minutes of audio.`
   - Price: `$189.00` USD
   - Click **Save product**
   - Copy the **Price ID** (starts with `price_`)

   **Deluxe Memory Package:**
   - Name: `Deluxe Memory Package`
   - Description: `For 2 people's voices. Up to 60 minutes.`
   - Price: `$269.00` USD
   - Click **Save product**
   - Copy the **Price ID** (starts with `price_`)

### Step 4: Configure Local Environment

1. Copy the example environment file:
   ```bash
   cp .env.development.example .env.development
   ```

2. Edit `.env.development` and add your Stripe keys:
   ```bash
   # Use test mode
   STRIPE_MODE=test

   # Your Stripe Test Keys
   STRIPE_SECRET_KEY_TEST=sk_test_YOUR_ACTUAL_KEY_HERE
   STRIPE_PUBLISHABLE_KEY_TEST=pk_test_YOUR_ACTUAL_KEY_HERE

   # Your Stripe Price IDs
   BASIC_PRICE_ID_TEST=price_YOUR_BASIC_PRICE_ID_HERE
   PREMIUM_PRICE_ID_TEST=price_YOUR_PREMIUM_PRICE_ID_HERE
   DELUXE_PRICE_ID_TEST=price_YOUR_DELUXE_PRICE_ID_HERE
   ```

3. Update `src/amplify-config-inject.js` with your Stripe publishable key:
   ```javascript
   STRIPE_PUBLISHABLE_KEY: 'pk_test_YOUR_ACTUAL_KEY_HERE',
   ```

### Step 5: Start Local Development Servers

Open two terminal windows:

**Terminal 1: Frontend Server**
```bash
npm run dev
```
This starts the website on `http://localhost:8000`

**Terminal 2: API Server**
```bash
npm run dev:api
```
This starts the payment API on `http://localhost:3001`

Or run both together:
```bash
npm run dev:full
```

### Step 6: Test Payments

1. Open `http://localhost:8000` in your browser
2. Click any "Buy Now" button
3. You'll be redirected to Stripe Checkout
4. Use Stripe test card numbers:

   **Successful Payment:**
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)

   **Declined Payment:**
   - Card: `4000 0000 0000 0002`

   **More test cards:** [Stripe Test Cards](https://stripe.com/docs/testing#cards)

5. Complete the checkout
6. Check Terminal 2 for webhook events (you'll see payment confirmations)

## 🔍 Testing Webhooks (Optional but Recommended)

To test Stripe webhooks locally, you need to forward events from Stripe to your local server:

### Option 1: Using Stripe CLI (Recommended)

1. **Install Stripe CLI:**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows
   scoop install stripe
   
   # Linux
   # Download from https://github.com/stripe/stripe-cli/releases
   ```

2. **Login to Stripe:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server:**
   ```bash
   stripe listen --forward-to http://localhost:3001/api/stripe-webhook
   ```

4. **Copy the webhook signing secret** (starts with `whsec_`) and add it to `.env.development`:
   ```bash
   STRIPE_WEBHOOK_SECRET_TEST=whsec_YOUR_WEBHOOK_SECRET_HERE
   ```

5. **Test a webhook:**
   ```bash
   stripe trigger checkout.session.completed
   ```

### Option 2: Manual Webhook Testing

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click **Add endpoint**
3. Use a tunneling service like ngrok:
   ```bash
   npx ngrok http 3001
   ```
4. Copy the ngrok URL and add `/api/stripe-webhook` to create your endpoint
5. Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
6. Save and copy the webhook signing secret to `.env.development`

## ✅ Verification Checklist

- [ ] Frontend loads at `http://localhost:8000`
- [ ] API server running at `http://localhost:3001`
- [ ] API health check responds: `http://localhost:3001/api/health`
- [ ] "Buy Now" buttons redirect to Stripe Checkout
- [ ] Test payment completes successfully
- [ ] Success page displays after payment
- [ ] Console logs show payment confirmation
- [ ] Webhooks are received (if configured)

## 🐛 Troubleshooting

### Issue: "Stripe publishable key not configured"

**Solution:** 
- Check that `.env.development` exists and has valid keys
- Update `src/amplify-config-inject.js` with your publishable key
- Restart both servers

### Issue: "Failed to create checkout session"

**Solution:**
- Check that API server is running on port 3001
- Verify your Stripe secret key in `.env.development`
- Verify price IDs match your Stripe products
- Check Terminal 2 for error messages

### Issue: "Invalid price ID"

**Solution:**
- Ensure you created products in **Test Mode**
- Copy the **Price ID** (not Product ID)
- Price IDs start with `price_`, not `prod_`
- Update `.env.development` with correct price IDs

### Issue: CORS errors in browser console

**Solution:**
- Make sure API server is running
- Check that `http://localhost:8000` is allowed in `scripts/local-api-server.js`
- Clear browser cache and reload

### Issue: Webhook signature verification failed

**Solution:**
- Use Stripe CLI to forward webhooks (recommended)
- Or disable webhook verification for local testing by removing signature check
- Ensure webhook secret in `.env.development` matches Stripe

## 📊 Monitoring Local Payments

### View in Stripe Dashboard

1. Go to [Payments](https://dashboard.stripe.com/test/payments)
2. See all test payments
3. View customer details, amount, and status

### View in Terminal

Watch Terminal 2 for real-time logs:
```
🛒 Creating checkout session for: Basic Memory Package
📧 Customer email: test@example.com
🔑 Using TEST mode
✅ Checkout session created: cs_test_...
```

## 🎯 Next Steps

Once local testing works perfectly:

1. ✅ Verify all three packages work
2. ✅ Test success and cancel flows
3. ✅ Check webhook events are logged
4. 📱 Deploy to AWS Amplify (see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md))

## 🆘 Need Help?

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe Test Cards:** https://stripe.com/docs/testing
- **Stripe CLI:** https://stripe.com/docs/stripe-cli
- **Check Terminal 2** for detailed error messages

## 🔒 Security Notes

- ✅ `.env.development` is in `.gitignore` - never commit it
- ✅ Always use test mode keys for local development
- ✅ Never expose secret keys in frontend code
- ✅ Use webhook signing secrets to verify Stripe events

