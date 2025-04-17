const express = require('express');
const ProductController = require('../controllers/ProductController');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs'); // Add fs to delete files
const path = require('path');

const router = express.Router();

// Middleware to authenticate JWT token
// routes/productRoutes.js
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Cleanup files on auth failure
  const cleanupFiles = () => {
    if (req.files?.image?.tempFilePath) {
      fs.unlinkSync(req.files.image.tempFilePath);
    }
  };

  if (!token) {
    cleanupFiles();
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    cleanupFiles();
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Route to create a new product (protected)
router.post('/', authenticateToken, ProductController.createProduct);

// Route to get all products (public)
router.get('/', ProductController.getAllProducts);

// Route to get a single product by ID (public)
router.get('/:id', ProductController.getProductById);

// Route to update a product by ID (protected)
router.put('/:id', authenticateToken, ProductController.updateProduct);

// Route to delete a product by ID (protected)
router.delete('/:id', authenticateToken, ProductController.deleteProduct);

module.exports = router;