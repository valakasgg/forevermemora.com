# Memora Stripe Integration - Deployment Guide

## 🎯 Overview
Complete guide to deploy Memora with Stripe payments on AWS Amplify. This setup allows customers to purchase your three memory packages securely.

## 📋 Pre-Deployment Checklist

### 1. Stripe Account Setup
- [ ] Create Stripe account at [stripe.com](https://stripe.com)
- [ ] Complete account verification
- [ ] Create products for all three packages:
  - Basic Memory Package ($89)
  - Premium Memory Package ($189) 
  - Deluxe Memory Package ($269)
- [ ] Copy Price IDs for each package
- [ ] Get API keys (Publishable & Secret)
- [ ] Set up webhook endpoint

### 2. AWS Amplify Prerequisites
- [ ] AWS account with appropriate permissions
- [ ] Amplify CLI installed: `npm install -g @aws-amplify/cli`
- [ ] AWS credentials configured: `amplify configure`

## 🚀 Deployment Steps

### Step 1: Initialize Amplify Project
```bash
cd /Users/nathan/Development/Memora/us
amplify init
```

Choose these options:
- Project name: `memora-website`
- Environment: `dev` (or `prod` for production)
- Default editor: Your preferred editor
- App type: `javascript`
- Framework: `none`
- Source directory: `.`
- Distribution directory: `.`
- Build command: `npm run build`
- Start command: `npm run dev`

### Step 2: Add API Gateway
```bash
amplify add api
```

Choose:
- Select service type: `REST`
- Provide friendly name: `memoraapi`
- Provide path: `/api`
- Create new Lambda function: `Yes`

### Step 3: Configure Functions
The functions are already created in:
- `amplify/functions/create-checkout-session/`
- `amplify/functions/stripe-webhook/`

Make sure to install dependencies in each function:
```bash
cd amplify/functions/create-checkout-session
npm install

cd ../stripe-webhook
npm install
```

### Step 4: Set Environment Variables
In AWS Amplify Console, go to App Settings > Environment Variables and add:

```
STRIPE_SECRET_KEY=sk_test_... (use sk_live_... for production)
STRIPE_PUBLISHABLE_KEY=pk_test_... (use pk_live_... for production)
STRIPE_WEBHOOK_SECRET=whsec_...
BASIC_PRICE_ID=price_...
PREMIUM_PRICE_ID=price_...
DELUXE_PRICE_ID=price_...
```

### Step 5: Update Stripe Publishable Key
Edit `index.html` and replace the placeholder:
```javascript
window.STRIPE_PUBLISHABLE_KEY = 'pk_test_your_actual_publishable_key_here';
```

### Step 6: Deploy to AWS
```bash
amplify push
```

This will:
- Create API Gateway endpoints
- Deploy Lambda functions
- Set up proper permissions

### Step 7: Configure Stripe Webhooks
1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://your-api-id.execute-api.region.amazonaws.com/dev/api/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook signing secret to environment variables

### Step 8: Deploy Frontend
```bash
amplify add hosting
amplify publish
```

## 🔧 Configuration Files Summary

### Created/Modified Files:
1. **STRIPE_SETUP_GUIDE.md** - Complete Stripe setup instructions
2. **amplify/functions/create-checkout-session/** - Handles payment session creation
3. **amplify/functions/stripe-webhook/** - Processes payment webhooks
4. **src/payment.js** - Client-side Stripe integration
5. **success.html** - Payment success page with instructions
6. **cancel.html** - Payment cancellation page
7. **package.json** - Project dependencies
8. **index.html** - Updated with Stripe.js integration

### API Endpoints:
- `POST /api/create-checkout-session` - Creates Stripe checkout session
- `POST /api/stripe-webhook` - Handles Stripe webhooks

## 🧪 Testing

### Test Mode (Development):
1. Use test API keys (`pk_test_...`, `sk_test_...`)
2. Use test card: `4242 4242 4242 4242`
3. Any CVC and future expiry date
4. Test all three packages

### Test Flow:
1. Visit your deployed site
2. Click "Buy Now" on any package
3. Fill out Stripe checkout form with test card
4. Verify redirect to success page
5. Check webhook logs in AWS CloudWatch

## 📧 Customer Flow

### After Successful Payment:
1. **Immediate**: Redirect to success.html
2. **Email Required**: Customer must send to `orders@memora.com`:
   - Voice recordings of loved one
   - Personal script text
   - Package confirmation
3. **Processing**: 5-7 business days
4. **Delivery**: Digital audio files + physical memorabilia

## 🔐 Security Considerations

### Environment Variables:
- Never commit secret keys to version control
- Use different keys for test/production
- Rotate keys periodically

### Webhook Security:
- Always verify webhook signatures
- Use HTTPS endpoints only
- Log webhook events for debugging

### Data Handling:
- Customer emails collected during checkout
- Payment data handled by Stripe (PCI compliant)
- Voice recordings sent via email (consider secure upload in future)

## 📊 Monitoring & Analytics

### AWS CloudWatch:
- Monitor Lambda function performance
- Check for errors in function logs
- Set up alarms for failed payments

### Stripe Dashboard:
- Monitor successful payments
- Track failed payments
- Analyze customer behavior

## 🔧 Troubleshooting

### Common Issues:

**1. "Payment system not initialized"**
- Check Stripe publishable key is set correctly
- Verify Stripe.js is loaded before payment.js

**2. "Failed to create checkout session"**
- Check AWS function logs in CloudWatch
- Verify environment variables are set
- Confirm Price IDs match Stripe products

**3. "Webhook signature verification failed"**
- Verify webhook secret in environment variables
- Check webhook endpoint URL in Stripe

**4. CORS Issues**
- API Gateway CORS is configured in the Lambda functions
- Check browser console for specific CORS errors

### Debug Steps:
1. Check browser console for JavaScript errors
2. Review AWS CloudWatch logs for Lambda functions
3. Verify Stripe webhook delivery in Stripe Dashboard
4. Test with Stripe's test mode first

## 🚀 Going Live

### Production Checklist:
- [ ] Replace all test keys with live keys
- [ ] Update webhook endpoints to production URLs
- [ ] Test complete flow with real payment methods
- [ ] Set up monitoring and alerts
- [ ] Update success/cancel page URLs in Stripe
- [ ] Configure real email addresses for order processing

### Environment Variables (Production):
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
# Price IDs remain the same or update if you created new products
```

## 📞 Support

### Resources:
- [Stripe Documentation](https://stripe.com/docs)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)

### Contact:
- Technical issues: Check CloudWatch logs first
- Stripe issues: Stripe support or documentation
- Deployment issues: AWS Amplify documentation

---

Your Memora payment system is now ready! Customers can purchase memory packages securely, and you'll receive their materials via email for processing.
