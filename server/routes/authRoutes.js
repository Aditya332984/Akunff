const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Middleware to handle errors consistently
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Existing routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Google OAuth Server-Side Flow (Passport.js)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = req.user.token;
    const user = req.user.user;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/product?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
  }
);

// Google Token Verification Endpoint (for client-side auth)
router.post('/google/token', asyncHandler(async (req, res) => {
  const { profile } = req.body;

  // Basic validation
  if (!profile || !profile.sub) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid Google profile received' 
    });
  }

  // Check if user already exists by Google ID
  let user = await User.findOne({ googleId: profile.sub });

  if (!user) {
    // Create new user
    user = new User({
      googleId: profile.sub,
      email: profile.email,
      password: null, // since it's a Google login
    });
    await user.save();
    console.log('New Google user created:', user);
  } else {
    // Optionally update profile info
    if (user.name !== profile.name || user.email !== profile.email) {
      user.name = profile.name;
      user.email = profile.email;
      await user.save();
      console.log('Google user updated:', user);
    }
  }

  // Generate JWT token
  const jwtToken = jwt.sign(
    { id: user._id, googleId: user.googleId },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Set cookie if needed (optional)
  res.cookie('jwt', jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000
  });

  // Send response back
  res.json({
    success: true,
    token: jwtToken,
    user: {
      id: user._id,
      email: user.email,
      googleId: user.googleId
    }
  });
}));


// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Route error:', err);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error' 
  });
});

module.exports = router;