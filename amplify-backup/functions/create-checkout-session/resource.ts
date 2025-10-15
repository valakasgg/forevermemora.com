import { defineFunction } from '@aws-amplify/backend';

export const createCheckoutSession = defineFunction({
  name: 'create-checkout-session',
  entry: './handler.ts',
  environment: {
    // Stripe secret key - set in AWS Amplify Console → Environment Variables
    // Development: sk_test_...
    // Production: sk_live_...  
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    
    // Price IDs for each package - set in AWS Amplify Console → Environment Variables
    // Development: price_test_...
    // Production: price_live_...
    BASIC_PRICE_ID: process.env.BASIC_PRICE_ID || '',
    PREMIUM_PRICE_ID: process.env.PREMIUM_PRICE_ID || '',
    DELUXE_PRICE_ID: process.env.DELUXE_PRICE_ID || '',
  },
  runtime: 18,
  timeoutSeconds: 30,
  memoryMB: 512,
});
