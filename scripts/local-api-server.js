// Local API Server for Memora Payment Testing
// Mimics AWS Lambda functions for local development

const express = require('express');
const cors = require('cors');
const stripe = require('stripe');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware - CORS must be first
app.use(cors({
  origin: ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:8000/', 'http://127.0.0.1:8000/'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: false,
  optionsSuccessStatus: 200,
  preflightContinue: false
}));

app.use(express.json());

// Load environment variables from .env.development
function loadLocalEnv() {
  const envPath = path.join(__dirname, '..', '.env.development');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.development file not found. Please create it with your Stripe keys.');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  return envVars;
}

// Load environment variables
const env = loadLocalEnv();
const stripeMode = env.STRIPE_MODE || 'test';
const isLiveMode = stripeMode === 'live';

// Initialize Stripe with appropriate secret key
const stripeSecretKey = isLiveMode ? env.STRIPE_SECRET_KEY_LIVE : env.STRIPE_SECRET_KEY_TEST;
const stripeClient = stripe(stripeSecretKey);

// Package configurations
const packages = {
  'Basic Memory Package': {
    priceId: isLiveMode ? env.BASIC_PRICE_ID_LIVE : env.BASIC_PRICE_ID_TEST,
    price: 89
  },
  'Premium Memory Package': {
    priceId: isLiveMode ? env.PREMIUM_PRICE_ID_LIVE : env.PREMIUM_PRICE_ID_TEST,
    price: 189
  },
  'Deluxe Memory Package': {
    priceId: isLiveMode ? env.DELUXE_PRICE_ID_LIVE : env.DELUXE_PRICE_ID_TEST,
    price: 269
  }
};

// Create checkout session endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { packageType, customerEmail } = req.body;

    console.log(`🛒 Creating checkout session for: ${packageType}`);
    console.log(`📧 Customer email: ${customerEmail || 'Not provided'}`);
    console.log(`🔑 Using ${stripeMode.toUpperCase()} mode`);

    // Validate package
    const packageConfig = packages[packageType];
    if (!packageConfig) {
      throw new Error(`Invalid package type: ${packageType}`);
    }

    if (!packageConfig.priceId || packageConfig.priceId.includes('YOUR_') || packageConfig.priceId.includes('_HERE')) {
      throw new Error(`Price ID not configured for ${packageType} in ${stripeMode} mode`);
    }

    // Create checkout session
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: packageConfig.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:8000/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:8000/cancel.html`,
      metadata: {
        package_type: packageType,
        environment: stripeMode
      }
    };

    // Add customer email if provided
    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }

    const session = await stripeClient.checkout.sessions.create(sessionConfig);

    console.log(`✅ Checkout session created: ${session.id}`);

    res.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('❌ Checkout session error:', error.message);
    res.status(400).json({
      error: error.message
    });
  }
});

// Stripe webhook endpoint
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = isLiveMode ? env.STRIPE_WEBHOOK_SECRET_LIVE : env.STRIPE_WEBHOOK_SECRET_TEST;

  if (!webhookSecret || webhookSecret.includes('YOUR_') || webhookSecret.includes('_HERE')) {
    console.log('⚠️ Webhook secret not configured, skipping signature verification');
    return res.json({ received: true });
  }

  let event;

  try {
    event = stripeClient.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('✅ Payment successful for session:', session.id);
      console.log('📦 Package:', session.metadata?.package_type);
      break;
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('💰 Payment succeeded:', paymentIntent.id);
      break;
    default:
      console.log(`🔄 Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: stripeMode,
    timestamp: new Date().toISOString(),
    packages: Object.keys(packages)
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Memora Local API Server Started');
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🔑 Stripe Mode: ${stripeMode.toUpperCase()}`);
  console.log(`💳 Secret Key: ${stripeSecretKey?.substring(0, 12)}...`);
  console.log('');
  console.log('📋 Available Endpoints:');
  console.log('   POST /api/create-checkout-session');
  console.log('   POST /api/stripe-webhook');
  console.log('   GET  /api/health');
  console.log('');
  console.log('🔗 Test at: http://localhost:8000');
  console.log('🛑 To stop: Ctrl+C');
});
