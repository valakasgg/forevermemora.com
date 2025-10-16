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

  getCustomerEmail() {
    // Try to get customer email from any form on the page
    const emailInput = document.querySelector('input[type="email"]');
    const email = emailInput ? emailInput.value.trim() : '';
    
    // Return null if email is empty or invalid
    if (!email || !email.includes('@')) {
      return null;
    }
    
    return email;
  }

  async handlePurchase(packageName) {
    if (this.isProcessing) return;
    
    console.log(`Starting purchase for ${packageName} package`);
    
    // Package configurations - handle both old and new formats
    const packages = {
      'basic': {
        name: 'Basic Memory Package',
        price: 5000, // $50.00 in cents
        description: '1 person, up to 10 minutes'
      },
      'premium': {
        name: 'Premium Memory Package', 
        price: 10000, // $100.00 in cents
        description: '1 person, up to 30 minutes'
      },
      'deluxe': {
        name: 'Deluxe Memory Package',
        price: 15000, // $150.00 in cents
        description: '2 people, up to 60 minutes'
      },
      'Basic Memory Package': {
        name: 'Basic Memory Package',
        price: 5000,
        description: '1 person, up to 10 minutes'
      },
      'Premium Memory Package': {
        name: 'Premium Memory Package', 
        price: 10000,
        description: '1 person, up to 30 minutes'
      },
      'Deluxe Memory Package': {
        name: 'Deluxe Memory Package',
        price: 15000,
        description: '2 people, up to 60 minutes'
      }
    };

    const packageConfig = packages[packageName];
    if (!packageConfig) {
      console.error('Package not found:', packageName);
      alert(`Invalid package type: ${packageName}`);
      return;
    }

    this.isProcessing = true;

    try {
      // Get customer email if available
      const customerEmail = this.getCustomerEmail();
      
      // Create checkout session options
      const checkoutOptions = {
        lineItems: [{
          price: 'price_1SGhjVRxjeA5v92yEoHzIWpQ', // Use your existing price ID
          quantity: 1,
        }],
        mode: 'payment',
        successUrl: `${window.location.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/cancel.html`,
      };
      
      // Only add customerEmail if it's valid
      if (customerEmail) {
        checkoutOptions.customerEmail = customerEmail;
      }
      
      // Create checkout session directly with Stripe
      const { error } = await this.stripe.redirectToCheckout(checkoutOptions);

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
