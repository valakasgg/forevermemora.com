// Memora Payment Integration with Stripe
// This file handles client-side payment processing for the three memory packages

class MemoraPayments {
  constructor() {
    this.stripe = null;
    this.isProcessing = false;
    this.init();
  }

  async init() {
    try {
      // Wait for config to be available
      if (!window.MemoraConfig) {
        console.error('MemoraConfig not loaded. Please ensure config-amplify.js is loaded before payment.js');
        return;
      }

      // Get Stripe publishable key from config
      const publishableKey = window.MemoraConfig.get('STRIPE_PUBLISHABLE_KEY');
      
      if (!publishableKey || publishableKey.includes('your_') || publishableKey.includes('_here')) {
        console.error('Stripe publishable key not configured properly. Please set STRIPE_PUBLISHABLE_KEY in AWS Amplify Console → Environment Variables');
        window.MemoraConfig.log('Current config:', window.MemoraConfig.config);
        return;
      }

      // Initialize Stripe
      this.stripe = Stripe(publishableKey);
      
      // Set up event listeners for buy buttons
      this.setupEventListeners();
      
      window.MemoraConfig.log('Payments initialized successfully');
      window.MemoraConfig.log('Using Stripe key:', publishableKey.substring(0, 12) + '...');
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
    }
  }

  setupEventListeners() {
    // Find all buy buttons with data-package attribute
    const buyButtons = document.querySelectorAll('[data-package]');
    
    buyButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const packageType = button.getAttribute('data-package');
        this.handlePurchase(packageType, button);
      });
    });

    // Also handle the package buy buttons in comparison table
    const packageBuyButtons = document.querySelectorAll('.package-buy-btn');
    packageBuyButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const packageType = button.getAttribute('data-package');
        this.handlePurchase(packageType, button);
      });
    });
  }

  async handlePurchase(packageType, buttonElement) {
    if (!this.stripe) {
      alert('Payment system not initialized. Please refresh the page and try again.');
      return;
    }

    if (this.isProcessing) {
      return; // Prevent double-clicks
    }

    if (!packageType) {
      alert('Package selection error. Please try again.');
      return;
    }

    try {
      this.isProcessing = true;
      this.updateButtonState(buttonElement, 'Processing...');

      // Get customer email if available (from any form on the page)
      const customerEmail = this.getCustomerEmail();

      // Create checkout session
      const apiBaseUrl = window.MemoraConfig.get('API_BASE_URL');
      const response = await fetch(`${apiBaseUrl}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageType: packageType,
          customerEmail: customerEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId, url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout (recommended)
        window.location.href = url;
      } else if (sessionId) {
        // Alternative: Use Stripe.js redirectToCheckout
        const { error } = await this.stripe.redirectToCheckout({
          sessionId: sessionId
        });

        if (error) {
          throw new Error(error.message);
        }
      } else {
        throw new Error('No checkout URL or session ID received');
      }

    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment error: ${error.message}. Please try again.`);
    } finally {
      this.isProcessing = false;
      this.resetButtonState(buttonElement, packageType);
    }
  }

  getCustomerEmail() {
    // Try to get email from any form inputs on the page
    const emailInputs = document.querySelectorAll('input[type="email"]');
    for (const input of emailInputs) {
      if (input.value && this.isValidEmail(input.value)) {
        return input.value;
      }
    }
    return null;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  updateButtonState(button, text) {
    if (button) {
      button.disabled = true;
      const span = button.querySelector('span[data-translate]') || button.querySelector('span');
      if (span) {
        span.textContent = text;
      } else {
        button.textContent = text;
      }
      button.style.opacity = '0.7';
      button.style.cursor = 'not-allowed';
    }
  }

  resetButtonState(button, packageType) {
    if (button) {
      button.disabled = false;
      const span = button.querySelector('span[data-translate]') || button.querySelector('span');
      if (span) {
        span.textContent = 'Buy Now';
      } else {
        button.textContent = 'Buy Now';
      }
      button.style.opacity = '1';
      button.style.cursor = 'pointer';
    }
  }

  // Utility method to get package info
  getPackageInfo(packageType) {
    const packages = {
      'Basic Memory Package': {
        name: 'Basic Memory Package',
        price: 89,
        description: 'For 1 person\'s voice. Up to 10 minutes of recording.',
      },
      'Premium Memory Package': {
        name: 'Premium Memory Package', 
        price: 189,
        description: 'For 1 person\'s voice. Up to 30 minutes of audio. Enhanced features.',
      },
      'Deluxe Memory Package': {
        name: 'Deluxe Memory Package',
        price: 269,
        description: 'For 2 people\'s voices. Up to 60 minutes. Premium features.',
      },
    };

    return packages[packageType] || null;
  }
}

// Initialize payments when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Stripe !== 'undefined') {
    window.memoraPayments = new MemoraPayments();
  } else {
    console.error('Stripe.js not loaded. Please include Stripe.js in your HTML.');
  }
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MemoraPayments;
}
