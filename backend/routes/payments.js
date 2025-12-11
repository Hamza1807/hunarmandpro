
// ============================================
// routes/payments.js - Payment Routes
// ============================================
const express = require('express');
const router = express.Router();
const Payment = require('./subscriptions');

// Process payment
router.post('/process', async (req, res) => {
  try {
    const {
      userId,
      subscriptionId,
      amount,
      paymentMethod,
      promoCode
    } = req.body;

    // Generate transaction ID
    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);

    // Apply promo code (simplified logic)
    let discount = 0;
    if (promoCode) {
      // Add your promo code validation logic here
      discount = amount * 0.1; // 10% discount example
    }

    const finalAmount = amount - discount;

    // Create payment record
    const payment = new Payment({
      userId,
      subscriptionId,
      amount: finalAmount,
      paymentMethod,
      transactionId,
      promoCode,
      discount,
      status: 'pending'
    });

    await payment.save();

    // Simulate payment processing
    // In production, integrate with actual payment gateway (Easypaisa/JazzCash API)
    setTimeout(async () => {
      payment.status = 'completed';
      await payment.save();
    }, 2000);

    res.status(201).json({
      message: 'Payment initiated successfully',
      transactionId,
      amount: finalAmount,
      payment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get payment history
router.get('/history/:userId', async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('subscriptionId');

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify payment status
router.get('/verify/:transactionId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ 
      transactionId: req.params.transactionId 
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      status: payment.status,
      amount: payment.amount,
      transactionId: payment.transactionId
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
