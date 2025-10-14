# ✅ Memora + Stripe + AWS Amplify Setup Checklist

Quick reference checklist for getting your Memora site running with Stripe payments on AWS Amplify.

## 📝 Pre-Deployment Checklist

### 1. Repository Setup
- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] `.gitignore` properly configured
- [ ] No `.env` files committed (use `env.development.example` as template)
- [ ] All files committed and pushed

### 2. Stripe Setup (Test Mode)
- [ ] Stripe account created
- [ ] Switched to **Test Mode** in Stripe Dashboard
- [ ] Test API keys obtained:
  - [ ] Publishable key (`pk_test_...`)
  - [ ] Secret key (`sk_test_...`)
- [ ] Three products created with correct prices:
  - [ ] Basic Memory Package ($89) - Price ID copied
  - [ ] Premium Memory Package ($189) - Price ID copied
  - [ ] Deluxe Memory Package ($269) - Price ID copied

### 3. Local Testing Setup
- [ ] Dependencies installed: `npm install`
- [ ] `env.development.example` copied to `.env.development`
- [ ] `.env.development` filled with Stripe test keys
- [ ] `src/amplify-config-inject.js` updated with test publishable key
- [ ] Local servers tested:
  - [ ] Frontend: `npm run dev` (http://localhost:8000)
  - [ ] API: `npm run dev:api` (http://localhost:3001)
- [ ] Test payment completed successfully
- [ ] Success/cancel pages working

### 4. AWS Account Setup
- [ ] AWS account created/accessed
- [ ] Region selected (e.g., us-east-1)
- [ ] IAM permissions verified (Amplify, Lambda, CloudFormation)

## 🚀 Deployment Checklist

### 5. AWS Amplify Initial Setup
- [ ] Repository connected to Amplify
- [ ] Branch selected (e.g., `main`)
- [ ] Build settings verified (`amplify.yml`)
- [ ] Service role created/selected

### 6. Environment Variables Set
Navigate to: Amplify Console → Your App → Environment Variables

#### Required Variables (Test Mode):
- [ ] `STRIPE_PUBLISHABLE_KEY` = `pk_test_...`
- [ ] `STRIPE_SECRET_KEY` = `sk_test_...`
- [ ] `BASIC_PRICE_ID` = `price_...` (test)
- [ ] `PREMIUM_PRICE_ID` = `price_...` (test)
- [ ] `DELUXE_PRICE_ID` = `price_...` (test)
- [ ] `DEBUG` = `true`

### 7. First Deployment
- [ ] Initial deployment triggered
- [ ] Build completed successfully
- [ ] Frontend deployed (green checkmark)
- [ ] Backend deployed (Lambda functions created)

### 8. Lambda Function URLs
- [ ] Accessed AWS Lambda Console
- [ ] Found `create-checkout-session` function
- [ ] Copied Function URL
- [ ] Found `stripe-webhook` function  
- [ ] Copied Function URL
- [ ] Updated `API_BASE_URL` environment variable in Amplify
- [ ] Redeployed app

### 9. Stripe Webhook Configuration
- [ ] Stripe webhook endpoint created
- [ ] Endpoint URL set to `stripe-webhook` Lambda Function URL
- [ ] Events selected:
  - [ ] `checkout.session.completed`
  - [ ] `payment_intent.succeeded`
  - [ ] `payment_intent.payment_failed`
- [ ] Webhook signing secret copied
- [ ] `STRIPE_WEBHOOK_SECRET` environment variable updated in Amplify
- [ ] App redeployed

### 10. Testing Deployed Site
- [ ] Amplify site URL accessible
- [ ] All pages load correctly
- [ ] Buy buttons work
- [ ] Redirects to Stripe Checkout
- [ ] Test payment completes (card: 4242 4242 4242 4242)
- [ ] Success page displays
- [ ] Webhook delivered successfully (check Stripe Dashboard)
- [ ] CloudWatch logs show successful payment

## 🎯 Production Readiness Checklist

### 11. Stripe Live Mode Setup
- [ ] Products created in Stripe **Live Mode**
- [ ] Live price IDs obtained:
  - [ ] Basic Memory Package ($89)
  - [ ] Premium Memory Package ($189)
  - [ ] Deluxe Memory Package ($269)
- [ ] Live API keys obtained:
  - [ ] Live publishable key (`pk_live_...`)
  - [ ] Live secret key (`sk_live_...`)

### 12. Production Environment Variables
- [ ] Switched to Live keys in Amplify Environment Variables:
  - [ ] `STRIPE_PUBLISHABLE_KEY` = `pk_live_...`
  - [ ] `STRIPE_SECRET_KEY` = `sk_live_...`
  - [ ] `BASIC_PRICE_ID` = `price_...` (live)
  - [ ] `PREMIUM_PRICE_ID` = `price_...` (live)
  - [ ] `DELUXE_PRICE_ID` = `price_...` (live)
  - [ ] `DEBUG` = `false`
- [ ] App redeployed

### 13. Live Webhook Configuration
- [ ] Live webhook endpoint created in Stripe
- [ ] Live webhook signing secret obtained
- [ ] `STRIPE_WEBHOOK_SECRET` updated with live secret
- [ ] App redeployed

### 14. Security Hardening
- [ ] CORS restricted to actual domain (update `backend.ts`)
- [ ] Webhook signature verification enabled
- [ ] All environment variables use live values
- [ ] Debug mode disabled
- [ ] No sensitive data in frontend code

### 15. Production Testing
- [ ] All three packages tested with live mode
- [ ] Real payment test completed (small amount)
- [ ] Webhooks delivering successfully
- [ ] CloudWatch logs clean (no errors)
- [ ] Email notifications working (if implemented)

### 16. Custom Domain (Optional)
- [ ] Custom domain purchased
- [ ] Domain added in Amplify Console
- [ ] DNS configured
- [ ] SSL certificate provisioned
- [ ] Domain active and accessible
- [ ] Stripe webhooks updated with custom domain

### 17. Monitoring & Alerts
- [ ] CloudWatch alarms set up for:
  - [ ] Lambda errors
  - [ ] Failed webhook deliveries
  - [ ] High latency
- [ ] SNS topics configured for notifications
- [ ] Email alerts configured
- [ ] Stripe monitoring dashboard reviewed

## 📊 Post-Launch Checklist

### 18. Documentation
- [ ] Team briefed on payment flow
- [ ] Support team has access to Stripe Dashboard
- [ ] Webhook event handling documented
- [ ] Rollback procedure documented
- [ ] Environment variable list maintained

### 19. Compliance
- [ ] Privacy policy updated (includes Stripe)
- [ ] Terms of service reviewed
- [ ] GDPR compliance verified (if applicable)
- [ ] PCI compliance noted (Stripe handles)
- [ ] Refund policy documented

### 20. Backup & Recovery
- [ ] Code repository backed up
- [ ] Environment variables documented (securely)
- [ ] Stripe product IDs documented
- [ ] AWS resources documented
- [ ] Recovery procedure tested

## 🔧 Maintenance Checklist

### Monthly
- [ ] Review CloudWatch logs for errors
- [ ] Check Stripe webhook delivery success rate
- [ ] Verify all environment variables current
- [ ] Review failed payments in Stripe
- [ ] Test checkout flow end-to-end

### Quarterly
- [ ] Rotate Stripe API keys (if required)
- [ ] Review AWS costs
- [ ] Update dependencies (`npm audit`, `npm update`)
- [ ] Review Lambda function performance
- [ ] Test disaster recovery procedure

### Annually
- [ ] Review and renew domain (if custom)
- [ ] SSL certificate renewal (auto with Amplify)
- [ ] Comprehensive security audit
- [ ] Update documentation
- [ ] Team training refresh

## 📞 Emergency Contacts

- **AWS Support:** https://console.aws.amazon.com/support
- **Stripe Support:** https://support.stripe.com
- **Emergency Disable:** Pause payments in Stripe Dashboard → Settings

## 🎯 Quick Reference

### Key URLs
- **Amplify Console:** https://console.aws.amazon.com/amplify
- **Lambda Console:** https://console.aws.amazon.com/lambda
- **CloudWatch Logs:** https://console.aws.amazon.com/cloudwatch
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Stripe Webhooks:** https://dashboard.stripe.com/webhooks

### Key Commands
```bash
# Local development
npm run dev:full

# Deploy to Amplify (automatic on git push)
git push origin main

# View logs locally
npm run dev:api

# Install dependencies
npm install

# Update packages
npm update
```

### Emergency Procedures

**Disable Payments Immediately:**
1. Go to Stripe Dashboard
2. Settings → Account → Disable payments
3. Or delete webhook endpoint

**Rollback Deployment:**
1. Amplify Console → Deployments
2. Find last good deployment
3. Click **Redeploy this version**

**View Production Errors:**
1. CloudWatch → Log groups
2. `/aws/lambda/[function-name]`
3. Filter by `ERROR`

---

## ✨ Status: Ready to Launch!

Once all checkboxes above are complete, your Memora site is ready to accept real payments! 🎉

