import { defineFunction } from '@aws-amplify/backend';

export const stripeWebhook = defineFunction({
  name: 'stripe-webhook',
  entry: './handler.ts',
  environment: {
    // Stripe secret key - set in AWS Amplify Console → Environment Variables
    // Development: sk_test_...
    // Production: sk_live_...
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    
    // Webhook signing secret - set in AWS Amplify Console → Environment Variables  
    // Development: whsec_test_...
    // Production: whsec_live_...
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  runtime: 18,
  timeoutSeconds: 30,
  memoryMB: 512,
});
