// server/server.js
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
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('./models/User');
const Message = require('./models/Message');
const authMiddleware = require('./middleware/auth');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory at:', uploadsDir);
}

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Middleware
app.use(express.json());
app.use(cors({ 
  origin: '*', 
  credentials: true 
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Passport Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.API_URL || 'http://localhost:3000'}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({ googleId: profile.id, name: profile.displayName, email: profile.emails[0].value, password: null });
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
app.use('/api/product', upload.single('image'), productRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Message Routes
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

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    return res.status(400).json({ message: 'File upload error', error: err.message });
  }
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// WebSocket Setup
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const clients = new Map();

wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection established');
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
      console.log(`Client authenticated: ${user.name} (${user.googleId}) for product ${productId}`);

      ws.send(JSON.stringify({
        type: 'welcome',
        message: `Welcome, ${user.name}! Connected to chat for product ${productId}`,
      }));

      ws.on('message', async (message) => {
        try {
          const parsedMessage = JSON.parse(message);
          const clientInfo = clients.get(ws);

          if (!parsedMessage.message || !parsedMessage.recipient || !parsedMessage.timestamp) {
            ws.send(JSON.stringify({ error: 'Invalid message format: message, recipient, and timestamp required' }));
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
              (recipientInfo.userId ===  parsedMessage.recipient || recipientInfo.userId === clientInfo.userId) &&
              recipientInfo.productId === productId
            ) {
              client.send(
                JSON.stringify({
                  type: 'chat',
                  sender: { userId: clientInfo.userId, name: clientInfo.name, googleId: clientInfo.googleId },
                  message: parsedMessage.message,
                  timestamp: parsedMessage.timestamp,
                  productId,
                })
              );
            }
          });
        } catch (error) {
          console.error('Error handling message:', error);
          ws.send(JSON.stringify({ error: 'Failed to process message' }));
        }
      });

      ws.on('close', () => {
        clients.delete(ws);
        console.log(`Client disconnected: ${user.name} (${user.googleId})`);
      });

      ws.on('error', (error) => console.error('WebSocket error:', error));
    } catch (error) {
      console.error('Error verifying user:', error);
      ws.close();
    }
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;