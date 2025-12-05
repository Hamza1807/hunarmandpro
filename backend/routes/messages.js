const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Get all conversations for a user
router.get('/conversations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all messages where user is sender or receiver
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(userId) },
            { receiverId: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$receiverId', new mongoose.Types.ObjectId(userId)] },
                  { $eq: ['$isRead', false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    // Get user details for each conversation
    const conversationsWithUsers = await Promise.all(
      messages.map(async (conv) => {
        const otherUserId = conv.lastMessage.senderId.toString() === userId 
          ? conv.lastMessage.receiverId 
          : conv.lastMessage.senderId;
        
        const otherUser = await User.findById(otherUserId).select('username email profile.profilePicture userType');
        
        return {
          conversationId: conv._id,
          otherUser: {
            id: otherUser._id,
            username: otherUser.username,
            profilePicture: otherUser.profile?.profilePicture || null,
            userType: otherUser.userType,
          },
          lastMessage: {
            message: conv.lastMessage.message,
            senderId: conv.lastMessage.senderId,
            timestamp: conv.lastMessage.createdAt,
            isRead: conv.lastMessage.isRead,
          },
          unreadCount: conv.unreadCount,
        };
      })
    );

    res.json({ conversations: conversationsWithUsers });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to get conversations' 
    });
  }
});

// Get messages in a conversation
router.get('/conversation/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.query;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate('senderId', 'username profile.profilePicture')
      .populate('receiverId', 'username profile.profilePicture');

    // Mark messages as read
    await Message.updateMany(
      { 
        conversationId, 
        receiverId: userId,
        isRead: false 
      },
      { isRead: true }
    );

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to get messages' 
    });
  }
});

// Send a message
router.post('/send', async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ 
        error: 'Missing fields',
        message: 'Sender, receiver, and message are required' 
      });
    }

    // Get sender and receiver details
    const sender = await User.findById(senderId).select('username');
    const receiver = await User.findById(receiverId).select('username');

    if (!sender || !receiver) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'Sender or receiver not found' 
      });
    }

    // Create conversation ID (sorted to ensure consistency)
    const conversationId = [senderId, receiverId].sort().join('_');

    // Create message
    const newMessage = new Message({
      conversationId,
      senderId,
      receiverId,
      senderUsername: sender.username,
      receiverUsername: receiver.username,
      message,
      isRead: false,
    });

    await newMessage.save();

    // Populate sender details
    await newMessage.populate('senderId', 'username profile.profilePicture');

    res.status(201).json({
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to send message' 
    });
  }
});

// Get unread message count
router.get('/unread-count/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const unreadCount = await Message.countDocuments({
      receiverId: userId,
      isRead: false,
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to get unread count' 
    });
  }
});

// Mark conversation as read
router.put('/mark-read/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;

    await Message.updateMany(
      { 
        conversationId, 
        receiverId: userId,
        isRead: false 
      },
      { isRead: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to mark messages as read' 
    });
  }
});

// Start a new conversation (check if exists)
router.post('/start-conversation', async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;

    // Create conversation ID (sorted to ensure consistency)
    const conversationId = [userId1, userId2].sort().join('_');

    // Check if conversation exists
    const existingMessages = await Message.findOne({ conversationId });

    if (existingMessages) {
      return res.json({ 
        conversationId,
        exists: true 
      });
    }

    // Get user details
    const user1 = await User.findById(userId1).select('username profile.profilePicture');
    const user2 = await User.findById(userId2).select('username profile.profilePicture');

    res.json({ 
      conversationId,
      exists: false,
      users: {
        user1: {
          id: user1._id,
          username: user1.username,
          profilePicture: user1.profile?.profilePicture,
        },
        user2: {
          id: user2._id,
          username: user2.username,
          profilePicture: user2.profile?.profilePicture,
        }
      }
    });
  } catch (error) {
    console.error('Start conversation error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to start conversation' 
    });
  }
});

module.exports = router;

