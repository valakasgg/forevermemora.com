# 🚀 Production Deployment Instructions

## ⚠️ CRITICAL SECURITY NOTICE

Your production zip file contains **LIVE Stripe keys** that can process **REAL payments**!

**Security Requirements:**
- 🔐 Keep the zip file secure and private
- 🚫 Do NOT share the zip file
- 🚫 Do NOT upload to public locations
- 🗑️ Delete the zip file after deployment
- 🔒 Only deploy from a secure, trusted computer

---

## 📦 Files Created

### 1. Production Environment File
**Location:** `/Users/nathan/Development/Memora/us/.env.production`
- Contains LIVE Stripe keys
- Set to LIVE mode (`STRIPE_MODE=live`)
- **NOT tracked by Git** (in .gitignore)

### 2. Production Deployment Zip
**Location:** `/Users/nathan/Development/Memora/us/memora-PRODUCTION-deploy-20251014_174336.zip`
- Includes `.env.production` with LIVE keys
- Size: ~10MB
- **Ready for AWS Amplify deployment**

---

## 🚀 Deployment Steps

### Step 1: Go to AWS Amplify Console

1. Open: https://console.aws.amazon.com/amplify
2. Click **"New app"** → **"Deploy without Git provider"**
3. Choose **"Manual deployment"**

### Step 2: Upload Production Zip

1. **App name:** `memora-production` (or your preferred name)
2. **Environment:** `prod` or `production`
3. **Drag and drop:** `memora-PRODUCTION-deploy-20251014_174336.zip`
4. Click **"Save and deploy"**

### Step 3: Wait for Deployment

- Initial deployment: ~5-10 minutes
- Watch for completion (green checkmarks)
- If it fails, check build logs for errors

### Step 4: Get Lambda Function URLs

After successful deployment:

1. Go to **AWS Lambda Console**: https://console.aws.amazon.com/lambda
2. Find these functions:
   - `amplify-memora-production-create-checkout-session`
   - `amplify-memora-production-stripe-webhook`

For **each function:**
1. Click on the function name
2. Go to **"Configuration"** tab
3. Click **"Function URL"** (left sidebar)
4. **Copy the URL** and save it

Example URLs:
```
create-checkout-session: https://abc123xyz.lambda-url.us-east-1.on.aws
stripe-webhook: https://def456uvw.lambda-url.us-east-1.on.aws
```

### Step 5: Configure Production Stripe Webhook

⚠️ **IMPORTANT:** Use LIVE mode in Stripe!

1. **Go to Stripe LIVE Dashboard:** https://dashboard.stripe.com/webhooks
   - Make sure you're in **LIVE mode** (toggle top-right)

2. **Create Webhook Endpoint:**
   - Click **"Add endpoint"**
   - **Endpoint URL:** Paste your `stripe-webhook` Lambda URL
   - **Description:** `Memora Production Webhooks`
   - **Events to send:** Select these events:
     - ✅ `checkout.session.completed`
     - ✅ `payment_intent.succeeded`
     - ✅ `payment_intent.payment_failed`
   - Click **"Add endpoint"**

3. **Get Webhook Signing Secret:**
   - Click on the newly created endpoint
   - Click **"Reveal"** next to **"Signing secret"**
   - **Copy the secret** (starts with `whsec_`)
   - Example: `whsec_abc123xyz...`

4. **Update Your Production Environment:**
   
   **Option A: Update .env.production locally and redeploy**
   - Edit `/Users/nathan/Development/Memora/us/.env.production`
   - Find: `STRIPE_WEBHOOK_SECRET_LIVE=whsec_live_YOUR_LIVE_WEBHOOK_SECRET_HERE`
   - Replace with your actual webhook secret
   - Save the file
   - Run: `./scripts/create-production-zip.sh`
   - Upload new zip to Amplify
   - Redeploy

   **Option B: Use AWS Amplify Environment Variables** (more secure)
   - Go to Amplify Console → Your app → Environment variables
   - Add/Update: `STRIPE_WEBHOOK_SECRET` = your webhook secret
   - Redeploy

### Step 6: Test Production Deployment

⚠️ **You will be processing REAL payments!**

1. **Access your production site:**
   - Find URL in Amplify Console
   - Example: `https://prod.d123abc.amplifyapp.com`

2. **Test with a SMALL real payment:**
   - Click **"Buy Now"** on Basic package ($89)
   - Use a **REAL credit card** (yours or test card)
   - Complete the checkout
   - ✅ Should redirect to success page

3. **Verify payment in Stripe:**
   - Go to: https://dashboard.stripe.com/payments (LIVE mode)
   - You should see the payment listed
   - Status should be "Succeeded"

4. **Verify webhook delivery:**
   - Go to: https://dashboard.stripe.com/webhooks (LIVE mode)
   - Click on your webhook endpoint
   - Check "Events" tab
   - Should show `checkout.session.completed` with **200 OK**

5. **Check Lambda logs:**
   - AWS Console → CloudWatch → Log groups
   - Find: `/aws/lambda/amplify-memora-production-create-checkout-session`
   - Should see successful checkout session creation

6. **Refund test payment (optional):**
   - Go to Stripe Dashboard → Payments
   - Click on your test payment
   - Click **"Refund"**

---

## ✅ Production Checklist

Before going live to customers:

- [ ] Production zip deployed successfully
- [ ] Lambda functions created and have URLs
- [ ] Stripe LIVE webhook configured
- [ ] Webhook secret updated in deployment
- [ ] Test payment completed successfully
- [ ] Payment visible in Stripe LIVE dashboard
- [ ] Webhook delivered with 200 OK status
- [ ] CloudWatch logs show no errors
- [ ] Success/cancel pages work correctly
- [ ] All three packages tested (or at least one)
- [ ] Custom domain configured (optional but recommended)
- [ ] SSL certificate active (automatic with Amplify)
- [ ] Monitoring/alerts set up
- [ ] Team knows how to check payments in Stripe

---

## 🔒 Post-Deployment Security

After successful deployment:

### 1. Delete Production Zip File

```bash
cd /Users/nathan/Development/Memora/us
rm memora-PRODUCTION-deploy-20251014_174336.zip
echo "✅ Production zip deleted"
```

### 2. Secure .env.production File

The file is already in `.gitignore`, but for extra security:

```bash
# Option A: Delete it (can recreate if needed)
rm .env.production

# Option B: Restrict permissions (only you can read)
chmod 600 .env.production
```

### 3. Rotate Keys Regularly

**Recommended schedule:**
- Every 90 days for regular operations
- Immediately if you suspect compromise
- After team member departures

**How to rotate:**
1. Generate new keys in Stripe Dashboard
2. Update in Amplify or .env.production
3. Redeploy
4. Deactivate old keys in Stripe

---

## 📊 Monitoring Your Production Site

### Check Payments
- **Stripe Dashboard:** https://dashboard.stripe.com/payments
- Filter by date, amount, status
- Export for accounting

### Check Webhooks
- **Webhook Logs:** https://dashboard.stripe.com/webhooks
- Click on your endpoint → "Events" tab
- Look for failed deliveries (fix immediately)

### Check Lambda Logs
- **CloudWatch:** https://console.aws.amazon.com/cloudwatch
- Log groups → `/aws/lambda/amplify-memora-production-*`
- Set up CloudWatch Alarms for errors

### Set Up Alerts

**Recommended CloudWatch Alarms:**
1. Lambda errors > 5 in 5 minutes
2. Webhook delivery failures
3. High latency on checkout creation

**Stripe Alerts:**
1. Go to Stripe Dashboard → Settings → Notifications
2. Enable email alerts for:
   - Failed webhook deliveries
   - Disputed payments
   - Refunds

---

## 🐛 Troubleshooting Production Issues

### Payments Not Working

**Check:**
1. Lambda CloudWatch logs for errors
2. Stripe Dashboard for failed payment attempts
3. Browser console for JavaScript errors
4. Verify price IDs match your Stripe products

**Common issues:**
- Price IDs incorrect (must be from LIVE mode)
- Lambda function timeout (increase to 30 seconds)
- CORS errors (check Lambda CORS config)

### Webhooks Not Delivering

**Check:**
1. Webhook URL matches Lambda URL exactly
2. Webhook secret is correct
3. Webhook events are selected in Stripe
4. Lambda has permissions to execute

**Test webhook:**
- Go to Stripe Dashboard → Webhooks
- Click your endpoint → "Send test webhook"
- Should receive 200 OK response

### Site Down or Errors

**Check:**
1. Amplify deployment status (should be green)
2. CloudFront distribution status
3. Lambda function status
4. Check Amplify build logs for errors

**Emergency rollback:**
1. Go to Amplify Console → Deployments
2. Find last working version
3. Click "Redeploy this version"

---

## 💰 Cost Monitoring

### AWS Costs

**Monitor in:** AWS Billing Dashboard

**Expected monthly costs:**
- Amplify hosting: $5-20
- Lambda executions: $1-10
- CloudWatch logs: $1-5
- Data transfer: $5-20

**Total estimate:** $15-60/month for small to medium traffic

### Stripe Fees

**Per transaction:** 2.9% + $0.30

**Examples:**
- $89 sale → $2.88 fee → $86.12 net
- $189 sale → $5.78 fee → $183.22 net
- $269 sale → $8.10 fee → $260.90 net

---

## 🆘 Emergency Contacts

### Disable Payments Immediately

If you need to stop all payments:

**Option 1: Disable in Stripe**
1. Go to Stripe Dashboard
2. Settings → Account → Disable payments
3. All checkout sessions will fail

**Option 2: Delete Webhook**
1. Go to Stripe Webhooks
2. Delete your production webhook
3. Payments will process but no order tracking

**Option 3: Take Down Site**
1. Go to Amplify Console
2. App settings → Delete app (extreme measure)

### Support Resources

- **AWS Support:** https://console.aws.amazon.com/support
- **Stripe Support:** https://support.stripe.com
- **Stripe Phone:** 1-888-926-2289 (for urgent issues)

---

## ✨ You're Live!

Your Memora production site is now accepting real payments! 🎉

**Your production URL:** `https://prod.[your-app-id].amplifyapp.com`

**Next steps:**
- Monitor payments in Stripe
- Check CloudWatch logs daily
- Set up custom domain
- Add monitoring/alerts
- Train team on payment checking

**Remember:**
- 🗑️ Delete the production zip file
- 🔒 Secure the .env.production file  
- 📊 Monitor Stripe and CloudWatch
- 🔄 Rotate keys every 90 days

---

Good luck with your production deployment! 🚀

