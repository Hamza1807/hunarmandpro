const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/deliverables/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'deliverable-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Get all orders for a seller
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const orders = await Order.find({ 'seller.id': sellerId })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// Get all orders for a buyer
router.get('/buyer/:buyerId', async (req, res) => {
  try {
    const { buyerId } = req.params;
    const orders = await Order.find({ 'buyer.id': buyerId })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// Get a specific order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const {
      gigId,
      gigTitle,
      seller,
      buyer,
      package,
      price,
      deliveryTime,
      description,
      requirements,
    } = req.body;

    // Generate unique order ID
    const orderId = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);

    // Calculate due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + deliveryTime);

    const newOrder = new Order({
      orderId,
      gigId,
      gigTitle,
      seller,
      buyer,
      package,
      price,
      deliveryTime,
      description,
      requirements,
      dueDate,
    });

    await newOrder.save();
    
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

// Submit work for an order
router.post('/:orderId/submit', upload.array('files', 10), async (req, res) => {
  try {
    const { orderId } = req.params;
    const { message } = req.body;
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status !== 'active' && order.status !== 'in_revision') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot submit work for this order status' 
      });
    }

    // Get uploaded file paths
    const files = req.files ? req.files.map(file => '/uploads/deliverables/' + file.filename) : [];

    // Add deliverable
    order.deliverables.push({
      message,
      files,
      submittedAt: new Date(),
    });

    // Update status to completed (in real app, buyer would need to approve)
    order.status = 'completed';
    order.completedAt = new Date();

    await order.save();
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error submitting work:', error);
    res.status(500).json({ success: false, message: 'Failed to submit work' });
  }
});

// Request revision (buyer action)
router.post('/:orderId/revision', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { message } = req.body;
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.revisionRequests.push({
      message,
      requestedAt: new Date(),
    });

    order.status = 'in_revision';

    await order.save();
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error requesting revision:', error);
    res.status(500).json({ success: false, message: 'Failed to request revision' });
  }
});

// Cancel order
router.post('/:orderId/cancel', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason;

    await order.save();
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
});

module.exports = router;

