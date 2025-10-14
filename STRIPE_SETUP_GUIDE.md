# Stripe Setup Guide for Memora

## Overview
This guide will help you set up Stripe payments for Memora's three memory packages:
- **Basic Memory Package**: $89
- **Premium Memory Package**: $189  
- **Deluxe Memory Package**: $269

## Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the account verification process
3. Navigate to the Dashboard

## Step 2: Create Products and Prices

### Create Products in Stripe Dashboard:

1. Go to **Products** in the Stripe Dashboard
2. Click **"Add Product"** for each package:

#### Basic Memory Package
- **Name**: Basic Memory Package
- **Description**: For 1 person's voice. Up to 10 minutes of recording. Handcrafted card with QR code. Standard AI voice processing.
- **Price**: $89.00 USD (one-time payment)
- **Product ID**: Save this for later (e.g., `prod_BasicMemoryPackage`)

#### Premium Memory Package  
- **Name**: Premium Memory Package
- **Description**: For 1 person's voice and everything from Basic. Up to 30 minutes of audio. QR code keychain. Background music. Higher quality audio.
- **Price**: $189.00 USD (one-time payment)
- **Product ID**: Save this for later (e.g., `prod_PremiumMemoryPackage`)

#### Deluxe Memory Package
- **Name**: Deluxe Memory Package  
- **Description**: For 2 people's voices and all Premium features. Up to 60 minutes of recording. Custom memorabilia. Highest quality audio.
- **Price**: $269.00 USD (one-time payment)
- **Product ID**: Save this for later (e.g., `prod_DeluxeMemoryPackage`)

## Step 3: Get API Keys

1. Go to **Developers** → **API Keys**
2. Copy your **Publishable key** (starts with `pk_`)
3. Copy your **Secret key** (starts with `sk_`)
4. **Important**: Use test keys for development, live keys for production

## Step 4: Configure Webhooks

1. Go to **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Set endpoint URL to: `https://your-amplify-app-id.amplifyapp.com/api/stripe-webhook`
4. Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded` 
   - `payment_intent.payment_failed`
5. Copy the **Webhook signing secret** (starts with `whsec_`)

## Step 5: Environment Variables for AWS Amplify

Set these environment variables in your AWS Amplify console:

```
STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)
STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_... for production)  
STRIPE_WEBHOOK_SECRET=whsec_...
BASIC_PRICE_ID=price_... (from Step 2)
PREMIUM_PRICE_ID=price_... (from Step 2)
DELUXE_PRICE_ID=price_... (from Step 2)
```

## Step 6: Update Success/Cancel URLs

In your Stripe checkout configuration, set:
- **Success URL**: `https://your-domain.com/success.html?session_id={CHECKOUT_SESSION_ID}`
- **Cancel URL**: `https://your-domain.com/cancel.html`

## Step 7: Test Mode vs Live Mode

### Test Mode (Development):
- Use test API keys (`pk_test_...`, `sk_test_...`)
- Use test card numbers: `4242 4242 4242 4242`
- No real money is charged

### Live Mode (Production):
- Use live API keys (`pk_live_...`, `sk_live_...`) 
- Real payments will be processed
- Complete Stripe account verification first

## Step 8: Email Collection Setup

During checkout, customers will be prompted to:
1. Provide their email address
2. Select their memory package
3. Complete payment

After successful payment, send them instructions to email:
- **Voice Recordings**: Original audio files of their loved one
- **Personal Script**: Text they want to hear in their voice  
- **Package Selection**: Confirmation of chosen package (Basic/Premium/Deluxe)

## Security Notes

- Never expose secret keys in client-side code
- Always validate webhooks using the signing secret
- Use HTTPS for all endpoints
- Store sensitive data in environment variables only

## Next Steps

1. Implement the AWS Amplify functions (create-checkout-session & stripe-webhook)
2. Add Stripe.js to your frontend
3. Connect Buy Now buttons to checkout sessions
4. Test with Stripe test mode
5. Deploy to production with live keys

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [AWS Amplify Functions Guide](https://docs.amplify.aws/cli/function/)
- Contact your development team for implementation assistance
