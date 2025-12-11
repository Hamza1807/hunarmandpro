// const express = require('express');
// const router = express.Router();
// const Gig = require('../models/Gig');
// const User = require('../models/User');

// // Get all gigs by a specific seller
// router.get('/seller/:sellerId', async (req, res) => {
//   try {
//     const { sellerId } = req.params;

//     // Verify seller exists
//     const seller = await User.findById(sellerId);
//     if (!seller) {
//       return res.status(404).json({ 
//         error: 'Seller not found',
//         message: 'The freelancer does not exist' 
//       });
//     }

//     // Get all active gigs for this seller
//     const gigs = await Gig.find({ 
//       sellerId: sellerId,
//       isActive: true 
//     })
//     .sort({ createdAt: -1 })
//     .select('title description price deliveryTime images category tags features');

//     res.json({ 
//       gigs,
//       sellerInfo: {
//         username: seller.username,
//         profilePicture: seller.profile?.profilePicture,
//       }
//     });
//   } catch (error) {
//     console.error('Get seller gigs error:', error);
//     res.status(500).json({ 
//       error: 'Server error',
//       message: 'Failed to get gigs' 
//     });
//   }
// });

// // Get all gigs (for browsing)
// router.get('/', async (req, res) => {
//   try {
//     const { category, search, limit = 20 } = req.query;

//     let query = { isActive: true };

//     if (category) {
//       query.category = category;
//     }

//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } },
//         { tags: { $in: [new RegExp(search, 'i')] } }
//       ];
//     }

//     const gigs = await Gig.find(query)
//       .populate('sellerId', 'username profile.profilePicture sellerProfile.rating sellerProfile.level')
//       .sort({ createdAt: -1 })
//       .limit(parseInt(limit));

//     res.json({ gigs });
//   } catch (error) {
//     console.error('Get gigs error:', error);
//     res.status(500).json({ 
//       error: 'Server error',
//       message: 'Failed to get gigs' 
//     });
//   }
// });

// module.exports = router;



//eshals work
// const express = require('express');
// const router = express.Router();
// const Gig = require('../models/Gig');
// const User = require('../models/User');

// // Get all gigs by a specific seller
// router.get('/seller/:username', async (req, res) => {
//   try {
//     const { username } = req.params;

//     // Verify seller exists
//     const seller = await User.findById(username);
//     if (!seller) {
//       return res.status(404).json({ 
//         error: 'Seller not found',
//         message: 'The freelancer does not exist' 
//       });
//     }

//     // Get all active gigs for this seller
//     const gigs = await Gig.find({ 
//       username: username,
//       isActive: true 
//     })
//     .sort({ createdAt: -1 })
//     .select('title description price deliveryTime images category tags features');

//     res.json({ 
//       gigs,
//       sellerInfo: {
//         username: seller.username,
//         profilePicture: seller.profile?.profilePicture,
//       }
//     });
//   } catch (error) {
//     console.error('Get seller gigs error:', error);
//     res.status(500).json({ 
//       error: 'Server error',
//       message: 'Failed to get gigs' 
//     });
//   }
// });

// // Get all gigs (for browsing) with advanced filtering
// router.get('/', async (req, res) => {
//   try {
//     const { 
//       category, 
//       search, 
//       minPrice, 
//       maxPrice, 
//       deliveryTime, 
//       sellerLevel,
//       language,
//       country,
//       limit = 50 
//     } = req.query;

//     let query = { isActive: true };

//     // Category filter
//     if (category) {
//       query.category = category;
//     }

//     // Price range filter
//     if (minPrice || maxPrice) {
//       query.price = {};
//       if (minPrice) query.price.$gte = parseInt(minPrice);
//       if (maxPrice) query.price.$lte = parseInt(maxPrice);
//     }

//     // Delivery time filter
//     if (deliveryTime) {
//       query.deliveryTime = { $lte: parseInt(deliveryTime) };
//     }

//     // Search filter (title, description, tags)
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } },
//         { tags: { $in: [new RegExp(search, 'i')] } }
//       ];
//     }

//     const gigs = await Gig.find(query)
//       .populate({
//         path: 'sellerId',
//         select: 'username profile.profilePicture sellerProfile.rating sellerProfile.level sellerProfile.responseRate',
//         match: sellerLevel ? { 'sellerProfile.level': parseInt(sellerLevel) } : {}
//       })
//       .sort({ createdAt: -1 })
//       .limit(parseInt(limit));

//     // Filter out gigs where seller didn't match (in case of sellerLevel filter)
//     const filteredGigs = gigs.filter(gig => gig.sellerId !== null);

//     res.json({ gigs: filteredGigs });
//   } catch (error) {
//     console.error('Get gigs error:', error);
//     res.status(500).json({ 
//       error: 'Server error',
//       message: 'Failed to get gigs' 
//     });
//   }
// });

// // Get single gig details
// router.get('/:gigId', async (req, res) => {
//   try {
//     const { gigId } = req.params;

//     const gig = await Gig.findById(gigId)
//       .populate({
//         path: 'sellerId',
//         select: 'username email profile sellerProfile'
//       });

//     if (!gig) {
//       return res.status(404).json({
//         success: false,
//         message: 'Gig not found'
//       });
//     }

//     res.json({
//       success: true,
//       gig
//     });
//   } catch (error) {
//     console.error('Get gig details error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get gig details'
//     });
//   }
// });

// // Create a new gig (for sellers)
// router.post('/', async (req, res) => {
//   try {
//     const {
//       sellerId,
//       title,
//       description,
//       category,
//       price,
//       deliveryTime,
//       images,
//       tags,
//       features
//     } = req.body;

//     // Validate required fields
//     if (!sellerId || !title || !description || !category || !price) {
//       return res.status(400).json({
//         error: 'Missing required fields',
//         message: 'Please provide all required fields'
//       });
//     }

//     // Verify seller exists and is a seller
//     const seller = await User.findById(sellerId);
//     if (!seller) {
//       return res.status(404).json({
//         error: 'Seller not found',
//         message: 'User does not exist'
//       });
//     }

//     if (seller.userType !== 'seller') {
//       return res.status(403).json({
//         error: 'Unauthorized',
//         message: 'Only sellers can create gigs'
//       });
//     }

//     const newGig = new Gig({
//       sellerId,
//       title,
//       description,
//       category,
//       price,
//       deliveryTime: deliveryTime || 3,
//       images: images || [],
//       tags: tags || [],
//       features: features || []
//     });

//     await newGig.save();

//     res.status(201).json({
//       success: true,
//       message: 'Gig created successfully',
//       gig: newGig
//     });
//   } catch (error) {
//     console.error('Create gig error:', error);
//     res.status(500).json({
//       error: 'Server error',
//       message: 'Failed to create gig'
//     });
//   }
// });

// // Update a gig
// router.put('/:gigId', async (req, res) => {
//   try {
//     const { gigId } = req.params;
//     const updates = req.body;

//     const gig = await Gig.findByIdAndUpdate(
//       gigId,
//       { ...updates, updatedAt: Date.now() },
//       { new: true, runValidators: true }
//     );

//     if (!gig) {
//       return res.status(404).json({
//         error: 'Gig not found',
//         message: 'Gig does not exist'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Gig updated successfully',
//       gig
//     });
//   } catch (error) {
//     console.error('Update gig error:', error);
//     res.status(500).json({
//       error: 'Server error',
//       message: 'Failed to update gig'
//     });
//   }
// });

// // Delete a gig (soft delete by setting isActive to false)
// router.delete('/:gigId', async (req, res) => {
//   try {
//     const { gigId } = req.params;

//     const gig = await Gig.findByIdAndUpdate(
//       gigId,
//       { isActive: false, updatedAt: Date.now() },
//       { new: true }
//     );

//     if (!gig) {
//       return res.status(404).json({
//         error: 'Gig not found',
//         message: 'Gig does not exist'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Gig deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete gig error:', error);
//     res.status(500).json({
//       error: 'Server error',
//       message: 'Failed to delete gig'
//     });
//   }
// });

// // Get featured/recommended gigs
// router.get('/featured/recommended', async (req, res) => {
//   try {
//     const gigs = await Gig.find({ isActive: true })
//       .populate({
//         path: 'sellerId',
//         select: 'username profile.profilePicture sellerProfile.rating sellerProfile.level'
//       })
//       .sort({ 'sellerId.sellerProfile.rating': -1 })
//       .limit(12);

//     res.json({ gigs });
//   } catch (error) {
//     console.error('Get featured gigs error:', error);
//     res.status(500).json({
//       error: 'Server error',
//       message: 'Failed to get featured gigs'
//     });
//   }
// });

// module.exports = router;



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

    // Get all gigs for this seller (including drafts)
    const gigs = await Gig.find({ sellerId: sellerId })
      .sort({ createdAt: -1 })
      .select('title description price deliveryTime images category tags features status isActive analytics packages');

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

// Get all gigs (for browsing) with advanced filtering
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      deliveryTime, 
      sellerLevel,
      language,
      country,
      limit = 50 
    } = req.query;

    let query = { isActive: true, status: 'active' };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Delivery time filter
    if (deliveryTime) {
      query.deliveryTime = { $lte: parseInt(deliveryTime) };
    }

    // Search filter (title, description, tags)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { searchKeywords: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const gigs = await Gig.find(query)
      .populate({
        path: 'sellerId',
        select: 'username profile.profilePicture sellerProfile.rating sellerProfile.level sellerProfile.responseRate',
        match: sellerLevel ? { 'sellerProfile.level': parseInt(sellerLevel) } : {}
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    // Filter out gigs where seller didn't match
    const filteredGigs = gigs.filter(gig => gig.sellerId !== null);

    // Increment impressions for each gig (async, don't wait)
    filteredGigs.forEach(gig => {
      Gig.findByIdAndUpdate(
        gig._id,
        { $inc: { 'analytics.impressions': 1 } }
      ).catch(err => console.error('Error updating impressions:', err));
    });

    res.json({ gigs: filteredGigs });
  } catch (error) {
    console.error('Get gigs error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to get gigs' 
    });
  }
});

// Get single gig details
router.get('/:gigId', async (req, res) => {
  try {
    const { gigId } = req.params;
    const { source = 'direct' } = req.query; // Track click source

    const gig = await Gig.findById(gigId)
      .populate({
        path: 'sellerId',
        select: 'username email profile sellerProfile'
      });

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Increment clicks and track source
    await Gig.findByIdAndUpdate(
      gigId,
      { 
        $inc: { 
          'analytics.clicks': 1,
          [`analytics.clicksBySource.${source}`]: 1
        }
      }
    );

    // Add daily view
    await gig.addDailyView();

    res.json({
      success: true,
      gig
    });
  } catch (error) {
    console.error('Get gig details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get gig details'
    });
  }
});

// Create a new gig (for sellers)
router.post('/', async (req, res) => {
  try {
    const {
      sellerId,
      title,
      description,
      category,
      subCategory,
      packages,
      addOns,
      faqs,
      images,
      videos,
      pdfs,
      tags,
      searchKeywords,
      metadata,
      requirements,
      status = 'draft',
      // Legacy fields
      price,
      deliveryTime,
      features
    } = req.body;

    // Validate required fields
    if (!sellerId || !title || !description || !category) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide sellerId, title, description, and category'
      });
    }

    // Validate packages
    if (!packages?.basic?.price || !packages?.basic?.deliveryTime) {
      return res.status(400).json({
        error: 'Missing package information',
        message: 'At least Basic package with price and delivery time is required'
      });
    }

    // Verify seller exists and is a seller
    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        error: 'Seller not found',
        message: 'User does not exist'
      });
    }

    if (seller.userType !== 'seller') {
      return res.status(403).json({
        error: 'Unauthorized',
        message: 'Only sellers can create gigs'
      });
    }

    const newGig = new Gig({
      sellerId,
      title,
      description,
      category,
      subCategory,
      packages,
      addOns: addOns || [],
      faqs: faqs || [],
      images: images || [],
      videos: videos || [],
      pdfs: pdfs || [],
      tags: tags || [],
      searchKeywords: searchKeywords || [],
      metadata: metadata || {},
      requirements: requirements || [],
      status,
      isActive: status === 'active',
      // Legacy fields for backward compatibility
      price: price || packages.basic.price,
      deliveryTime: deliveryTime || packages.basic.deliveryTime,
      features: features || packages.basic.features || [],
      // Initialize analytics
      analytics: {
        impressions: 0,
        clicks: 0,
        orders: 0,
        saves: 0,
        conversionRate: 0,
        views: [],
        clicksBySource: {
          search: 0,
          profile: 0,
          direct: 0,
          other: 0
        }
      }
    });

    await newGig.save();

    res.status(201).json({
      success: true,
      message: 'Gig created successfully',
      gig: newGig
    });
  } catch (error) {
    console.error('Create gig error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to create gig'
    });
  }
});

// Update a gig
router.put('/:gigId', async (req, res) => {
  try {
    const { gigId } = req.params;
    const updates = req.body;

    // Prevent updating analytics directly
    delete updates.analytics;

    // Update legacy fields if packages changed
    if (updates.packages?.basic) {
      updates.price = updates.packages.basic.price;
      updates.deliveryTime = updates.packages.basic.deliveryTime;
      updates.features = updates.packages.basic.features || [];
    }

    const gig = await Gig.findByIdAndUpdate(
      gigId,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!gig) {
      return res.status(404).json({
        error: 'Gig not found',
        message: 'Gig does not exist'
      });
    }

    res.json({
      success: true,
      message: 'Gig updated successfully',
      gig
    });
  } catch (error) {
    console.error('Update gig error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to update gig'
    });
  }
});

// Delete a gig (soft delete by setting isActive to false)
router.delete('/:gigId', async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findByIdAndUpdate(
      gigId,
      { isActive: false, status: 'paused', updatedAt: Date.now() },
      { new: true }
    );

    if (!gig) {
      return res.status(404).json({
        error: 'Gig not found',
        message: 'Gig does not exist'
      });
    }

    res.json({
      success: true,
      message: 'Gig deleted successfully'
    });
  } catch (error) {
    console.error('Delete gig error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to delete gig'
    });
  }
});

// Increment gig save count
router.post('/:gigId/save', async (req, res) => {
  try {
    const { gigId } = req.params;

    await Gig.findByIdAndUpdate(
      gigId,
      { $inc: { 'analytics.saves': 1 } }
    );

    res.json({
      success: true,
      message: 'Save count updated'
    });
  } catch (error) {
    console.error('Update save count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update save count'
    });
  }
});

// Increment gig order count
router.post('/:gigId/order', async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findByIdAndUpdate(
      gigId,
      { $inc: { 'analytics.orders': 1 } },
      { new: true }
    );

    // Update conversion rate
    if (gig && gig.analytics.clicks > 0) {
      gig.analytics.conversionRate = 
        (gig.analytics.orders / gig.analytics.clicks * 100).toFixed(2);
      await gig.save();
    }

    res.json({
      success: true,
      message: 'Order count updated'
    });
  } catch (error) {
    console.error('Update order count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order count'
    });
  }
});

// Get featured/recommended gigs
router.get('/featured/recommended', async (req, res) => {
  try {
    const gigs = await Gig.find({ isActive: true, status: 'active' })
      .populate({
        path: 'sellerId',
        select: 'username profile.profilePicture sellerProfile.rating sellerProfile.level'
      })
      .sort({ 'analytics.orders': -1, 'analytics.saves': -1 })
      .limit(12);

    res.json({ gigs });
  } catch (error) {
    console.error('Get featured gigs error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to get featured gigs'
    });
  }
});

module.exports = router;