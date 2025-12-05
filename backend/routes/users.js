const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/profiles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Update profile picture
router.post('/profile-picture/:userId', upload.single('profilePicture'), async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded',
        message: 'Please select a file to upload' 
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      // Delete uploaded file if user not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ 
        error: 'User not found',
        message: 'User does not exist' 
      });
    }

    // Delete old profile picture if exists
    if (user.profile && user.profile.profilePicture) {
      const oldPath = path.join(__dirname, '../', user.profile.profilePicture);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Save relative path
    const profilePicturePath = `/uploads/profiles/${req.file.filename}`;
    
    // Update user profile
    if (!user.profile) {
      user.profile = {};
    }
    user.profile.profilePicture = profilePicturePath;
    
    await user.save();

    res.json({
      message: 'Profile picture updated successfully',
      profilePicture: profilePicturePath,
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    // Delete uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to upload profile picture' 
    });
  }
});

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'User does not exist' 
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to get user profile' 
    });
  }
});

// Update user profile
router.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, bio, skills } = req.body;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'User does not exist' 
      });
    }

    // Update profile fields
    if (!user.profile) {
      user.profile = {};
    }
    
    if (firstName !== undefined) user.profile.firstName = firstName;
    if (lastName !== undefined) user.profile.lastName = lastName;
    if (bio !== undefined) user.profile.bio = bio;
    if (skills !== undefined) user.profile.skills = skills;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to update profile' 
    });
  }
});

// Search users (for starting conversations)
router.get('/search', async (req, res) => {
  try {
    const { query, userType } = req.query;

    if (!query) {
      return res.status(400).json({ 
        error: 'Missing query',
        message: 'Search query is required' 
      });
    }

    const searchCriteria = {
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ]
    };

    // Filter by user type if specified
    if (userType) {
      searchCriteria.userType = userType;
    }

    const users = await User.find(searchCriteria)
      .select('username email userType profile.profilePicture')
      .limit(10);

    res.json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to search users' 
    });
  }
});

// Get all freelancers (sellers) for clients to browse
router.get('/freelancers', async (req, res) => {
  try {
    const freelancers = await User.find({ userType: 'seller' })
      .select('username email profile.profilePicture profile.bio profile.skills sellerProfile.rating sellerProfile.level')
      .sort({ 'sellerProfile.rating': -1, createdAt: -1 })
      .limit(50);

    res.json({ freelancers });
  } catch (error) {
    console.error('Get freelancers error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to get freelancers' 
    });
  }
});

module.exports = router;

