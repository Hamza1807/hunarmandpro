const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register new user
router.post('/signup', async (req, res) => {
  try {
    const { email, password, username, role } = req.body;

    // Validate input
    if (!email || !password || !username || !role) {
      return res.status(400).json({ 
        error: 'All fields are required',
        message: 'Please provide email, password, username, and role' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists',
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Map role to userType (client -> buyer, freelancer -> seller)
    const userType = role === 'client' ? 'buyer' : 'seller';

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      username,
      userType,
    });

    await user.save();

    // Return user data (without password)
    const userResponse = {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.userType === 'buyer' ? 'client' : 'freelancer',
      userType: user.userType,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        error: 'Duplicate entry',
        message: `${field} already exists` 
      });
    }
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to create user' 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ 
        error: 'Missing credentials',
        message: 'Please provide email/username and password' 
      });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername }
      ]
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email/username or password is incorrect' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email/username or password is incorrect' 
      });
    }

    // Return user data (without password)
    const userResponse = {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.userType === 'buyer' ? 'client' : 'freelancer',
      userType: user.userType,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Login successful',
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to login' 
    });
  }
});

// Get current user (for session validation)
router.get('/me', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ 
        error: 'Missing user ID',
        message: 'User ID is required' 
      });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'User does not exist' 
      });
    }

    const userResponse = {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.userType === 'buyer' ? 'client' : 'freelancer',
      userType: user.userType,
      createdAt: user.createdAt
    };

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to get user' 
    });
  }
});

// Check if username is available
router.get('/check-username', async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ 
        error: 'Missing username',
        message: 'Username is required' 
      });
    }

    const user = await User.findOne({ username });

    res.json({ 
      available: !user,
      message: user ? 'Username already taken' : 'Username available'
    });
  } catch (error) {
    console.error('Check username error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to check username' 
    });
  }
});

module.exports = router;

