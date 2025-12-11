
// ============================================
// routes/subscriptions.js - Subscription Routes
// ============================================
const express = require('express');
const router = express.Router();
const Subscription = require('./subscriptions');
const User = require('../models/User');

// Get subscription details
router.get('/:userId', async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ 
      userId: req.params.userId,
      status: 'active'
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create subscription
router.post('/create', async (req, res) => {
  try {
    const {
      userId,
      plan,
      price,
      billingCycle,
      paymentMethod
    } = req.body;

    // Check if user already has active subscription
    const existingSubscription = await Subscription.findOne({
      userId,
      status: 'active'
    });

    if (existingSubscription) {
      return res.status(400).json({ message: 'User already has active subscription' });
    }

    // Calculate end date (1 year from now for yearly billing)
    const startDate = new Date();
    const endDate = new Date();
    if (billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // Create subscription
    const subscription = new Subscription({
      userId,
      plan,
      price,
      billingCycle,
      paymentMethod,
      startDate,
      endDate
    });

    await subscription.save();

    // Update user
    await User.findByIdAndUpdate(userId, {
      subscriptionStatus: 'premium',
      subscriptionId: subscription._id
    });

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel subscription
router.post('/cancel/:subscriptionId', async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.subscriptionId);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    await subscription.save();

    await User.findByIdAndUpdate(subscription.userId, {
      subscriptionStatus: 'cancelled'
    });

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check eligibility
router.get('/check-eligibility/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has active subscription
    const subscription = await Subscription.findOne({
      userId: user._id,
      status: 'active'
    });

    const eligible = !subscription || subscription.annualOrdersValue >= 1000;

    res.json({
      eligible,
      currentOrdersValue: subscription ? subscription.annualOrdersValue : 0,
      requiredOrdersValue: 1000
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
