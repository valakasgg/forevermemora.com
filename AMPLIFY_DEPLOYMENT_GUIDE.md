# 🚀 AWS Amplify Deployment Guide for Memora

Complete guide to deploy Memora with Stripe payments to AWS Amplify.

## 📋 Prerequisites

- AWS Account
- Stripe Account (with test and/or production keys)
- GitHub repository (or other Git provider)
- AWS CLI installed (optional but recommended)
- Node.js v18+ installed locally

## 🏗️ Architecture Overview

Your Memora app will deploy with:

1. **Static Website Hosting** (CloudFront CDN)
2. **Lambda Functions** (2 functions):
   - `create-checkout-session` - Creates Stripe checkout sessions
   - `stripe-webhook` - Handles Stripe webhook events
3. **Function URLs** - Direct HTTPS access to Lambda functions
4. **Environment Variables** - Secure storage for Stripe keys

## Part 1: Initial AWS Amplify Setup

### Step 1: Connect Repository to Amplify

1. **Login to AWS Console**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
   - Select your region (e.g., `us-east-1`)

2. **Create New App**
   - Click **New app** → **Host web app**
   - Choose your Git provider (GitHub recommended)
   - Authorize AWS Amplify to access your repository
   - Select your repository and branch (e.g., `main` or `master`)

3. **Configure Build Settings**
   - Amplify should auto-detect the `amplify.yml` file
   - Verify the build settings match:
     ```yaml
     version: 1
     applications:
       - frontend:
           phases:
             preBuild:
               commands:
                 - npm ci
                 - chmod +x scripts/amplify-build.sh
                 - ./scripts/amplify-build.sh
             build:
               commands:
                 - echo "Building frontend..."
           artifacts:
             baseDirectory: /
             files:
               - '**/*'
       - appRoot: amplify
     ```

4. **Review and Deploy**
   - Click **Next** → **Save and deploy**
   - Wait for initial deployment (this will fail - that's expected)

### Step 2: Set Up Environment Variables

The deployment failed because environment variables aren't set yet. Let's fix that.

#### A. For Testing (Test Mode)

1. Go to **Amplify Console** → Your app → **Environment variables**
2. Click **Manage variables**
3. Add the following variables:

   | Variable | Value | Notes |
   |----------|-------|-------|
   | `STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Your Stripe test publishable key |
   | `STRIPE_SECRET_KEY` | `sk_test_...` | Your Stripe test secret key |
   | `BASIC_PRICE_ID` | `price_...` | Basic package price ID (test mode) |
   | `PREMIUM_PRICE_ID` | `price_...` | Premium package price ID (test mode) |
   | `DELUXE_PRICE_ID` | `price_...` | Deluxe package price ID (test mode) |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Leave empty for now, we'll add after deployment |
   | `DEBUG` | `true` | Enable debug logging |

4. Click **Save**

#### B. For Production (Live Mode)

If you're ready to accept real payments:

1. **Create Live Products in Stripe:**
   - Go to [Stripe Products](https://dashboard.stripe.com/products) (LIVE mode)
   - Create the same three products with live prices
   - Copy the live price IDs

2. **Get Live Keys:**
   - Go to [Stripe API Keys](https://dashboard.stripe.com/apikeys)
   - Copy your **Live** publishable and secret keys

3. **Update Environment Variables:**
   - Use `pk_live_...` for `STRIPE_PUBLISHABLE_KEY`
   - Use `sk_live_...` for `STRIPE_SECRET_KEY`
   - Use live `price_...` IDs for the packages
   - Set `DEBUG` to `false`

### Step 3: Deploy Backend Functions

1. **Redeploy the App**
   - Go to **Amplify Console** → Your app
   - Click **Redeploy this version**
   - Wait for deployment to complete (~5-10 minutes)

2. **Verify Deployment**
   - Check that both frontend and backend deployed successfully
   - You should see a green checkmark ✅

3. **Get Lambda Function URLs**
   - Go to **AWS Lambda Console**
   - Find your functions:
     - `amplify-[app-name]-[env]-create-checkout-session`
     - `amplify-[app-name]-[env]-stripe-webhook`
   - Click on each function
   - Go to **Configuration** → **Function URL**
   - Copy both URLs (you'll need these)

### Step 4: Update Frontend Configuration

The frontend needs to know the Lambda function URLs.

#### Option A: Using Environment Variables (Recommended)

1. Add to Amplify Environment Variables:
   - `API_BASE_URL`: Use your create-checkout-session function URL (remove the trailing path)
   
   Example:
   ```
   API_BASE_URL=https://abc123.lambda-url.us-east-1.on.aws
   ```

2. Update `scripts/amplify-build.sh` to inject this URL:
   ```bash
   API_BASE_URL: '${API_BASE_URL}',
   ```

#### Option B: Manual Configuration

Update `src/amplify-config-inject.js` after deployment with actual URLs:
```javascript
window.AWS_AMPLIFY_CONFIG = {
  API_BASE_URL: 'https://your-actual-function-url.lambda-url.us-east-1.on.aws',
  // ... other config
};
```

### Step 5: Configure Stripe Webhooks

Now that your Lambda function is deployed, set up Stripe webhooks:

1. **Get Webhook Function URL**
   - From AWS Lambda Console, copy the `stripe-webhook` function URL
   - Example: `https://xyz789.lambda-url.us-east-1.on.aws`

2. **Create Webhook in Stripe**
   - For Test Mode:
     - Go to [Test Webhooks](https://dashboard.stripe.com/test/webhooks)
   - For Live Mode:
     - Go to [Live Webhooks](https://dashboard.stripe.com/webhooks)
   
   - Click **Add endpoint**
   - Endpoint URL: `https://your-webhook-function-url.lambda-url.us-east-1.on.aws`
   - Description: `Memora Payment Webhooks`
   - Version: `Latest API version`
   
3. **Select Events to Listen For:**
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

4. **Save and Get Signing Secret**
   - Click **Add endpoint**
   - Click on the newly created endpoint
   - Reveal and copy the **Signing secret** (starts with `whsec_`)

5. **Update Environment Variable**
   - Go back to Amplify Console → Environment variables
   - Update `STRIPE_WEBHOOK_SECRET` with the value from Stripe
   - Save and redeploy

## Part 2: Testing Your Deployment

### Step 1: Access Your Site

1. Go to Amplify Console
2. Click on your deployment URL (e.g., `https://main.d123abc.amplifyapp.com`)
3. Your website should load

### Step 2: Test Stripe Checkout

1. Click any "Buy Now" button
2. You should be redirected to Stripe Checkout
3. Use test card: `4242 4242 4242 4242`
4. Complete the checkout
5. You should be redirected to your success page

### Step 3: Verify Webhooks

1. Go to Stripe Dashboard → [Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click on your webhook endpoint
3. You should see successful webhook deliveries
4. Status should be `200 OK`

### Step 4: Check Lambda Logs

1. Go to AWS Lambda Console
2. Click on `create-checkout-session` function
3. Go to **Monitor** → **Logs** → **View CloudWatch logs**
4. You should see successful checkout session creation logs

## Part 3: Production Checklist

Before going live with real payments:

### Security

- [ ] Switch to Stripe **Live Mode** keys
- [ ] Update all environment variables with live values
- [ ] Restrict CORS to your actual domain (update `backend.ts`)
- [ ] Enable Stripe webhook signature verification
- [ ] Set `DEBUG=false` in environment variables

### Testing

- [ ] Test all three packages (Basic, Premium, Deluxe)
- [ ] Test successful payment flow
- [ ] Test payment failure (use `4000 0000 0000 0002`)
- [ ] Test cancel flow
- [ ] Verify webhook events are received
- [ ] Check CloudWatch logs for errors

### Monitoring

- [ ] Set up CloudWatch alarms for Lambda errors
- [ ] Monitor Stripe webhook delivery success rate
- [ ] Set up error notifications (SNS/Email)

### Domain Setup (Optional)

1. **Add Custom Domain:**
   - Go to Amplify Console → Domain management
   - Add your custom domain
   - Follow DNS configuration instructions
   - Wait for SSL certificate provisioning

2. **Update Stripe Webhook URLs:**
   - After domain is active, update webhook URL in Stripe
   - Update CORS settings in Lambda functions

## Part 4: Environment Management

### Multiple Environments

Amplify supports multiple environments (dev, staging, prod):

1. **Create New Branch:**
   ```bash
   git checkout -b staging
   git push origin staging
   ```

2. **Connect Branch in Amplify:**
   - Go to Amplify Console
   - Click **Connect branch**
   - Select `staging` branch
   - Configure separate environment variables

3. **Benefits:**
   - `main` branch → Production (live keys)
   - `staging` branch → Staging (test keys)
   - `dev` branch → Development (test keys)

### Updating Environment Variables

1. Go to Amplify Console → Environment variables
2. Update values
3. Click **Save**
4. Redeploy the app (automatic or manual)

## Part 5: CI/CD Pipeline

### Automatic Deployments

Amplify automatically deploys when you push to connected branches:

```bash
# Make changes
git add .
git commit -m "Update payment flow"
git push origin main

# Amplify automatically builds and deploys
```

### Manual Deployments

1. Go to Amplify Console
2. Click **Redeploy this version**
3. Wait for deployment

### Rollback

1. Go to Amplify Console → Deployments
2. Find previous successful deployment
3. Click **...** → **Redeploy this version**

## 🐛 Troubleshooting

### Issue: Build Fails During Deployment

**Check:**
- Amplify build logs for errors
- Verify `amplify.yml` syntax
- Ensure `scripts/amplify-build.sh` has execute permissions
- Check Node.js version in Amplify (should be 18+)

**Solution:**
```bash
# Update amplify.yml to specify Node version
preBuild:
  commands:
    - nvm use 18
    - npm ci
```

### Issue: Lambda Functions Not Created

**Check:**
- Ensure `amplify/backend.ts` is correct
- Verify TypeScript syntax
- Check Amplify build logs for backend errors

**Solution:**
- Redeploy from Amplify Console
- Check CloudFormation stack in AWS Console

### Issue: CORS Errors in Browser

**Check:**
- Lambda function CORS configuration in `backend.ts`
- Ensure Function URLs are public (authType: 'NONE')

**Solution:**
Update `backend.ts` to allow your domain:
```typescript
allowedOrigins: ['https://your-domain.amplifyapp.com'],
```

### Issue: Stripe Webhooks Not Working

**Check:**
- Webhook URL is correct (should be Lambda Function URL)
- Webhook secret is set in environment variables
- Webhook events are configured in Stripe

**Solution:**
1. Test webhook manually in Stripe Dashboard
2. Check Lambda CloudWatch logs for errors
3. Verify signature verification logic

### Issue: Environment Variables Not Available

**Check:**
- Variables are set in Amplify Console
- Variables are referenced in `resource.ts` files
- App was redeployed after setting variables

**Solution:**
1. Verify in Amplify Console → Environment variables
2. Redeploy the app
3. Check Lambda function environment variables in AWS Console

## 📊 Monitoring and Logs

### CloudWatch Logs

1. **View Lambda Logs:**
   - AWS Console → CloudWatch → Log groups
   - Find `/aws/lambda/amplify-[app-name]-[env]-[function-name]`
   - View real-time logs

2. **Set Up Log Filters:**
   ```
   # Find errors
   ?ERROR ?error ?failed

   # Find successful payments
   ?checkout.session.completed
   ```

### Stripe Dashboard

1. **Monitor Payments:**
   - [Test Payments](https://dashboard.stripe.com/test/payments)
   - [Live Payments](https://dashboard.stripe.com/payments)

2. **Check Webhook Deliveries:**
   - [Test Webhooks](https://dashboard.stripe.com/test/webhooks)
   - [Live Webhooks](https://dashboard.stripe.com/webhooks)
   - View delivery attempts and responses

### Amplify Metrics

1. Go to Amplify Console → your app
2. View:
   - Deployment history
   - Traffic metrics
   - Error rates

## 🎯 Performance Optimization

### Lambda Optimization

1. **Increase Memory** (if needed):
   - Update `resource.ts`: `memoryMB: 1024`

2. **Reduce Cold Starts:**
   - Consider Lambda provisioned concurrency (for high traffic)

### CloudFront CDN

- Amplify automatically uses CloudFront
- Static assets are cached globally
- No additional configuration needed

## 🔒 Security Best Practices

1. **Rotate Stripe Keys Regularly**
2. **Use Environment Variables for Secrets**
3. **Enable Webhook Signature Verification**
4. **Restrict CORS to Your Domain**
5. **Monitor Failed Webhook Deliveries**
6. **Set Up CloudWatch Alarms**
7. **Use IAM Roles with Least Privilege**

## 💰 Cost Estimation

### AWS Costs (Approximate)

- **Amplify Hosting**: $0.01 per GB served + $0.15 per build minute
- **Lambda Functions**: Free tier: 1M requests/month, then $0.20 per 1M requests
- **CloudWatch Logs**: Free tier: 5GB, then $0.50 per GB
- **Data Transfer**: First 1GB free, then $0.09 per GB

### Typical Monthly Cost

- **Low Traffic** (< 100 orders/month): ~$0-5
- **Medium Traffic** (100-1000 orders/month): ~$5-20
- **High Traffic** (> 1000 orders/month): ~$20-100

## ✅ Final Checklist

- [ ] Repository connected to Amplify
- [ ] Environment variables configured
- [ ] Backend functions deployed
- [ ] Frontend deployed and accessible
- [ ] Stripe products created
- [ ] Stripe webhooks configured
- [ ] Test payments working
- [ ] Webhooks delivering successfully
- [ ] CloudWatch logs show no errors
- [ ] Custom domain configured (optional)
- [ ] Production keys set (when ready)
- [ ] Monitoring and alarms set up

## 🆘 Support Resources

- **AWS Amplify Docs:** https://docs.amplify.aws
- **Stripe Docs:** https://stripe.com/docs
- **AWS Support:** https://console.aws.amazon.com/support
- **Stripe Support:** https://support.stripe.com

---

🎉 **Congratulations!** Your Memora app with Stripe payments is now live on AWS Amplify!

