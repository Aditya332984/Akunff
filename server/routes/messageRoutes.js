const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

router.get('/active', authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { recipient: req.user.id }],
    })
      .populate('product', 'title _id')
      .populate('sender', 'name _id')
      .populate('recipient', 'name _id')
      .sort({ timestamp: -1 });

    const uniqueChats = [];
    const seen = new Set();
    for (const msg of messages) {
      // Check if sender, recipient, and product are populated correctly
      if (!msg.sender || !msg.recipient || !msg.product) {
        console.warn(`Invalid message data: ${JSON.stringify(msg)}`);
        continue; // Skip this message if any field is null/undefined
      }

      const senderId = msg.sender._id?.toString();
      const recipientId = msg.recipient._id?.toString();
      const productId = msg.product._id?.toString();

      if (!senderId || !recipientId || !productId) {
        console.warn(`Missing ID in message: ${JSON.stringify(msg)}`);
        continue;
      }

      const otherUserId = senderId === req.user.id ? recipientId : senderId;
      const chatKey = `${otherUserId}-${productId}`;
      if (!seen.has(chatKey)) {
        seen.add(chatKey);
        uniqueChats.push({
          sellerId: otherUserId,
          sellerName: senderId === req.user.id ? msg.recipient.name : msg.sender.name,
          productId,
          productTitle: msg.product.title,
        });
      }
    }
    res.json(uniqueChats);
  } catch (error) {
    console.error('Error fetching active chats:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

router.get('/:productId/:recipientId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      product: req.params.productId,
      $or: [
        { sender: req.user.id, recipient: req.params.recipientId },
        { sender: req.params.recipientId, recipient: req.user.id },
      ],
    }).populate('sender', 'name _id');
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;