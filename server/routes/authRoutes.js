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
  const { token } = req.body; // Changed from 'credential' to 'token' for consistency
  
  if (!token) {
    return res.status(400).json({ 
      success: false,
      message: 'No Google token provided' 
    });
  }

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  
  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    console.log('Google payload:', payload);

    // Find or create user
    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        password: null,
      });
      await user.save();
      console.log('New Google user created:', user);
    } else {
      // Update user info if needed
      if (user.name !== payload.name || user.email !== payload.email) {
        user.name = payload.name;
        user.email = payload.email;
        await user.save();
        console.log('Google user updated:', user);
      }
    }

    // Generate JWT (consistent with your Passport implementation)
    const jwtToken = jwt.sign(
      { id: user._id, googleId: user.googleId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set HTTP-only cookie
    res.cookie('jwt', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour
    });

    // Return response (consistent with your existing pattern)
    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        googleId: user.googleId
      }
    });

  } catch (error) {
    console.error('Google token verification error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Invalid Google token',
      error: error.message 
    });
  }
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