import { defineBackend } from '@aws-amplify/backend';
import { createCheckoutSession } from './functions/create-checkout-session/resource';
import { stripeWebhook } from './functions/stripe-webhook/resource';

/**
 * Define the Amplify Backend with Stripe payment functions
 * This creates Lambda functions with Function URLs enabled for direct HTTP access
 */
export const backend = defineBackend({
  createCheckoutSession,
  stripeWebhook,
});

// Add CORS and Function URL configuration to the Lambda functions
const { createCheckoutSession: checkoutFunction, stripeWebhook: webhookFunction } = backend;

// Enable Function URLs for HTTP access
checkoutFunction.resources.lambda.addFunctionUrl({
  authType: 'NONE', // Public access (CORS handles security)
  cors: {
    allowedOrigins: ['*'], // You can restrict this to your domain in production
    allowedMethods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 300, // 5 minutes
  },
});

webhookFunction.resources.lambda.addFunctionUrl({
  authType: 'NONE', // Public access for Stripe webhooks
  cors: {
    allowedOrigins: ['*'],
    allowedMethods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Stripe-Signature'],
    maxAge: 300,
  },
});

// Export the function URLs for the frontend to use
backend.addOutput({
  custom: {
    API: {
      createCheckoutSessionUrl: checkoutFunction.resources.lambda.functionUrl,
      stripeWebhookUrl: webhookFunction.resources.lambda.functionUrl,
    }
  }
});
