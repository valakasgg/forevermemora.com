# 🎙️ Memora - AI Voice Memory Service

Memora helps preserve the voices of loved ones through AI-powered speech generation, delivered as beautiful memorial keepsakes.

## 🚀 Quick Links

- **⚡ Get Started Fast:** [QUICK_START_STEPS.md](QUICK_START_STEPS.md) - 30-minute setup
- **🧪 Local Testing:** [LOCAL_TESTING_GUIDE.md](LOCAL_TESTING_GUIDE.md) - Complete local dev guide
- **☁️ AWS Deployment:** [AMPLIFY_DEPLOYMENT_GUIDE.md](AMPLIFY_DEPLOYMENT_GUIDE.md) - Deploy to production
- **✅ Setup Checklist:** [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) - Track your progress
- **🔍 Technical Review:** [REVIEW_SUMMARY.md](REVIEW_SUMMARY.md) - Architecture details

## 📦 What's Included

### Frontend
- Beautiful, responsive website
- Three pricing tiers (Basic $89, Premium $189, Deluxe $269)
- Stripe Checkout integration
- Multi-language support (US, UK, Indonesian)
- Modern UI with sample audio previews

### Backend (AWS Amplify)
- **Serverless Lambda Functions:**
  - `create-checkout-session` - Handles Stripe payment creation
  - `stripe-webhook` - Processes payment events
- **Infrastructure as Code:** TypeScript-based Amplify Gen 2
- **Auto-scaling:** Handles traffic spikes automatically
- **Secure:** Environment-based secrets management

### Payment Integration
- **Stripe Checkout:** Secure, PCI-compliant payments
- **Webhook Processing:** Real-time order tracking
- **Test & Live Modes:** Safe testing before going live
- **Multiple Currencies:** USD support (expandable)

## 🛠️ Technology Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Backend:** AWS Lambda (Node.js 18)
- **Hosting:** AWS Amplify (CloudFront CDN)
- **Payments:** Stripe Checkout
- **Infrastructure:** AWS Amplify Gen 2, TypeScript
- **Local Dev:** Express.js, Concurrently

## 📋 Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- AWS Account ([Sign Up](https://aws.amazon.com))
- Stripe Account ([Sign Up](https://stripe.com))
- Git & GitHub account

## ⚡ Quick Start

### Option 1: Just Want to See It Work? (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp env.development.example .env.development

# 3. Add your Stripe test keys to .env.development
# Get keys from: https://dashboard.stripe.com/test/apikeys

# 4. Update src/amplify-config-inject.js with your Stripe publishable key

# 5. Start development servers
npm run dev:full

# 6. Open http://localhost:8000 and test!
# Use test card: 4242 4242 4242 4242
```

### Option 2: Full Setup with Deployment (30 minutes)

Follow the detailed guide: **[QUICK_START_STEPS.md](QUICK_START_STEPS.md)**

## 📁 Project Structure

```
memora/
├── amplify/                      # AWS Amplify backend
│   ├── backend.ts               # Main backend configuration
│   └── functions/               # Lambda functions
│       ├── create-checkout-session/
│       │   ├── handler.ts       # Checkout session logic
│       │   ├── resource.ts      # Lambda config
│       │   └── package.json
│       └── stripe-webhook/
│           ├── handler.ts       # Webhook event processing
│           ├── resource.ts      # Lambda config
│           └── package.json
│
├── src/                         # Frontend source
│   ├── payment.js              # Stripe payment integration
│   ├── config.js               # Environment configuration
│   ├── config-amplify.js       # Amplify-specific config
│   ├── styles.css              # Styling
│   └── img/                    # Images and assets
│
├── scripts/                     # Build and development scripts
│   ├── local-api-server.js     # Local API for testing
│   ├── local-server.js         # Local web server
│   ├── amplify-build.sh        # Amplify build script
│   └── build-config.js         # Config builder
│
├── index.html                   # Main website
├── success.html                 # Payment success page
├── cancel.html                  # Payment cancel page
├── contact.html                 # Contact page
├── privacy.html                 # Privacy policy
├── terms.html                   # Terms of service
│
├── amplify.yml                  # Amplify build configuration
├── package.json                 # Node dependencies
├── env.development.example      # Environment template
│
└── Documentation/
    ├── QUICK_START_STEPS.md    # 30-min setup guide
    ├── LOCAL_TESTING_GUIDE.md  # Local development
    ├── AMPLIFY_DEPLOYMENT_GUIDE.md  # AWS deployment
    ├── SETUP_CHECKLIST.md      # Progress tracker
    └── REVIEW_SUMMARY.md       # Technical review
```

## 🎯 Available NPM Scripts

```bash
# Local Development
npm run dev              # Start local web server (port 8000)
npm run dev:api          # Start local API server (port 3001)
npm run dev:full         # Start both servers concurrently

# Building
npm run build            # Build for production
npm run build:staging    # Build for staging
npm run config           # Generate config

# Amplify Deployment
npm run amplify:push     # Deploy backend only
npm run amplify:deploy   # Build and deploy everything

# Utilities
npm run clear-keys       # Delete local .env.development
```

## 🔒 Environment Variables

### Local Development (.env.development)
```bash
STRIPE_MODE=test
STRIPE_SECRET_KEY_TEST=sk_test_...
STRIPE_PUBLISHABLE_KEY_TEST=pk_test_...
BASIC_PRICE_ID_TEST=price_...
PREMIUM_PRICE_ID_TEST=price_...
DELUXE_PRICE_ID_TEST=price_...
```

### AWS Amplify (Console Environment Variables)
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key (secure)
- `BASIC_PRICE_ID` - Basic package price ID
- `PREMIUM_PRICE_ID` - Premium package price ID
- `DELUXE_PRICE_ID` - Deluxe package price ID
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
- `DEBUG` - Enable debug logging (true/false)

**📝 Note:** Never commit `.env.development` to Git! Use `env.development.example` as a template.

## 🧪 Testing

### Local Testing with Stripe

**Test Credit Cards:**
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
```

**Expiry:** Any future date  
**CVC:** Any 3 digits  
**ZIP:** Any 5 digits

More test cards: https://stripe.com/docs/testing

### Testing Webhooks Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to http://localhost:3001/api/stripe-webhook

# Copy the webhook secret to .env.development
```

## 🚀 Deployment

### Deploy to AWS Amplify

1. **First time setup:**
   ```bash
   # Commit your code
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Follow deployment guide:**
   See [AMPLIFY_DEPLOYMENT_GUIDE.md](AMPLIFY_DEPLOYMENT_GUIDE.md) for step-by-step instructions

3. **Monitor deployment:**
   - Amplify Console: Build logs
   - Lambda Console: Function execution
   - CloudWatch: Application logs
   - Stripe Dashboard: Webhook deliveries

### Continuous Deployment

Amplify automatically deploys when you push to your connected branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
# Amplify automatically builds and deploys!
```

## 💰 Pricing Packages

| Package | Price | Features |
|---------|-------|----------|
| **Basic** | $89 | 1 voice, 10 min recording, QR card |
| **Premium** | $189 | 1 voice, 30 min audio, QR keychain, background music |
| **Deluxe** | $269 | 2 voices, 60 min, custom memorabilia, highest quality |

## 🔧 Troubleshooting

### Common Issues

**"Module not found" errors:**
```bash
npm install
```

**"Stripe key not configured":**
- Check `.env.development` exists and has valid keys
- Update `src/amplify-config-inject.js` with your publishable key
- Restart both servers

**"Failed to create checkout session":**
- Verify API server is running on port 3001
- Check Stripe keys in `.env.development`
- Verify price IDs match your Stripe products

**Build fails on Amplify:**
- Check environment variables are set in Amplify Console
- Verify Node.js version (should be 18+)
- Check CloudFormation logs in AWS Console

**Webhooks not working:**
- Verify webhook URL points to Lambda function
- Check webhook signing secret in environment variables
- Look at CloudWatch logs for errors

## 📊 Monitoring

### CloudWatch Logs
```
AWS Console → CloudWatch → Log groups
→ /aws/lambda/amplify-[app]-[function]
```

### Stripe Dashboard
- **Payments:** https://dashboard.stripe.com/payments
- **Webhooks:** https://dashboard.stripe.com/webhooks
- **Customers:** https://dashboard.stripe.com/customers

### Amplify Metrics
```
AWS Console → Amplify → Your App
→ Monitoring tab
```

## 🔐 Security

- ✅ All secrets stored in AWS environment variables (not in code)
- ✅ Stripe webhook signature verification enabled
- ✅ HTTPS enforced (AWS Amplify + CloudFront)
- ✅ PCI compliance handled by Stripe
- ✅ CORS properly configured
- ✅ No payment data touches your servers

## 📄 License

ISC License - See LICENSE file for details

## 🤝 Support

- **Documentation:** See all MD files in this repository
- **AWS Amplify:** https://docs.amplify.aws
- **Stripe:** https://stripe.com/docs
- **Issues:** Create an issue in this repository

## 🎯 Roadmap

- [ ] Email notifications for new orders
- [ ] Customer order lookup portal
- [ ] Database integration (DynamoDB)
- [ ] Subscription packages
- [ ] Multi-currency support
- [ ] Admin dashboard
- [ ] Analytics integration
- [ ] A/B testing

## 👥 Team

Memora Team - Preserving memories, one voice at a time.

---

**Ready to get started?** 👉 [QUICK_START_STEPS.md](QUICK_START_STEPS.md)

**Need help?** 👉 [LOCAL_TESTING_GUIDE.md](LOCAL_TESTING_GUIDE.md)

**Deploying?** 👉 [AMPLIFY_DEPLOYMENT_GUIDE.md](AMPLIFY_DEPLOYMENT_GUIDE.md)

