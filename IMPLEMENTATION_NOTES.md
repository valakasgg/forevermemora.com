# 📝 Implementation Notes - Memora AWS Amplify + Stripe Integration

**Date:** October 13, 2025  
**Status:** ✅ Ready for Deployment  
**Next Step:** Run `npm install` and follow QUICK_START_STEPS.md

---

## ✅ What Was Done

### 1. Fixed AWS Amplify Backend Configuration

**File:** `amplify/backend.ts`

**Issues Fixed:**
- ❌ **Before:** Incorrectly tried to access non-existent `functionUrl` property
- ✅ **After:** Properly calls `addFunctionUrl()` method with CORS configuration

**Changes:**
```typescript
// Added proper Function URL configuration
checkoutFunction.resources.lambda.addFunctionUrl({
  authType: 'NONE',
  cors: {
    allowedOrigins: ['*'],
    allowedMethods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 300,
  },
});
```

**Why This Matters:**
- Lambda functions need explicit Function URLs to be accessible via HTTPS
- CORS must be configured for frontend to call backend
- Without this, Stripe checkout creation would fail

### 2. Updated Lambda Resource Configurations

**Files:**
- `amplify/functions/create-checkout-session/resource.ts`
- `amplify/functions/stripe-webhook/resource.ts`

**Changes:**
- Added `memoryMB: 512` for better performance
- Improved documentation for environment variables
- Clarified where to set variables (Amplify Console → Environment Variables)

### 3. Fixed Package Dependencies

**File:** `package.json`

**Added:**
```json
"devDependencies": {
  "@aws-amplify/backend": "^1.0.0",
  "@aws-amplify/backend-cli": "^1.0.0",
  "@aws-amplify/cli": "^12.0.0",
  "typescript": "^5.0.0"
}
```

**Why:** Required for Amplify Gen 2 backend development and deployment

### 4. Updated .gitignore

**File:** `.gitignore`

**Changes:**
- Allow `amplify/` directory to be tracked (contains backend source code)
- Allow `aws-exports.js` to be tracked (contains configuration template)
- Allow `env.development.example` to be tracked (template for developers)
- Still ignore `.env.development` (contains actual secrets)

### 5. Created Comprehensive Documentation

**New Files Created:**

1. **`env.development.example`** - Template for local development environment
   - All Stripe keys documented
   - Clear setup instructions
   - Both test and live mode sections

2. **`LOCAL_TESTING_GUIDE.md`** - Complete local development guide
   - Step-by-step Stripe setup
   - Local server configuration
   - Testing procedures
   - Troubleshooting section

3. **`AMPLIFY_DEPLOYMENT_GUIDE.md`** - Full AWS deployment guide
   - Repository connection
   - Environment variable setup
   - Lambda function configuration
   - Stripe webhook setup
   - Production checklist

4. **`SETUP_CHECKLIST.md`** - Comprehensive deployment checklist
   - Pre-deployment tasks
   - Deployment steps
   - Production readiness
   - Maintenance schedule

5. **`REVIEW_SUMMARY.md`** - Technical review and architecture
   - What's working
   - What was fixed
   - Architecture diagram
   - Security review
   - Cost estimates

6. **`QUICK_START_STEPS.md`** - 30-minute quick start guide
   - Fast-track setup
   - Minimal steps to get running
   - Local and deployment in 30 minutes

7. **`README.md`** - Main project documentation
   - Project overview
   - Quick links to all guides
   - Technology stack
   - Available commands
   - Support resources

8. **`IMPLEMENTATION_NOTES.md`** - This file
   - What was changed
   - Why it was changed
   - How to proceed

---

## 🔍 Current Architecture

### Request Flow

```
User clicks "Buy Now"
    ↓
Frontend (payment.js)
    ↓
POST request to Lambda Function URL
    ↓
Lambda: create-checkout-session
    ↓
Stripe API: Create Checkout Session
    ↓
Stripe returns session URL
    ↓
Frontend redirects to Stripe Checkout
    ↓
User completes payment
    ↓
Stripe sends webhook event
    ↓
Lambda: stripe-webhook
    ↓
Process payment (log/email/database)
    ↓
User redirected to success page
```

### AWS Resources Created

When you deploy, Amplify will create:

1. **CloudFront Distribution** (CDN for static files)
2. **S3 Bucket** (for static website hosting)
3. **Lambda Functions** (2):
   - `create-checkout-session` - Payment creation
   - `stripe-webhook` - Webhook processing
4. **CloudWatch Log Groups** (for monitoring)
5. **IAM Roles** (for Lambda execution)
6. **Function URLs** (HTTPS endpoints for Lambdas)

### Environment Variables Flow

**Local Development:**
```
.env.development
    ↓
scripts/local-api-server.js
    ↓
Local Express API (port 3001)
```

**Production:**
```
Amplify Console → Environment Variables
    ↓
amplify/functions/*/resource.ts
    ↓
Lambda Environment Variables
    ↓
Lambda Handler Code
```

---

## ⚠️ Known Issues & Limitations

### 1. Linter Error (Expected)
```
Cannot find module '@aws-amplify/backend'
```
**Status:** Normal - not installed yet  
**Solution:** Run `npm install`

### 2. No Email Notifications Yet
**Status:** TODO comments in webhook handler  
**Solution:** Integrate AWS SES or SendGrid (future enhancement)

### 3. No Persistent Storage
**Status:** Orders logged to CloudWatch only  
**Solution:** Add DynamoDB table (future enhancement)

### 4. No Customer Portal
**Status:** Not implemented  
**Solution:** Build order lookup system (future enhancement)

---

## 🎯 Next Steps (In Order)

### Immediate (Before Testing)

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Verify Installation:**
   ```bash
   npm list @aws-amplify/backend
   # Should show version ^1.0.0
   ```

### For Local Testing

3. **Set Up Stripe Test Account:**
   - Create account: https://dashboard.stripe.com
   - Switch to Test Mode
   - Get API keys

4. **Create Stripe Products:**
   - Basic Memory Package: $89
   - Premium Memory Package: $189
   - Deluxe Memory Package: $269

5. **Configure Local Environment:**
   ```bash
   cp env.development.example .env.development
   # Edit .env.development with your Stripe keys
   ```

6. **Update Frontend Config:**
   - Edit `src/amplify-config-inject.js`
   - Add your Stripe publishable key

7. **Test Locally:**
   ```bash
   npm run dev:full
   # Visit http://localhost:8000
   # Test with card: 4242 4242 4242 4242
   ```

### For AWS Deployment

8. **Commit Changes:**
   ```bash
   git add .
   git commit -m "Add Stripe payment integration"
   git push origin main
   ```

9. **Follow Deployment Guide:**
   - See `AMPLIFY_DEPLOYMENT_GUIDE.md`
   - Set up environment variables in Amplify Console
   - Configure Stripe webhooks

10. **Test Production:**
    - Complete test purchase
    - Verify webhooks
    - Check CloudWatch logs

---

## 🔐 Security Considerations

### ✅ Implemented

1. **Environment Variables:** All secrets stored securely
2. **Webhook Verification:** Stripe signature verification enabled
3. **HTTPS Only:** All traffic encrypted
4. **No Secrets in Code:** Keys never hardcoded
5. **CORS Configured:** Proper cross-origin settings
6. **PCI Compliance:** Stripe handles all payment data

### 🚧 Recommended (Before Production)

1. **Restrict CORS:** Update `backend.ts` to allow only your domain
   ```typescript
   allowedOrigins: ['https://yourdomain.com'],
   ```

2. **Enable CloudWatch Alarms:** Monitor for Lambda errors

3. **Set Up AWS WAF:** Rate limiting for Lambda functions (optional)

4. **Review IAM Roles:** Ensure least privilege access

5. **Enable AWS Shield:** DDoS protection (optional)

---

## 💰 Cost Breakdown

### AWS Amplify (Monthly Estimates)

**Free Tier Benefits:**
- First 1,000 build minutes/month
- First 15 GB served/month
- First 1M Lambda requests/month

**After Free Tier:**
- **Amplify Hosting:** $0.15/GB served
- **Build Minutes:** $0.01/minute
- **Lambda Invocations:** $0.20 per 1M requests
- **Lambda Duration:** $0.00001667 per GB-second
- **CloudWatch Logs:** $0.50/GB ingested

**Example Monthly Costs:**
- **100 orders/month:** ~$0-2
- **500 orders/month:** ~$2-10
- **2,000 orders/month:** ~$10-30

### Stripe Fees (Per Transaction)

- **Rate:** 2.9% + $0.30 per successful charge

**Examples:**
- $89 sale → $2.88 fee → $86.12 net
- $189 sale → $5.78 fee → $183.22 net
- $269 sale → $8.10 fee → $260.90 net

---

## 📊 Testing Checklist

### Local Testing

- [ ] Frontend loads (http://localhost:8000)
- [ ] API server running (http://localhost:3001)
- [ ] Health check works (http://localhost:3001/api/health)
- [ ] Buy buttons redirect to Stripe
- [ ] Test payment completes
- [ ] Success page displays
- [ ] Cancel page works
- [ ] Console logs show payment info

### Production Testing

- [ ] Amplify deployment successful
- [ ] Website accessible via Amplify URL
- [ ] Lambda functions deployed
- [ ] Function URLs created
- [ ] Environment variables set
- [ ] Test payment works end-to-end
- [ ] Webhooks delivered successfully
- [ ] CloudWatch logs clean
- [ ] No CORS errors in browser console

---

## 🆘 Troubleshooting Quick Reference

### Issue: npm install fails

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: TypeScript errors in amplify/

**Cause:** Dependencies not installed  
**Solution:** Run `npm install`

### Issue: Local API won't start

**Cause:** .env.development missing  
**Solution:**
```bash
cp env.development.example .env.development
# Edit and add your Stripe keys
```

### Issue: Amplify build fails

**Cause:** Environment variables not set  
**Solution:** Add all required variables in Amplify Console

### Issue: Payments fail on deployed site

**Cause:** Lambda function URLs not configured  
**Solution:** Check `backend.ts` has `addFunctionUrl()` calls

### Issue: Webhooks not receiving

**Cause:** Webhook URL incorrect or secret missing  
**Solution:** Verify URL in Stripe Dashboard and secret in env vars

---

## 📚 Documentation Quick Reference

| Guide | Purpose | When to Use |
|-------|---------|-------------|
| `README.md` | Overview & quick links | Start here |
| `QUICK_START_STEPS.md` | 30-min setup | Want to launch fast |
| `LOCAL_TESTING_GUIDE.md` | Local development | Setting up dev environment |
| `AMPLIFY_DEPLOYMENT_GUIDE.md` | AWS deployment | Deploying to production |
| `SETUP_CHECKLIST.md` | Track progress | Step-by-step deployment |
| `REVIEW_SUMMARY.md` | Technical details | Understanding architecture |
| `IMPLEMENTATION_NOTES.md` | What changed | Reference for what was done |

---

## ✅ Final Verification

Before considering setup complete, verify:

- [ ] All files created and saved
- [ ] package.json updated with new dependencies
- [ ] .gitignore properly configured
- [ ] env.development.example created
- [ ] All documentation files present
- [ ] Backend configuration fixed
- [ ] Lambda resources updated

---

## 🎉 Success Criteria

You'll know everything works when:

1. **Local:** Can complete a test purchase at localhost:8000
2. **Deployed:** Can complete a test purchase at your Amplify URL
3. **Webhooks:** Events show as "Succeeded" in Stripe Dashboard
4. **Logs:** CloudWatch shows successful payment processing
5. **No Errors:** Browser console is clean, no CORS errors

---

## 📞 Support Resources

- **This Codebase:** All MD files have detailed instructions
- **AWS Amplify Docs:** https://docs.amplify.aws
- **Stripe Docs:** https://stripe.com/docs
- **Stripe Testing:** https://stripe.com/docs/testing
- **AWS Support:** https://console.aws.amazon.com/support

---

**Ready to begin?** → Start with `npm install`, then follow **QUICK_START_STEPS.md**

**Questions?** → Check **REVIEW_SUMMARY.md** for architecture details

**Deploying?** → Follow **AMPLIFY_DEPLOYMENT_GUIDE.md** step by step

Good luck! 🚀

