// const mongoose = require('mongoose');

// const gigSchema = new mongoose.Schema({
//   sellerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     index: true,
//   },
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   category: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   deliveryTime: {
//     type: Number, // in days
//     default: 3,
//   },
//   images: [{
//     type: String,
//   }],
//   tags: [{
//     type: String,
//   }],
//   features: [{
//     type: String,
//   }],
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Pre-save hook to update timestamp
// gigSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// module.exports = mongoose.model('Gig', gigSchema);

const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
  },
  
  // Three-tier package system
  packages: {
    basic: {
      name: {
        type: String,
        default: 'Basic'
      },
      description: String,
      price: {
        type: Number,
        required: true
      },
      deliveryTime: {
        type: Number,
        required: true
      },
      revisions: {
        type: Number,
        default: 0
      },
      features: [String],
    },
    standard: {
      name: {
        type: String,
        default: 'Standard'
      },
      description: String,
      price: Number,
      deliveryTime: Number,
      revisions: {
        type: Number,
        default: 2
      },
      features: [String],
    },
    premium: {
      name: {
        type: String,
        default: 'Premium'
      },
      description: String,
      price: Number,
      deliveryTime: Number,
      revisions: {
        type: Number,
        default: 5
      },
      features: [String],
    }
  },

  // Add-ons
  addOns: [{
    name: String,
    description: String,
    price: Number,
    deliveryTime: Number, // Additional days
    type: {
      type: String,
      enum: ['extra-fast', 'additional-revision', 'extra-feature', 'custom']
    }
  }],

  // FAQs
  faqs: [{
    question: String,
    answer: String
  }],

  // Media files
  images: [{
    type: String,
  }],
  videos: [{
    url: String,
    thumbnail: String
  }],
  pdfs: [{
    name: String,
    url: String,
    size: Number
  }],

  // Metadata and tags
  tags: [{
    type: String,
  }],
  searchKeywords: [{
    type: String
  }],
  metadata: {
    language: String,
    targetAudience: String,
    skillLevel: String,
    industryExperience: String
  },

  // Requirements from buyer
  requirements: [{
    question: String,
    type: {
      type: String,
      enum: ['text', 'file', 'multiple-choice'],
      default: 'text'
    },
    options: [String], // For multiple-choice
    required: {
      type: Boolean,
      default: false
    }
  }],

  // Analytics
  analytics: {
    impressions: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    orders: {
      type: Number,
      default: 0
    },
    saves: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    },
    views: [{
      date: Date,
      count: Number
    }],
    clicksBySource: {
      search: { type: Number, default: 0 },
      profile: { type: Number, default: 0 },
      direct: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    }
  },

  // Legacy fields for backward compatibility
  price: {
    type: Number,
    required: true,
  },
  deliveryTime: {
    type: Number,
    default: 3,
  },
  features: [{
    type: String,
  }],

  // Status
  isActive: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'denied'],
    default: 'draft'
  },

  // Admin review
  reviewStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewNotes: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for better query performance
gigSchema.index({ sellerId: 1, isActive: 1 });
gigSchema.index({ category: 1, isActive: 1 });
gigSchema.index({ tags: 1 });
gigSchema.index({ 'packages.basic.price': 1 });
gigSchema.index({ createdAt: -1 });

// Pre-save hook to update timestamp and sync legacy fields
gigSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Sync legacy price and deliveryTime from basic package
  if (this.packages && this.packages.basic) {
    this.price = this.packages.basic.price;
    this.deliveryTime = this.packages.basic.deliveryTime;
  }

  // Calculate conversion rate
  if (this.analytics && this.analytics.clicks > 0) {
    this.analytics.conversionRate = 
      (this.analytics.orders / this.analytics.clicks * 100).toFixed(2);
  }

  next();
});

// Method to increment analytics
gigSchema.methods.incrementAnalytics = function(type, source = 'other') {
  if (type === 'impression') {
    this.analytics.impressions += 1;
  } else if (type === 'click') {
    this.analytics.clicks += 1;
    if (this.analytics.clicksBySource[source] !== undefined) {
      this.analytics.clicksBySource[source] += 1;
    } else {
      this.analytics.clicksBySource.other += 1;
    }
  } else if (type === 'order') {
    this.analytics.orders += 1;
  } else if (type === 'save') {
    this.analytics.saves += 1;
  }
  
  return this.save();
};

// Method to add daily view
gigSchema.methods.addDailyView = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const existingView = this.analytics.views.find(
    v => v.date.toDateString() === today.toDateString()
  );
  
  if (existingView) {
    existingView.count += 1;
  } else {
    this.analytics.views.push({ date: today, count: 1 });
  }
  
  return this.save();
};

module.exports = mongoose.model('Gig', gigSchema);