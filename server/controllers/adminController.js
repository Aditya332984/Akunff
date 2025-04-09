const User = require('../models/User');
const Product = require('../models/Product');

exports.getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    res.json({ users: userCount, posts: productCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Product.deleteMany({ user: req.params.id }); // Delete user's products
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('user', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductDetail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('user', 'name email');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price, platform, genre, gameId } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product fields
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price ? parseFloat(price) : product.price;
    product.platform = platform || product.platform;
    product.genre = genre || product.genre;
    product.gameId = gameId || product.gameId;

    // Handle image update if a new file is uploaded
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`; // Update image path
    }

    await product.save();
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};