const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['seller', 'buyer'],
    required: true,
  },
  profile: {
    firstName: String,
    lastName: String,
    profilePicture: String,
    bio: String,
    skills: [String],
  },
  // Seller specific fields
  sellerProfile: {
    level: {
      type: Number,
      default: 1,
    },
    successScore: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    responseRate: {
      type: Number,
      default: 0,
    },
    earnings: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
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

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);

