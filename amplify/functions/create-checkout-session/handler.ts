import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import Stripe from 'stripe';

// Initialize Stripe with secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

interface CreateCheckoutRequest {
  packageType: 'Basic Memory Package' | 'Premium Memory Package' | 'Deluxe Memory Package';
  customerEmail?: string;
}

interface PackageConfig {
  priceId: string;
  name: string;
  description: string;
}

export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
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
    // Parse request body
    const body: CreateCheckoutRequest = JSON.parse(event.body || '{}');
    const { packageType, customerEmail } = body;

    if (!packageType) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Package type is required' }),
      };
    }

    // Package configurations
    const packages: Record<string, PackageConfig> = {
      'Basic Memory Package': {
        priceId: process.env.BASIC_PRICE_ID!,
        name: 'Basic Memory Package',
        description: 'For 1 person\'s voice. Up to 10 minutes of recording. Handcrafted card with QR code.',
      },
      'Premium Memory Package': {
        priceId: process.env.PREMIUM_PRICE_ID!,
        name: 'Premium Memory Package', 
        description: 'For 1 person\'s voice. Up to 30 minutes of audio. QR keychain. Background music. Higher quality.',
      },
      'Deluxe Memory Package': {
        priceId: process.env.DELUXE_PRICE_ID!,
        name: 'Deluxe Memory Package',
        description: 'For 2 people\'s voices. Up to 60 minutes. Custom memorabilia. Highest quality audio.',
      },
    };

    const selectedPackage = packages[packageType];
    if (!selectedPackage) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid package type' }),
      };
    }

    // Get the domain from the request
    const domain = event.headers.Origin || event.headers.origin || 'https://localhost:3000';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPackage.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${domain}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/cancel.html`,
      metadata: {
        package_type: packageType,
        package_name: selectedPackage.name,
      },
      payment_intent_data: {
        metadata: {
          package_type: packageType,
          package_name: selectedPackage.name,
        },
      },
      // Customize the checkout page
      custom_text: {
        submit: {
          message: 'After payment, you\'ll receive instructions to email us your voice recordings and personal script.',
        },
      },
      // Collect customer information
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
    };

  } catch (error) {
    console.error('Stripe checkout session creation failed:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
