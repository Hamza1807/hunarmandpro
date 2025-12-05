const express = require('express');
const router = express.Router();
const Gig = require('../models/Gig');
const User = require('../models/User');

// Get all gigs by a specific seller
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Verify seller exists
    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ 
        error: 'Seller not found',
        message: 'The freelancer does not exist' 
      });
    }

    // Get all active gigs for this seller
    const gigs = await Gig.find({ 
      sellerId: sellerId,
      isActive: true 
    })
    .sort({ createdAt: -1 })
    .select('title description price deliveryTime images category tags features');

    res.json({ 
      gigs,
      sellerInfo: {
        username: seller.username,
        profilePicture: seller.profile?.profilePicture,
      }
    });
  } catch (error) {
    console.error('Get seller gigs error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to get gigs' 
    });
  }
});

// Get all gigs (for browsing)
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 20 } = req.query;

    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const gigs = await Gig.find(query)
      .populate('sellerId', 'username profile.profilePicture sellerProfile.rating sellerProfile.level')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ gigs });
  } catch (error) {
    console.error('Get gigs error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to get gigs' 
    });
  }
});

module.exports = router;

