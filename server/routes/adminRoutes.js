const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  });
};

router.post('/login', authController.adminLogin);
router.get('/stats', adminAuth, adminController.getStats);
router.get('/users', adminAuth, adminController.getUsers);
router.delete('/users/:id', adminAuth, adminController.deleteUser);
router.get('/products', adminAuth, adminController.getProducts);
router.delete('/products/:id', adminAuth, adminController.deleteProduct);
router.get('/products/:id', adminAuth, adminController.getProductDetail);

module.exports = router;