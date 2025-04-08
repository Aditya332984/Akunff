const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

router.get('/active', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { recipient: req.user.id }],
    })
      .populate('product', 'title')
      .populate('sender', 'name')
      .populate('recipient', 'name')
      .sort({ timestamp: -1 });

    const uniqueChats = [];
    const seen = new Set();
    for (const msg of messages) {
      const otherUserId = msg.sender._id.toString() === req.user.id ? msg.recipient._id.toString() : msg.sender._id.toString();
      const chatKey = `${otherUserId}-${msg.product._id}`;
      if (!seen.has(chatKey)) {
        seen.add(chatKey);
        uniqueChats.push({
          sellerId: otherUserId,
          sellerName: msg.sender._id.toString() === req.user.id ? msg.recipient.name : msg.sender.name,
          productId: msg.product._id,
          productTitle: msg.product.title,
        });
      }
    }
    res.json(uniqueChats);
  } catch (error) {
    console.error('Error fetching active chats:', error);
    res.status(500).json({ message: 'Server error' });
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
    }).populate('sender', 'name');
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;