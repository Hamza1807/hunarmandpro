const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true,
  },
  gigTitle: {
    type: String,
    required: true,
  },
  seller: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: String,
  },
  buyer: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: String,
  },
  package: {
    type: String,
    enum: ['basic', 'standard', 'premium'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  deliveryTime: {
    type: Number, // in days
    required: true,
  },
  description: {
    type: String,
  },
  requirements: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'in_revision', 'completed', 'cancelled'],
    default: 'active',
  },
  deliverables: [{
    message: String,
    files: [String],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  revisionRequests: [{
    message: String,
    requestedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  dueDate: {
    type: Date,
    required: true,
  },
  completedAt: {
    type: Date,
  },
  cancelledAt: {
    type: Date,
  },
  cancellationReason: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);

