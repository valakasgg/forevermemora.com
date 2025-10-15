import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import Stripe from 'stripe';
import * as crypto from 'crypto';

// Initialize Stripe with secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,Stripe-Signature',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = event.body;
    const signature = event.headers['Stripe-Signature'] || event.headers['stripe-signature'];

    if (!body || !signature) {
      console.error('Missing body or signature');
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing body or signature' }),
      };
    }

    // Verify webhook signature
    let stripeEvent: Stripe.Event;
    try {
      stripeEvent = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Webhook signature verification failed' }),
      };
    }

    console.log('Received Stripe webhook event:', stripeEvent.type);

    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case 'payment_intent.succeeded': {
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ received: true }),
    };

  } catch (error) {
    console.error('Webhook handler error:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Webhook handler failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

// Handle successful checkout completion
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('Checkout completed for session:', session.id);
    console.log('Customer email:', session.customer_email);
    console.log('Package type:', session.metadata?.package_type);
    console.log('Amount total:', session.amount_total);

    // Here you can:
    // 1. Send confirmation email to customer
    // 2. Add customer to your database
    // 3. Send notification to your team
    // 4. Update inventory/analytics
    
    // For now, we'll just log the successful purchase
    const customerInfo = {
      email: session.customer_email,
      packageType: session.metadata?.package_type,
      packageName: session.metadata?.package_name,
      amountPaid: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
      currency: session.currency,
      sessionId: session.id,
      paymentStatus: session.payment_status,
      timestamp: new Date().toISOString(),
    };

    console.log('Customer purchase info:', JSON.stringify(customerInfo, null, 2));

    // TODO: Implement email notification system
    // TODO: Store purchase data in database
    // TODO: Send instructions email to customer

  } catch (error) {
    console.error('Error handling checkout completion:', error);
    throw error;
  }
}

// Handle successful payment
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment succeeded for PaymentIntent:', paymentIntent.id);
    console.log('Amount received:', paymentIntent.amount);
    console.log('Package type:', paymentIntent.metadata?.package_type);

    // Additional success handling if needed
    
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

// Handle failed payment
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment failed for PaymentIntent:', paymentIntent.id);
    console.log('Failure reason:', paymentIntent.last_payment_error?.message);
    console.log('Package type:', paymentIntent.metadata?.package_type);

    // Handle failed payment - notify customer, retry logic, etc.
    
  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
}
