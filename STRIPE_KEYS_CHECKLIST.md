# Stripe Setup Checklist for Memora

## 🏪 **STEP 1: Create Stripe Account & Get API Keys**

1. **Go to** [stripe.com](https://stripe.com) and create account
2. **Complete verification** (required for live payments)
3. **Get your keys:**
   - Dashboard → Developers → API Keys
   - Copy **Publishable key** (pk_test_...)
   - Copy **Secret key** (sk_test_...)
   - Toggle to "Live mode" and copy live keys too

## 📦 **STEP 2: Create Products (Do this TWICE - Test & Live mode)**

### Test Mode Products:
1. **Switch to Test Mode** in Stripe Dashboard
2. **Go to Products** → Add Product

#### Basic Memory Package (Test):
- **Name:** Basic Memory Package
- **Description:** For 1 person's voice. Up to 10 minutes of recording. Handcrafted card with QR code. Standard AI voice processing.
- **Pricing:** One-time payment
- **Price:** $89.00 USD
- **Copy the Price ID:** `price_test_1A2B3C...`

#### Premium Memory Package (Test):
- **Name:** Premium Memory Package  
- **Description:** For 1 person's voice and everything from Basic. Up to 30 minutes of audio. QR keychain. Background music. Higher quality audio.
- **Pricing:** One-time payment
- **Price:** $189.00 USD
- **Copy the Price ID:** `price_test_4D5E6F...`

#### Deluxe Memory Package (Test):
- **Name:** Deluxe Memory Package
- **Description:** For 2 people's voices and all Premium features. Up to 60 minutes of recording. Custom memorabilia. Highest quality audio.
- **Pricing:** One-time payment
- **Price:** $269.00 USD
- **Copy the Price ID:** `price_test_7G8H9I...`

### Live Mode Products:
1. **Switch to Live Mode** in Stripe Dashboard
2. **Repeat the same process** for live products
3. **Copy the live Price IDs:** `price_live_...`

## 🔗 **STEP 3: Set Up Webhooks (Do this TWICE - Test & Live mode)**

### Test Mode Webhook:
1. **Test Mode** → Developers → Webhooks → Add endpoint
2. **Endpoint URL:** `https://your-dev-api-id.execute-api.region.amazonaws.com/dev/api/stripe-webhook`
3. **Events to send:**
   - `checkout.session.completed`
   - `payment_intent.succeeded` 
   - `payment_intent.payment_failed`
4. **Copy Signing Secret:** `whsec_test_...`

### Live Mode Webhook:
1. **Live Mode** → Developers → Webhooks → Add endpoint
2. **Endpoint URL:** `https://your-prod-api-id.execute-api.region.amazonaws.com/prod/api/stripe-webhook`
3. **Same events as test**
4. **Copy Signing Secret:** `whsec_live_...`

## 📋 **Your Stripe Keys Summary:**

Copy this template and fill in your actual values:

```bash
# TEST ENVIRONMENT
STRIPE_PUBLISHABLE_KEY_TEST=pk_test_51234567890abcdef...
STRIPE_SECRET_KEY_TEST=sk_test_51234567890abcdef...
STRIPE_WEBHOOK_SECRET_TEST=whsec_test_...
BASIC_PRICE_ID_TEST=price_test_...
PREMIUM_PRICE_ID_TEST=price_test_...
DELUXE_PRICE_ID_TEST=price_test_...

# LIVE ENVIRONMENT  
STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_51234567890abcdef...
STRIPE_SECRET_KEY_LIVE=sk_live_51234567890abcdef...
STRIPE_WEBHOOK_SECRET_LIVE=whsec_live_...
BASIC_PRICE_ID_LIVE=price_live_...
PREMIUM_PRICE_ID_LIVE=price_live_...
DELUXE_PRICE_ID_LIVE=price_live_...
```

## 🎯 **Quick Verification:**

### Test Your Keys:
1. **Publishable keys** start with `pk_test_` or `pk_live_`
2. **Secret keys** start with `sk_test_` or `sk_live_`
3. **Price IDs** start with `price_` followed by random string
4. **Webhook secrets** start with `whsec_`

### Test Card Numbers:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Any future expiry date and CVC**

## ⚠️ **Important Security Notes:**

- ✅ **Safe for frontend:** Publishable keys (pk_test_, pk_live_)
- ❌ **Never in frontend:** Secret keys (sk_test_, sk_live_)
- ❌ **Never in frontend:** Webhook secrets (whsec_...)
- 🔒 **Never commit:** Any keys to version control
- 🎯 **Test first:** Always test with test keys before using live keys
