const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    profilePicture: String,
  }],
  lastMessage: {
    message: String,
    senderId: mongoose.Schema.Types.ObjectId,
    timestamp: Date,
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {},
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

// Create index for efficient lookups
conversationSchema.index({ 'participants.userId': 1 });

module.exports = mongoose.model('Conversation', conversationSchema);

