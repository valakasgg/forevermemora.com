// Simple Stripe Payment Integration for Memora
// This version uses Stripe's client-side checkout directly

class SimpleMemoraPayments {
  constructor() {
    this.stripe = null;
    this.isProcessing = false;
    this.initializeStripe();
  }

  async initializeStripe() {
    const publishableKey = window.MemoraConfig.get('STRIPE_PUBLISHABLE_KEY');
    
    if (!publishableKey || publishableKey.includes('your_')) {
      console.error('Stripe publishable key not configured properly');
      return;
    }

    try {
      this.stripe = Stripe(publishableKey);
      console.log('Stripe initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
    }
  }

  async handlePurchase(packageType) {
    if (this.isProcessing) return;
    
    console.log(`Starting purchase for ${packageType} package`);
    
    // Package configurations
    const packages = {
      basic: {
        name: 'Basic Memory Package',
        price: 5000, // $50.00 in cents
        description: '1 person, up to 10 minutes'
      },
      premium: {
        name: 'Premium Memory Package', 
        price: 10000, // $100.00 in cents
        description: '1 person, up to 30 minutes'
      },
      deluxe: {
        name: 'Deluxe Memory Package',
        price: 15000, // $150.00 in cents
        description: '2 people, up to 60 minutes'
      }
    };

    const packageConfig = packages[packageType];
    if (!packageConfig) {
      alert('Invalid package type');
      return;
    }

    this.isProcessing = true;

    try {
      // Create checkout session directly with Stripe
      const { error } = await this.stripe.redirectToCheckout({
        lineItems: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: packageConfig.name,
              description: packageConfig.description,
            },
            unit_amount: packageConfig.price,
          },
          quantity: 1,
        }],
        mode: 'payment',
        successUrl: `${window.location.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/cancel.html`,
        metadata: {
          package_type: packageType,
          package_name: packageConfig.name,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment error: ${error.message}`);
    } finally {
      this.isProcessing = false;
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.SimpleMemoraPayments = new SimpleMemoraPayments();
  
  // Attach click handlers to buy buttons
  document.querySelectorAll('[data-package]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const packageType = button.getAttribute('data-package');
      window.SimpleMemoraPayments.handlePurchase(packageType);
    });
  });
});
