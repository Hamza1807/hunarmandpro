// Fiverr Payment Calculator
// 10% deducted from seller, 3% from buyer

class FiverrPaymentProcessor {
  constructor() {
    this.sellerFeePercentage = 10; // Fiverr takes 10% from seller
    this.buyerFeePercentage = 3;   // Service fee for buyer (3%)
  }

  /**
   * Calculate payment breakdown for an order
   * @param {number} orderAmount - The base order amount set by seller
   * @returns {object} Payment breakdown
   */
  calculatePayment(orderAmount) {
    if (orderAmount <= 0) {
      throw new Error("Order amount must be greater than 0");
    }

    // Calculate seller's deduction (10% fee)
    const sellerFee = (orderAmount * this.sellerFeePercentage) / 100;
    const sellerReceives = orderAmount - sellerFee;

    // Calculate buyer's payment (order amount + 3% service fee)
    const buyerFee = (orderAmount * this.buyerFeePercentage) / 100;
    const buyerPays = orderAmount + buyerFee;

    // Total fees collected by platform
    const totalPlatformFees = sellerFee + buyerFee;

    return {
      orderAmount: orderAmount.toFixed(2),
      seller: {
        fee: sellerFee.toFixed(2),
        feePercentage: `${this.sellerFeePercentage}%`,
        receives: sellerReceives.toFixed(2)
      },
      buyer: {
        fee: buyerFee.toFixed(2),
        feePercentage: `${this.buyerFeePercentage}%`,
        pays: buyerPays.toFixed(2)
      },
      platform: {
        totalFees: totalPlatformFees.toFixed(2)
      }
    };
  }

  /**
   * Process a payment transaction
   * @param {number} orderAmount - The base order amount
   * @param {string} buyerId - Buyer identifier
   * @param {string} sellerId - Seller identifier
   * @returns {object} Transaction result
   */
  processPayment(orderAmount, buyerId, sellerId) {
    const breakdown = this.calculatePayment(orderAmount);
    
    const transaction = {
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      buyerId,
      sellerId,
      ...breakdown,
      status: "completed"
    };

    return transaction;
  }

  /**
   * Display payment breakdown in console
   * @param {number} orderAmount - The base order amount
   */
  displayBreakdown(orderAmount) {
    const breakdown = this.calculatePayment(orderAmount);
    
   
  }
}

// Example Usage
const paymentProcessor = new FiverrPaymentProcessor();

// Example 1: Calculate payment for $100 order

const payment1 = paymentProcessor.calculatePayment(100);
console.log(payment1);
paymentProcessor.displayBreakdown(100);

// Example 2: Process a complete transaction

const transaction = paymentProcessor.processPayment(
  250,              // Order amount
  "buyer_12345",    // Buyer ID
  "seller_67890"    // Seller ID
);
console.log(transaction);

// Example 3: Multiple orders

[50, 100, 500, 1000].forEach(amount => {
  paymentProcessor.displayBreakdown(amount);
});