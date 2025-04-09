const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const jwt = require('jsonwebtoken');
const multer = require('multer'); // Import multer
const path = require('path');

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

// Multer configuration for image uploads
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

router.post('/login', authController.adminLogin);
router.get('/stats', adminAuth, adminController.getStats);
router.get('/users', adminAuth, adminController.getUsers);
router.delete('/users/:id', adminAuth, adminController.deleteUser);
router.get('/products', adminAuth, adminController.getProducts);
router.delete('/products/:id', adminAuth, adminController.deleteProduct);
router.get('/products/:id', adminAuth, adminController.getProductDetail);
router.put('/products/:id', adminAuth, upload.single('image'), adminController.updateProduct); // Updated route with multer

module.exports = router;