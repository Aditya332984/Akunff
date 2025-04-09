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
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'No token provided' });
  }

  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token, // Assuming the client sends an ID token instead of access_token
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { id: user._id, googleId: user.googleId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      token: jwtToken,
      user: { id: user._id, email: user.email, googleId: user.googleId },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(400).json({ success: false, message: 'Invalid Google token' });
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