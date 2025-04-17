const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
require('dotenv').config();
const WebSocket = require('ws');
const http = require('http');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const path = require('path');
const User = require('./models/User');
const Message = require('./models/Message');
const authMiddleware = require('./middleware/auth');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

const app = express();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use(cookieParser());

// CORS Configuration
const allowedOrigins = [
  'https://akunff.com',
  'https://www.akunff.com',
  'http://localhost:5173',
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(passport.initialize());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.API_URL || 'http://localhost:3000'}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        password: null,
      });
      await user.save();
    }
    const token = jwt.sign({ id: user._id, googleId: user.googleId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return done(null, { user, token });
  } catch (err) {
    console.error('Error during Google OAuth:', err);
    return done(err, null);
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes); // Upload handled inside productRoutes now
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// User Info Route
app.get('/api/auth/user/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ name: user.name });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health Check
app.get('/', (req, res) => res.send('API is running'));

// CORS Error Handler
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    console.error(`CORS error: ${req.headers.origin} trying to access ${req.path}`);
    return res.status(403).json({
      message: 'CORS error',
      error: 'Origin not allowed',
      allowedOrigins,
    });
  }
  next(err);
});

// General Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// WebSocket Setup
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const clients = new Map();

wss.on('connection', (ws, req) => {
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const token = urlParams.get('token');
  const productId = urlParams.get('productId');

  if (!token || !productId) {
    ws.send(JSON.stringify({ error: 'Authentication and productId required' }));
    ws.close();
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      ws.send(JSON.stringify({ error: 'Invalid token' }));
      ws.close();
      return;
    }

    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        ws.send(JSON.stringify({ error: 'User not found' }));
        ws.close();
        return;
      }

      clients.set(ws, { userId: user._id.toString(), googleId: user.googleId, name: user.name, productId });

      ws.send(JSON.stringify({
        type: 'welcome',
        message: `Welcome, ${user.name}! Connected to chat for product ${productId}`,
      }));

      ws.on('message', async (message) => {
        try {
          const parsedMessage = JSON.parse(message);
          const clientInfo = clients.get(ws);

          if (!parsedMessage.message || !parsedMessage.recipient || !parsedMessage.timestamp) {
            ws.send(JSON.stringify({ error: 'Invalid message format' }));
            return;
          }

          const newMessage = new Message({
            sender: clientInfo.userId,
            recipient: parsedMessage.recipient,
            product: productId,
            message: parsedMessage.message,
            timestamp: parsedMessage.timestamp,
          });
          await newMessage.save();

          wss.clients.forEach((client) => {
            const recipientInfo = clients.get(client);
            if (
              client.readyState === WebSocket.OPEN &&
              (recipientInfo.userId === parsedMessage.recipient || recipientInfo.userId === clientInfo.userId) &&
              recipientInfo.productId === productId
            ) {
              client.send(JSON.stringify({
                type: 'chat',
                sender: {
                  userId: clientInfo.userId,
                  name: clientInfo.name,
                  googleId: clientInfo.googleId,
                },
                message: parsedMessage.message,
                timestamp: parsedMessage.timestamp,
                productId,
              }));
            }
          });
        } catch (error) {
          console.error('WebSocket message error:', error);
          ws.send(JSON.stringify({ error: 'Failed to process message' }));
        }
      });

      ws.on('close', () => {
        clients.delete(ws);
        console.log(`Client disconnected: ${user.name}`);
      });

      ws.on('error', (error) => console.error('WebSocket error:', error));
    } catch (error) {
      console.error('WebSocket user verification error:', error);
      ws.close();
    }
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
